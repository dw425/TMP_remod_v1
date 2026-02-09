import { useEffect } from 'react';
import { useScrollLock } from '@/hooks/useScrollLock';

interface TechArchModalProps {
  src: string;
  onClose: () => void;
}

export function TechArchModal({ src, onClose }: TechArchModalProps) {
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
      aria-label="Technical Architecture Diagram"
    >
      <div className="fixed inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={onClose} aria-hidden="true" />
      <div
        className="relative bg-white p-2 border border-gray-200 shadow-xl w-full max-w-4xl"
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 text-white bg-black hover:bg-gray-800 w-8 h-8 flex items-center justify-center text-xl z-10"
          style={{ borderRadius: '9999px' }}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="w-full bg-white flex items-center justify-center overflow-hidden">
          <img
            src={`${import.meta.env.BASE_URL}images/${src}`}
            alt="Technical Architecture Diagram"
            className="w-full h-auto block"
          />
        </div>
      </div>
    </div>
  );
}
