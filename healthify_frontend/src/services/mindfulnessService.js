//
// Mindfulness service: list/create/update/remove using apiClient
// Uses placeholder endpoints and handles missing API_BASE gracefully.
//

import api, { ApiError } from './apiClient';
import { getApiBase } from '../utils/env';
import { warn, error as logError, debug } from '../utils/log';

const ENDPOINT = '/mindfulness/sessions';

/** Safe check for API availability */
function hasApi() {
  return Boolean(getApiBase());
}

// PUBLIC_INTERFACE
export async function list() {
  /** Returns a list of mindfulness sessions. Returns [] when API base is not configured or on handled errors. */
  if (!hasApi()) {
    debug('mindfulnessService.list: API base not configured, returning empty list.');
    return [];
  }
  try {
    const data = await api.get(ENDPOINT);
    if (Array.isArray(data)) return data;
    return Array.isArray(data?.items) ? data.items : [];
  } catch (e) {
    if (e instanceof ApiError) {
      warn('mindfulnessService.list failed:', e.message);
      return [];
    }
    logError('mindfulnessService.list unexpected error:', e);
    return [];
  }
}

// PUBLIC_INTERFACE
export async function create(session) {
  /** Creates a mindfulness session. If no API is configured, returns a local object with a generated id. */
  if (!hasApi()) {
    const local = { id: session?.id || `local-${Date.now()}`, ...(session || {}) };
    debug('mindfulnessService.create: API base not configured, returning local object.', local);
    return local;
  }
  try {
    return await api.post(ENDPOINT, session);
  } catch (e) {
    if (e instanceof ApiError) warn('mindfulnessService.create failed:', e.message);
    else logError('mindfulnessService.create unexpected error:', e);
    return { id: session?.id || `fallback-${Date.now()}`, ...(session || {}) };
  }
}

// PUBLIC_INTERFACE
export async function update(id, patch) {
  /** Updates a session by id. If no API is configured, returns a merged object { id, ...patch }. */
  if (!hasApi()) {
    const local = { id, ...(patch || {}) };
    debug('mindfulnessService.update: API base not configured, returning local merged object.', local);
    return local;
  }
  try {
    return await api.put(`${ENDPOINT}/${encodeURIComponent(id)}`, patch);
  } catch (e) {
    if (e instanceof ApiError) warn('mindfulnessService.update failed:', e.message);
    else logError('mindfulnessService.update unexpected error:', e);
    return { id, ...(patch || {}) };
  }
}

// PUBLIC_INTERFACE
export async function remove(id) {
  /** Removes a session by id. If no API is configured, returns { success: true }. */
  if (!hasApi()) {
    debug('mindfulnessService.remove: API base not configured, returning success flag.');
    return { success: true };
  }
  try {
    await api.del(`${ENDPOINT}/${encodeURIComponent(id)}`);
    return { success: true };
  } catch (e) {
    if (e instanceof ApiError) warn('mindfulnessService.remove failed:', e.message);
    else logError('mindfulnessService.remove unexpected error:', e);
    return { success: false, error: e?.message || 'Remove failed' };
  }
}

const mindfulnessService = { list, create, update, remove };
export default mindfulnessService;
