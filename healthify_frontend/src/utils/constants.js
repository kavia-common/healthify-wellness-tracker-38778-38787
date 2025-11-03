import { getEnv } from './env';

const { API_BASE } = getEnv();

/**
 * Join base URL and path safely without duplicate slashes.
 */
function join(base, path) {
  const b = String(base || '').replace(/\/*$/, '');
  const p = String(path || '').replace(/^\/*/, '');
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
 * Expected payload shapes and endpoint behaviors.
 * This documents the REST contracts used by the frontend. Backends should aim
 * to match these shapes for smooth integration.
 *
 * Auth:
 * - POST /auth/login
 *   Request: { email: string, password: string }
 *   Response: { token: string, user?: UserProfile }
 *
 * - POST /auth/logout
 *   Response: { success: boolean }
 *
 * - GET /me
 *   Response: UserProfile
 *
 * UserProfile:
 * {
 *   id: string,
 *   name: string,
 *   email: string,
 *   age?: number,
 *   heightCm?: number,
 *   weightKg?: number,
 *   plan?: 'free' | 'pro'
 * }
 *
 * Workouts:
 * - GET /workouts?limit&date...
 *   Response: Workout[]
 * - POST /workouts
 *   Request: Partial<Workout>
 *   Response: Workout
 * - GET /workouts/:id
 * - PUT/PATCH /workouts/:id
 *
 * Workout:
 * {
 *   id: string,
 *   date: string,       // ISO date
 *   type: string,       // 'cardio' | 'strength' | 'yoga' | 'other'
 *   durationMin: number,
 *   calories?: number,
 *   notes?: string
 * }
 *
 * Nutrition:
 * - GET /meals?limit&date...
 *   Response: Meal[]
 * - POST /meals
 *   Request: Partial<Meal>
 *   Response: Meal
 *
 * Meal:
 * {
 *   id: string,
 *   date: string,       // ISO date
 *   name: string,       // e.g. 'Breakfast'
 *   calories: number,
 *   proteinG?: number,
 *   carbsG?: number,
 *   fatG?: number,
 *   items?: Array<{ food: string, qty: string }>
 * }
 *
 * Habits:
 * - GET /habits
 *   Response: Habit[]
 * - PUT /habits/:id
 *   Request: Partial<Habit>
 *   Response: Habit
 *
 * Habit:
 * {
 *   id: string,
 *   name: string,
 *   schedule?: string,      // e.g., 'daily'
 *   completedToday?: boolean,
 *   streak?: number
 * }
 */

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

  // Notifications
  NOTIFICATIONS: apiPath('/notifications'),
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
