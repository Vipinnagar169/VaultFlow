import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Lock, RefreshCw, BarChart3 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import styles from './LandingPage.module.css';

export function LandingPage() {
  return (
    <div className={styles.wrapper}>
      {/* Header / Nav */}
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Zap size={20} />
          </div>
          <span>LedgerPay</span>
        </div>
        <div className={styles.navActions}>
          <Link to="/login">
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <ShieldCheck size={14} /> Immutable Ledger Accounting Engine
        </div>
        <h1 className={styles.heroTitle}>
          Banking infrastructure engineered with <span className={styles.highlight}>zero-compromise</span> integrity.
        </h1>
        <p className={styles.heroSubtitle}>
          Real-time credit/debit ledger entries, atomic double-entry verification, and built-in idempotency protection for ultra-secure financial transactions.
        </p>

        <div className={styles.ctaGroup}>
          <Link to="/register">
            <Button variant="primary" size="lg">
              Open Banking Account <ArrowRight size={18} />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              Access Existing Ledger
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}><Lock size={20} /></div>
            <h3>Immutable Audit Trail</h3>
            <p>Every single transaction writes permanent credit and debit records into an aggregate MongoDB ledger that cannot be tampered with or deleted.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}><RefreshCw size={20} /></div>
            <h3>Idempotency Guard</h3>
            <p>Unique request hashing guarantees zero duplicate transfers, protecting user funds against retries, network glitches, or accidental double clicks.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}><BarChart3 size={20} /></div>
            <h3>Dynamic Balance Aggregation</h3>
            <p>Account balances are calculated dynamically directly from the underlying ledger ledger entries using high-performance MongoDB aggregation pipelines.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 LedgerPay Banking Systems. Powered by Node.js, Express & MongoDB Atlas.</p>
      </footer>
    </div>
  );
}
