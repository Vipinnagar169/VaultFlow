import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Lock, BookOpen } from 'lucide-react';
import { accountService } from '../../../services/account.service';
import { formatCurrency } from '../../../utils/format';
import styles from './LedgerPage.module.css';

export function LedgerPage() {
  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountService.getAccounts,
  });

  const primaryAccount = accounts?.[0];

  const { data: ledgerData, isLoading } = useQuery({
    queryKey: ['ledger', primaryAccount?._id],
    queryFn: () => accountService.getLedger(primaryAccount!._id),
    enabled: !!primaryAccount,
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Immutable Audit Ledger</h1>
          <p className={styles.subtitle}>
            Append-only double-entry ledger records. Modifications and deletes are strictly prevented at schema level.
          </p>
        </div>
        <div className={styles.badge}>
          <Lock size={16} /> Immutable Enforcement
        </div>
      </div>

      <div className={styles.card}>
        {!primaryAccount ? (
          <div className={styles.emptyState}>
            <p>No active bank account available.</p>
          </div>
        ) : isLoading ? (
          <div className={styles.center}>
            <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--surface-3)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
          </div>
        ) : !ledgerData?.entries.length ? (
          <div className={styles.emptyState}>
            <BookOpen size={40} className="text-muted mb-2" />
            <p>No ledger entries recorded yet.</p>
            <span className="text-xs text-muted">Complete a transaction to write initial CREDIT/DEBIT entries.</span>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ledger Entry ID</th>
                  <th>Account ID</th>
                  <th>Transaction Ref</th>
                  <th>Ledger Type</th>
                  <th>Amount</th>
                  <th>Immutability</th>
                </tr>
              </thead>
              <tbody>
                {ledgerData.entries.map((entry) => (
                  <tr key={entry._id}>
                    <td className={styles.mono}>{entry._id}</td>
                    <td className={styles.mono}>{entry.account}</td>
                    <td className={styles.mono}>
                      {typeof entry.transaction === 'object' ? entry.transaction._id : entry.transaction}
                    </td>
                    <td>
                      <span className={`${styles.typeBadge} ${entry.type === 'DEBIT' ? styles.debit : styles.credit}`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className={`${styles.mono} ${entry.type === 'DEBIT' ? styles.debitText : styles.creditText}`}>
                      {entry.type === 'DEBIT' ? '-' : '+'}{formatCurrency(entry.amount)}
                    </td>
                    <td>
                      <span className={styles.lockedBadge}>
                        <ShieldCheck size={12} /> Read-Only
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
