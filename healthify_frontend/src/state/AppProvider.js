import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Simple storage utility around localStorage with safe-guards for SSR/tests.
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

// Keys used in localStorage
const LS_TOKEN_KEY = 'healthify_auth_token';
const LS_FEATURE_FLAGS = 'healthify_feature_flags';

/**
 * PUBLIC_INTERFACE
 * AppContext
 * Provides application-wide state: authentication, user profile, and feature flags.
 */
export const AppContext = createContext({
  isAuthenticated: false,
  token: null,
  user: null,
  featureFlags: {},
  experimentsEnabled: false,
  login: async (_credentials) => {},
  logout: () => {},
  refreshUser: async () => {},
  setFeatureFlags: (_flags) => {},
});

/**
 * Parse feature flags from env or localStorage
 */
function loadInitialFlags() {
  // Prefer local overrides if present
  const saved = storage.get(LS_FEATURE_FLAGS);
  if (saved) {
    try {
      return JSON.parse(saved) || {};
    } catch {
      /* ignore parse errors */
    }
  }
  // Fallback to env value
  let parsed = {};
  const envFlags = process.env.REACT_APP_FEATURE_FLAGS;
  if (envFlags) {
    try {
      parsed = JSON.parse(envFlags);
    } catch {
      // Support comma-separated "flagA,flagB"
      parsed = envFlags.split(',').reduce((acc, k) => {
        const key = String(k || '').trim();
        if (key) acc[key] = true;
        return acc;
      }, {});
    }
  }
  return parsed;
}

/**
 * PUBLIC_INTERFACE
 * AppProvider
 * React context provider that manages:
 * - Authentication token (persisted in localStorage)
 * - User profile (fetched with placeholder API using the token)
 * - Feature flags (from localStorage or env)
 *
 * Note: API calls are placeholders and should be wired to real backend in step 01.07.
 */
export function AppProvider({ children }) {
  const [token, setToken] = useState(() => storage.get(LS_TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [featureFlags, _setFeatureFlags] = useState(loadInitialFlags);
  const [experimentsEnabled] = useState(
    String(process.env.REACT_APP_EXPERIMENTS_ENABLED || '').toLowerCase() === 'true'
  );
  const isAuthenticated = !!token;

  // Persist feature flags locally for overrides
  const setFeatureFlags = useCallback((flags) => {
    _setFeatureFlags((prev) => {
      const next = { ...(prev || {}), ...(flags || {}) };
      storage.set(LS_FEATURE_FLAGS, JSON.stringify(next));
      return next;
    });
  }, []);

  // Placeholder API: simulate login and "me" call
  const api = {
    // Simulate network delay
    wait: (ms = 350) => new Promise((res) => setTimeout(res, ms)),

    // Placeholder: exchange credentials for token.
    // Replace with real POST /auth/login
    login: async (credentials) => {
      // eslint-disable-next-line no-unused-vars
      const { email, password } = credentials || {};
      await api.wait(250);
      // Return a fake token
      return { token: 'demo-token-123' };
    },

    // Placeholder: fetch current user profile with token.
    // Replace with real GET /me
    me: async (jwt) => {
      await api.wait(200);
      if (!jwt) throw new Error('Unauthorized');
      // Mock user
      return {
        id: 'user_demo',
        name: 'Demo User',
        email: 'demo@example.com',
        plan: 'free',
      };
    },
  };

  /**
   * PUBLIC_INTERFACE
   * login
   * Accepts credentials, obtains token, persists it, and fetches the user profile.
   */
  const login = useCallback(
    async (credentials = {}) => {
      const result = await api.login(credentials);
      const nextToken = result?.token || null;
      if (nextToken) {
        storage.set(LS_TOKEN_KEY, nextToken);
        setToken(nextToken);
        try {
          const me = await api.me(nextToken);
          setUser(me);
        } catch {
          // If fetching user fails, clear token to keep state consistent
          storage.remove(LS_TOKEN_KEY);
          setToken(null);
          setUser(null);
          throw new Error('Failed to fetch user after login');
        }
      } else {
        throw new Error('Invalid login response');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * PUBLIC_INTERFACE
   * logout
   * Clears token and user; leaves feature flags untouched.
   */
  const logout = useCallback(() => {
    storage.remove(LS_TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  /**
   * PUBLIC_INTERFACE
   * refreshUser
   * Re-fetch the current user based on saved token.
   */
  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      return null;
    }
    try {
      const me = await api.me(token);
      setUser(me);
      return me;
    } catch {
      // Token possibly invalid -> logout
      logout();
      return null;
    }
  }, [api, token, logout]);

  // On initial load, if token exists, attempt to fetch the user profile
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (token && !user) {
        try {
          const me = await api.me(token);
          if (mounted) setUser(me);
        } catch {
          if (mounted) {
            logout();
          }
        }
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      token,
      user,
      featureFlags,
      experimentsEnabled,
      login,
      logout,
      refreshUser,
      setFeatureFlags,
    }),
    [
      isAuthenticated,
      token,
      user,
      featureFlags,
      experimentsEnabled,
      login,
      logout,
      refreshUser,
      setFeatureFlags,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppProvider;
