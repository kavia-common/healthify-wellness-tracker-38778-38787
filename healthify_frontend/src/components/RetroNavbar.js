import React from 'react';

/**
 * PUBLIC_INTERFACE
 * RetroNavbar
 * Accessible top navigation bar aligned with retro theme tokens.
 * Props:
 * - title: string (app or page title)
 * - onBack: function (optional) if provided shows a back button
 * - rightContent: node (optional) area for actions like profile, settings, etc.
 */
export default function RetroNavbar({ title = 'Healthify', onBack, rightContent }) {
  return (
    <header
      className="retro-scanlines"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--color-surface)',
        borderBottom: 'var(--retro-border-width) solid var(--border-color)',
      }}
      role="banner"
      aria-label="Top navigation"
    >
      <nav
        className="retro-container"
        role="navigation"
        aria-label="Primary"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          paddingTop: 'var(--space-3)',
          paddingBottom: 'var(--space-3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="retro-button retro-button--secondary"
              aria-label="Go back"
              title="Go back"
            >
              ←
            </button>
          ) : null}
          <h1
            className="retro-title u-m-0"
            style={{ fontSize: 18, lineHeight: 1.2 }}
            aria-label="Application title"
          >
            {title}
          </h1>
        </div>

        <div
          aria-label="Navbar actions"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          {rightContent || null}
        </div>
      </nav>
    </header>
  );
}
