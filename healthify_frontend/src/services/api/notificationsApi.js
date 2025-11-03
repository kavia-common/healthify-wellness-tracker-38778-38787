import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../../utils/constants';

/**
 * Types (documentation):
 * Notification:
 * {
 *   id: string,
 *   type: 'reminder' | 'achievement' | 'system',
 *   title: string,
 *   body: string,
 *   createdAt: string,   // ISO
 *   read?: boolean
 * }
 */

/**
 * PUBLIC_INTERFACE
 * getNotifications
 * GET /notifications
 */
export async function getNotifications(query = {}) {
  const url = new URL(API_ENDPOINTS.NOTIFICATIONS);
  Object.entries(query || {}).forEach(([k, v]) => {
    if (v != null) url.searchParams.set(k, String(v));
  });
  return httpClient.get(url.toString(), { retry: 1 });
}
