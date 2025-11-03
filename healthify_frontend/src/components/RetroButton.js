import React from 'react';

/**
 * PUBLIC_INTERFACE
 * RetroButton
 * Button component using retro styles and tokens.
 * Props:
 * - children: node (label)
 * - variant: "primary" | "secondary" | "danger"
 * - size: "sm" | "md" | "lg"
 * - type: button type
 * - ariaLabel: string (accessibility label override)
 * - disabled: boolean
 * - onClick: function
 */
export default function RetroButton({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ariaLabel,
  disabled = false,
  onClick,
  ...rest
}) {
  const variantClass =
    variant === 'secondary'
      ? 'retro-button--secondary'
      : variant === 'danger'
      ? 'retro-button--danger'
      : '';

  const sizeStyle =
    size === 'sm'
      ? { padding: '6px 10px', fontSize: 12 }
      : size === 'lg'
      ? { padding: '12px 18px', fontSize: 16 }
      : { padding: '10px 16px', fontSize: 14 };

  return (
    <button
      type={type}
      className={`retro-button ${variantClass}`}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      {...rest}
      style={{
        ...sizeStyle,
        opacity: disabled ? 0.7 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}
