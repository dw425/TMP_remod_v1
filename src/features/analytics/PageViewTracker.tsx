import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from './analytics';
import { EVENTS } from './events';

export function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    trackEvent(EVENTS.PAGE_VIEW, {
      path: location.pathname,
      search: location.search,
    });
  }, [location.pathname, location.search]);

  return null;
}
