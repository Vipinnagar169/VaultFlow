import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wallet, Plus, ShieldCheck, Copy } from 'lucide-react';
import { accountService } from '../../../services/account.service';
import { formatCurrency, formatDate } from '../../../utils/format';
import { AccountStatusBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import styles from './AccountsPage.module.css';
import toast from 'react-hot-toast';

export function AccountsPage() {
  const queryClient = useQueryClient();

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountService.getAccounts,
  });

  const createAccountMutation = useMutation({
    mutationFn: accountService.createAccount,
    onSuccess: (newAcc) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success(`New Bank Account Created: ${newAcc._id}`);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create account');
    },
  });

  function copy(id: string) {
    navigator.clipboard.writeText(id);
    toast.success('Account ID copied to clipboard');
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Bank Accounts</h1>
          <p className={styles.subtitle}>Manage your active ledger accounts and balances</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={16} />}
          loading={createAccountMutation.isPending}
          onClick={() => createAccountMutation.mutate()}
        >
          Open New Account
        </Button>
      </div>

      {isLoading ? (
        <div className={styles.grid}>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : !accounts?.length ? (
        <div className={styles.emptyCard}>
          <Wallet size={48} className="text-muted mb-4" />
          <h3>No Accounts Found</h3>
          <p className="text-sm text-muted mb-6">Create your first banking account to start transacting.</p>
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            loading={createAccountMutation.isPending}
            onClick={() => createAccountMutation.mutate()}
          >
            Create Account
          </Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {accounts.map((acc) => (
            <AccountCard key={acc._id} account={acc} onCopy={() => copy(acc._id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function AccountCard({ account, onCopy }: { account: any; onCopy: () => void }) {
  const { data: balance = 0, isLoading } = useQuery({
    queryKey: ['balance', account._id],
    queryFn: () => accountService.getBalance(account._id),
  });

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.cardBadge}>
          <Wallet size={16} /> Ledger Account
        </div>
        <AccountStatusBadge status={account.status} />
      </div>

      <div className={styles.balanceBox}>
        <span className={styles.label}>Computed Ledger Balance</span>
        {isLoading ? (
          <div className="animate-pulse" style={{ height: 32, width: '60%', background: 'var(--surface-3)', borderRadius: 4 }} />
        ) : (
          <h2 className={styles.balance}>{formatCurrency(balance)}</h2>
        )}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.accIdBox}>
          <span className={styles.label}>Account ID (MongoDB ObjectId)</span>
          <div className={styles.idRow}>
            <span className={styles.mono}>{account._id}</span>
            <button onClick={onCopy} className={styles.copyBtn} title="Copy ID">
              <Copy size={14} />
            </button>
          </div>
        </div>
        <div className={styles.dateRow}>
          <span>Opened: {formatDate(account.createdAt)}</span>
          <span className="text-brand flex items-center gap-1"><ShieldCheck size={14} /> Active</span>
        </div>
      </div>
    </div>
  );
}
