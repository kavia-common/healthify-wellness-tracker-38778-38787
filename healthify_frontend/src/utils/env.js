//
// Centralized environment configuration and normalization for Healthify (React CRA)
// Provides typed, normalized accessors for REACT_APP_* variables with sensible defaults.
// All public helpers are documented and prefixed with PUBLIC_INTERFACE comments.
//

/** Internal: read env var safely (CRA replaces process.env.REACT_APP_* at build time) */
const readEnv = (key) => (typeof process !== 'undefined' ? process.env?.[key] : undefined);

/** Internal: string helpers */
const isEmpty = (v) => v === undefined || v === null || String(v).trim() === '';
const trimTrailingSlash = (v) => (typeof v === 'string' ? v.replace(/\/+$/, '') : v);
const ensureLeadingSlash = (p) => {
  if (!p) return '/';
  return p.startsWith('/') ? p : `/${p}`;
};
const hasProtocol = (url) => /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(url) || url.startsWith('//');
const toBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  const s = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'on', 'enabled'].includes(s)) return true;
  if (['0', 'false', 'no', 'off', 'disabled'].includes(s)) return false;
  return defaultValue;
};
const toInteger = (value, defaultValue) => {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : defaultValue;
};

const ensureProtocol = (url, defaultProtocol = 'https') => {
  if (isEmpty(url)) return '';
  const u = String(url).trim();
  if (hasProtocol(u)) return u;
  return `${defaultProtocol}://${u.replace(/^\/\//, '')}`;
};

const normalizeHttpUrl = (url, { stripSlash = true, defaultProtocol = 'https' } = {}) => {
  if (isEmpty(url)) return '';
  let out = ensureProtocol(String(url).trim(), defaultProtocol);
  if (stripSlash) out = trimTrailingSlash(out);
  return out;
};

