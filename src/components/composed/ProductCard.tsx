import { SharpCard, Badge, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/formatCurrency';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails, onAddToCart }: ProductCardProps) {
  const hasPrice = product.priceMonthly > 0 || product.priceAnnual > 0;

  return (
    <SharpCard hover className="flex flex-col h-full">
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="primary">{product.type}</Badge>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
        <p className="text-sm text-gray-600 mb-4 flex-grow">{product.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1">
              {tag}
            </span>
          ))}
        </div>

        {hasPrice && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">From {formatCurrency(product.priceMonthly)}/mo</p>
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          <Button variant="outline" onClick={() => onViewDetails(product)} className="flex-1">
            View Details
          </Button>
          {hasPrice && (
            <Button variant="primary" onClick={() => onAddToCart(product)} className="flex-1">
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </SharpCard>
  );
}
