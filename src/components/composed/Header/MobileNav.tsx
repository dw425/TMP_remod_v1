import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useScrollLock } from '@/hooks/useScrollLock';
import { whatWeDoMenu, databricksMenu } from '@/data/navigation';
import { ROUTES } from '@/config/routes';
import { BPCS_LINKS } from '@/config/bpcs';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  useScrollLock(isOpen);

  const closeNav = useCallback(() => {
    setIsOpen(false);
    setExpandedSection(null);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  return (
    <>
      {/* Hamburger Button — visible below xl */}
      <button
        onClick={() => setIsOpen(true)}
        className="xl:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
        aria-label="Open navigation menu"
      >
        <span className="block w-6 h-0.5 bg-gray-900 dark:bg-gray-100" />
        <span className="block w-6 h-0.5 bg-gray-900 dark:bg-gray-100" />
        <span className="block w-6 h-0.5 bg-gray-900 dark:bg-gray-100" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100]"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[320px] max-w-[90vw] bg-white dark:bg-slate-900 z-[101] border-l-4 border-blueprint-blue shadow-xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-900 text-2xl"
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-grow overflow-y-auto p-4">
          <nav className="space-y-1">
            {/* Home / Marketplace */}
            <Link
              to={ROUTES.HOME}
              onClick={closeNav}
              className="block px-4 py-3 text-sm font-bold text-gray-900 hover:text-blueprint-blue hover:bg-gray-50 transition-colors"
            >
              Marketplace
            </Link>

            {/* AI-Migration */}
            <Link
              to={ROUTES.MIGRATION_HOME}
              onClick={closeNav}
              className="block px-4 py-3 text-sm font-bold text-gray-900 hover:text-blueprint-blue hover:bg-gray-50 transition-colors"
            >
              AI-Migration
            </Link>

            {/* What we do — Accordion */}
            <div>
              <button
                onClick={() => toggleSection('whatwedo')}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-gray-900 hover:text-blueprint-blue hover:bg-gray-50 transition-colors"
              >
                <span>What we do</span>
                <svg
                  className={`w-4 h-4 transition-transform ${expandedSection === 'whatwedo' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === 'whatwedo' && (
                <div className="pl-4 pb-2 space-y-1">
                  {whatWeDoMenu.map((col) => (
                    <div key={col.title} className="mb-3">
                      <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {col.title}
                      </p>
                      {col.links.map((link) =>
                        link.external ? (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blueprint-blue transition-colors"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            key={link.label}
                            to={link.href}
                            onClick={closeNav}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blueprint-blue transition-colors"
                          >
                            {link.label}
                          </Link>
                        ),
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Databricks — Accordion */}
            <div>
              <button
                onClick={() => toggleSection('databricks')}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-gray-900 hover:text-blueprint-blue hover:bg-gray-50 transition-colors"
              >
                <span>Databricks</span>
                <svg
                  className={`w-4 h-4 transition-transform ${expandedSection === 'databricks' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === 'databricks' && (
                <div className="pl-4 pb-2 space-y-1">
                  {databricksMenu.map((item) =>
                    item.external ? (
                      <a
                        key={item.title}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-blueprint-blue transition-colors"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <Link
                        key={item.title}
                        to={item.href}
                        onClick={closeNav}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-blueprint-blue transition-colors"
                      >
                        {item.title}
                      </Link>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* Our Work */}
            <a
              href="https://bpcs.com/case-studies"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 text-sm font-bold text-gray-900 hover:text-blueprint-blue hover:bg-gray-50 transition-colors"
            >
              Our Work
            </a>

            {/* StrategyHub */}
            <a
              href="https://dw425.github.io/StrategyHub_test/"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 text-sm font-bold text-gray-900 hover:text-blueprint-blue hover:bg-gray-50 transition-colors"
            >
              StrategyHub
            </a>
          </nav>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
          <a
            href={BPCS_LINKS.contact}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-blueprint-blue text-white font-bold py-3 uppercase tracking-widest text-xs hover:bg-blue-800 transition-colors"
          >
            Connect
          </a>
        </div>
      </div>
    </>
  );
}
