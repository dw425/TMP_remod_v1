import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useScrollLock } from '@/hooks/useScrollLock';

interface ImageLightboxProps {
  imageUrl: string;
  alt: string;
  onClose: () => void;
}

export function ImageLightbox({ imageUrl, alt, onClose }: ImageLightboxProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
      onClick={onClose}
    >
      <div className="relative max-w-7xl max-h-[90vh] w-full">
        <Button
          variant="secondary"
          onClick={onClose}
          className="absolute top-4 right-4 z-10"
        >
          Close
        </Button>
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
