import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { useWishlistStore } from '@/features/wishlist/wishlistStore';
import { products } from '@/data/products';
import { useCartStore } from '@/features/cart/cartStore';
import { Button } from '@/components/ui';
import { ROUTES } from '@/config/routes';

export default function WishlistPage() {
  const { items, remove } = useWishlistStore();
  const addToCart = useCartStore((s) => s.add);

  const wishlisted = products.filter((p) => items.includes(p.id));

  const handleAddToCart = (product: (typeof products)[number]) => {
    if (product.type !== 'tool') return;
    addToCart({
      id: product.id,
      title: product.title,
      type: product.type,
      billing: 'monthly',
      price: product.priceMonthly,
    });
    remove(product.id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SEO title="Wishlist" description="Your saved products." />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Wishlist</h1>

      {wishlisted.length === 0 ? (
        <div className="sharp-card bg-white dark:bg-slate-800 p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">Your wishlist is empty.</p>
          <Link to={ROUTES.HOME} className="text-blueprint-blue hover:underline text-sm font-medium">
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {wishlisted.map((product) => (
            <div key={product.id} className="sharp-card bg-white dark:bg-slate-800 p-5 flex items-center justify-between">
              <div>
                <Link
                  to={`/products/${product.slug}`}
                  className="font-bold text-gray-900 dark:text-gray-100 hover:text-blueprint-blue"
                >
                  {product.title}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{product.description}</p>
                {product.type === 'tool' && (
                  <p className="text-sm font-medium text-blueprint-blue mt-1">
                    ${product.priceMonthly.toLocaleString()}/mo
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                {product.type === 'tool' && (
                  <Button onClick={() => handleAddToCart(product)} className="text-xs">
                    Add to Cart
                  </Button>
                )}
                <button
                  onClick={() => remove(product.id)}
                  className="text-sm text-red-500 hover:text-red-700 px-3 py-1"
                  aria-label={`Remove ${product.title} from wishlist`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
