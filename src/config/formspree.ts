import { env } from './env';

export const FORMSPREE_ENDPOINTS = {
  contactSales: env.VITE_FORMSPREE_CONTACT,
  poCheckout: env.VITE_FORMSPREE_PO,
  aiFactory: env.VITE_FORMSPREE_AIFACTORY,
  romCalculator: env.VITE_FORMSPREE_CALC,
} as const;
