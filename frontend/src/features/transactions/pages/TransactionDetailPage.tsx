import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ShieldCheck, Copy, Clock, Hash } from 'lucide-react';
import { transactionService } from '../../../services/transaction.service';
import { formatCurrency, formatDate } from '../../../utils/format';
import { TransactionStatusBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import styles from './TransactionDetailPage.module.css';
import toast from 'react-hot-toast';

export function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['transactionDetail', id],
    queryFn: () => transactionService.getTransactionById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className={styles.center}>
        <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--surface-3)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.center}>
        <p className="text-danger mb-4">Transaction not found or access denied.</p>
        <Button variant="ghost" onClick={() => navigate('/transactions')}>
          <ArrowLeft size={16} /> Back to Transactions
        </Button>
      </div>
    );
  }

  const { transaction, ledgerEntries } = data;

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  }

  return (
    <div className={styles.container}>
      <div className={styles.topNav}>
        <Link to="/transactions" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to History
        </Link>
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.amountHeader}>
            <span>Amount Transferred</span>
            <h2>{formatCurrency(transaction.amount)}</h2>
          </div>
          <TransactionStatusBadge status={transaction.status} />
        </div>

        <div className={styles.divider} />

        {/* Transaction Metadata */}
        <div className={styles.grid}>
          <div className={styles.metaBox}>
            <span className={styles.label}>Transaction ID</span>
            <div className={styles.valWithCopy}>
              <span className={styles.mono}>{transaction._id}</span>
              <button onClick={() => copy(transaction._id, 'Transaction ID')} className={styles.copyBtn}>
                <Copy size={14} />
              </button>
            </div>
          </div>

          <div className={styles.metaBox}>
            <span className={styles.label}>Idempotency Key</span>
            <div className={styles.valWithCopy}>
              <span className={styles.mono}>{transaction.idempotencyKey}</span>
              <button onClick={() => copy(transaction.idempotencyKey, 'Idempotency Key')} className={styles.copyBtn}>
                <Copy size={14} />
              </button>
            </div>
          </div>

          <div className={styles.metaBox}>
            <span className={styles.label}>From Account</span>
            <span className={styles.mono}>{transaction.fromAccount}</span>
          </div>

          <div className={styles.metaBox}>
            <span className={styles.label}>To Account</span>
            <span className={styles.mono}>{transaction.toAccount}</span>
          </div>

          <div className={styles.metaBox}>
            <span className={styles.label}>Created At</span>
            <span className={styles.val}><Clock size={14} /> {formatDate(transaction.createdAt)}</span>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Double-Entry Ledger Details */}
        <div className={styles.ledgerSection}>
          <div className={styles.ledgerHeader}>
            <ShieldCheck size={18} className="text-brand" />
            <h3>Associated Ledger Audit Log</h3>
          </div>
          <p className={styles.ledgerDesc}>
            Double-entry ledger records generated atomically during this transaction execution.
          </p>

          <div className={styles.ledgerTableWrapper}>
            <table className={styles.ledgerTable}>
              <thead>
                <tr>
                  <th>Entry ID</th>
                  <th>Account ID</th>
                  <th>Ledger Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {ledgerEntries && ledgerEntries.length > 0 ? (
                  ledgerEntries.map((entry: any) => (
                    <tr key={entry._id}>
                      <td className={styles.mono}>{entry._id}</td>
                      <td className={styles.mono}>{entry.account}</td>
                      <td>
                        <span className={`${styles.badge} ${entry.type === 'DEBIT' ? styles.debit : styles.credit}`}>
                          {entry.type}
                        </span>
                      </td>
                      <td className={styles.mono}>{formatCurrency(entry.amount)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-muted">
                      No ledger entries returned
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
