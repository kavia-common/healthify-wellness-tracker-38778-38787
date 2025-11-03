import { API_ENDPOINTS } from '../../utils/constants';
import { httpClient } from '../httpClient';

/**
 * Types (documentation only):
 *
 * Workout:
 * {
 *   id: string,
 *   date: string,          // ISO date
 *   type: string,          // e.g., 'strength', 'cardio', 'yoga'
 *   durationMin: number,
 *   calories?: number,
 *   notes?: string
 * }
 *
 * Meal:
 * {
 *   id: string,
 *   date: string,          // ISO date
 *   name: string,          // e.g., 'Breakfast'
 *   calories: number,
 *   proteinG?: number,
 *   carbsG?: number,
 *   fatG?: number,
 *   items?: Array<{ food: string, qty: string }>
 * }
 *
 * Habit:
 * {
 *   id: string,
 *   name: string,
 *   schedule?: string,     // e.g., 'daily', '3x/week'
 *   completedToday?: boolean,
 *   streak?: number
 * }
 */

/**
 * PUBLIC_INTERFACE
 * getWorkouts
 * GET /workouts
 * Optional query params as plain object (e.g., { date: '2025-01-01' })
 */
export async function getWorkouts(query = {}) {
  const url = new URL(API_ENDPOINTS.WORKOUTS, window.location.origin);
  Object.entries(query || {}).forEach(([k, v]) => {
    if (v != null) url.searchParams.set(k, String(v));
  });
  // Use absolute URL to preserve query; httpClient can accept absolute paths
  return httpClient.get(url.toString(), { retry: 1 });
}

/**
 * PUBLIC_INTERFACE
 * addWorkout
 * POST /workouts
 * @param {Partial<Workout>} workout
 */
export async function addWorkout(workout) {
  return httpClient.post(API_ENDPOINTS.WORKOUTS, workout, { retry: 0 });
}

/**
 * PUBLIC_INTERFACE
 * getNutrition
 * GET /meals
 */
export async function getNutrition(query = {}) {
  const url = new URL(API_ENDPOINTS.MEALS, window.location.origin);
  Object.entries(query || {}).forEach(([k, v]) => {
    if (v != null) url.searchParams.set(k, String(v));
  });
  return httpClient.get(url.toString(), { retry: 1 });
}

/**
 * PUBLIC_INTERFACE
 * addMeal
 * POST /meals
 */
export async function addMeal(meal) {
  return httpClient.post(API_ENDPOINTS.MEALS, meal, { retry: 0 });
}

/**
 * PUBLIC_INTERFACE
 * getHabits
 * GET /habits
 */
export async function getHabits(query = {}) {
  const url = new URL(API_ENDPOINTS.HABITS, window.location.origin);
  Object.entries(query || {}).forEach(([k, v]) => {
    if (v != null) url.searchParams.set(k, String(v));
  });
  return httpClient.get(url.toString(), { retry: 1 });
}

/**
 * PUBLIC_INTERFACE
 * updateHabit
 * PUT /habits/:id
 */
export async function updateHabit(id, patch) {
  if (!id) throw new Error('Habit id is required');
  return httpClient.put(API_ENDPOINTS.HABIT_BY_ID(id), patch, { retry: 0 });
}
