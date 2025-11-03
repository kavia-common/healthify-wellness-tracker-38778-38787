import { API_ENDPOINTS } from '../../utils/constants';
import { httpClient } from '../httpClient';

/**
 * PUBLIC_INTERFACE
 * login
 * POST /auth/login
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ ok: boolean, status: number, data?: { token: string, user?: object }, message?: string }>}
 */
export async function login(credentials) {
  return httpClient.post(API_ENDPOINTS.AUTH_LOGIN, credentials, { retry: 0 });
}

/**
 * PUBLIC_INTERFACE
 * logout
 * POST /auth/logout (server may clear cookie or revoke token)
 */
export async function logout() {
  return httpClient.post(API_ENDPOINTS.AUTH_LOGOUT, {}, { retry: 0 });
}

/**
 * PUBLIC_INTERFACE
 * me
 * GET /me
 * @returns {Promise<{ ok: boolean, status: number, data?: { id: string, name: string, email: string, plan?: string } }>}
 */
export async function me() {
  return httpClient.get(API_ENDPOINTS.AUTH_ME, { retry: 0 });
}
