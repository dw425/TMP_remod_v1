import { Link } from 'react-router-dom';
import { useCartStore } from '@/features/cart/cartStore';
import { ROUTES } from '@/config/routes';

export function CartBadge() {
  const totalCount = useCartStore((state) => state.totalCount());

  return (
    <Link
      to={ROUTES.CART}
      className="relative group"
      aria-label={totalCount > 0 ? `Shopping cart, ${totalCount} item${totalCount === 1 ? '' : 's'}` : 'Shopping cart, empty'}
    >
      <svg
        className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-blueprint-blue transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      {totalCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-2 -right-2 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full"
          style={{ backgroundColor: '#dc2626' }}
        >
          {totalCount}
        </span>
      )}
    </Link>
  );
}
