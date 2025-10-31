//
// Lightweight gated logger for Healthify frontend
// Respects LOG_LEVEL from env utils and NODE_ENV defaults.
// Exposes debug/info/warn/error/log with runtime level gating.
//

import { getLogLevel, getNodeEnv } from './env';

const LEVELS = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  log: 3,
  debug: 4,
};

let currentLevelName = (getLogLevel() || 'warn').toLowerCase();
let currentLevel = LEVELS[currentLevelName] ?? LEVELS.warn;

const PREFIX = '[Healthify]';

// INTERNAL
const updateLevel = (name) => {
  currentLevelName = (name || '').toLowerCase();
  currentLevel = LEVELS[currentLevelName] ?? LEVELS.warn;
};

// INTERNAL
const enabled = (levelName) => {
  const level = LEVELS[levelName] ?? LEVELS.info;
  return level <= currentLevel && currentLevel > LEVELS.silent;
};

// INTERNAL
const baseEmit = (method, args) => {
  // In test env, avoid noisy console.info/debug unless explicitly raised
  const nodeEnv = getNodeEnv();
  if ((nodeEnv === 'test') && (method === 'info' || method === 'debug' || method === 'log')) {
    // Allow only if level config explicitly allows
    if (!enabled(method)) return;
  }
  // eslint-disable-next-line no-console
  (console[method] || console.log).call(console, PREFIX, ...args);
};

// PUBLIC_INTERFACE
export function setLogLevel(levelName) {
  /** Override the current log level at runtime. Accepted: 'silent'|'error'|'warn'|'info'|'debug'. */
  updateLevel(levelName);
}

// PUBLIC_INTERFACE
export function getLevel() {
  /** Returns the current effective log level name. */
  return currentLevelName;
}

// PUBLIC_INTERFACE
export function debug(...args) {
  /** Log at DEBUG level. Visible when LOG_LEVEL >= debug (default in development). */
  if (!enabled('debug')) return;
  baseEmit('debug', args);
}

// PUBLIC_INTERFACE
export function info(...args) {
  /** Log at INFO level. Visible when LOG_LEVEL >= info. */
  if (!enabled('info')) return;
  baseEmit('info', args);
}

// PUBLIC_INTERFACE
export function warn(...args) {
  /** Log at WARN level. Visible when LOG_LEVEL >= warn. */
  if (!enabled('warn')) return;
  baseEmit('warn', args);
}

// PUBLIC_INTERFACE
export function error(...args) {
  /** Log at ERROR level. Visible when LOG_LEVEL >= error (i.e., unless 'silent'). */
  if (!enabled('error')) return;
  baseEmit('error', args);
}

// PUBLIC_INTERFACE
export function log(...args) {
  /** Alias for INFO level (to mimic console.log) but still respects LOG_LEVEL gating. */
  if (!enabled('log')) return;
  baseEmit('log', args);
}

export default {
  setLogLevel,
  getLevel,
  debug,
  info,
  warn,
  error,
  log,
};
