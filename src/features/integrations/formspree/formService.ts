import { FORMSPREE_ENDPOINTS } from '@/config/formspree';

export async function submitForm(endpoint: keyof typeof FORMSPREE_ENDPOINTS, data: Record<string, unknown>) {
  const formspreeId = FORMSPREE_ENDPOINTS[endpoint];
  const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Form submission failed');
  }

  return response.json();
}
