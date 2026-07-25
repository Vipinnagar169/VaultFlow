import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { authService } from '../../../services/auth.service';
import { useAuthStore } from '../../../store/auth.store';
import { getErrorMessage } from '../../../utils/format';
import styles from './Auth.module.css';
import toast from 'react-hot-toast';

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await authService.register({ name, email, password });
      setAuth(data.user, data.token);
      toast.success('Account created successfully! Welcome to VaultFlow.');
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
          <h1 className={styles.title}>Create your VaultFlow Account</h1>
          <p className={styles.subtitle}>Open an account with immutable ledger security</p>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User size={18} />}
            required
          />

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
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock size={18} />}
            hint="Minimum 6 characters required"
            required
          />

          <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
            Create Account <ArrowRight size={18} />
          </Button>
        </form>

        <div className={styles.footer}>
          <p className="text-sm text-secondary">
            Already have an account?{' '}
            <Link to="/login" className={styles.link}>
              Log in
            </Link>
          </p>
        </div>

        <div className={styles.trustBadge}>
          <ShieldCheck size={16} /> 256-bit Immutable Ledger & Encryption
        </div>
      </div>
    </div>
  );
}
