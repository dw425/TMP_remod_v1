import posthog from 'posthog-js';
import { env } from '@/config/env';
import { FEATURES } from '@/config/features';

let initialized = false;

export function initAnalytics() {
  if (!FEATURES.analytics || !env.VITE_POSTHOG_KEY || initialized) return;

  posthog.init(env.VITE_POSTHOG_KEY, {
    api_host: 'https://us.i.posthog.com',
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: '.sensitive',
    },
  });

  initialized = true;
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (!initialized) return;
  posthog.capture(event, properties);
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (!initialized) return;
  posthog.identify(userId, traits);
}

export function resetAnalytics() {
  if (!initialized) return;
  posthog.reset();
}
