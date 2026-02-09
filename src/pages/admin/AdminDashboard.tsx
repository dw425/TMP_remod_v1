import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { SEO } from '@/components/SEO';

const ADMIN_CARDS = [
  {
    title: 'ROM Configuration',
    description: 'Manage ROM calculator settings, rates, and platform configurations.',
    to: ROUTES.ROM_ADMIN,
    icon: (
      <svg className="w-8 h-8 text-blueprint-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'User Management',
    description: 'View registered users, account details, and login history.',
    to: ROUTES.ADMIN_USERS,
    icon: (
      <svg className="w-8 h-8 text-blueprint-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    title: 'Order Reports',
    description: 'View PO submissions, order status, and revenue tracking.',
    to: ROUTES.ADMIN_ORDERS,
    icon: (
      <svg className="w-8 h-8 text-blueprint-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export default function AdminDashboard() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO title="Admin Portal" description="Blueprint Marketplace administration dashboard." canonical="/admin" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
      <p className="text-gray-500 mb-8">Manage users, orders, and system configuration.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ADMIN_CARDS.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="sharp-card p-6 bg-white hover:border-blueprint-blue transition-colors group"
          >
            <div className="mb-4">{card.icon}</div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blueprint-blue transition-colors mb-2">
              {card.title}
            </h3>
            <p className="text-sm text-gray-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
