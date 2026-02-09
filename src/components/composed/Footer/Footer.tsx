import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { BPCS_LINKS } from '@/config/bpcs';

const PRODUCT_LINKS = [
  { label: 'Lakehouse Optimizer', to: '/products/lakehouse-optimizer' },
  { label: 'CampaignIQ', to: '/products/campaign-iq' },
  { label: 'ChurnIQ', to: '/products/churn-iq' },
  { label: 'AI Factory', to: ROUTES.AI_FACTORY },
  { label: 'Migration Suite', to: ROUTES.MIGRATION_HOME },
];

const RESOURCE_LINKS = [
  { label: 'Migration Assessments', to: ROUTES.MIGRATION_HOME, external: false },
  { label: 'StrategyHub', href: 'https://dw425.github.io/StrategyHub_test/', external: true },
  { label: 'Blog', href: BPCS_LINKS.blog, external: true },
  { label: 'Case Studies', href: 'https://bpcs.com/case-studies', external: true },
];

const COMPANY_LINKS = [
  { label: 'About', href: BPCS_LINKS.about },
  { label: 'Careers', href: BPCS_LINKS.careers },
  { label: 'Contact', href: BPCS_LINKS.contact },
  { label: 'Privacy Policy', href: BPCS_LINKS.privacy },
  { label: 'Terms of Service', href: BPCS_LINKS.terms },
];

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/BlueprintConsulting',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    label: 'X (Twitter)',
    href: 'https://twitter.com/BPCSData',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/blueprint-consulting-services',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 mt-20">
      {/* Main footer grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div>
            <img
              src="https://bpcs.com/wp-content/uploads/2021/02/BlueprintLogo_White_Tiles-400x81.png"
              alt="Blueprint"
              className="h-7 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Production-ready AI &amp; data solutions built on Databricks. From migration to deployment.
            </p>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Products */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Products
            </h4>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {RESOURCE_LINKS.map((link) =>
                link.external ? (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link
                      to={link.to!}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Col 4: Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Blueprint Technologies, LLC. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Built on{' '}
            <a
              href="https://databricks.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Databricks
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
