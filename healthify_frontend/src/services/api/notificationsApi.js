import { httpClient } from '../httpClient';
import { apiPath } from '../../utils/constants';

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

// Not present in constants; define path using apiPath helper:
/**
 * PUBLIC_INTERFACE
 * getNotifications
 * GET /notifications
 */
export async function getNotifications(query = {}) {
  const base = apiPath('/notifications');
  const url = new URL(base, window.location.origin);
  Object.entries(query || {}).forEach(([k, v]) => {
    if (v != null) url.searchParams.set(k, String(v));
  });
  return httpClient.get(url.toString(), { retry: 1 });
}
