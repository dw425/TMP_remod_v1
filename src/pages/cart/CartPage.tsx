import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/features/cart/useCart';
import { formatCurrency } from '@/lib/formatCurrency';
import { SEO } from '@/components/SEO';
import { ROUTES } from '@/config/routes';
import { POFormModal } from '@/components/composed/POFormModal';
import { POConfirmationModal } from '@/components/composed/POConfirmationModal';

export default function CartPage() {
  const { items, remove, clear, totals } = useCart();
  const [showPOForm, setShowPOForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Compute summary values
  const monthlyTotal = totals.monthlyTotal;
  const onetimeTotal = totals.annualTotal; // annual mapped as one-time in original
  const grandTotal = monthlyTotal + onetimeTotal;

  const handlePOSuccess = () => {
    clear();
    setShowConfirmation(true);
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO title="Your Cart" description="Review your selected Blueprint Marketplace items." canonical="/cart" />
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Quote Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Items Table */}
        <div className="lg:col-span-8">
          <div className="sharp-card bg-white overflow-hidden">
            {items.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Product / Service
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Billing
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const priceText =
                      item.billing === 'monthly'
                        ? `${formatCurrency(item.price)} / mo`
                        : formatCurrency(item.price);

                    return (
                      <tr key={item.id}>
                        <td className="py-4 px-6 border-b border-gray-100">
                          <div className="font-bold text-gray-900">{item.title}</div>
                          {item.quantity > 1 && (
                            <span className="text-xs font-bold text-blueprint-blue bg-blue-50 px-2 py-1 mt-1 inline-block">
                              Qty: {item.quantity}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 border-b border-gray-100 text-sm text-gray-500">
                          {item.type || 'Software'}
                        </td>
                        <td className="py-4 px-6 border-b border-gray-100 text-sm text-gray-500 capitalize">
                          {item.billing || '-'}
                        </td>
                        <td className="py-4 px-6 border-b border-gray-100 font-mono text-sm text-gray-900">
                          {priceText}
                        </td>
                        <td className="py-4 px-6 border-b border-gray-100">
                          <button
                            onClick={() => remove(item.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            aria-label={`Remove ${item.title}`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
                <p className="text-gray-500 text-lg mb-2">Your cart is currently empty.</p>
                <p className="text-sm text-gray-400 mb-6">
                  Add items from the marketplace to request a quote.
                </p>
                <Link
                  to={ROUTES.HOME}
                  className="bg-blueprint-blue text-white font-bold py-3 px-6 uppercase tracking-widest text-xs hover:bg-blue-800 transition-colors inline-block"
                >
                  Browse Marketplace
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="sharp-card p-6 bg-white sticky top-28">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Summary
            </h3>
            <div className="space-y-3 mb-6 border-b border-gray-100 pb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Monthly Recurring</span>
                <span className="font-bold text-gray-900">{formatCurrency(monthlyTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">One-Time Implementation</span>
                <span className="font-bold text-gray-900">{formatCurrency(onetimeTotal)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-900">Total Est.</span>
              <span className="text-xl font-bold text-blueprint-blue">
                {formatCurrency(grandTotal)}
              </span>
            </div>
            <button
              onClick={() => {
                if (items.length === 0) {
                  alert('Cart is empty');
                  return;
                }
                setShowPOForm(true);
              }}
              className="w-full bg-blueprint-blue text-white font-bold py-4 uppercase tracking-widest text-xs hover:bg-blue-800 transition-colors"
            >
              Request Quote / PO
            </button>
          </div>
        </div>
      </div>

      {/* PO Form Modal */}
      {showPOForm && (
        <POFormModal
          cartItems={items}
          estimatedTotal={formatCurrency(grandTotal)}
          onClose={() => setShowPOForm(false)}
          onSuccess={handlePOSuccess}
        />
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <POConfirmationModal onClose={() => setShowConfirmation(false)} />
      )}
    </main>
  );
}
