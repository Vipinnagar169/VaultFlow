import styles from './Badge.module.css';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
}

export function Badge({ variant = 'default', children, dot = false }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}

// Preset badge for transaction status
type TxStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
const txStatusVariant: Record<TxStatus, BadgeVariant> = {
  PENDING: 'warning',
  COMPLETED: 'success',
  FAILED: 'danger',
  REVERSED: 'danger',
};

export function TransactionStatusBadge({ status }: { status: TxStatus }) {
  return (
    <Badge variant={txStatusVariant[status]} dot>
      {status}
    </Badge>
  );
}

// Preset badge for account status
type AccountStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED';
const accountStatusVariant: Record<AccountStatus, BadgeVariant> = {
  ACTIVE: 'success',
  FROZEN: 'warning',
  CLOSED: 'default',
};

export function AccountStatusBadge({ status }: { status: AccountStatus }) {
  return <Badge variant={accountStatusVariant[status]}>{status}</Badge>;
}
