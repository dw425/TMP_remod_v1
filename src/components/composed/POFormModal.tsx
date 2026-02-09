import { useState, useEffect } from 'react';
import { useScrollLock } from '@/hooks/useScrollLock';
import type { CartItem } from '@/types/cart';
import { formatCurrency } from '@/lib/formatCurrency';
import { grantEntitlement } from '@/features/downloads/downloadService';
import { useAuthStore } from '@/features/auth/authStore';
import { products } from '@/data/products';
import { dbPutOrder } from '@/lib/db';

interface POFormModalProps {
  cartItems: CartItem[];
  estimatedTotal: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function POFormModal({ cartItems, estimatedTotal, onClose, onSuccess }: POFormModalProps) {
  useScrollLock(true);
  const [submitting, setSubmitting] = useState(false);

  // Build the product summary text
  const summaryText = cartItems
    .map((i) => `\u2022 ${i.title} (x${i.quantity}) - ${formatCurrency(i.price)}`)
    .join('\n');

  // Today's date for prefill
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xwpgdwbd', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        // Grant download entitlements for purchased products
        const user = useAuthStore.getState().user;
        const userId = user?.id;
        if (userId) {
          cartItems.forEach((item) => {
            const product = products.find((p) => p.id === item.id);
            if (product?.slug) {
              grantEntitlement(userId, product.slug);
            }
          });

          // Save order to IndexedDB
          const poNumber = (formData.get('po_number') as string) || undefined;
          const legalName = (formData.get('legal_name') as string) || '';
          const email = (formData.get('email') as string) || '';
          dbPutOrder({
            id: crypto.randomUUID(),
            userId,
            email,
            company: legalName,
            items: cartItems.map((ci) => ({
              title: ci.title,
              type: ci.type || 'Software',
              price: ci.price,
              billing: ci.billing || 'monthly',
            })),
            total: parseFloat(estimatedTotal.replace(/[^0-9.]/g, '')) || 0,
            status: 'submitted',
            submittedAt: new Date().toISOString(),
            poNumber,
          });
        }

        form.reset();
        onClose();
        onSuccess();
      } else {
        alert('Oops! There was a problem submitting your form.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Request Quote / PO"
    >
      <div className="fixed inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose} aria-hidden="true" />
      <div
        className="relative bg-white w-full max-w-4xl max-h-[95vh] flex flex-col border-t-8 border-blueprint-blue shadow-2xl"
      >
        <header className="p-6 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Request Quote / PO</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 text-3xl"
            aria-label="Close"
          >
            &times;
          </button>
        </header>

        <div className="overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-8 text-sm">
            <input type="hidden" name="cart_contents" value={JSON.stringify(cartItems)} />
            <input type="hidden" name="estimated_total" value={estimatedTotal} />

            {/* Top-level fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
              <div>
                <label htmlFor="po-number" className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  PO Number (Optional)
                </label>
                <input
                  id="po-number"
                  type="text"
                  name="po_number"
                  className="w-full border border-gray-300 p-2 focus:border-blueprint-blue focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="po-date" className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                <input
                  id="po-date"
                  type="date"
                  name="po_date"
                  required
                  defaultValue={today}
                  className="w-full border border-gray-300 p-2 text-gray-900 focus:border-blueprint-blue focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Fieldset 1: Customer Information */}
              <fieldset className="border border-gray-200 p-4 bg-gray-50">
                <legend className="text-sm font-bold text-blueprint-blue px-2 uppercase tracking-wide">
                  1. Customer Information
                </legend>
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="po-legal-name" className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Legal Entity Name
                      </label>
                      <input
                        id="po-legal-name"
                        type="text"
                        name="legal_name"
                        required
                        className="w-full border border-gray-300 p-2 focus:border-blueprint-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="po-email" className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Contact Email
                      </label>
                      <input
                        id="po-email"
                        type="email"
                        name="email"
                        required
                        className="w-full border border-gray-300 p-2 focus:border-blueprint-blue focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                      <label htmlFor="po-address" className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Street Address
                      </label>
                      <input
                        id="po-address"
                        type="text"
                        name="address"
                        required
                        className="w-full border border-gray-300 p-2 focus:border-blueprint-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="po-city" className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                      <input
                        id="po-city"
                        type="text"
                        name="city"
                        required
                        className="w-full border border-gray-300 p-2 focus:border-blueprint-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="po-state" className="block text-xs font-bold text-gray-500 uppercase mb-1">State</label>
                      <input
                        id="po-state"
                        type="text"
                        name="state"
                        required
                        maxLength={2}
                        className="w-full border border-gray-300 p-2 focus:border-blueprint-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="po-zip" className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Zip Code
                      </label>
                      <input
                        id="po-zip"
                        type="text"
                        name="zip"
                        required
                        maxLength={5}
                        className="w-full border border-gray-300 p-2 focus:border-blueprint-blue focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Fieldsets 2 & 3 side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fieldset 2: Order Summary */}
                <fieldset className="border border-gray-200 p-4 bg-gray-50">
                  <legend className="text-sm font-bold text-blueprint-blue px-2 uppercase tracking-wide">
                    2. Order Summary
                  </legend>
                  <div className="space-y-4 pt-2">
                    <div>
                      <label htmlFor="po-summary" className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Items in Cart
                      </label>
                      <textarea
                        id="po-summary"
                        name="poProductSummary"
                        readOnly
                        value={summaryText}
                        className="w-full border border-gray-300 p-2 bg-gray-100 h-24 font-mono text-xs resize-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="po-start-date" className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Requested Start Date
                      </label>
                      <input
                        id="po-start-date"
                        type="date"
                        name="start_date"
                        required
                        className="w-full border border-gray-300 p-2 focus:border-blueprint-blue focus:outline-none"
                      />
                    </div>
                  </div>
                </fieldset>

                {/* Fieldset 3: Deployment */}
                <fieldset className="border border-gray-200 p-4 bg-gray-50">
                  <legend className="text-sm font-bold text-blueprint-blue px-2 uppercase tracking-wide">
                    3. Deployment
                  </legend>
                  <div className="space-y-4 pt-2">
                    <div>
                      <label htmlFor="po-cloud" className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Cloud Provider
                      </label>
                      <select
                        id="po-cloud"
                        name="deployment_location"
                        className="w-full border border-gray-300 p-2 focus:border-blueprint-blue focus:outline-none"
                      >
                        <option value="AWS">AWS</option>
                        <option value="Azure">Azure</option>
                        <option value="GCP">GCP</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="po-tech-contact" className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Technical Contact Email (Optional)
                      </label>
                      <input
                        id="po-tech-contact"
                        type="email"
                        name="tech_contact"
                        className="w-full border border-gray-300 p-2 focus:border-blueprint-blue focus:outline-none"
                      />
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-xs font-bold uppercase text-gray-500 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-blueprint-blue text-white font-bold uppercase tracking-widest text-[10px] hover:bg-blue-800 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Processing...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
