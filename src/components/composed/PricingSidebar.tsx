import { useState } from 'react';
import type { Product } from '@/types/product';
import { SharpCard } from '@/components/ui/SharpCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/features/cart/useCart';
import { useAlerts } from '@/features/notifications/useAlerts';
import { formatCurrency } from '@/lib/formatCurrency';

interface PricingSidebarProps {
  product: Product;
}

export function PricingSidebar({ product }: PricingSidebarProps) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const { add } = useCart();
  const { showSuccess } = useAlerts();

  const price = billing === 'monthly' ? product.priceMonthly : product.priceAnnual;
  const billingLabel = billing === 'monthly' ? '/month' : '/year';

  const handleAddToCart = () => {
    add({
      id: product.id,
      title: product.title,
      type: product.type,
      billing,
      price,
    });
    showSuccess(`${product.title} added to cart`);
  };

  return (
    <SharpCard className="p-6 sticky top-4">
      <div className="space-y-6">
        {/* Product Type Badge */}
        <Badge className="capitalize">{product.type}</Badge>

        {/* Billing Toggle */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Billing</label>
          <div className="flex gap-2">
            <Button
              variant={billing === 'monthly' ? 'primary' : 'secondary'}
              onClick={() => setBilling('monthly')}
              className="flex-1"
            >
              Monthly
            </Button>
            <Button
              variant={billing === 'annual' ? 'primary' : 'secondary'}
              onClick={() => setBilling('annual')}
              className="flex-1"
            >
              Annual
            </Button>
          </div>
        </div>

        {/* Price Display */}
        <div className="text-center py-4 border-t border-b border-gray-200">
          <div className="text-3xl font-bold text-gray-900">{formatCurrency(price)}</div>
          <div className="text-sm text-gray-500">{billingLabel}</div>
        </div>

        {/* Add to Cart Button */}
        <Button variant="primary" onClick={handleAddToCart} className="w-full">
          Add to Cart
        </Button>

        {/* Info Text */}
        <p className="text-xs text-gray-500 text-center">
          Click "Add to Cart" to request a purchase order. Our team will contact you within 24 hours.
        </p>
      </div>
    </SharpCard>
  );
}
