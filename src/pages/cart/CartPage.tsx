import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/features/cart/useCart';
import { SharpCard } from '@/components/ui/SharpCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckoutModal } from '@/components/modals/CheckoutModal';
import { useAlerts } from '@/features/notifications/useAlerts';
import { formatCurrency } from '@/lib/formatCurrency';
import { ROUTES } from '@/config/routes';

export default function CartPage() {
  const { items, remove, clear } = useCart();
  const { showSuccess } = useAlerts();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const totals = items.reduce(
    (acc, item) => {
      if (item.billing === 'monthly') {
        acc.monthly += item.price;
      } else {
        acc.annual += item.price;
      }
      return acc;
    },
    { monthly: 0, annual: 0 }
  );

  const handleRemove = (id: number) => {
    remove(id);
    showSuccess('Item removed from cart');
  };

  const handleClearCart = () => {
    clear();
    showSuccess('Cart cleared');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <SharpCard className="p-12 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Browse our marketplace to find the perfect tools for your needs.</p>
          <Link to={ROUTES.HOME}>
            <Button variant="primary">Browse Products</Button>
          </Link>
        </SharpCard>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="space-y-6">
        {/* Cart Items */}
        <SharpCard className="divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.id} className="p-6 flex items-center justify-between gap-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Badge className="capitalize">{item.type}</Badge>
                  <span>•</span>
                  <span className="capitalize">{item.billing} billing</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">{formatCurrency(item.price)}</div>
                  <div className="text-sm text-gray-500">{item.billing === 'monthly' ? '/month' : '/year'}</div>
                </div>

                <Button variant="secondary" onClick={() => handleRemove(item.id)} className="px-3 py-2">
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </SharpCard>

        {/* Totals */}
        <SharpCard className="p-6">
          <div className="space-y-3">
            {totals.monthly > 0 && (
              <div className="flex justify-between items-center text-gray-700">
                <span>Monthly Total:</span>
                <span className="text-xl font-semibold">{formatCurrency(totals.monthly)}/month</span>
              </div>
            )}
            {totals.annual > 0 && (
              <div className="flex justify-between items-center text-gray-700">
                <span>Annual Total:</span>
                <span className="text-xl font-semibold">{formatCurrency(totals.annual)}/year</span>
              </div>
            )}

            {totals.monthly > 0 && totals.annual > 0 && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  Your cart contains both monthly and annual subscriptions
                </p>
              </div>
            )}
          </div>
        </SharpCard>

        {/* Actions */}
        <div className="flex justify-between items-center gap-4">
          <Button variant="secondary" onClick={handleClearCart}>
            Clear Cart
          </Button>
          <Button variant="primary" onClick={() => setIsCheckoutOpen(true)} className="px-8">
            Request Purchase Order
          </Button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 p-4 text-sm text-gray-700">
          <p>
            <strong>Next Steps:</strong> Submit your purchase order request and our team will contact you within 24
            hours to finalize pricing, terms, and deployment details.
          </p>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={items}
        totalMonthly={totals.monthly}
        totalAnnual={totals.annual}
      />
    </div>
  );
}
