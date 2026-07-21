import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './lib/queryClient';
import { AppRouter } from './router';
import './styles/globals.css';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--surface-2)',
            color: 'var(--text-1)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-sans)',
          },
          success: {
            iconTheme: { primary: 'var(--primary)', secondary: 'var(--surface-1)' },
          },
          error: {
            iconTheme: { primary: 'var(--danger)', secondary: 'var(--surface-1)' },
          },
        }}
      />
    </QueryClientProvider>
  );
}
