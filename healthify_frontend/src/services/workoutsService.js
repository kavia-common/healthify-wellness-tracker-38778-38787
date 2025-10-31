//
// Workouts service: list/create/update/remove using apiClient
// Uses placeholder endpoints and handles missing API_BASE gracefully.
//

import api, { ApiError } from './apiClient';
import { getApiBase } from '../utils/env';
import { warn, error as logError, debug } from '../utils/log';

const ENDPOINT = '/workouts';

/** Safe check for API availability */
function hasApi() {
  return Boolean(getApiBase());
}

// PUBLIC_INTERFACE
export async function list() {
  /** Returns a list of workouts. Returns [] when API base is not configured or on handled errors. */
  if (!hasApi()) {
    debug('workoutsService.list: API base not configured, returning empty list.');
    return [];
  }
  try {
    const data = await api.get(ENDPOINT);
    if (Array.isArray(data)) return data;
    return Array.isArray(data?.items) ? data.items : [];
  } catch (e) {
    if (e instanceof ApiError) {
      warn('workoutsService.list failed:', e.message);
      return [];
    }
    logError('workoutsService.list unexpected error:', e);
    return [];
  }
}

// PUBLIC_INTERFACE
export async function create(workout) {
  /** Creates a workout. If no API is configured, returns a local object with a generated id. */
  if (!hasApi()) {
    const local = { id: workout?.id || `local-${Date.now()}`, ...(workout || {}) };
    debug('workoutsService.create: API base not configured, returning local object.', local);
    return local;
  }
  try {
    return await api.post(ENDPOINT, workout);
  } catch (e) {
    if (e instanceof ApiError) warn('workoutsService.create failed:', e.message);
    else logError('workoutsService.create unexpected error:', e);
    // graceful fallback
    return { id: workout?.id || `fallback-${Date.now()}`, ...(workout || {}) };
  }
}

// PUBLIC_INTERFACE
export async function update(id, patch) {
  /** Updates a workout by id. If no API is configured, returns a merged object { id, ...patch }. */
  if (!hasApi()) {
    const local = { id, ...(patch || {}) };
    debug('workoutsService.update: API base not configured, returning local merged object.', local);
    return local;
  }
  try {
    return await api.put(`${ENDPOINT}/${encodeURIComponent(id)}`, patch);
  } catch (e) {
    if (e instanceof ApiError) warn('workoutsService.update failed:', e.message);
    else logError('workoutsService.update unexpected error:', e);
    return { id, ...(patch || {}) };
  }
}

// PUBLIC_INTERFACE
export async function remove(id) {
  /** Removes a workout by id. If no API is configured, returns { success: true }. */
  if (!hasApi()) {
    debug('workoutsService.remove: API base not configured, returning success flag.');
    return { success: true };
  }
  try {
    await api.del(`${ENDPOINT}/${encodeURIComponent(id)}`);
    return { success: true };
  } catch (e) {
    if (e instanceof ApiError) warn('workoutsService.remove failed:', e.message);
    else logError('workoutsService.remove unexpected error:', e);
    return { success: false, error: e?.message || 'Remove failed' };
    }
}

const workoutsService = { list, create, update, remove };
export default workoutsService;
