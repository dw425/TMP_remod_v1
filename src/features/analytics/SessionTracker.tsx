import { useEffect, useRef } from 'react';
import { trackEvent } from './analytics';

export function SessionTracker() {
  const startRef = useRef(0);

  useEffect(() => {
    startRef.current = Date.now();
    const start = startRef.current;

    const handleUnload = () => {
      trackEvent('session_ended', {
        durationMs: Date.now() - start,
      });
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  return null;
}
