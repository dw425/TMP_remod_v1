import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/formatCurrency';
import { useCartStore } from '@/features/cart/cartStore';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const TYPE_BADGE: Record<Product['type'], { label: string; bg: string; text: string }> = {
  tool: { label: 'Tool', bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blueprint-blue' },
  accelerator: { label: 'Accelerator', bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  service: { label: 'Service', bg: 'bg-purple-50 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
};

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const [addedFeedback, setAddedFeedback] = useState(false);
  const navigate = useNavigate();
  const addToCart = useCartStore((s) => s.add);

  const isTool = product.type === 'tool';
  const isTrending = product.id === 7;
  const hasPricing = product.priceMonthly > 0;
  const badge = TYPE_BADGE[product.type];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.title,
      type: product.type,
      billing: 'monthly',
      price: product.priceMonthly,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1200);
  };

  const handleViewFull = (e: React.MouseEvent) => {
    e.stopPropagation();
    const target = product.detailPage || `/products/${product.slug}`;
    navigate(target);
  };

  return (
    <div
      className="group sharp-card p-6 flex flex-col hover:shadow-lg transition-all duration-300 cursor-pointer grid-item h-full relative overflow-hidden"
      onClick={() => onViewDetails(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetails(product);
        }
      }}
    >
      {/* Type Badge */}
      <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>

      {/* Trending Badge */}
      {isTrending && (
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Trending
        </span>
      )}

      {/* Content */}
      <div className="flex-grow mt-2">
        <h4 className="text-lg font-bold text-blueprint-blue transition-colors mb-2 tracking-tight leading-snug pr-16">
          {product.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-0 line-clamp-3">
          {product.description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700">
        {/* Price Row */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {hasPricing ? `${formatCurrency(product.priceMonthly)}/mo` : 'Free'}
          </span>

          {/* Quick Add to Cart (tools only) */}
          {isTool && hasPricing && (
            <button
              onClick={handleQuickAdd}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-blueprint-blue text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 hover:bg-blue-800 btn-rounded flex items-center gap-1"
              aria-label={`Add ${product.title} to cart`}
            >
              {addedFeedback ? (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Added
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add
                </>
              )}
            </button>
          )}
        </div>

        {/* Tags + View Details */}
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wide">
          <button
            onClick={handleViewFull}
            className="text-blueprint-blue hover:underline"
          >
            View Details &rarr;
          </button>
          <div className="flex space-x-1 text-gray-400">
            {product.tags.slice(0, 2).map((tag, i) => (
              <span key={tag}>
                {i > 0 && <span className="text-gray-300 mr-1">|</span>}
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
