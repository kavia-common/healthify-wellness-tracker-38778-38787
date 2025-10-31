import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/workouts', label: 'Workouts', icon: '🏋️' },
  { to: '/nutrition', label: 'Nutrition', icon: '🥗' },
  { to: '/habits', label: 'Habits', icon: '📈' },
  { to: '/mindfulness', label: 'Mindful', icon: '🧘' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

const styles = {
  bar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: 'var(--color-surface)',
    borderTop: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-xs)',
    zIndex: 50,
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100%',
    padding: '0 6px',
  },
  link: (active) => ({
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 48,
    minWidth: 48,
    padding: '0 8px',
    borderRadius: 10,
    textDecoration: 'none',
    color: active ? 'var(--color-primary)' : 'var(--color-text)',
    fontSize: 12,
    fontWeight: active ? 800 : 600,
    background: active ? 'rgba(37,99,235,0.10)' : 'transparent',
    transition: 'background-color .2s ease, color .2s ease, transform .15s ease',
  }),
  icon: { fontSize: 18, lineHeight: 1 },
};

// PUBLIC_INTERFACE
export default function BottomNav() {
  /** Accessible bottom navigation for primary routes. */
  return (
    <nav
      role="navigation"
      aria-label="Bottom navigation"
      style={styles.bar}
    >
      <div className="container" style={styles.inner}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.label}
            className="focus-ring"
            style={({ isActive }) => styles.link(isActive)}
          >
            <span style={styles.icon} aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
