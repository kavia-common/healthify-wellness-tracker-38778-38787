//
// API client: JSON helpers and healthcheck leveraging env utils
// Reads getApiBase, getBackendUrl, getWsUrl, getHealthcheckPath from src/utils/env.js
// Provides: get/post/put/del helpers, unified error handling, and a healthcheck function
//

import { getApiBase, getBackendUrl, getWsUrl, getHealthcheckPath } from '../utils/env';
import { warn, error as logError, debug } from '../utils/log';

/** Internal helpers */
const trimTrailingSlash = (v) => (typeof v === 'string' ? v.replace(/\/+$/, '') : v);
const ensureLeadingSlash = (p) => {
  if (!p) return '/';
  return p.startsWith('/') ? p : `/${p}`;
};
const isNil = (v) => v === undefined || v === null;

/** Simple querystring builder */
const toQueryString = (params) => {
  if (!params || typeof params !== 'object') return '';
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (isNil(v)) return;
    if (Array.isArray(v)) {
      v.forEach((item) => usp.append(k, String(item)));
    } else {
      usp.set(k, String(v));
    }
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : '';
};

/** Build a full URL from base and path */
const buildUrl = (baseUrl, path, params) => {
  const b = trimTrailingSlash(baseUrl || '');
  const p = ensureLeadingSlash(path || '');
  const qs = toQueryString(params);
  return `${b}${p}${qs}`;
};

/** ApiError: normalized error for API failures */
// PUBLIC_INTERFACE
export class ApiError extends Error {
  /** Normalized API error */
  constructor({ message, status = 0, code = 'API_ERROR', url = '', details = null }) {
    super(message || 'Request failed');
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.url = url;
    this.details = details;
  }
}

/** Parse a non-2xx response for error details */
async function parseErrorResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  let data = null;
  try {
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const txt = await res.text();
      data = { message: txt };
    }
  } catch {
    // ignore parse errors
  }

  const message =
    (data && (data.message || data.error || data.title)) ||
    `Request failed with status ${res.status}`;

  return new ApiError({
    message,
    status: res.status,
    code: (data && (data.code || data.errorCode)) || 'HTTP_ERROR',
    url: res.url,
    details: data,
  });
}

/** Parse a successful response */
async function parseOkResponse(res) {
  if (res.status === 204) return null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  // Fallback to text for non-JSON responses
  const txt = await res.text();
  return txt;
}

/** Low-level request helper (internal) */
async function request(method, path, { params, body, headers, baseUrl } = {}) {
  const API_BASE = getApiBase();
  const effectiveBase = baseUrl || API_BASE;
  if (!effectiveBase) {
    // No API base configured: surface a consistent error so callers can gracefully fallback
    const err = new ApiError({
      message: 'API base URL is not configured',
      status: 0,
      code: 'NO_API_BASE',
      url: path || '',
      details: null,
    });
    debug('Skipping request due to missing API base:', { path, method });
    throw err;
  }

  const url = buildUrl(effectiveBase, path, params);
  const hasBody = !['GET', 'HEAD'].includes(method.toUpperCase()) && !isNil(body);

  const fetchOptions = {
    method,
    headers: {
      Accept: 'application/json',
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(headers || {}),
    },
    ...(hasBody ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
  };

  try {
    const res = await fetch(url, fetchOptions);
    if (!res.ok) {
      throw await parseErrorResponse(res);
    }
    return await parseOkResponse(res);
  } catch (e) {
    if (e instanceof ApiError) {
      // Already normalized
      throw e;
    }
    // Network or other runtime error
    const err = new ApiError({
      message: e?.message || 'Network error',
      status: 0,
      code: 'NETWORK_ERROR',
      url,
      details: { original: String(e) },
    });
    throw err;
  }
}

// PUBLIC_INTERFACE
export async function getJson(path, options = {}) {
  /** Perform a GET request and parse JSON response. */
  return request('GET', path, options);
}

// PUBLIC_INTERFACE
export async function postJson(path, data, options = {}) {
  /** Perform a POST request with a JSON body and parse JSON response. */
  return request('POST', path, { ...options, body: data });
}

// PUBLIC_INTERFACE
export async function putJson(path, data, options = {}) {
  /** Perform a PUT request with a JSON body and parse JSON response. */
  return request('PUT', path, { ...options, body: data });
}

// PUBLIC_INTERFACE
export async function deleteJson(path, options = {}) {
  /** Perform a DELETE request and parse JSON response. */
  return request('DELETE', path, options);
}

// PUBLIC_INTERFACE
export async function healthcheck() {
  /**
   * Performs a lightweight server healthcheck.
   * Uses BACKEND_URL + HEALTHCHECK_PATH when available, else API_BASE + HEALTHCHECK_PATH.
   * Returns a normalized result: { ok, status, url, details? } and never throws.
   */
  try {
    const backend = getBackendUrl();
    const apiBase = getApiBase();
    const wsBase = getWsUrl(); // intentionally read to ensure config is accessed early (useful for diagnostics)
    const path = getHealthcheckPath();
    const base = backend || apiBase;

    if (!base) {
      // Nothing configured: report gracefully
      return {
        ok: false,
        status: 0,
        url: null,
        details: { code: 'NO_BACKEND_BASE', wsBase, message: 'No backend/api base configured' },
      };
    }

    const url = buildUrl(base, path);
    const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
    let details = null;
    try {
      details = await parseOkResponse(res);
    } catch {
      // ignore parse issues
    }
    return { ok: res.ok, status: res.status, url, details };
  } catch (e) {
    logError('Healthcheck failed:', e);
    return {
      ok: false,
      status: e?.status || 0,
      url: e?.url || null,
      details: { code: e?.code || 'HEALTHCHECK_ERROR', message: e?.message || 'Healthcheck error' },
    };
  }
}

// Friendly aliases
// PUBLIC_INTERFACE
export const get = getJson;
// PUBLIC_INTERFACE
export const post = postJson;
// PUBLIC_INTERFACE
export const put = putJson;
// PUBLIC_INTERFACE
export const del = deleteJson;

const apiClient = {
  get: getJson,
  post: postJson,
  put: putJson,
  del: deleteJson,
  healthcheck,
  // Expose current resolved URLs for introspection
  urls: {
    apiBase: getApiBase(),
    backend: getBackendUrl(),
    ws: getWsUrl(),
    healthcheckPath: getHealthcheckPath(),
  },
};

export default apiClient;
