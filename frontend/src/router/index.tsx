import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Lazy-loaded pages
import { lazy, Suspense } from 'react';

const LandingPage        = lazy(() => import('../features/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage          = lazy(() => import('../features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage       = lazy(() => import('../features/auth/pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DashboardPage      = lazy(() => import('../features/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const AccountsPage       = lazy(() => import('../features/accounts/pages/AccountsPage').then(m => ({ default: m.AccountsPage })));
const SendMoneyPage      = lazy(() => import('../features/transactions/pages/SendMoneyPage').then(m => ({ default: m.SendMoneyPage })));
const TransactionsPage   = lazy(() => import('../features/transactions/pages/TransactionsPage').then(m => ({ default: m.TransactionsPage })));
const TransactionDetail  = lazy(() => import('../features/transactions/pages/TransactionDetailPage').then(m => ({ default: m.TransactionDetailPage })));
const LedgerPage         = lazy(() => import('../features/accounts/pages/LedgerPage').then(m => ({ default: m.LedgerPage })));

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--surface-3)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Suspense fallback={<PageLoader />}><LandingPage /></Suspense>,
  },
  {
    path: '/login',
    element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense>,
  },
  {
    path: '/register',
    element: <Suspense fallback={<PageLoader />}><RegisterPage /></Suspense>,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard',           element: <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense> },
          { path: '/accounts',            element: <Suspense fallback={<PageLoader />}><AccountsPage /></Suspense> },
          { path: '/send',                element: <Suspense fallback={<PageLoader />}><SendMoneyPage /></Suspense> },
          { path: '/transactions',        element: <Suspense fallback={<PageLoader />}><TransactionsPage /></Suspense> },
          { path: '/transactions/:id',    element: <Suspense fallback={<PageLoader />}><TransactionDetail /></Suspense> },
          { path: '/ledger',              element: <Suspense fallback={<PageLoader />}><LedgerPage /></Suspense> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
