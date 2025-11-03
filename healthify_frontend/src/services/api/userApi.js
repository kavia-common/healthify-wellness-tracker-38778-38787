import { API_ENDPOINTS } from '../../utils/constants';
import { httpClient } from '../httpClient';

/**
 * Types (documentation):
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
 */

/**
 * PUBLIC_INTERFACE
 * getProfile
 * Alias of GET /me to retrieve the authenticated user's profile.
 */
export async function getProfile() {
  return httpClient.get(API_ENDPOINTS.AUTH_ME, { retry: 0 });
}

/**
 * PUBLIC_INTERFACE
 * updateProfile
 * PUT /me
 * @param {Partial<UserProfile>} patch
 */
export async function updateProfile(patch) {
  // Assuming backend supports PUT /me to update profile fields
  return httpClient.put(API_ENDPOINTS.AUTH_ME, patch, { retry: 0 });
}
