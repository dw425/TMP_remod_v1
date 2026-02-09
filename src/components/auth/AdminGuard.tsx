import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { ROUTES } from '@/config/routes';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
}
