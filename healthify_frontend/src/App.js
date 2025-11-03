import React, { useState, useEffect } from 'react';
import './App.css';
import AppRouter, { AuthProvider } from './routes/Router';
import RetroNavbar from './components/RetroNavbar';
import BottomNav from './components/BottomNav';

/**
 * PUBLIC_INTERFACE
 * App
 * Root component for Healthify. Provides theme toggling and renders Router.
 */
function App() {
  const [theme, setTheme] = useState('light');

  // Apply theme to document root for CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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

      {/* Router with temporary in-memory auth provider */}
      <main style={{ paddingBottom: 76 /* space for bottom nav */ }}>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </main>

      <BottomNav items={navItems} />
    </div>
  );
}

export default App;
