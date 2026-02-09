import { Link } from 'react-router-dom';
import { CartBadge } from './CartBadge';
import { UserMenu } from './UserMenu';
import { mainNav } from '@/data/navigation';
import { ROUTES } from '@/config/routes';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-300 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={ROUTES.HOME} className="text-2xl font-bold text-blueprint-blue">
            Blueprint Marketplace
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {mainNav.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-gray-700 hover:text-blueprint-blue font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <CartBadge />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
