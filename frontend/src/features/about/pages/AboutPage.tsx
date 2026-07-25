import { Link } from 'react-router-dom';
import {
  ShieldCheck, Zap, BookOpen, Lock, RefreshCw, BarChart3,
  Database, Server, Globe, ArrowRight, Users, Target,
  Eye, Code2, TrendingUp, Mail
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import styles from './AboutPage.module.css';

const TECH_STACK = [
  { icon: <Server size={20} />, name: 'Node.js + Express 5', desc: 'REST API server with async error handling' },
  { icon: <Database size={20} />, name: 'MongoDB + Mongoose', desc: 'Document store with aggregation pipelines' },
  { icon: <Globe size={20} />, name: 'React 19 + TypeScript', desc: 'Type-safe component-driven UI' },
  { icon: <Zap size={20} />, name: 'Vite 8', desc: 'Lightning-fast dev server and bundler' },
  { icon: <RefreshCw size={20} />, name: 'TanStack Query v5', desc: 'Server state, caching & background sync' },
  { icon: <BarChart3 size={20} />, name: 'Zustand + Axios', desc: 'Global auth state + typed API client' },
];

const FEATURES = [
  {
    icon: <Lock size={22} />,
    title: 'Immutable Audit Trail',
    desc: 'Every transaction writes permanent CREDIT and DEBIT ledger entries that cannot be modified or deleted. Mongoose-level pre-hooks enforce immutability at the model layer.',
  },
  {
    icon: <RefreshCw size={22} />,
    title: 'Idempotency Protection',
    desc: 'Every transfer carries a unique idempotency key. Duplicate requests are detected and resolved safely — zero double-spends, zero fund loss on retries.',
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'Real-time Balance Aggregation',
    desc: 'Account balances are never stored — they are computed on-demand via MongoDB aggregation pipelines summing CREDIT minus DEBIT. No stale data. Ever.',
  },
  {
    icon: <Database size={22} />,
    title: 'ACID MongoDB Sessions',
    desc: 'Fund transfers use MongoDB multi-document transactions with sessions. Either both ledger entries commit or nothing does — atomic double-entry guaranteed.',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'JWT Authentication',
    desc: 'Stateless JWT access tokens with HTTP-only cookie blacklisting on logout. Every protected route validates token freshness on each request.',
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'Portfolio Balance Dashboard',
    desc: 'A dedicated total-balance endpoint aggregates balances across all accounts in a single API call, giving a true portfolio view with per-account breakdown.',
  },
];

const FUTURE = [
  'Webhook notifications for real-time transaction alerts',
  'Multi-currency support with live FX rate conversion',
  'Scheduled/recurring transfers with cron jobs',
  'PDF statement generation with ledger export',
  'Admin dashboard with system-wide analytics',
  'Rate limiting & fraud detection middleware',
];

export function AboutPage() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.badge}>
            <ShieldCheck size={14} /> Portfolio Project · Full-Stack Fintech
          </div>
          <h1 className={styles.heroTitle}>
            Built to showcase<br />
            <span className={styles.highlight}>production-grade</span> banking engineering
          </h1>
          <p className={styles.heroSub}>
            VaultFlow is a full-stack double-entry ledger system built from scratch to demonstrate
            real-world financial software patterns — immutability, atomicity, idempotency, and
            real-time aggregation.
          </p>
          <div className={styles.heroCta}>
            <Link to="/register">
              <Button variant="primary" size="lg">
                Try Live Demo <ArrowRight size={18} />
              </Button>
            </Link>
            <a href="https://github.com/Vipinnagar169/Ledger-Pay" target="_blank" rel="noreferrer">
              <Button variant="secondary" size="lg">
                <Code2 size={18} /> View Source
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Problem + Solution */}
      <section className={styles.section}>
        <div className={styles.twoCol}>
          <div className={styles.problemCard}>
            <div className={styles.sectionIcon} style={{ background: 'var(--danger-muted)', color: 'var(--danger)' }}>
              <Target size={20} />
            </div>
            <h2 className={styles.cardTitle}>The Problem</h2>
            <p className={styles.cardText}>
              Most CRUD-based banking demos store balances as a mutable number field. This creates
              data races, no audit history, and catastrophic failure when retries cause double-charges.
              Real banks don't store balances — they compute them from an immutable ledger.
            </p>
          </div>
          <div className={styles.solutionCard}>
            <div className={styles.sectionIcon} style={{ background: 'var(--success-muted)', color: 'var(--success)' }}>
              <Eye size={20} />
            </div>
            <h2 className={styles.cardTitle}>The Solution</h2>
            <p className={styles.cardText}>
              VaultFlow implements a true double-entry ledger: every transaction writes two immutable
              records (DEBIT + CREDIT). Balances are aggregated from these entries in real-time.
              Idempotency keys prevent duplicate processing. MongoDB sessions guarantee atomicity.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Core Features</h2>
          <p className={styles.sectionSub}>Engineering decisions that mirror production financial systems</p>
        </div>
        <div className={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Technology Stack</h2>
          <p className={styles.sectionSub}>Modern, production-proven tools — no boilerplate generators</p>
        </div>
        <div className={styles.techGrid}>
          {TECH_STACK.map((t) => (
            <div key={t.name} className={styles.techCard}>
              <div className={styles.techIcon}>{t.icon}</div>
              <div>
                <p className={styles.techName}>{t.name}</p>
                <p className={styles.techDesc}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className={styles.section}>
        <div className={styles.archCard}>
          <h2 className={styles.sectionTitle}>System Architecture</h2>
          <p className={styles.cardText} style={{ marginBottom: '1.5rem' }}>
            A clean 3-tier architecture: React SPA ↔ Express REST API ↔ MongoDB Atlas
          </p>
          <div className={styles.archFlow}>
            <div className={styles.archNode}>
              <Globe size={18} />
              <span>React Frontend</span>
              <small>Vite + TypeScript + TanStack Query</small>
            </div>
            <div className={styles.archArrow}>→</div>
            <div className={styles.archNode}>
              <Server size={18} />
              <span>Express API</span>
              <small>JWT Auth + Route Guards + Controllers</small>
            </div>
            <div className={styles.archArrow}>→</div>
            <div className={styles.archNode}>
              <Database size={18} />
              <span>MongoDB Atlas</span>
              <small>Ledger + Transactions + Sessions</small>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Security &amp; Reliability</h2>
        </div>
        <div className={styles.securityGrid}>
          {[
            'JWT tokens with HTTP-only cookie blacklist on logout',
            'bcryptjs password hashing (salt rounds: 10)',
            'Mongoose immutable fields block ledger tampering at DB layer',
            'Idempotency keys prevent double-spend on network retries',
            'CORS configured for explicit origin whitelist',
            'MongoDB ACID sessions — atomic multi-document commits',
            'Account ownership verified on every protected endpoint',
            'Input validation before any database write',
          ].map((item) => (
            <div key={item} className={styles.securityItem}>
              <ShieldCheck size={16} className={styles.securityIcon} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Future Vision */}
      <section className={styles.section}>
        <div className={styles.futureCard}>
          <div className={styles.sectionIcon} style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
            <TrendingUp size={20} />
          </div>
          <h2 className={styles.sectionTitle}>Future Roadmap</h2>
          <ul className={styles.futureList}>
            {FUTURE.map((item) => (
              <li key={item} className={styles.futureItem}>
                <ArrowRight size={14} /> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Developer */}
      <section className={styles.section}>
        <div className={styles.devCard}>
          <div className={styles.devAvatar}>
            <Users size={28} />
          </div>
          <div className={styles.devInfo}>
            <h2 className={styles.devName}>Vipin Nagar</h2>
            <p className={styles.devRole}>Full-Stack Developer · Backend & Systems Engineering</p>
            <p className={styles.devBio}>
              Passionate about building robust, scalable backend systems with real-world financial
              engineering patterns. VaultFlow was built as a portfolio demonstration of production-level
              Node.js + MongoDB architecture.
            </p>
            <div className={styles.devLinks}>
              <a href="https://github.com/Vipinnagar169" target="_blank" rel="noreferrer" className={styles.devLink}>
                <Code2 size={16} /> GitHub
              </a>
              <a href="mailto:vipin@example.com" className={styles.devLink}>
                <Mail size={16} /> Contact
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to explore?</h2>
        <p className={styles.ctaSub}>Create a free account and experience the ledger system live.</p>
        <div className={styles.ctaButtons}>
          <Link to="/register">
            <Button variant="primary" size="lg">
              Open an Account <ArrowRight size={18} />
            </Button>
          </Link>
          <Link to="/faq">
            <Button variant="secondary" size="lg">Read FAQ</Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
