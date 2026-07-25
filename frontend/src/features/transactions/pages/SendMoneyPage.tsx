import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, ShieldCheck, CheckCircle2, XCircle, Clock, Copy, RefreshCw, AlertCircle } from 'lucide-react';
import { accountService } from '../../../services/account.service';
import { transactionService } from '../../../services/transaction.service';
import { generateIdempotencyKey } from '../../../utils/idempotency';
import { formatCurrency, maskAccountId, getErrorMessage } from '../../../utils/format';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Transaction } from '../../../types';
import styles from './SendMoneyPage.module.css';
import toast from 'react-hot-toast';

type Step = 'FORM' | 'REVIEW' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export function SendMoneyPage() {
  const queryClient = useQueryClient();

  // Fetch accounts
  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountService.getAccounts,
  });

  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<Step>('FORM');

  // Idempotency key (generated once when entering REVIEW step)
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Timer for 3s backend delay UX animation
  const [countdown, setCountdown] = useState(3);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Set default fromAccount once loaded
  useEffect(() => {
    if (accounts?.length && !fromAccountId) {
      setFromAccountId(accounts[0]._id);
    }
  }, [accounts, fromAccountId]);

  // Fetch balance for selected fromAccount
  const { data: currentBalance = 0 } = useQuery({
    queryKey: ['balance', fromAccountId],
    queryFn: () => accountService.getBalance(fromAccountId),
    enabled: !!fromAccountId,
  });

  // Handle countdown during PROCESSING
  useEffect(() => {
    if (step === 'PROCESSING') {
      setCountdown(3);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  // Create Transaction Mutation
  const sendMutation = useMutation({
    mutationFn: (payload: { fromAccount: string; toAccount: string; amount: number; idempotencyKey: string }) =>
      transactionService.createTransaction(payload),
    onSuccess: (tx: Transaction) => {
      setCompletedTx(tx);
      setStep('SUCCESS');
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction Completed Successfully!');
    },
    onError: (err: unknown) => {
      const msg = getErrorMessage(err);
      setErrorMessage(msg);
      setStep('FAILED');
      toast.error(msg);
    },
  });

  // Proceed from FORM to REVIEW
  function handleGoToReview(e: React.FormEvent) {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount greater than 0');
      return;
    }
    if (numAmount > currentBalance) {
      toast.error(`Insufficient balance. Available: ${formatCurrency(currentBalance)}`);
      return;
    }
    if (fromAccountId === toAccountId) {
      toast.error('From and To accounts cannot be identical');
      return;
    }
    if (!toAccountId.trim()) {
      toast.error('Please enter recipient Account ID');
      return;
    }

    // Generate unique idempotency key for this transaction attempt
    const newKey = generateIdempotencyKey();
    setIdempotencyKey(newKey);
    setStep('REVIEW');
  }

  // Confirm and Execute Transfer
  function handleConfirmTransfer() {
    setStep('PROCESSING');
    sendMutation.mutate({
      fromAccount: fromAccountId,
      toAccount: toAccountId.trim(),
      amount: parseFloat(amount),
      idempotencyKey,
    });
  }

  // Reset form to start new transfer
  function handleReset() {
    setStep('FORM');
    setAmount('');
    setToAccountId('');
    setCompletedTx(null);
    setErrorMessage('');
    setIdempotencyKey('');
  }

  // Copy Idempotency Key or Tx ID
  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Progress Tracker */}
        <div className={styles.stepper}>
          <div className={`${styles.stepDot} ${step === 'FORM' ? styles.activeDot : styles.doneDot}`}>1</div>
          <div className={styles.stepLine} />
          <div className={`${styles.stepDot} ${step === 'REVIEW' ? styles.activeDot : ['PROCESSING', 'SUCCESS', 'FAILED'].includes(step) ? styles.doneDot : ''}`}>2</div>
          <div className={styles.stepLine} />
          <div className={`${styles.stepDot} ${step === 'PROCESSING' ? styles.activeDot : ['SUCCESS', 'FAILED'].includes(step) ? styles.doneDot : ''}`}>3</div>
        </div>

        {/* STEP 1: FORM */}
        {step === 'FORM' && (
          <form onSubmit={handleGoToReview} className={styles.form}>
            <div className={styles.header}>
              <h2 className={styles.title}>Send Money</h2>
              <p className={styles.subtitle}>Transfer funds securely across double-entry ledger accounts</p>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Select Origin Account</label>
              <select
                value={fromAccountId}
                onChange={(e) => setFromAccountId(e.target.value)}
                className={styles.select}
                disabled={accountsLoading}
              >
                {accounts?.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    Account: {maskAccountId(acc._id)} ({acc.currency})
                  </option>
                ))}
              </select>
              <span className={styles.balanceHint}>
                Available Balance: <strong>{formatCurrency(currentBalance)}</strong>
              </span>
            </div>

            <Input
              label="Recipient Account ID"
              placeholder="e.g. 64b8f... (MongoDB ObjectId)"
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              required
              hint="Enter the exact 24-character Account ID of the recipient"
            />

            <Input
              label="Amount (INR)"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" size="lg" fullWidth>
              Review Transfer <ArrowRight size={18} />
            </Button>

            <div className={styles.idempotencyNotice}>
              <ShieldCheck size={16} /> Every transaction is protected with an automatic Idempotency Key to prevent double charges.
            </div>
          </form>
        )}

        {/* STEP 2: REVIEW */}
        {step === 'REVIEW' && (
          <div className={styles.reviewBox}>
            <div className={styles.header}>
              <h2 className={styles.title}>Review Transfer Details</h2>
              <p className={styles.subtitle}>Verify all details before committing to the ledger</p>
            </div>

            <div className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <span>From Account</span>
                <span className={styles.mono}>{maskAccountId(fromAccountId)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>To Account</span>
                <span className={styles.mono}>{toAccountId}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Transfer Amount</span>
                <span className={styles.highlightAmount}>{formatCurrency(parseFloat(amount))}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Idempotency Protection</span>
                <span className={styles.keyBadge} onClick={() => copyToClipboard(idempotencyKey, 'Idempotency Key')}>
                  {idempotencyKey.slice(0, 13)}... <Copy size={12} />
                </span>
              </div>
            </div>

            <div className={styles.actionsGroup}>
              <Button variant="ghost" onClick={() => setStep('FORM')} size="lg">
                Back
              </Button>
              <Button variant="primary" onClick={handleConfirmTransfer} size="lg" fullWidth>
                Confirm & Pay {formatCurrency(parseFloat(amount))}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: PROCESSING (15s intentional delay UX) */}
        {step === 'PROCESSING' && (
          <div className={styles.centerBox}>
            <div className={styles.spinnerWrapper}>
              <svg className={styles.progressRing} width="120" height="120">
                <circle className={styles.ringBg} cx="60" cy="60" r="50" />
                <circle className={styles.ringFg} cx="60" cy="60" r="50" />
              </svg>
              <div className={styles.ringText}>{countdown}s</div>
            </div>

            <h3 className={styles.processingTitle}>Executing Ledger Transfer...</h3>
            <p className={styles.processingDesc}>
              Creating atomic DEBIT & CREDIT entries and committing session transaction in MongoDB.
            </p>

            <div className={styles.statusStep}>
              <Clock size={16} className="text-warning" /> Status: <strong>PENDING</strong>
            </div>

            <p className={styles.warningHint}>
              Do not close or refresh this tab. Idempotency Key <code>{idempotencyKey.slice(0, 8)}</code> locks duplicate requests.
            </p>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'SUCCESS' && completedTx && (
          <div className={styles.centerBox}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={56} />
            </div>

            <h2 className={styles.successTitle}>Transfer Successful!</h2>
            <p className={styles.subtitle}>Funds have been securely transferred and committed to the ledger.</p>

            <div className={styles.receiptCard}>
              <div className={styles.receiptHeader}>Transaction Receipt</div>
              <div className={styles.receiptRow}>
                <span>Amount Paid</span>
                <span className={styles.receiptAmount}>{formatCurrency(completedTx.amount)}</span>
              </div>
              <div className={styles.receiptRow}>
                <span>Transaction ID</span>
                <span className={styles.mono}>{completedTx._id}</span>
              </div>
              <div className={styles.receiptRow}>
                <span>To Account</span>
                <span className={styles.mono}>{completedTx.toAccount}</span>
              </div>
              <div className={styles.receiptRow}>
                <span>Status</span>
                <span className="text-success font-semibold">COMPLETED</span>
              </div>
            </div>

            <Button variant="primary" onClick={handleReset} size="lg" fullWidth>
              Make Another Transfer
            </Button>
          </div>
        )}

        {/* STEP 5: FAILED */}
        {step === 'FAILED' && (
          <div className={styles.centerBox}>
            <div className={styles.failedIcon}>
              <XCircle size={56} />
            </div>

            <h2 className={styles.failedTitle}>Transaction Failed</h2>
            <p className={styles.errorMessage}>{errorMessage}</p>

            <div className={styles.errorBoxAlert}>
              <AlertCircle size={18} /> No funds were deducted from your account. You can retry safely.
            </div>

            <div className={styles.actionsGroup}>
              <Button variant="ghost" onClick={handleReset} size="lg">
                Start Over
              </Button>
              <Button variant="primary" onClick={() => {
                setIdempotencyKey(generateIdempotencyKey());
                setStep('REVIEW');
              }} size="lg" fullWidth icon={<RefreshCw size={18} />}>
                Retry Transfer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
