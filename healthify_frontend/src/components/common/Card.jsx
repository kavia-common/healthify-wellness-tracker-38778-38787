import React from 'react';
import { tokens } from '../../theme/tokens';

/**
 * Utility: build a className string from truthy parts.
 * @param  {...any} parts
 * @returns {string}
 */
function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

/**
 * Basic styles leveraging theme tokens as a fallback to CSS variables.
 * The app's CSS already provides .card, .card-header, .card-body classes.
 */
const baseStyles = {
  card: {
    background: 'var(--color-surface, ' + tokens.surface + ')',
    color: 'var(--color-text, ' + tokens.text + ')',
    border: '1px solid var(--border-color, rgba(17,24,39,0.08))',
    borderRadius: 'var(--radius-md, 12px)',
    boxShadow: 'var(--shadow-sm, 0 2px 6px rgba(0,0,0,0.06))',
    overflow: 'hidden',
  },
  header: {
    padding: '0.85rem 1rem',
    borderBottom: '1px solid var(--border-color, rgba(17,24,39,0.08))',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  body: {
    padding: '1rem',
  },
};

// PUBLIC_INTERFACE
export default function Card({
  /**
   * Optional title to render in the header area. If 'header' is provided, it takes precedence.
   */
  title,
  /**
   * Optional custom header node; overrides 'title' when provided.
   */
  header,
  /**
   * Optional right-side header content (e.g., actions, badge).
   */
  headerRight,
  /**
   * Children will be rendered into the card body.
   */
  children,
  /**
   * Optional footer node (not styled by default).
   */
  footer,
  /**
   * Render element/tag for the card container. Defaults to 'section'.
   */
  as = 'section',
  /**
   * Optional role for accessibility (e.g., 'status', 'alert').
   */
  role,
  /**
   * Extra className to append.
   */
  className,
  /**
   * Inline style override for the card container.
   */
  style,
  /**
   * Props passed to the header element (div.card-header).
   */
  headerProps,
  /**
   * Props passed to the body element (div.card-body).
   */
  bodyProps,
  /**
   * Props passed to the footer element.
   */
  footerProps,
  /**
   * If true, adds subtle retro scanlines over the card.
   */
  retro = false,
  ...rest
}) {
  /**
   * Card component using shared theme tokens and existing CSS classes.
   * Provides an optional header (title or custom), a body for content, and optional footer.
   */
  const Root = as;
  const headerNode = header ?? (title ? <span>{title}</span> : null);

  return (
    <Root
      className={cx('card', retro && 'retro-scanline', className)}
      style={{ ...baseStyles.card, ...style }}
      role={role}
      {...rest}
    >
      {(headerNode || headerRight) && (
        <div className="card-header" style={baseStyles.header} {...(headerProps || {})}>
          <div>{headerNode}</div>
          {headerRight ? <div>{headerRight}</div> : null}
        </div>
      )}

      <div className="card-body" style={baseStyles.body} {...(bodyProps || {})}>
        {children}
      </div>

      {footer ? (
        <div className="card-footer" {...(footerProps || {})}>
          {footer}
        </div>
      ) : null}
    </Root>
  );
}
