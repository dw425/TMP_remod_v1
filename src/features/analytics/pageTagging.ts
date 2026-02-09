import { useEffect, useRef } from 'react';
import { useTrack } from './useTrack';
import { EVENTS } from './events';

interface PageTag {
  pageName: string;
  pageType: 'marketplace' | 'product' | 'migration' | 'content' | 'cart' | 'account' | 'admin' | 'auth';
  productId?: number;
  productName?: string;
  category?: string;
}

/**
 * Tag the current page with metadata. Fires a `page_tagged` event on mount
 * and a `time_on_page` event on unmount with session duration.
 */
export function usePageTag(tag: PageTag) {
  const track = useTrack();
  const mountTime = useRef(Date.now());

  useEffect(() => {
    mountTime.current = Date.now();
    track(EVENTS.PAGE_TAGGED, { ...tag });

    return () => {
      const durationMs = Date.now() - mountTime.current;
      if (durationMs > 1000) {
        track(EVENTS.TIME_ON_PAGE, {
          ...tag,
          durationMs,
          durationSec: Math.round(durationMs / 1000),
        });
      }
    };
    // Only fire on mount/unmount — tag properties captured at mount time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Track scroll depth milestones (25%, 50%, 75%, 100%).
 * Call from a page component to track scroll engagement.
 */
export function useScrollDepthTracking() {
  const track = useTrack();
  const milestones = useRef(new Set<number>());

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const percent = Math.round((scrollTop / docHeight) * 100);
      const targets = [25, 50, 75, 100];
      for (const target of targets) {
        if (percent >= target && !milestones.current.has(target)) {
          milestones.current.add(target);
          track(EVENTS.SCROLL_DEPTH, { depth: target });
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [track]);
}
