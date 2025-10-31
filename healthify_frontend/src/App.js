import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useTheme } from './context/ThemeContext';

// PUBLIC_INTERFACE
function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="App retro-scanline">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <span className="retro-badge" style={{ marginBottom: '1rem' }}>
          Ocean Pro
        </span>

        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Current theme: <strong>{theme}</strong>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
