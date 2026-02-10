import { Link } from 'react-router-dom';
import { CartBadge } from './CartBadge';
import { UserMenu } from './UserMenu';
import { MobileNav } from './MobileNav';
import { SearchBar } from '@/components/composed/SearchBar';
import { whatWeDoMenu, databricksMenu } from '@/data/navigation';
import { ROUTES } from '@/config/routes';
import { BPCS_LINKS } from '@/config/bpcs';
export function Header() {
  return (
    <header className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-md dark:bg-slate-900 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Logo + Divider + Marketplace */}
          <div className="flex items-center gap-4">
            <a
              href="https://bpcs.com/"
              title="Blueprint Home"
              className="flex items-center gap-2 group"
            >
              <img
                src="https://bpcs.com/wp-content/uploads/2021/02/BlueprintLogo_White_Tiles-400x81.png"
                alt="Blueprint"
                className="h-8 w-auto blue-logo-filter"
              />
            </a>

            <div className="h-6 w-px bg-gray-300 dark:bg-slate-600 mx-2" />

            <Link
              to={ROUTES.HOME}
              className="text-lg font-medium text-gray-500 dark:text-gray-400 tracking-tight hover:text-blueprint-blue transition-colors"
            >
              Marketplace
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden xl:flex items-center space-x-8 text-sm font-bold tracking-wide text-gray-900 dark:text-gray-100"
          >
            {/* AI-Migration */}
            <Link
              to={ROUTES.MIGRATION_HOME}
              className="hover:text-blueprint-blue transition-colors flex items-center gap-1"
            >
              AI-Migration <span>+</span>
            </Link>

            {/* What we do — mega dropdown */}
            <div className="group h-20 flex items-center">
              <span className="hover:text-blueprint-blue transition-colors flex items-center gap-1 py-8 cursor-pointer">
                What we do <span>+</span>
              </span>
              <div className="fixed left-0 top-20 w-full bg-white border-t-4 border-blueprint-blue shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 dark:bg-slate-900 dark:border-t-blueprint-blue">
                <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                  <div className="grid grid-cols-4 gap-8">
                    {whatWeDoMenu.map((col) => (
                      <div key={col.title} className="flex flex-col gap-4">
                        <h4 className="text-xs uppercase text-gray-400 font-bold tracking-wider border-b border-gray-100 pb-2 dark:border-slate-700">
                          {col.title}
                        </h4>
                        {col.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            className="text-gray-700 hover:text-blueprint-blue transition-colors block text-[15px] dark:text-gray-300 dark:hover:text-blue-400"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Databricks — mega dropdown */}
            <div className="group h-20 flex items-center">
              <span className="hover:text-blueprint-blue transition-colors flex items-center gap-1 py-8 cursor-pointer">
                Databricks <span>+</span>
              </span>
              <div className="fixed left-0 top-20 w-full bg-white border-t-4 border-blueprint-blue shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 dark:bg-slate-900 dark:border-t-blueprint-blue">
                <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                  <div className="grid grid-cols-3 gap-x-12 gap-y-10">
                    {databricksMenu.map((item) => (
                      <div key={item.title} className="flex flex-col">
                        <a
                          href={item.href}
                          className="text-[17px] font-bold text-gray-900 hover:text-blueprint-blue transition-colors mb-1 dark:text-gray-100 dark:hover:text-blue-400"
                        >
                          {item.title}
                        </a>
                        {item.description && (
                          <p className="text-gray-500 text-[13px] leading-relaxed font-normal dark:text-gray-400">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Our Work */}
            <a
              href="https://bpcs.com/case-studies"
              className="hover:text-blueprint-blue transition-colors"
            >
              Our Work
            </a>

            {/* StrategyHub */}
            <a
              href="https://dw425.github.io/StrategyHub_test/"
              className="hover:text-blueprint-blue transition-colors"
            >
              StrategyHub
            </a>
          </nav>

          {/* Right: Theme + Search + Connect + Cart + User + Mobile Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block w-48">
              <SearchBar />
            </div>
            <a
              href={BPCS_LINKS.contact}
              className="hidden sm:inline-block bg-blueprint-blue hover:bg-blue-800 text-white text-sm font-bold py-2.5 px-6 transition-colors tracking-wide btn-rounded shadow-sm"
            >
              Connect
            </a>
            <CartBadge />
            <UserMenu />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
