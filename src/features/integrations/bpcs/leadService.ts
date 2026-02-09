import { submitForm } from '@/features/integrations/formspree/formService';
import { sendSlackNotification } from '@/features/integrations/slack/slackService';

interface LeadData {
  email: string;
  name: string;
  company: string;
  source: string;
  details?: Record<string, unknown>;
}

export async function captureLead(data: LeadData): Promise<boolean> {
  const results = await Promise.allSettled([
    submitForm('contactSales', {
      email: data.email,
      name: data.name,
      company: data.company,
      source: data.source,
      ...data.details,
    }),
    sendSlackNotification({
      text: `New Lead: ${data.name} (${data.email}) from ${data.company} - Source: ${data.source}`,
    }),
  ]);

  return results.some((r) => r.status === 'fulfilled' && r.value);
}
