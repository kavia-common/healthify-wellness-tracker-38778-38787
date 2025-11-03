import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Loader
 * Accessible loading indicator. Uses ARIA live announcements.
 * Props:
 * - label?: string (screen reader text, defaults to "Loading")
 * - size?: number (px)
 */
export default function Loader({ label = 'Loading', size = 20 }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
    >
      <span
        aria-hidden="true"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: '3px solid var(--border-color)',
          borderTopColor: 'var(--color-primary)',
          animation: 'spin 900ms linear infinite',
          display: 'inline-block',
        }}
      />
      <span className="retro-subtitle" style={{ fontSize: 12 }}>
        {label}
      </span>
      <style>
        {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
}
