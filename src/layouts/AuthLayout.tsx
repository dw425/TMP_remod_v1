import { Outlet, Link } from 'react-router-dom';
import { AlertContainer } from '@/components/alerts/AlertContainer';
import { ROUTES } from '@/config/routes';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-bg-primary font-dm-sans flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-blueprint-blue focus:text-white focus:px-4 focus:py-2 focus:font-bold"
      >
        Skip to main content
      </a>
      <div className="p-6 flex items-center gap-4">
        <Link to={ROUTES.HOME} className="flex items-center gap-4">
          <img
            src="https://bpcs.com/wp-content/uploads/2021/02/BlueprintLogo_White_Tiles-400x81.png"
            alt="Blueprint"
            className="h-8 w-auto blue-logo-filter"
          />
          <div className="h-6 w-px bg-gray-300" />
          <span className="text-lg font-medium text-gray-500 tracking-tight">Marketplace</span>
        </Link>
      </div>
      <main id="main-content" className="flex-grow flex items-center justify-center px-4">
        <Outlet />
      </main>
      <footer className="p-6 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Blueprint Technologies, LLC. All rights reserved.
      </footer>
      <AlertContainer />
    </div>
  );
}
