import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Send,
  LogOut,
  BookOpen,
  Info,
} from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Sidebar.module.css';
import { useAuthStore } from '../../store/auth.store';
import { authService } from '../../services/auth.service';
import { getInitials } from '../../utils/format';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/accounts', icon: Wallet, label: 'Accounts' },
  { to: '/send', icon: Send, label: 'Send Money' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/ledger', icon: BookOpen, label: 'Ledger' },
  { to: '/about', icon: Info, label: 'About' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  async function handleLogout() {
    try {
      await authService.logout();
    } catch {
      // ignore – blacklist best effort
    } finally {
      logout();
      navigate('/login');
      toast.success('Logged out successfully');
    }
  }

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M2 8.5h20M6 16.5h4M2 5.5a2 2 0 012-2h16a2 2 0 012 2v13a2 2 0 01-2 2H4a2 2 0 01-2-2v-13z" />
          </svg>
        </div>
        <span className={styles.logoText}>VaultFlow</span>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className={styles.activeBg}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon size={18} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className={styles.footer}>
        <div className={styles.userRow}>
          <div className={styles.avatar}>{user ? getInitials(user.name) : 'U'}</div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.name}</p>
            <p className={styles.userEmail}>{user?.email}</p>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
