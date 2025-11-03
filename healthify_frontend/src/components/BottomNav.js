import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * BottomNav
 * Mobile-first bottom navigation bar with labeled icons.
 * Props:
 * - items: [{ to: string, label: string, icon?: ReactNode, ariaLabel?: string }]
 */
export default function BottomNav({ items = [] }) {
  return (
    <nav
      role="navigation"
      aria-label="Bottom navigation"
      style={{
        position: 'sticky',
        bottom: 0,
        width: '100%',
        background: 'var(--color-surface)',
        borderTop: 'var(--retro-border-width) solid var(--border-color)',
        boxShadow: '0 -2px 12px var(--color-shadow)',
      }}
    >
      <ul
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.max(items.length, 1)}, 1fr)`,
          margin: 0,
          padding: 'var(--space-2) var(--space-4)',
          listStyle: 'none',
          gap: 'var(--space-2)',
          alignItems: 'center',
        }}
      >
        {items.map((item) => (
          <li key={item.to} style={{ textAlign: 'center' }}>
            <NavLink
              to={item.to}
              aria-label={item.ariaLabel || item.label}
              className="retro-link"
              style={({ isActive }) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '8px 4px',
                borderRadius: 'var(--radius-1)',
              })}
            >
              <span aria-hidden="true" style={{ fontSize: 16 }}>
                {item.icon || '●'}
              </span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
