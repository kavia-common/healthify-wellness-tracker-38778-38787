import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useTheme } from './context/ThemeContext';
import TopBar from './components/layout/TopBar';
import BottomNav from './components/layout/BottomNav';

// PUBLIC_INTERFACE
function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="App retro-scanline">
      <TopBar />

      <main id="main-content" role="main" className="container" style={{ paddingBottom: 76 }}>
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
      </main>

      <BottomNav />
    </div>
  );
}

export default App;
