import { getEnv } from './env';

/**
 * Parse feature flags from either a JSON object string or a comma-separated list.
 * Examples:
 *  - '{"newUI": true, "beta": false}'
 *  - 'newUI,beta,aiInsights'
 */
function parseFlags(raw) {
  if (!raw || typeof raw !== 'string') return {};
  const text = raw.trim();
  if (!text) return {};
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return Object.keys(parsed).reduce((acc, k) => {
        acc[String(k)] = Boolean(parsed[k]);
        return acc;
      }, {});
    }
  } catch {
    // Not JSON, attempt CSV parsing
  }

  // CSV 'flagA, flagB' -> { flagA: true, flagB: true }
  return text.split(',').reduce((acc, item) => {
    const key = String(item || '').trim();
    if (key) acc[key] = true;
    return acc;
  }, {});
}

let _flags = parseFlags(getEnv().FEATURE_FLAGS_RAW);
let _experiments = !!getEnv().EXPERIMENTS_ENABLED;

/**
 * PUBLIC_INTERFACE
 * isEnabled
 * Returns true if the specified flag is enabled.
 * Special flag "experiments" reflects REACT_APP_EXPERIMENTS_ENABLED.
 */
export function isEnabled(flagName) {
  if (!flagName) return false;
  if (flagName === 'experiments') return _experiments;
  return Boolean(_flags[flagName]);
}

/**
 * PUBLIC_INTERFACE
 * flags
 * Exposes the current flags object (read-only usage recommended).
 */
export const flags = Object.freeze({ ..._flags, experiments: _experiments });

/**
 * PUBLIC_INTERFACE
 * reloadFlags
 * Re-parse flags from environment. Useful for tests.
 */
export function reloadFlags() {
  const env = getEnv();
  _flags = parseFlags(env.FEATURE_FLAGS_RAW);
  _experiments = !!env.EXPERIMENTS_ENABLED;
  return { ..._flags, experiments: _experiments };
}
