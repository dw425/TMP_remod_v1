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
      <div className="p-6 flex items-center gap-3">
        <Link to={ROUTES.HOME} className="flex items-center gap-3">
          <div className="bg-blueprint-blue p-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-blueprint-blue">Blueprint Marketplace</span>
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
