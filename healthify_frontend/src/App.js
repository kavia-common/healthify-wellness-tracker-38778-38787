import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App
 * Root component for Healthify. Provides a minimal scaffold and theme toggling.
 * This will be extended with Router and pages in subsequent steps.
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
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <h1 className="retro-title">Healthify</h1>
        <p className="retro-subtitle">Your wellness companion</p>

        <p className="sr-note">
          Current theme: <strong>{theme}</strong>
        </p>
      </header>
    </div>
  );
}

export default App;
