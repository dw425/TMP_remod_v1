import { Outlet, Link } from 'react-router-dom';
import { AlertContainer } from '@/components/alerts/AlertContainer';
import { ROUTES } from '@/config/routes';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-bg-primary font-dm-sans flex dark:text-gray-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-blueprint-blue focus:text-white focus:px-4 focus:py-2 focus:font-bold"
      >
        Skip to main content
      </a>

      {/* Left branded panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-blueprint-blue to-blue-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Dot pattern background */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10">
          <Link to={ROUTES.HOME} className="flex items-center gap-3 mb-16">
            <img
              src="https://bpcs.com/wp-content/uploads/2021/02/BlueprintLogo_White_Tiles-400x81.png"
              alt="Blueprint"
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>

          <h1 className="text-3xl font-bold leading-tight mb-4">
            Your Databricks AI &amp; Data Marketplace
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Deploy production-ready tools, migration accelerators, and AI frameworks from Blueprint.
          </p>
        </div>

        <div className="relative z-10 text-sm text-blue-300">
          &copy; {new Date().getFullYear()} Blueprint Technologies, LLC.
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header — visible only on mobile */}
        <div className="lg:hidden p-6 flex items-center gap-4">
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

        <main id="main-content" className="flex-grow flex items-center justify-center px-4 py-8">
          <Outlet />
        </main>

        <footer className="lg:hidden p-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Blueprint Technologies, LLC. All rights reserved.
        </footer>
      </div>

      <AlertContainer />
    </div>
  );
}
