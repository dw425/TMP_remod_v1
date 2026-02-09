import { useEffect } from 'react';
import { initAnalytics, identifyUser } from './analytics';
import { useAuthStore } from '@/features/auth/authStore';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (user) {
      identifyUser(user.id, {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        company: user.company,
        role: user.role,
      });
    }
  }, [user]);

  return <>{children}</>;
}
