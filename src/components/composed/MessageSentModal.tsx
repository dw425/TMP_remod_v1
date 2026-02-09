import { useEffect } from 'react';
import { useScrollLock } from '@/hooks/useScrollLock';

interface MessageSentModalProps {
  onClose: () => void;
}

export function MessageSentModal({ onClose }: MessageSentModalProps) {
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
      aria-label="Message Sent"
    >
      <div className="fixed inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={onClose} aria-hidden="true" />
      <div
        className="relative bg-white shadow-xl w-full max-w-md text-center p-8 border-t-8 border-green-500"
      >
        <div className="mx-auto flex items-center justify-center h-16 w-16 bg-green-100 mb-4" style={{ borderRadius: '9999px' }}>
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h2>
        <p className="text-gray-500 mb-6 text-sm">Our sales team will get back to you shortly.</p>
        <button
          onClick={onClose}
          className="mt-4 text-xs font-bold uppercase text-blueprint-blue hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
}
