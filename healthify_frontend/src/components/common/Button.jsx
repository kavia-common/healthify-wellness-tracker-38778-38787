import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
 * Quick size mapping (uses height/font-size that complement existing CSS).
 */
const sizeStyles = {
  sm: { height: 32, padding: '0 0.75rem', fontSize: 12 },
  md: { height: 40, padding: '0 1rem', fontSize: 14 },
  lg: { height: 48, padding: '0 1.15rem', fontSize: 15 },
};

/**
 * Variant to class map (ties into global .btn styles).
 */
const variantClass = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  // ghost falls back to outline-like with transparent background
  ghost: '',
};

// PUBLIC_INTERFACE
export default function Button({
  /**
   * Visual variant: 'primary' | 'secondary' | 'outline' | 'ghost'
   */
  variant = 'primary',
  /**
   * Visual size: 'sm' | 'md' | 'lg'
   */
  size = 'md',
  /**
   * When provided, renders a Router Link (react-router-dom) with 'to'.
   */
  to,
  /**
   * When provided (and 'to' is not), renders an anchor with 'href'.
   */
  href,
  /**
   * Optional native button type when rendering a <button>.
   */
  type = 'button',
  /**
   * Optional leading icon node.
   */
  leadingIcon,
  /**
   * Optional trailing icon node.
   */
  trailingIcon,
  /**
   * Whether the button is disabled.
   */
  disabled = false,
  /**
   * Optional ARIA label.
   */
  'aria-label': ariaLabel,
  /**
   * Additional class name(s).
   */
  className,
  /**
   * Inline style overrides.
   */
  style,
  /**
   * Children content.
   */
  children,
  /**
   * onClick handler (applies to button and link variants).
   */
  onClick,
  ...rest
}) {
  /**
   * Button component that unifies links and buttons under a consistent theme.
   * Uses existing global .btn classes, with optional token-based fallback styling.
   */
  const classes = cx('btn', variantClass[variant] || '', className);

  const mergedStyle = {
    // Fallback to token colors if CSS variables are missing
    ...(variant === 'primary' ? { backgroundColor: 'var(--color-primary, ' + tokens.primary + ')', color: '#fff' } : {}),
    ...(variant === 'secondary' ? { backgroundColor: 'var(--color-secondary, ' + tokens.secondary + ')', color: '#111827' } : {}),
    ...(variant === 'ghost' ? { backgroundColor: 'transparent', color: 'var(--color-text, ' + tokens.text + ')', border: '1px solid var(--border-color, rgba(17,24,39,0.08))' } : {}),
    ...sizeStyles[size],
    ...style,
  };

  if (to) {
    return (
      <RouterLink
        to={to}
        aria-label={ariaLabel}
        className={classes}
        style={mergedStyle}
        aria-disabled={disabled || undefined}
        onClick={onClick}
        {...rest}
      >
        {leadingIcon ? <span aria-hidden="true">{leadingIcon}</span> : null}
        <span>{children}</span>
        {trailingIcon ? <span aria-hidden="true">{trailingIcon}</span> : null}
      </RouterLink>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        className={classes}
        style={mergedStyle}
        aria-disabled={disabled || undefined}
        onClick={onClick}
        {...rest}
      >
        {leadingIcon ? <span aria-hidden="true">{leadingIcon}</span> : null}
        <span>{children}</span>
        {trailingIcon ? <span aria-hidden="true">{trailingIcon}</span> : null}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classes}
      style={mergedStyle}
      onClick={onClick}
      {...rest}
    >
      {leadingIcon ? <span aria-hidden="true">{leadingIcon}</span> : null}
      <span>{children}</span>
      {trailingIcon ? <span aria-hidden="true">{trailingIcon}</span> : null}
    </button>
  );
}
