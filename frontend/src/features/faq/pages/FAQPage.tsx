import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import styles from './FAQPage.module.css';

const FAQ_ITEMS = [
  {
    category: 'Accounts & Onboarding',
    questions: [
      {
        q: 'What is VaultFlow?',
        a: 'VaultFlow is a double-entry ledger banking system that implements immutable financial records. Every transaction creates both a CREDIT and a DEBIT ledger entry, ensuring complete auditability and zero data loss — mirroring how real banks manage funds.',
      },
      {
        q: 'How do I create an account?',
        a: 'Register with your name, email, and password. Once registered, you are taken directly to the dashboard where you can open a banking account with one click. Each new account starts with a default deposit of ₹500 INR to let you explore immediately.',
      },
      {
        q: 'Can I have multiple banking accounts?',
        a: 'Yes. You can open as many ledger accounts as you need from the Accounts page. Each account is independently tracked, and your dashboard shows a Total Portfolio Balance aggregated across all your accounts.',
      },
      {
        q: 'What does "account status" mean?',
        a: 'Each account has one of three statuses: ACTIVE (fully operational), FROZEN (temporarily suspended — no transfers allowed), or CLOSED (permanently deactivated). Only ACTIVE accounts can send or receive funds.',
      },
    ],
  },
  {
    category: 'Transactions & Transfers',
    questions: [
      {
        q: 'How do I send money?',
        a: 'Navigate to "Send Money" from the sidebar. Enter the recipient\'s Account ID, your source Account ID, and the amount. A unique idempotency key is auto-generated to prevent duplicate processing. Funds are transferred atomically.',
      },
      {
        q: 'What is an idempotency key?',
        a: 'An idempotency key is a unique identifier attached to every transfer request. If the same request is sent twice (e.g., due to a network timeout), the system detects the duplicate key and returns the original result without processing the transfer again — preventing double-charges.',
      },
      {
        q: 'How long does a transfer take?',
        a: 'Transfers go through a PENDING → COMPLETED flow. There is a simulated 15-second processing window (mimicking real banking settlement delays) before funds are confirmed. You can track status in real-time on the Transactions page.',
      },
      {
        q: 'What happens if a transfer fails?',
        a: 'If any part of the double-entry transaction fails (network error, insufficient funds, inactive account), the entire operation is rolled back using MongoDB session transactions. No partial transfers occur — it\'s all-or-nothing.',
      },
      {
        q: 'Can I reverse a transaction?',
        a: 'Transactions can be marked as REVERSED in the system. Because ledger entries are immutable, reversal creates new offsetting entries rather than modifying existing ones — maintaining a complete audit trail.',
      },
      {
        q: 'What does PENDING status mean?',
        a: 'PENDING means the transaction has been created and is being processed. The debit ledger entry is written first; the credit follows after the processing window. Once both entries commit, the status changes to COMPLETED.',
      },
    ],
  },
  {
    category: 'Ledger & Balance',
    questions: [
      {
        q: 'How is my balance calculated?',
        a: 'Balances are never stored as a field. They are computed in real-time by MongoDB aggregation pipelines that sum all CREDIT entries and subtract all DEBIT entries for your account. This ensures your balance always reflects the exact state of your ledger.',
      },
      {
        q: 'What is the Audit Ledger?',
        a: 'The Audit Ledger is a chronological, immutable record of every CREDIT and DEBIT entry associated with your account. Ledger entries cannot be edited or deleted at any layer — Mongoose pre-hooks enforce this at the model level. This makes VaultFlow verifiably tamper-proof.',
      },
      {
        q: 'What is "Total Portfolio Balance"?',
        a: 'This is the sum of balances across all your accounts, calculated server-side in a single API call. It gives you an instant snapshot of your total holdings without making multiple balance requests.',
      },
      {
        q: 'Why doesn\'t the balance update instantly?',
        a: 'The balance reflects committed ledger entries. During the PENDING window, the DEBIT is recorded but the CREDIT has not yet committed, so the recipient\'s balance will not update until the transaction completes. This is intentional — it mirrors real settlement behaviour.',
      },
    ],
  },
  {
    category: 'Security & Privacy',
    questions: [
      {
        q: 'How is my password stored?',
        a: 'Passwords are hashed using bcryptjs with a salt factor of 10 before being stored. Plain-text passwords are never saved anywhere in the system.',
      },
      {
        q: 'How does authentication work?',
        a: 'VaultFlow uses stateless JWT (JSON Web Tokens). On login, a signed token is issued and sent as an HTTP-only cookie. On logout, the token is added to a blacklist in MongoDB, preventing reuse even before expiry.',
      },
      {
        q: 'Can someone else access my account data?',
        a: 'No. Every protected endpoint verifies account ownership before returning data. You can only view, send from, or fetch balance for accounts that belong to your authenticated user ID.',
      },
      {
        q: 'Is this production-ready?',
        a: 'VaultFlow implements production patterns (idempotency, ACID transactions, immutable audit trail, JWT blacklisting) but is a portfolio project — not a licensed financial product. It demonstrates how real-world banking backends are engineered.',
      },
    ],
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.item} ${open ? styles.itemOpen : ''}`}>
      <button
        className={styles.question}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <ChevronDown
          size={18}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
        />
      </button>
      <div className={`${styles.answer} ${open ? styles.answerOpen : ''}`}>
        <p>{a}</p>
      </div>
    </div>
  );
}

export function FAQPage() {
  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.badge}>
          <HelpCircle size={14} /> Frequently Asked Questions
        </div>
        <h1 className={styles.title}>Everything you need to know</h1>
        <p className={styles.subtitle}>
          Practical answers about how VaultFlow's ledger banking system works — from account setup
          to transaction mechanics and security.
        </p>
      </div>

      {/* FAQ Sections */}
      <div className={styles.sections}>
        {FAQ_ITEMS.map((section) => (
          <div key={section.category} className={styles.section}>
            <h2 className={styles.category}>{section.category}</h2>
            <div className={styles.accordion}>
              {section.questions.map((item) => (
                <AccordionItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <h3 className={styles.ctaTitle}>Still have questions?</h3>
        <p className={styles.ctaSub}>
          Read the full project overview on the About page or explore the live system yourself.
        </p>
        <div className={styles.ctaButtons}>
          <Link to="/about">
            <Button variant="primary">
              About VaultFlow <ArrowRight size={16} />
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary">Try the Demo</Button>
          </Link>
        </div>
      </div>

    </div>
  );
}
