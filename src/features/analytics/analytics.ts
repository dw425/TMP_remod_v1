import type { PostHog } from 'posthog-js';
import { env } from '@/config/env';
import { FEATURES } from '@/config/features';
import { dbAddInteraction } from '@/lib/db';

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
  // Send to PostHog if available
  if (posthogInstance) {
    posthogInstance.capture(event, properties);
  }

  // Always persist to IndexedDB for local admin analytics
  const timestamp = new Date().toISOString();
  dbAddInteraction({
    id: crypto.randomUUID(),
    userId: (properties?.userId as string) || undefined,
    event,
    properties: properties ?? {},
    timestamp,
    page: (properties?.pageUrl as string) || window.location.pathname,
  }).catch(() => {
    // Best-effort — don't break the app if IndexedDB fails
  });
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (!posthogInstance) return;
  posthogInstance.identify(userId, traits);
}

export function resetAnalytics() {
  if (!posthogInstance) return;
  posthogInstance.reset();
}
