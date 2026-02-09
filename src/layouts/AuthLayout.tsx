import { Outlet, Link } from 'react-router-dom';
import { AlertContainer } from '@/components/alerts/AlertContainer';
import { ROUTES } from '@/config/routes';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-bg-primary font-dm-sans flex flex-col">
      <div className="p-6">
        <Link to={ROUTES.HOME} className="text-2xl font-bold text-blueprint-blue">
          Blueprint Marketplace
        </Link>
      </div>
      <main className="flex-grow flex items-center justify-center px-4">
        <Outlet />
      </main>
      <footer className="p-6 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Blueprint Professional Consulting Services
      </footer>
      <AlertContainer />
    </div>
  );
}
