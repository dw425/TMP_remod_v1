import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/features/cart/useCart';
import { products } from '@/data/products';
import { formatCurrency } from '@/lib/formatCurrency';
import { SEO } from '@/components/SEO';
import { ROUTES } from '@/config/routes';
import { POFormModal } from '@/components/composed/POFormModal';
import { POConfirmationModal } from '@/components/composed/POConfirmationModal';
import { usePageTag } from '@/features/analytics/pageTagging';
import { useTrack } from '@/features/analytics/useTrack';
import { EVENTS } from '@/features/analytics/events';

export default function CartPage() {
  const { items, add, remove, decrement, clear, totals } = useCart();
  const [showPOForm, setShowPOForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const track = useTrack();
  usePageTag({ pageName: 'Cart', pageType: 'cart' });

  const monthlyTotal = totals.monthlyTotal;
  const onetimeTotal = totals.annualTotal;
  const grandTotal = monthlyTotal + onetimeTotal;

  const handlePOSuccess = () => {
    clear();
    setShowConfirmation(true);
  };

  // Recommended products: tools not in cart, max 3
  const recommended = useMemo(() => {
    const cartIds = new Set(items.map((i) => i.id));
    return products
      .filter((p) => p.type === 'tool' && p.priceMonthly > 0 && !cartIds.has(p.id))
      .slice(0, 3);
  }, [items]);

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO title="Your Cart" description="Review your selected Blueprint Marketplace items." canonical="/cart" />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Your Quote Cart</h1>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200 flex items-start gap-3">
        <svg className="w-5 h-5 text-blueprint-blue shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        All pricing is for estimation purposes. Final quotes will be provided by our sales team.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Items Table */}
        <div className="lg:col-span-8">
          <div className="sharp-card overflow-hidden">
            {items.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-800">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Product / Service
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Billing
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const priceText =
                      item.billing === 'monthly'
                        ? `${formatCurrency(item.price * item.quantity)} / mo`
                        : formatCurrency(item.price * item.quantity);

                    return (
                      <tr key={item.id}>
                        <td className="py-4 px-6 border-b border-gray-100 dark:border-slate-700">
                          <div className="font-bold text-gray-900 dark:text-gray-100">{item.title}</div>
                        </td>
                        <td className="py-4 px-6 border-b border-gray-100 dark:border-slate-700 text-sm text-gray-500 dark:text-gray-400">
                          {item.type || 'Software'}
                        </td>
                        <td className="py-4 px-6 border-b border-gray-100 dark:border-slate-700 text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {item.billing || '-'}
                        </td>
                        <td className="py-4 px-6 border-b border-gray-100 dark:border-slate-700">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => decrement(item.id)}
                              className="w-7 h-7 flex items-center justify-center border border-gray-300 dark:border-slate-600 text-gray-500 dark:text-gray-400 hover:border-blueprint-blue hover:text-blueprint-blue transition-colors text-sm font-bold"
                              aria-label="Decrease quantity"
                            >
                              &minus;
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-gray-900 dark:text-gray-100">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => add({ id: item.id, title: item.title, type: item.type, billing: item.billing, price: item.price })}
                              className="w-7 h-7 flex items-center justify-center border border-gray-300 dark:border-slate-600 text-gray-500 dark:text-gray-400 hover:border-blueprint-blue hover:text-blueprint-blue transition-colors text-sm font-bold"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-6 border-b border-gray-100 dark:border-slate-700 font-mono text-sm text-gray-900 dark:text-gray-100">
                          {priceText}
                        </td>
                        <td className="py-4 px-6 border-b border-gray-100 dark:border-slate-700">
                          <button
                            onClick={() => { track(EVENTS.CART_ITEM_REMOVED, { productId: item.id, productName: item.title }); remove(item.id); }}
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
                  className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
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
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">Your cart is currently empty.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
                  Add items from the marketplace to request a quote.
                </p>
                <Link
                  to={ROUTES.HOME}
                  className="bg-blueprint-blue text-white font-bold py-3 px-6 uppercase tracking-widest text-xs hover:bg-blue-800 transition-colors inline-block btn-rounded"
                >
                  Browse Marketplace
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="sharp-card p-6 sticky top-28">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Summary
            </h3>
            <div className="space-y-3 mb-6 border-b border-gray-100 dark:border-slate-700 pb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Monthly Recurring</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(monthlyTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">One-Time Implementation</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(onetimeTotal)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Total Est.</span>
              <span className="text-xl font-bold text-blueprint-blue">
                {formatCurrency(grandTotal)}
              </span>
            </div>
            <button
              onClick={() => {
                if (items.length === 0) return;
                track(EVENTS.CHECKOUT_STARTED, { itemCount: items.length, total: grandTotal });
                setShowPOForm(true);
              }}
              disabled={items.length === 0}
              className="w-full bg-blueprint-blue text-white font-bold py-4 uppercase tracking-widest text-xs hover:bg-blue-800 transition-colors btn-rounded disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Request Quote / PO
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      {recommended.length > 0 && (
        <section className="mt-16 border-t border-gray-200 dark:border-slate-700 pt-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommended.map((rp) => (
              <Link
                key={rp.id}
                to={`/products/${rp.slug}`}
                className="sharp-card p-6 hover:shadow-lg transition-all group"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blueprint-blue transition-colors mb-1">
                  {rp.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{rp.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatCurrency(rp.priceMonthly)}/mo</span>
                  <span className="text-xs font-bold text-blueprint-blue uppercase tracking-wide">
                    View Details &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

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
