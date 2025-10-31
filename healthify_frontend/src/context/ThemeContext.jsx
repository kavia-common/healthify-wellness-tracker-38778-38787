/* ThemeContext: handles light/dark theme toggling with persistence and html[data-theme] syncing */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'healthify_theme';

const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  // eslint-disable-next-line no-unused-vars
  setTheme: (_v) => {},
  toggleTheme: () => {},
});

function getInitialTheme() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // ignore storage errors
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark && typeof prefersDark.matches === 'boolean') {
      return prefersDark.matches ? 'dark' : 'light';
    }
  }
  return 'light';
}

// PUBLIC_INTERFACE
export function ThemeProvider({ children }) {
  /** Provides theme state (light/dark) with localStorage persistence and updates html[data-theme] attribute for CSS consumption. */
  const [theme, setTheme] = useState(getInitialTheme);

  // Keep html[data-theme] in sync and persist
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  // React to OS changes if user hasn't explicitly stored preference
  useEffect(() => {
    if (!(typeof window !== 'undefined' && window.matchMedia)) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved !== 'light' && saved !== 'dark') {
          setTheme(e.matches ? 'dark' : 'light');
        }
      } catch {
        // ignore
      }
    };
    if (mq.addEventListener) {
      mq.addEventListener('change', onChange);
    } else if (mq.addListener) {
      // Safari / legacy
      mq.addListener(onChange);
    }
    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', onChange);
      } else if (mq.removeListener) {
        mq.removeListener(onChange);
      }
    };
  }, []);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const value = useMemo(
    () => ({ theme, isDark: theme === 'dark', setTheme, toggleTheme }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// PUBLIC_INTERFACE
export function useTheme() {
  /** Hook to access and control current theme: returns { theme, isDark, setTheme, toggleTheme }. */
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}

export default ThemeContext;
