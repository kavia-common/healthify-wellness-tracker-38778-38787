//
// PUBLIC_INTERFACE
// getEnv
// Environment configuration utility for the Healthify frontend.
// Normalizes and exposes REACT_APP_* variables with safe defaults.
// Usage:
//   import { getEnv, config } from './utils/env';
//   const { API_BASE } = getEnv();
//
// Note: Do not hardcode configuration data. Values are read from process.env
// (CRA injects variables prefixed with REACT_APP_ at build time).
//

/**
 * Coerce a string to boolean.
 * Accepts: 'true', '1', 'yes', 'on' => true; otherwise false.
 */
function toBool(val) {
  const s = String(val || '').trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes' || s === 'on';
}

/**
 * Coerce a string to integer. Returns fallback on failure.
 */
function toInt(val, fallback) {
  const n = parseInt(val, 10);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Ensure URL has no trailing slash to avoid double slashes when joining paths.
 */
function trimTrailingSlash(url) {
  if (typeof url !== 'string') return url;
  return url.replace(/\/+$/, '');
}

/**
 * Resolve API base with sensible fallbacks:
 * - REACT_APP_API_BASE
 * - else REACT_APP_BACKEND_URL
 * - else from FRONTEND_URL (same origin) + '/api'
 * - else default '/api'
 */
function resolveApiBase() {
  const env = process.env || {};
  const explicit = trimTrailingSlash(env.REACT_APP_API_BASE || env.REACT_APP_BACKEND_URL);
  if (explicit) return explicit;

  const fe = trimTrailingSlash(env.REACT_APP_FRONTEND_URL);
  if (fe) return `${fe}/api`;

  // As a last resort, use same-origin relative path
  return '/api';
}

/**
 * Construct a normalized config object. All fields are strings unless documented otherwise.
 */
function buildConfig() {
  const env = process.env || {};

  const NODE_ENV = env.REACT_APP_NODE_ENV || process.env.NODE_ENV || 'development';
  const FRONTEND_URL = trimTrailingSlash(env.REACT_APP_FRONTEND_URL || '');
  const WS_URL = trimTrailingSlash(env.REACT_APP_WS_URL || '');
  const API_BASE = resolveApiBase();

  const NEXT_TELEMETRY_DISABLED = toBool(env.REACT_APP_NEXT_TELEMETRY_DISABLED);
  const ENABLE_SOURCE_MAPS =
    env.REACT_APP_ENABLE_SOURCE_MAPS == null ? true : toBool(env.REACT_APP_ENABLE_SOURCE_MAPS);
  const PORT = toInt(env.REACT_APP_PORT, 3000);
  const TRUST_PROXY = toBool(env.REACT_APP_TRUST_PROXY);
  const LOG_LEVEL = (env.REACT_APP_LOG_LEVEL || 'info').toLowerCase();
  const HEALTHCHECK_PATH = env.REACT_APP_HEALTHCHECK_PATH || '/healthz';
  const FEATURE_FLAGS_RAW = env.REACT_APP_FEATURE_FLAGS || '';
  const EXPERIMENTS_ENABLED = toBool(env.REACT_APP_EXPERIMENTS_ENABLED);

  return {
    // URLs
    API_BASE,
    BACKEND_URL: trimTrailingSlash(env.REACT_APP_BACKEND_URL || ''), // kept for compatibility
    FRONTEND_URL,
    WS_URL,

    // Runtime/meta
    NODE_ENV,
    NEXT_TELEMETRY_DISABLED,
    ENABLE_SOURCE_MAPS,
    PORT,
    TRUST_PROXY,
    LOG_LEVEL,
    HEALTHCHECK_PATH,

    // Flags raw values (parsing is handled by featureFlags util)
    FEATURE_FLAGS_RAW,
    EXPERIMENTS_ENABLED,
  };
}

let _config = buildConfig();

/**
 * PUBLIC_INTERFACE
 * getEnv
 * Returns the normalized environment configuration object.
 */
export function getEnv() {
  return _config;
}

/**
 * PUBLIC_INTERFACE
 * config
 * Export a read-only snapshot of environment configuration for convenience.
 */
export const config = _config;

/**
 * PUBLIC_INTERFACE
 * reloadEnv
 * Rebuilds and returns the config. Useful for tests or hot-reload scenarios.
 */
export function reloadEnv() {
  _config = buildConfig();
  return _config;
}
