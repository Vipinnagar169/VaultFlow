import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({ width = '100%', height = '1rem', borderRadius, className = '' }: SkeletonProps) {
  return (
    <span
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <Skeleton height="0.75rem" width="40%" />
      <Skeleton height="2rem" width="60%" />
      <Skeleton height="0.75rem" width="30%" />
    </div>
  );
}

export function SkeletonTxRow() {
  return (
    <div className={styles.txRow}>
      <Skeleton width={40} height={40} borderRadius="50%" />
      <div className={styles.txInfo}>
        <Skeleton height="0.875rem" width="50%" />
        <Skeleton height="0.75rem" width="30%" />
      </div>
      <Skeleton height="1rem" width="5rem" />
    </div>
  );
}
