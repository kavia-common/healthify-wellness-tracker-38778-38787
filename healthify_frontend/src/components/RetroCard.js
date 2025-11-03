import React from 'react';

/**
 * PUBLIC_INTERFACE
 * RetroCard
 * Themed card container with optional header/footer and elevated variant.
 * Props:
 * - title?: string
 * - subtitle?: string
 * - children: node
 * - elevated?: boolean
 * - as?: string (semantic tag, defaults to section)
 * - footer?: node
 */
export default function RetroCard({
  title,
  subtitle,
  children,
  elevated = false,
  as: Tag = 'section',
  footer,
}) {
  return (
    <Tag
      className={`retro-card ${elevated ? 'retro-card--elevated' : ''}`}
      role="region"
      aria-label={title ? `${title} card` : 'Content card'}
      style={{ marginBottom: 'var(--space-4)' }}
    >
      {(title || subtitle) && (
        <header style={{ marginBottom: 'var(--space-3)' }}>
          {title ? (
            <h2 className="retro-title" style={{ fontSize: 18, margin: 0 }}>
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="retro-subtitle" style={{ marginTop: 6 }}>
              {subtitle}
            </p>
          ) : null}
        </header>
      )}
      <div>{children}</div>
      {footer ? (
        <footer style={{ marginTop: 'var(--space-3)' }}>{footer}</footer>
      ) : null}
    </Tag>
  );
}
