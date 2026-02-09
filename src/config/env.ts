import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_NAME: z.string().default('Blueprint Marketplace'),
  VITE_API_URL: z.string().url().optional(),
  VITE_FORMSPREE_CONTACT: z.string().default('mgozdqkj'),
  VITE_FORMSPREE_PO: z.string().default('xwpgdwbd'),
  VITE_FORMSPREE_AIFACTORY: z.string().default('xjkavwle'),
  VITE_FORMSPREE_CALC: z.string().default('mnnoelgb'),
  VITE_POSTHOG_KEY: z.string().optional(),
  // SECURITY: Slack webhook URL is exposed to the client bundle.
  // Do NOT set this in production until a backend proxy exists.
  VITE_SLACK_WEBHOOK_URL: z.string().optional(),
  VITE_ENABLE_CHAT: z
    .string()
    .transform((v) => v === 'true')
    .default('true'),
  VITE_ENABLE_ANALYTICS: z
    .string()
    .transform((v) => v === 'true')
    .default('false'),
  VITE_SESSION_TIMEOUT_MINUTES: z.coerce.number().default(30),
});

export const env = envSchema.parse(import.meta.env);
