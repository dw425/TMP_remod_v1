import { useState, useEffect } from 'react';
import { useScrollLock } from '@/hooks/useScrollLock';
import type { Product } from '@/types/product';
import { useCart } from '@/features/cart/useCart';
import { useAlerts } from '@/features/notifications/useAlerts';

interface AmIReadyModalProps {
  product: Product;
  onClose: () => void;
}

const CHECKLIST_ITEMS = [
  'Do you currently have a Databricks Account?',
  'Do you have a workspace setup to accept the notebook?',
  'Do you have marketing data setup inside the workspace?',
  'Are you using unity catalog?',
  'Do you have a clear and consistent definition of what costs are included in your "Ad Spend"?',
  'Do you have a basic understanding of your sales attribution model?',
  'Does your team have the technical skills required to use this notebook?',
  'Do you have a designated person responsible for maintaining the notebook?',
  'Do you have a specific business question in mind for ROAS analysis?',
];

export function AmIReadyModal({ product, onClose }: AmIReadyModalProps) {
  useScrollLock(true);
  const [checked, setChecked] = useState<boolean[]>(new Array(CHECKLIST_ITEMS.length).fill(false));
  const { add } = useCart();
  const { showSuccess } = useAlerts();

  const allChecked = checked.every(Boolean);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleToggle = (index: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleAddToCart = () => {
    add({
      id: product.id,
      title: `${product.title} - Single User`,
      type: product.type,
      billing: 'monthly',
      price: product.priceMonthly,
    });
    showSuccess(`${product.title} added to cart`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Are You Ready?"
    >
      <div className="fixed inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={onClose} aria-hidden="true" />
      <div
        className="relative bg-white shadow-xl w-full max-w-3xl max-h-[95vh] flex flex-col border-t-8 border-blueprint-blue"
      >
        <header className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Are You Ready?</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 text-3xl"
            aria-label="Close"
          >
            &times;
          </button>
        </header>

        <div className="p-6 overflow-y-auto text-sm space-y-3">
          <p className="text-gray-500 mb-4">
            This tool is most effective when you can answer &quot;yes&quot; to all of the following statements:
          </p>
          <div className="grid grid-cols-1 gap-y-4 text-gray-800">
            {CHECKLIST_ITEMS.map((item, index) => (
              <div key={index} className="flex items-start bg-gray-50 p-3 border border-gray-100">
                <input
                  id={`ready-${index}`}
                  type="checkbox"
                  checked={checked[index]}
                  onChange={() => handleToggle(index)}
                  className="mr-3 h-4 w-4 mt-1 flex-shrink-0 accent-blue-600"
                />
                <label htmlFor={`ready-${index}`} className="cursor-pointer">
                  {item}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2 text-xs font-bold uppercase text-gray-500 hover:text-gray-800"
          >
            Close
          </button>
          <button
            onClick={handleAddToCart}
            disabled={!allChecked}
            className="px-8 py-3 bg-blueprint-blue text-white font-bold uppercase tracking-widest text-[10px] hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
