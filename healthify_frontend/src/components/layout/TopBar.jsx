import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const routeTitle = (pathname) => {
  switch (true) {
    case pathname === '/':
      return 'Dashboard';
    case pathname.startsWith('/workouts'):
      return 'Workouts';
    case pathname.startsWith('/nutrition'):
      return 'Nutrition';
    case pathname.startsWith('/habits'):
      return 'Habits';
    case pathname.startsWith('/mindfulness'):
      return 'Mindfulness';
    case pathname.startsWith('/profile'):
      return 'Profile';
    default:
      return 'Healthify';
  }
};

const styles = {
  bar: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    borderBottom: '1px solid var(--border-color)',
    backdropFilter: 'saturate(160%) blur(6px)',
    WebkitBackdropFilter: 'saturate(160%) blur(6px)',
  },
  inner: {
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px',
  },
  brand: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontWeight: 800,
    letterSpacing: '0.02em',
    color: 'var(--color-text)',
  },
  title: {
    fontWeight: 700,
    fontSize: 16,
    margin: 0,
  },
  spacer: { width: 40, height: 1 },
  skip: (visible) => ({
    position: 'absolute',
    left: visible ? 8 : -9999,
    top: visible ? 8 : 'auto',
    zIndex: 100,
    background: 'var(--color-primary)',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: '8px',
    textDecoration: 'none',
    boxShadow: 'var(--shadow-sm)',
  }),
};

// PUBLIC_INTERFACE
export default function TopBar() {
  /** Mobile-first top bar with route-aware title, brand link, and accessible skip link. */
  const location = useLocation();
  const [skipVisible, setSkipVisible] = useState(false);
  const title = routeTitle(location.pathname);

  return (
    <header role="banner" style={styles.bar}>
      {/* Accessible skip link, visible on focus */}
      <a
        href="#main-content"
        aria-label="Skip to main content"
        className="focus-ring"
        style={styles.skip(skipVisible)}
        onFocus={() => setSkipVisible(true)}
        onBlur={() => setSkipVisible(false)}
        onMouseDown={() => setSkipVisible(false)}
      >
        Skip to content
      </a>

      <div className="container" style={styles.inner}>
        <Link to="/" aria-label="Go to Dashboard" style={styles.brand} className="focus-ring">
          <span role="img" aria-hidden="true">💧</span>
          <span>Healthify</span>
        </Link>

        <h1 style={styles.title} aria-live="polite" aria-atomic="true">
          {title}
        </h1>

        {/* Right spacer to balance layout (room for actions later) */}
        <div aria-hidden="true" style={styles.spacer} />
      </div>
    </header>
  );
}
