//
// Habits service: list/create/update/remove using apiClient
// Uses placeholder endpoints and handles missing API_BASE gracefully.
//

import api, { ApiError } from './apiClient';
import { getApiBase } from '../utils/env';
import { warn, error as logError, debug } from '../utils/log';

const ENDPOINT = '/habits';

/** Safe check for API availability */
function hasApi() {
  return Boolean(getApiBase());
}

// PUBLIC_INTERFACE
export async function list() {
  /** Returns a list of habits. Returns [] when API base is not configured or on handled errors. */
  if (!hasApi()) {
    debug('habitsService.list: API base not configured, returning empty list.');
    return [];
  }
  try {
    const data = await api.get(ENDPOINT);
    if (Array.isArray(data)) return data;
    return Array.isArray(data?.items) ? data.items : [];
  } catch (e) {
    if (e instanceof ApiError) {
      warn('habitsService.list failed:', e.message);
      return [];
    }
    logError('habitsService.list unexpected error:', e);
    return [];
  }
}

// PUBLIC_INTERFACE
export async function create(habit) {
  /** Creates a habit. If no API is configured, returns a local object with a generated id. */
  if (!hasApi()) {
    const local = { id: habit?.id || `local-${Date.now()}`, ...(habit || {}) };
    debug('habitsService.create: API base not configured, returning local object.', local);
    return local;
  }
  try {
    return await api.post(ENDPOINT, habit);
  } catch (e) {
    if (e instanceof ApiError) warn('habitsService.create failed:', e.message);
    else logError('habitsService.create unexpected error:', e);
    return { id: habit?.id || `fallback-${Date.now()}`, ...(habit || {}) };
  }
}

// PUBLIC_INTERFACE
export async function update(id, patch) {
  /** Updates a habit by id. If no API is configured, returns a merged object { id, ...patch }. */
  if (!hasApi()) {
    const local = { id, ...(patch || {}) };
    debug('habitsService.update: API base not configured, returning local merged object.', local);
    return local;
  }
  try {
    return await api.put(`${ENDPOINT}/${encodeURIComponent(id)}`, patch);
  } catch (e) {
    if (e instanceof ApiError) warn('habitsService.update failed:', e.message);
    else logError('habitsService.update unexpected error:', e);
    return { id, ...(patch || {}) };
  }
}

// PUBLIC_INTERFACE
export async function remove(id) {
  /** Removes a habit by id. If no API is configured, returns { success: true }. */
  if (!hasApi()) {
    debug('habitsService.remove: API base not configured, returning success flag.');
    return { success: true };
  }
  try {
    await api.del(`${ENDPOINT}/${encodeURIComponent(id)}`);
    return { success: true };
  } catch (e) {
    if (e instanceof ApiError) warn('habitsService.remove failed:', e.message);
    else logError('habitsService.remove unexpected error:', e);
    return { success: false, error: e?.message || 'Remove failed' };
  }
}

const habitsService = { list, create, update, remove };
export default habitsService;
