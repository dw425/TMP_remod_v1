import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { ROUTES } from '@/config/routes';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  const quickLinks = [
    { label: 'Downloads', to: ROUTES.DOWNLOADS, desc: 'Access your purchased content and downloads' },
    { label: 'Order History', to: ROUTES.ORDERS, desc: 'View your PO requests and order status' },
    { label: 'Account Settings', to: ROUTES.SETTINGS, desc: 'Update your profile and password' },
    { label: 'Migration Suite', to: ROUTES.MIGRATION_HOME, desc: 'Start a platform migration assessment' },
    { label: 'AI Factory', to: ROUTES.AI_FACTORY, desc: 'Explore AI engagement tiers' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white border border-gray-300 border-t-4 border-t-blueprint-blue p-8 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Welcome back, {user.firstName}
        </h1>
        <p className="text-gray-500 text-sm">
          {user.email} &middot; {user.company || 'No company'} &middot;{' '}
          <span className="capitalize">{user.role}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="bg-white border border-gray-300 p-6 hover:border-blueprint-blue transition-colors group"
          >
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-blueprint-blue mb-1">
              {link.label}
            </h2>
            <p className="text-sm text-gray-500">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
