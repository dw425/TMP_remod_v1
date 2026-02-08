import { env } from './env';

export const FEATURES = {
  chat: env.VITE_ENABLE_CHAT,
  analytics: env.VITE_ENABLE_ANALYTICS,
  sessionTimeoutMinutes: env.VITE_SESSION_TIMEOUT_MINUTES,
} as const;
