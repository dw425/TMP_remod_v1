import { useCallback } from 'react';
import { trackEvent } from './analytics';
import { useAuthStore } from '@/features/auth/authStore';
import type { EventName } from './events';

export function useTrack() {
  const userId = useAuthStore((s) => s.user?.id);

  return useCallback(
    (event: EventName | string, properties?: Record<string, unknown>) => {
      trackEvent(event, {
        ...properties,
        userId,
        timestamp: new Date().toISOString(),
        pageUrl: window.location.pathname,
        pageTitle: document.title,
        referrer: document.referrer || undefined,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      });
    },
    [userId],
  );
}
