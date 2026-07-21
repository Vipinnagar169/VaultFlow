import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, Filter, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { accountService } from '../../../services/account.service';
import { transactionService } from '../../../services/transaction.service';
import { formatCurrency, maskAccountId, formatDate } from '../../../utils/format';
import { TransactionStatusBadge } from '../../../components/ui/Badge';
import { SkeletonTxRow } from '../../../components/ui/Skeleton';
import styles from './TransactionsPage.module.css';

export function TransactionsPage() {
  const [page, setPage] = useState(1);

  // Fetch user accounts
  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountService.getAccounts,
  });

  const primaryAccount = accounts?.[0];

  // Fetch transactions for primary account
  const { data: txData, isLoading } = useQuery({
    queryKey: ['transactions', primaryAccount?._id, page],
    queryFn: () => transactionService.getTransactionsByAccount(primaryAccount!._id, page, 15),
    enabled: !!primaryAccount,
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Transaction History</h1>
          <p className={styles.subtitle}>Complete ledger audit of credit and debit operations</p>
        </div>
      </div>

      <div className={styles.card}>
        {!primaryAccount ? (
          <div className={styles.emptyState}>
            <p>No active bank account available.</p>
          </div>
        ) : isLoading ? (
          <div className={styles.skeletonGroup}>
            <SkeletonTxRow />
            <SkeletonTxRow />
            <SkeletonTxRow />
            <SkeletonTxRow />
          </div>
        ) : !txData?.transactions.length ? (
          <div className={styles.emptyState}>
            <FileText size={40} className="text-muted mb-2" />
            <p>No transactions found for this account</p>
          </div>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Account Pair</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {txData.transactions.map((tx) => {
                    const isDebit = tx.fromAccount === primaryAccount._id;
                    return (
                      <tr key={tx._id}>
                        <td>
                          <div className={`${styles.typeBadge} ${isDebit ? styles.debit : styles.credit}`}>
                            {isDebit ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                            <span>{isDebit ? 'DEBIT' : 'CREDIT'}</span>
                          </div>
                        </td>
                        <td>
                          <span className={styles.mono}>
                            {isDebit ? `To: ${maskAccountId(tx.toAccount)}` : `From: ${maskAccountId(tx.fromAccount)}`}
                          </span>
                        </td>
                        <td>
                          <span className={`${styles.amount} ${isDebit ? styles.debitText : styles.creditText}`}>
                            {isDebit ? '-' : '+'}{formatCurrency(tx.amount)}
                          </span>
                        </td>
                        <td>
                          <TransactionStatusBadge status={tx.status} />
                        </td>
                        <td>
                          <span className={styles.time}>{formatDate(tx.createdAt)}</span>
                        </td>
                        <td>
                          <Link to={`/transactions/${tx._id}`} className={styles.detailLink}>
                            Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {txData.pagination && txData.pagination.pages > 1 && (
              <div className={styles.pagination}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={styles.pageBtn}
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {page} of {txData.pagination.pages}
                </span>
                <button
                  disabled={page === txData.pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                  className={styles.pageBtn}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
