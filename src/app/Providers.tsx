import { type ReactNode } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { AnalyticsProvider } from '@/features/analytics/AnalyticsProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <AnalyticsProvider>
        <AuthProvider>{children}</AuthProvider>
      </AnalyticsProvider>
    </ErrorBoundary>
  );
}
