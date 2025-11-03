import React, { useState, useEffect } from 'react';
import './App.css';
import AppRouter from './routes/Router';
import RetroNavbar from './components/RetroNavbar';
import BottomNav from './components/BottomNav';
import { AppProvider } from './state/AppProvider';
import Toast from './components/Toast';
import { runHealthcheck } from './utils/healthcheck';

/**
 * PUBLIC_INTERFACE
 * App
 * Root component for Healthify. Provides theme toggling and renders Router.
 * Also performs a backend connectivity healthcheck at startup and shows a toast on failure.
 */
function App() {
  const [theme, setTheme] = useState('light');
  const [healthToast, setHealthToast] = useState(null);

  // Apply theme to document root for CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // On app start, run a backend healthcheck and show a banner/toast if it fails
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      const res = await runHealthcheck(ac.signal);
      if (!res.ok) {
        setHealthToast({
          type: res.status >= 500 ? 'error' : 'warning',
          message:
            res.message ||
            (res.status ? `API healthcheck failed (${res.status})` : 'API unreachable'),
        });
      }
    })();
    return () => ac.abort();
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Bottom nav items placeholder (will be enhanced with icons later)
  const navItems = [
    { to: '/dashboard', label: 'Home', ariaLabel: 'Go to dashboard', icon: '🏠' },
    { to: '/workouts', label: 'Workouts', ariaLabel: 'Go to workouts', icon: '🏋️' },
    { to: '/nutrition', label: 'Nutrition', ariaLabel: 'Go to nutrition', icon: '🥗' },
    { to: '/habits', label: 'Habits', ariaLabel: 'Go to habits', icon: '✅' },
    { to: '/profile', label: 'Profile', ariaLabel: 'Go to profile', icon: '👤' },
  ];

  return (
    <div className="App retro-app">
      <RetroNavbar
        title="Healthify"
        rightContent={
          <button
            className="retro-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
            <span style={{ fontSize: 12 }}>
              {theme === 'light' ? 'Dark' : 'Light'}
            </span>
          </button>
        }
      />

      {/* Router wrapped with global AppProvider (auth, user, flags) */}
      <main style={{ paddingBottom: 76 /* space for bottom nav */ }}>
        <AppProvider>
          <AppRouter />
        </AppProvider>
      </main>

      <BottomNav items={navItems} />

      {healthToast ? (
        <Toast
          type={healthToast.type}
          message={healthToast.message}
          onClose={() => setHealthToast(null)}
        />
      ) : null}
    </div>
  );
}

export default App;
