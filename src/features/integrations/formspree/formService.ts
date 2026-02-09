import { FORMSPREE_ENDPOINTS } from '@/config/formspree';
import { sanitizeFormData } from '@/lib/sanitize';

export async function submitForm(endpoint: keyof typeof FORMSPREE_ENDPOINTS, data: Record<string, unknown>) {
  const formspreeId = FORMSPREE_ENDPOINTS[endpoint];
  const sanitized = sanitizeFormData(data);
  const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sanitized),
  });

  if (!response.ok) {
    throw new Error('Form submission failed');
  }

  return response.json();
}

export interface PORequestData {
  name: string;
  email: string;
  company: string;
  phone?: string;
  message: string;
}

export async function submitPORequest(data: PORequestData) {
  return submitForm('poCheckout', { ...data });
}
