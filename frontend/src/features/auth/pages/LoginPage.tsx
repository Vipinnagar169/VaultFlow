import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { authService } from '../../../services/auth.service';
import { useAuthStore } from '../../../store/auth.store';
import { getErrorMessage } from '../../../utils/format';
import styles from './Auth.module.css';
import toast from 'react-hot-toast';

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await authService.login({ email, password });
      setAuth(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoBadge}>
            <Zap size={20} className="text-brand" />
          </div>
          <h1 className={styles.title}>Welcome to VaultFlow</h1>
          <p className={styles.subtitle}>Enter your credentials to access your banking ledger</p>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={18} />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock size={18} />}
            required
          />

          <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
            Log In <ArrowRight size={18} />
          </Button>
        </form>

        <div className={styles.footer}>
          <p className="text-sm text-secondary">
            Don't have an account yet?{' '}
            <Link to="/register" className={styles.link}>
              Create an account
            </Link>
          </p>
        </div>

        <div className={styles.trustBadge}>
          <ShieldCheck size={16} /> Secured by Double-Entry Immutable Ledger
        </div>
      </div>
    </div>
  );
}
