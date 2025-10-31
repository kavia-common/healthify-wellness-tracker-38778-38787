import React from 'react';

/**
 * Utility: build a className string from truthy parts.
 * @param  {...any} parts
 * @returns {string}
 */
function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

// PUBLIC_INTERFACE
export default function RetroBadge({
  /**
   * Optional label to render if children not provided.
   */
  label,
  /**
   * Optional icon node (emoji or SVG).
   */
  icon,
  /**
   * Children content overrides 'label' when provided.
   */
  children,
  /**
   * Additional class name(s).
   */
  className,
  /**
   * Inline style overrides.
   */
  style,
  ...rest
}) {
  /** A small retro-themed badge using the .retro-badge utility class (with scanline-like shadows). */
  return (
    <span className={cx('retro-badge', className)} style={style} {...rest}>
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      <span>{children ?? label}</span>
    </span>
  );
}