const normalizeWsUrl = (url, { defaultProtocol = 'wss' } = {}) => {
  if (isEmpty(url)) return '';
  let out = String(url).trim();
  // If http(s), convert to ws(s)
  if (/^https?:\/\//i.test(out)) {
    out = out.replace(/^http:\/\//i, 'ws://').replace(/^https:\/\//i, 'wss://');
  } else if (!/^(wss?:)?\/\//i.test(out)) {
    // No protocol => add
    out = `${defaultProtocol}://${out.replace(/^\/\//, '')}`;
  }
  return trimTrailingSlash(out);
};

const joinUrl = (base, path) => {
  const b = trimTrailingSlash(base || '');
  const p = ensureLeadingSlash(path || '');
  return `${b}${p}`;
};

/** Compute basic environment context */
const NODE_ENV_INTERNAL =
  (readEnv('REACT_APP_NODE_ENV') || (typeof process !== 'undefined' ? process.env?.NODE_ENV : '') || 'development')
    .toString()
    .toLowerCase();

const RAW = {
  REACT_APP_API_BASE: readEnv('REACT_APP_API_BASE'),
  REACT_APP_BACKEND_URL: readEnv('REACT_APP_BACKEND_URL'),
  REACT_APP_FRONTEND_URL: readEnv('REACT_APP_FRONTEND_URL'),
  REACT_APP_WS_URL: readEnv('REACT_APP_WS_URL'),

  REACT_APP_NODE_ENV: readEnv('REACT_APP_NODE_ENV'),
  REACT_APP_NEXT_TELEMETRY_DISABLED: readEnv('REACT_APP_NEXT_TELEMETRY_DISABLED'),
  REACT_APP_ENABLE_SOURCE_MAPS: readEnv('REACT_APP_ENABLE_SOURCE_MAPS'),

  REACT_APP_PORT: readEnv('REACT_APP_PORT'),
  REACT_APP_TRUST_PROXY: readEnv('REACT_APP_TRUST_PROXY'),

  REACT_APP_LOG_LEVEL: readEnv('REACT_APP_LOG_LEVEL'),

  REACT_APP_HEALTHCHECK_PATH: readEnv('REACT_APP_HEALTHCHECK_PATH'),

  REACT_APP_FEATURE_FLAGS: readEnv('REACT_APP_FEATURE_FLAGS'),
  REACT_APP_EXPERIMENTS_ENABLED: readEnv('REACT_APP_EXPERIMENTS_ENABLED'),
};

/** Internal: compute defaults */
const FRONTEND_URL = normalizeHttpUrl(RAW.REACT_APP_FRONTEND_URL || 'http://localhost:3000', {
  defaultProtocol: 'http',
});
const BACKEND_URL = normalizeHttpUrl(RAW.REACT_APP_BACKEND_URL || '');
const API_BASE = (() => {
  // Prefer explicit API base, else default to BACKEND_URL + '/api' if backend exists
  const explicit = normalizeHttpUrl(RAW.REACT_APP_API_BASE || '');
  if (explicit) return explicit;
  if (BACKEND_URL) return joinUrl(BACKEND_URL, '/api');
  return '';
})();
const WS_URL = (() => {
  const explicit = normalizeWsUrl(RAW.REACT_APP_WS_URL || '');
  if (explicit) return explicit;
  if (BACKEND_URL) {
    const wsBase = normalizeWsUrl(BACKEND_URL);
    return joinUrl(wsBase, '/ws');
  }
  return '';
})();
const HEALTHCHECK_PATH = ensureLeadingSlash(RAW.REACT_APP_HEALTHCHECK_PATH || '/healthz');

const DEFAULT_LOG_LEVEL = (() => {
  switch (NODE_ENV_INTERNAL) {
    case 'development':
      return 'debug';
    case 'test':
      return 'error';
    default:
      return 'warn';
  }
})();

const TELEMETRY_DISABLED = toBoolean(RAW.REACT_APP_NEXT_TELEMETRY_DISABLED, true);
const SOURCE_MAPS_ENABLED = toBoolean(RAW.REACT_APP_ENABLE_SOURCE_MAPS, NODE_ENV_INTERNAL !== 'production');
const PORT = toInteger(RAW.REACT_APP_PORT, 3000);
const TRUST_PROXY = toBoolean(RAW.REACT_APP_TRUST_PROXY, false);
const LOG_LEVEL = (RAW.REACT_APP_LOG_LEVEL || DEFAULT_LOG_LEVEL).toString().trim().toLowerCase();
const EXPERIMENTS_ENABLED = toBoolean(RAW.REACT_APP_EXPERIMENTS_ENABLED, false);

/** Parse feature flags - supports JSON or comma-separated "k=v,k2=true,k3" formats */
const parseFeatureFlags = (value) => {
  if (isEmpty(value)) return {};
  const str = String(value).trim();
  try {
    // JSON object, e.g. {"a":true,"b":false,"experiments":{"x":true}}
    const parsed = JSON.parse(str);
    return typeof parsed === 'object' && parsed != null ? parsed : {};
  } catch {
    // Comma-separated fallback: "a=true,b=1,c"
    const out = {};
    str.split(',').forEach((part) => {
      const item = part.trim();
      if (!item) return;
      const idx = item.indexOf('=');
      if (idx === -1) {
        out[item] = true;
      } else {
        const key = item.slice(0, idx).trim();
        const val = item.slice(idx + 1).trim();
        // coerce boolean/number where possible
        if (['true', 'false', '1', '0', 'yes', 'no', 'on', 'off'].includes(val.toLowerCase())) {
          out[key] = toBoolean(val, false);
        } else if (/^-?\d+(\.\d+)?$/.test(val)) {
          out[key] = Number(val);
        } else {
          out[key] = val;
        }
      }
    });
    return out;
  }
};

const FEATURE_FLAGS = parseFeatureFlags(RAW.REACT_APP_FEATURE_FLAGS);

/** Public API */

// PUBLIC_INTERFACE
export function getNodeEnv() {
  /** Returns normalized application environment: 'development' | 'test' | 'production'. */
  return NODE_ENV_INTERNAL;
}

// PUBLIC_INTERFACE
export function getFrontendUrl() {
  /** Returns the normalized frontend URL (no trailing slash). */
  return FRONTEND_URL;
}

// PUBLIC_INTERFACE
export function getBackendUrl() {
  /** Returns the normalized backend URL (no trailing slash). */
  return BACKEND_URL;
}

// PUBLIC_INTERFACE
export function getApiBase() {
  /** Returns the normalized API base URL, favoring REACT_APP_API_BASE, else BACKEND_URL + '/api'. */
  return API_BASE;
}

// PUBLIC_INTERFACE
export function getWsUrl() {
  /** Returns the normalized WebSocket base URL (wss/ws), using REACT_APP_WS_URL or derived from BACKEND_URL + '/ws'. */
  return WS_URL;
}

// PUBLIC_INTERFACE
export function getPort() {
  /** Returns the configured port number (from REACT_APP_PORT) or default 3000. */
  return PORT;
}

// PUBLIC_INTERFACE
export function getTrustProxy() {
  /** Returns whether proxy headers should be trusted (boolean from REACT_APP_TRUST_PROXY). */
  return TRUST_PROXY;
}

// PUBLIC_INTERFACE
export function getHealthcheckPath() {
  /** Returns the healthcheck path beginning with a leading slash. */
  return HEALTHCHECK_PATH;
}

// PUBLIC_INTERFACE
export function isTelemetryDisabled() {
  /** Returns true if Next telemetry (or analogous telemetry) should be disabled. */
  return TELEMETRY_DISABLED;
}

// PUBLIC_INTERFACE
export function isSourceMapsEnabled() {
  /** Returns whether source maps should be enabled for the build. */
  return SOURCE_MAPS_ENABLED;
}

// PUBLIC_INTERFACE
export function getLogLevel() {
  /** Returns the normalized log level string. Default: 'debug' (dev), 'error' (test), 'warn' (prod). */
  return LOG_LEVEL;
}

// PUBLIC_INTERFACE
export function getFeatureFlags() {
  /** Returns parsed feature flags object. Supports JSON or comma-separated syntax. */
  return FEATURE_FLAGS;
}

// PUBLIC_INTERFACE
export function isExperimentEnabled(key) {
  /**
   * Returns whether the given experiment key is enabled.
   * Checks FEATURE_FLAGS.experiments[key] if present; otherwise falls back to REACT_APP_EXPERIMENTS_ENABLED.
   */
  const e = FEATURE_FLAGS?.experiments;
  if (e && Object.prototype.hasOwnProperty.call(e, key)) {
    return toBoolean(e[key], false);
  }
  return EXPERIMENTS_ENABLED;
}

// PUBLIC_INTERFACE
export function getConfig() {
  /**
   * Returns the complete normalized config snapshot to simplify debugging and consumption.
   * Note: Avoid logging secrets; this object contains only non-secret vars.
   */
  return {
    nodeEnv: getNodeEnv(),
    frontendUrl: getFrontendUrl(),
    backendUrl: getBackendUrl(),
    apiBase: getApiBase(),
    wsUrl: getWsUrl(),
    port: getPort(),
    trustProxy: getTrustProxy(),
    healthcheckPath: getHealthcheckPath(),
    telemetryDisabled: isTelemetryDisabled(),
    sourceMapsEnabled: isSourceMapsEnabled(),
    logLevel: getLogLevel(),
    featureFlags: getFeatureFlags(),
    experimentsEnabled: isExperimentEnabled('__fallback__'), // evaluates to global toggle when key not found
  };
}

export default {
  getNodeEnv,
  getFrontendUrl,
  getBackendUrl,
  getApiBase,
  getWsUrl,
  getPort,
  getTrustProxy,
  getHealthcheckPath,
  isTelemetryDisabled,
  isSourceMapsEnabled,
  getLogLevel,
  getFeatureFlags,
  isExperimentEnabled,
  getConfig,
};
