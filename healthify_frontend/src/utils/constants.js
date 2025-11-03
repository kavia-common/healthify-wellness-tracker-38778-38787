import { getEnv } from './env';

const { API_BASE } = getEnv();

/**
 * Join base URL and path safely without duplicate slashes.
 */
function join(base, path) {
  const b = String(base || '').replace(/\/+$/, '');
  const p = String(path || '').replace(/^\/+/, '');
  return p ? `${b}/${p}` : b;
}

/**
 * PUBLIC_INTERFACE
 * apiPath
 * Returns a full API path by prefixing with API_BASE.
 * Example: apiPath('/auth/login') => `${API_BASE}/auth/login`
 */
export function apiPath(path = '') {
  return join(API_BASE, path);
}

/**
 * PUBLIC_INTERFACE
 * API_ENDPOINTS
 * Centralized list of known API endpoints for the Healthify app.
 * These can be expanded as backend routes are implemented.
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: apiPath('/auth/login'),
  AUTH_LOGOUT: apiPath('/auth/logout'),
  AUTH_REFRESH: apiPath('/auth/refresh'),
  AUTH_ME: apiPath('/me'),

  // Workouts
  WORKOUTS: apiPath('/workouts'),
  WORKOUT_BY_ID: (id) => apiPath(`/workouts/${id}`),

  // Nutrition
  MEALS: apiPath('/meals'),
  MEAL_BY_ID: (id) => apiPath(`/meals/${id}`),

  // Habits
  HABITS: apiPath('/habits'),
  HABIT_BY_ID: (id) => apiPath(`/habits/${id}`),

  // Insights
  INSIGHTS: apiPath('/insights'),
};

/**
 * PUBLIC_INTERFACE
 * WS_ENDPOINTS
 * WebSocket endpoints derived from env where applicable.
 */
export const WS_ENDPOINTS = {
  // If WS_URL exists, you can append channels/rooms here in the future
  BASE: getEnv().WS_URL || '',
};
