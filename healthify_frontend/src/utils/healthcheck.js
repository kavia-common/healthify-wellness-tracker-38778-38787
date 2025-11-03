import { getEnv } from './env';
import { apiPath } from './constants';

/**
 * PUBLIC_INTERFACE
 * runHealthcheck
 * Performs a connectivity healthcheck against the backend.
 * It uses REACT_APP_HEALTHCHECK_PATH from env (default '/healthz').
 * Returns an object: { ok: boolean, status: number, message?: string, data?: any }
 */
export async function runHealthcheck(signal) {
  const { HEALTHCHECK_PATH } = getEnv();
  const url = HEALTHCHECK_PATH.startsWith('http')
    ? HEALTHCHECK_PATH
    : apiPath(HEALTHCHECK_PATH);

  try {
    const resp = await fetch(url, { method: 'GET', credentials: 'include', signal });
    const contentType = resp.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    if (!resp.ok) {
      let details = null;
      try {
        details = isJson ? await resp.json() : await resp.text();
      } catch {
        /* no-op */
      }
      return {
        ok: false,
        status: resp.status,
        message: (details && details.message) || resp.statusText || 'Healthcheck failed',
        data: details || null,
      };
    }
    const data = isJson ? await resp.json() : await resp.text();
    return { ok: true, status: resp.status, data };
  } catch (err) {
    return { ok: false, status: 0, message: err?.message || 'Network error' };
  }
}
