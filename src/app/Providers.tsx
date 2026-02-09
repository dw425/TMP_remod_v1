import { type ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { AnalyticsProvider } from '@/features/analytics/AnalyticsProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AnalyticsProvider>
          <AuthProvider>{children}</AuthProvider>
        </AnalyticsProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
