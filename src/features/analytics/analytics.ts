import type { PostHog } from 'posthog-js';
import { env } from '@/config/env';
import { FEATURES } from '@/config/features';

let posthogInstance: PostHog | null = null;
let initialized = false;

export async function initAnalytics() {
  if (!FEATURES.analytics || !env.VITE_POSTHOG_KEY || initialized) return;

  const { default: posthog } = await import('posthog-js');

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

  posthogInstance = posthog;
  initialized = true;
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (!posthogInstance) return;
  posthogInstance.capture(event, properties);
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (!posthogInstance) return;
  posthogInstance.identify(userId, traits);
}

export function resetAnalytics() {
  if (!posthogInstance) return;
  posthogInstance.reset();
}
