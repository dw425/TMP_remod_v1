import { Modal, Button, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/formatCurrency';
import type { Product } from '@/types/product';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  if (!product) return null;

  const hasPrice = product.priceMonthly > 0 || product.priceAnnual > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.title}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Badge variant="primary">{product.type}</Badge>
          <span className="text-sm text-gray-600">{product.subtitle}</span>
        </div>

        <p className="text-gray-700">{product.description}</p>

        {product.features.length > 0 && (
          <div>
            <h3 className="font-bold text-lg mb-3">Key Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blueprint-blue mr-2">✓</span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasPrice && (
          <div className="bg-gray-50 p-4">
            <h3 className="font-bold mb-2">Pricing</h3>
            <div className="space-y-1">
              <p>Monthly: {formatCurrency(product.priceMonthly)}</p>
              <p>Annual: {formatCurrency(product.priceAnnual)}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {hasPrice && (
            <Button
              variant="primary"
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="flex-1"
            >
              Add to Cart
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
