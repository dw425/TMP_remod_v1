import { useEffect, useRef } from 'react';
import { trackEvent } from './analytics';

export function SessionTracker() {
  const startRef = useRef(Date.now());

  useEffect(() => {
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
