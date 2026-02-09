import { useEffect } from 'react';
import { useAuth } from './useAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { restoreSession } = useAuth();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return <>{children}</>;
}
