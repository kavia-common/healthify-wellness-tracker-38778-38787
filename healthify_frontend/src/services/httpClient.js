import { apiPath } from '../utils/constants';

/**
 * Simple localStorage wrapper used by the client to access auth token.
 */
const storage = {
  get(key) {
    try {
      if (typeof window === 'undefined') return null;
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(key, value);
    } catch {
      /* no-op */
    }
  },
  remove(key) {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.removeItem(key);
    } catch {
      /* no-op */
    }
  },
};

// LocalStorage key must match AppProvider
const LS_TOKEN_KEY = 'healthify_auth_token';

/**
 * Format errors into a consistent shape for consumers.
 */
function formatError(error, extra = {}) {
  const base = {
    ok: false,
    status: error?.status || 0,
    message: error?.message || 'Request failed',
    details: error?.details || null,
    ...extra,
  };
  return base;
}

/**
 * Handle 401 by clearing token and redirecting to login with return URL.
 */
function handleUnauthorized() {
  storage.remove(LS_TOKEN_KEY);
  try {
    const current = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
    const target = `/login?from=${encodeURIComponent(current)}`;
    if (typeof window !== 'undefined') {
      // Avoid infinite loops
      if (!window.location.pathname.startsWith('/login')) {
        window.location.replace(target);
      }
    }
  } catch {
    /* no-op */
  }
}

/**
 * Build default headers including JSON accept and auth if available.
 */
function buildHeaders(customHeaders) {
  const headers = new Headers(customHeaders || {});
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  const hasBody =
    headers.has('Content-Type') ||
    headers.has('content-type');

  // Only set content type if body is not FormData/Blob and not set by caller
  if (!hasBody) {
    headers.set('Content-Type', 'application/json');
  }

  const token = storage.get(LS_TOKEN_KEY);
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}

/**
 * Sleep helper for retries.
 */
function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * Determine if an error is a network error worthy of retry.
 */
function isNetworkError(err) {
  // fetch throws TypeError on network failure
  return err instanceof TypeError;
}

/**
 * Serialize body depending on type.
 */
function serializeBody(body) {
  if (body == null) return undefined;
  if (typeof body === 'string') return body;
  if (body instanceof FormData || body instanceof Blob) return body;
  return JSON.stringify(body);
}

/**
 * PUBLIC_INTERFACE
 * httpClient
 * Fetch-based HTTP client with:
 * - Base URL from env via apiPath
 * - Auth header injection
 * - Simple retry on network failure
 * - 401 handling (redirect to /login)
 * - Centralized error formatting
 */
export const httpClient = {
  /**
   * PUBLIC_INTERFACE
   * request
   * Low-level request method. Use helpers (get/post/put/patch/del) for convenience.
   * @param {string} path - can be absolute or relative; relative will be prefixed with API_BASE
   * @param {object} options - fetch options + { retry?: number, retryDelayMs?: number }
   * @returns {Promise<{ ok: boolean, status: number, data?: any, message?: string }>}
   */
  async request(path, options = {}) {
    const {
      retry = 1,
      retryDelayMs = 250,
      headers: customHeaders,
      body,
      ...rest
    } = options;

    const url = path.startsWith('http')
      ? path
      : apiPath(path);

    const headers = buildHeaders(customHeaders);
    const payload = serializeBody(body);
    // If payload is FormData/Blob, do not force content-type (browser will set it)
    if (payload instanceof FormData || payload instanceof Blob) {
      headers.delete('Content-Type');
    }

    let attempt = 0;
    /* eslint-disable no-constant-condition */
    while (true) {
      try {
        const resp = await fetch(url, {
          method: rest.method || 'GET',
          headers,
          body: payload,
          credentials: 'include', // allows cookie-based flows too
          ...rest,
        });

        const contentType = resp.headers.get('content-type') || '';
        const isJson = contentType.includes('application/json');

        if (resp.status === 401) {
          handleUnauthorized();
          return formatError({ status: 401, message: 'Unauthorized' });
        }

        if (!resp.ok) {
          let details = null;
          try {
            details = isJson ? await resp.json() : await resp.text();
          } catch {
            /* no-op */
          }
          return formatError(
            { status: resp.status, message: (details && details.message) || resp.statusText || 'Request error', details },
            { status: resp.status }
          );
        }

        const data = isJson ? await resp.json() : await resp.text();
        return { ok: true, status: resp.status, data };
      } catch (err) {
        // Retry on network errors only
        if (isNetworkError(err) && attempt < retry) {
          attempt += 1;
          await delay(retryDelayMs * attempt);
          continue;
        }
        return formatError({ message: err?.message || 'Network error' });
      }
    }
    /* eslint-enable no-constant-condition */
  },

  // PUBLIC_INTERFACE
  async get(path, options = {}) {
    return this.request(path, { ...options, method: 'GET' });
  },

  // PUBLIC_INTERFACE
  async post(path, body, options = {}) {
    return this.request(path, { ...options, method: 'POST', body });
  },

  // PUBLIC_INTERFACE
  async put(path, body, options = {}) {
    return this.request(path, { ...options, method: 'PUT', body });
  },

  // PUBLIC_INTERFACE
  async patch(path, body, options = {}) {
    return this.request(path, { ...options, method: 'PATCH', body });
  },

  // PUBLIC_INTERFACE
  async del(path, options = {}) {
    return this.request(path, { ...options, method: 'DELETE' });
  },
};

export default httpClient;
