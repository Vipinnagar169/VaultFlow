import styles from './Button.module.css';
import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cls}
      disabled={disabled || loading}
      {...(props as object)}
    >
      {loading ? (
        <span className={styles.spinner} aria-label="Loading" />
      ) : icon ? (
        <span className={styles.icon}>{icon}</span>
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
}
