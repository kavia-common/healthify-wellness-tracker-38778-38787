import React, { useEffect } from 'react';

/**
 * PUBLIC_INTERFACE
 * Toast
 * Temporary notification component with accessible live region.
 * Props:
 * - message: string
 * - type: "info" | "success" | "warning" | "error"
 * - duration: number (ms) auto-dismiss; if 0, persistent
 * - onClose: function called when dismissed
 */
export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) {
  useEffect(() => {
    if (!duration) return;
    const id = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(id);
  }, [duration, onClose]);

  const palette = {
    info: {
      border: 'var(--retro-border-width) solid var(--border-color)',
      bg: 'var(--color-surface)',
      color: 'var(--text-primary)',
    },
    success: {
      border: 'var(--retro-border-width) solid #10b98166',
      bg: '#ecfdf5',
      color: '#065f46',
    },
    warning: {
      border: 'var(--retro-border-width) solid #f59e0b66',
      bg: '#fffbeb',
      color: '#7c2d12',
    },
    error: {
      border: 'var(--retro-border-width) solid #ef444466',
      bg: '#fef2f2',
      color: '#7f1d1d',
    },
  }[type];

  return (
    <div
      role="status"
      aria-live="polite"
      className="retro-card retro-card--elevated"
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: '80px',
        zIndex: 100,
        minWidth: 240,
        maxWidth: '90%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        background: palette.bg,
        color: palette.color,
        border: palette.border,
        boxShadow: 'var(--elevation-2)',
      }}
    >
      <span style={{ fontSize: 14 }}>{message}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        className="retro-button"
        style={{ padding: '4px 8px', fontSize: 12 }}
      >
        ✕
      </button>
    </div>
  );
}
