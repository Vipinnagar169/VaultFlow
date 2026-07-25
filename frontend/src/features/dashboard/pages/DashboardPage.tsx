import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Wallet, Plus, Send, Eye, EyeOff, ArrowUpRight, ArrowDownLeft,
  Shield, Clock, TrendingUp, Layers, ChevronRight
} from 'lucide-react';
import { accountService } from '../../../services/account.service';
import { transactionService } from '../../../services/transaction.service';
import { useAuthStore } from '../../../store/auth.store';
import { formatCurrency, maskAccountId, formatDate } from '../../../utils/format';
import { Button } from '../../../components/ui/Button';
import { TransactionStatusBadge, AccountStatusBadge } from '../../../components/ui/Badge';
import { SkeletonCard, SkeletonTxRow } from '../../../components/ui/Skeleton';
import styles from './DashboardPage.module.css';
import toast from 'react-hot-toast';

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [showBalance, setShowBalance] = useState(true);

  // Fetch accounts
  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountService.getAccounts,
  });

  const primaryAccount = accounts?.[0];

  // Fetch TOTAL balance across all accounts (new endpoint)
  const { data: totalBalanceData, isLoading: totalBalanceLoading } = useQuery({
    queryKey: ['total-balance'],
    queryFn: accountService.getTotalBalance,
    enabled: !!accounts && accounts.length > 0,
  });

  // Fetch balance of primary account (kept for primary card)
  const { data: balance = 0, isLoading: balanceLoading } = useQuery({
    queryKey: ['balance', primaryAccount?._id],
    queryFn: () => accountService.getBalance(primaryAccount!._id),
    enabled: !!primaryAccount,
  });

  // Fetch recent transactions of primary account
  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ['transactions', primaryAccount?._id],
    queryFn: () => transactionService.getTransactionsByAccount(primaryAccount!._id, 1, 5),
    enabled: !!primaryAccount,
  });

  // Mutation to create account
  const createAccountMutation = useMutation({
    mutationFn: accountService.createAccount,
    onSuccess: (newAccount) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['total-balance'] });
      toast.success(`New Bank Account created! ID: ${newAccount._id}`);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create bank account');
    },
  });

  const totalBalance = totalBalanceData?.totalBalance ?? balance;
  const accountCount = totalBalanceData?.accountCount ?? (primaryAccount ? 1 : 0);

  return (
    <div className={styles.container}>
      {/* Welcome Banner */}
      <div className={styles.welcomeBanner}>
        <div>
          <h1 className={styles.greeting}>Welcome back, {user?.name}</h1>
          <p className={styles.subtext}>Double-entry ledger accounting system active &amp; verified</p>
        </div>
        {!primaryAccount && !accountsLoading && (
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            loading={createAccountMutation.isPending}
            onClick={() => createAccountMutation.mutate()}
          >
            Open Banking Account
          </Button>
        )}
      </div>

      {/* Portfolio Total Balance — NEW */}
      {primaryAccount && (
        <div className={styles.totalBalanceCard}>
          <div className={styles.totalBalanceLeft}>
            <div className={styles.totalBalanceIcon}>
              <TrendingUp size={22} />
            </div>
            <div>
              <span className={styles.totalBalanceLabel}>
                <Layers size={13} style={{ display: 'inline', marginRight: 4 }} />
                Total Portfolio Balance
              </span>
              {totalBalanceLoading ? (
                <div className={styles.totalBalanceSkeleton} />
              ) : (
                <p className={styles.totalBalanceAmount}>
                  {showBalance ? formatCurrency(totalBalance) : '₹ ••••••••'}
                </p>
              )}
              <span className={styles.totalBalanceSub}>
                Across {accountCount} ledger account{accountCount !== 1 ? 's' : ''} · Real-time aggregation
              </span>
            </div>
          </div>
          <div className={styles.totalBalanceRight}>
            {totalBalanceData?.accounts.map((acc) => (
              <div key={acc.accountId.toString()} className={styles.accBreakdownRow}>
                <span className={styles.accBreakdownId}>{maskAccountId(acc.accountId.toString())}</span>
                <span className={styles.accBreakdownBal}>
                  {showBalance ? formatCurrency(acc.balance) : '₹ ••••'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className={styles.grid}>
        {/* Left Column — Account & Balance Cards */}
        <div className={styles.mainCol}>
          {/* Primary Balance Card */}
          <div className={styles.balanceCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardBadge}>
                <Wallet size={16} /> Primary Account
              </div>
              <button
                className={styles.eyeBtn}
                onClick={() => setShowBalance(!showBalance)}
                title={showBalance ? 'Hide Balance' : 'Show Balance'}
              >
                {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className={styles.balanceBody}>
              <span className={styles.balanceLabel}>Available Balance</span>
              {balanceLoading ? (
                <div style={{ padding: '0.5rem 0' }}>
                  <SkeletonCard />
                </div>
              ) : (
                <h2 className={styles.balanceAmount}>
                  {showBalance ? formatCurrency(balance) : '₹ ••••••••'}
                </h2>
              )}
            </div>

            {primaryAccount && (
              <div className={styles.cardFooter}>
                <div>
                  <span className={styles.accLabel}>Account ID</span>
                  <p className={styles.accValue}>{maskAccountId(primaryAccount._id)}</p>
                </div>
                <div>
                  <span className={styles.accLabel}>Status</span>
                  <AccountStatusBadge status={primaryAccount.status} />
                </div>
                <div>
                  <span className={styles.accLabel}>Currency</span>
                  <span className={styles.accValue}>{primaryAccount.currency}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <Link to="/send" className={styles.actionBtn}>
              <div className={styles.actionIcon} style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
                <Send size={20} />
              </div>
              <span>Send Money</span>
            </Link>

            <Link to="/accounts" className={styles.actionBtn}>
              <div className={styles.actionIcon} style={{ background: 'var(--info-muted)', color: 'var(--info)' }}>
                <Wallet size={20} />
              </div>
              <span>View Accounts</span>
            </Link>

            <Link to="/ledger" className={styles.actionBtn}>
              <div className={styles.actionIcon} style={{ background: 'var(--warning-muted)', color: 'var(--warning)' }}>
                <Shield size={20} />
              </div>
              <span>Audit Ledger</span>
            </Link>
          </div>

          {/* Accounts List (if user has multiple) */}
          {accounts && accounts.length > 1 && (
            <div className={styles.sectionCard}>
              <h3 className={styles.sectionTitle}>All Banking Accounts</h3>
              <div className={styles.accountsList}>
                {accounts.map((acc) => (
                  <div key={acc._id} className={styles.accountRow}>
                    <div>
                      <p className={styles.accId}>{acc._id}</p>
                      <span className={styles.accDate}>Created {formatDate(acc.createdAt)}</span>
                    </div>
                    <AccountStatusBadge status={acc.status} />
                  </div>
                ))}
              </div>
              <Link to="/accounts" className={styles.viewAllAccounts}>
                Manage all accounts <ChevronRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* Right Column — Recent Transactions */}
        <div className={styles.sideCol}>
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Recent Activity</h3>
              <Link to="/transactions" className={styles.viewAll}>View all</Link>
            </div>

            {!primaryAccount ? (
              <div className={styles.emptyState}>
                <p>No active bank account found.</p>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => createAccountMutation.mutate()}
                >
                  Create Account
                </Button>
              </div>
            ) : txLoading ? (
              <div className={styles.skeletonList}>
                <SkeletonTxRow />
                <SkeletonTxRow />
                <SkeletonTxRow />
              </div>
            ) : !txData?.transactions.length ? (
              <div className={styles.emptyState}>
                <Clock size={32} className="text-muted mb-2" />
                <p>No transactions yet</p>
                <span className="text-xs text-muted">Make your first transfer to see activity</span>
              </div>
            ) : (
              <div className={styles.txList}>
                {txData.transactions.map((tx) => {
                  const isDebit = tx.fromAccount === primaryAccount._id;
                  return (
                    <Link to={`/transactions/${tx._id}`} key={tx._id} className={styles.txItem}>
                      <div className={`${styles.txBadge} ${isDebit ? styles.debit : styles.credit}`}>
                        {isDebit ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                      </div>
                      <div className={styles.txDetails}>
                        <p className={styles.txTarget}>
                          {isDebit ? `To: ${maskAccountId(tx.toAccount)}` : `From: ${maskAccountId(tx.fromAccount)}`}
                        </p>
                        <span className={styles.txTime}>{formatDate(tx.createdAt)}</span>
                      </div>
                      <div className={styles.txRight}>
                        <p className={`${styles.txAmount} ${isDebit ? styles.debitText : styles.creditText}`}>
                          {isDebit ? '-' : '+'}{formatCurrency(tx.amount)}
                        </p>
                        <TransactionStatusBadge status={tx.status} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
