import React, { useState, useEffect } from 'react';
import './App.css';
import AppRouter, { AuthProvider } from './routes/Router';

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

  return (
    <div className="App">
      {/* Global Theme Toggle Button (persists across routes) */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>

      {/* Router with temporary in-memory auth provider */}
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </div>
  );
}

export default App;
