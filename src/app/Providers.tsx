import { type ReactNode } from 'react';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { AnalyticsProvider } from '@/features/analytics/AnalyticsProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AnalyticsProvider>
      <AuthProvider>{children}</AuthProvider>
    </AnalyticsProvider>
  );
}
