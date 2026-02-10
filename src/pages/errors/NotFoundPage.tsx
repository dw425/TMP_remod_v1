import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { SEO } from '@/components/SEO';
import { ROUTES } from '@/config/routes';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." />
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blueprint-blue mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to={ROUTES.HOME}>
          <Button variant="primary">Return to Marketplace</Button>
        </Link>
      </div>
    </div>
  );
}
