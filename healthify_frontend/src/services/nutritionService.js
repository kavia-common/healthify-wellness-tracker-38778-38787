//
// Nutrition service: list/create/update/remove using apiClient
// Uses placeholder endpoints and handles missing API_BASE gracefully.
//

import api, { ApiError } from './apiClient';
import { getApiBase } from '../utils/env';
import { warn, error as logError, debug } from '../utils/log';

const ENDPOINT = '/nutrition/meals';

/** Safe check for API availability */
function hasApi() {
  return Boolean(getApiBase());
}

// PUBLIC_INTERFACE
export async function list() {
  /** Returns a list of meals. Returns [] when API base is not configured or on handled errors. */
  if (!hasApi()) {
    debug('nutritionService.list: API base not configured, returning empty list.');
    return [];
  }
  try {
    const data = await api.get(ENDPOINT);
    if (Array.isArray(data)) return data;
    return Array.isArray(data?.items) ? data.items : [];
  } catch (e) {
    if (e instanceof ApiError) {
      warn('nutritionService.list failed:', e.message);
      return [];
    }
    logError('nutritionService.list unexpected error:', e);
    return [];
  }
}

// PUBLIC_INTERFACE
export async function create(meal) {
  /** Creates a meal. If no API is configured, returns a local object with a generated id. */
  if (!hasApi()) {
    const local = { id: meal?.id || `local-${Date.now()}`, ...(meal || {}) };
    debug('nutritionService.create: API base not configured, returning local object.', local);
    return local;
  }
  try {
    return await api.post(ENDPOINT, meal);
  } catch (e) {
    if (e instanceof ApiError) warn('nutritionService.create failed:', e.message);
    else logError('nutritionService.create unexpected error:', e);
    return { id: meal?.id || `fallback-${Date.now()}`, ...(meal || {}) };
  }
}

// PUBLIC_INTERFACE
export async function update(id, patch) {
  /** Updates a meal by id. If no API is configured, returns a merged object { id, ...patch }. */
  if (!hasApi()) {
    const local = { id, ...(patch || {}) };
    debug('nutritionService.update: API base not configured, returning local merged object.', local);
    return local;
  }
  try {
    return await api.put(`${ENDPOINT}/${encodeURIComponent(id)}`, patch);
  } catch (e) {
    if (e instanceof ApiError) warn('nutritionService.update failed:', e.message);
    else logError('nutritionService.update unexpected error:', e);
    return { id, ...(patch || {}) };
  }
}

// PUBLIC_INTERFACE
export async function remove(id) {
  /** Removes a meal by id. If no API is configured, returns { success: true }. */
  if (!hasApi()) {
    debug('nutritionService.remove: API base not configured, returning success flag.');
    return { success: true };
  }
  try {
    await api.del(`${ENDPOINT}/${encodeURIComponent(id)}`);
    return { success: true };
  } catch (e) {
    if (e instanceof ApiError) warn('nutritionService.remove failed:', e.message);
    else logError('nutritionService.remove unexpected error:', e);
    return { success: false, error: e?.message || 'Remove failed' };
  }
}

const nutritionService = { list, create, update, remove };
export default nutritionService;
