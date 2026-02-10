import { useEffect } from 'react';
import { useScrollLock } from '@/hooks/useScrollLock';

interface POConfirmationModalProps {
  onClose: () => void;
}

export function POConfirmationModal({ onClose }: POConfirmationModalProps) {
  useScrollLock(true);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Order Confirmation"
    >
      <div className="fixed inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose} aria-hidden="true" />
      <div
        className="relative bg-white dark:bg-slate-900 shadow-xl w-full max-w-md text-center p-12 border-t-8 border-green-500"
      >
        <div className="mx-auto flex items-center justify-center h-20 w-20 bg-green-100 dark:bg-green-900/30 mb-6" style={{ borderRadius: '9999px' }}>
          <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Order Received!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
          Thank you for your request. Our team will process your PO and email you the confirmation and next steps shortly.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-black text-white font-bold py-3 uppercase tracking-widest text-xs hover:bg-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
}
