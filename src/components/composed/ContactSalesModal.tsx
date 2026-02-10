import { useState, useEffect } from 'react';
import { useScrollLock } from '@/hooks/useScrollLock';

interface ContactSalesModalProps {
  productTitle?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ContactSalesModal({ productTitle, onClose, onSuccess }: ContactSalesModalProps) {
  useScrollLock(true);
  const [submitting, setSubmitting] = useState(false);

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
      const response = await fetch('https://formspree.io/f/mgozdqkj', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        form.reset();
        onClose();
        onSuccess();
      } else {
        alert('Error submitting form. Please try again.');
      }
    } catch {
      alert('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Contact Sales"
    >
      <div className="fixed inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={onClose} aria-hidden="true" />
      <div
        className="relative bg-white dark:bg-slate-900 shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col border-t-8 border-black dark:border-slate-500"
      >
        <header className="p-6 border-b border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Contact Sales</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-3xl leading-none"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blueprint-blue p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-1">Prefer to speak directly?</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <a
                href="tel:2064558326"
                className="flex items-center text-gray-900 dark:text-gray-100 font-bold hover:text-blueprint-blue transition-colors"
              >
                <svg className="w-4 h-4 mr-2 text-blueprint-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                (206) 455-8326
              </a>
              <a
                href="mailto:Info@bpcs.com"
                className="flex items-center text-gray-900 dark:text-gray-100 font-bold hover:text-blueprint-blue transition-colors"
              >
                <svg className="w-4 h-4 mr-2 text-blueprint-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Info@bpcs.com
              </a>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <input type="hidden" name="form_subject" value="New Sales Inquiry from Marketplace" />
          <input type="hidden" name="product_page" value={productTitle || ''} />

          <div>
            <label htmlFor="cs-fullName" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Full Name
            </label>
            <input
              id="cs-fullName"
              type="text"
              name="fullName"
              required
              className="w-full border border-gray-300 dark:border-slate-600 p-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:border-blueprint-blue focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="cs-email" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Business Email
            </label>
            <input
              id="cs-email"
              type="email"
              name="email"
              required
              className="w-full border border-gray-300 dark:border-slate-600 p-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:border-blueprint-blue focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="cs-message" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Message
            </label>
            <textarea
              id="cs-message"
              name="message"
              rows={4}
              required
              className="w-full border border-gray-300 dark:border-slate-600 p-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:border-blueprint-blue focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-bold uppercase text-gray-400 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
