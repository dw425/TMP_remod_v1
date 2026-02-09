import { env } from '@/config/env';

interface SlackMessage {
  text: string;
  blocks?: unknown[];
}

export async function sendSlackNotification(message: SlackMessage): Promise<boolean> {
  const webhookUrl = env.VITE_SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.info('[Slack] No webhook URL configured, skipping notification');
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    return response.ok;
  } catch (err) {
    console.error('[Slack] Failed to send notification:', err);
    return false;
  }
}

export function formatPONotification(email: string, company: string, itemCount: number, total: string) {
  return {
    text: `New PO Request from ${email} (${company}) - ${itemCount} items, ${total}`,
  };
}

export function formatContactNotification(name: string, email: string, subject: string) {
  return {
    text: `New Contact Form: ${name} (${email}) - ${subject}`,
  };
}

export function formatMigrationNotification(platform: string, email: string, totalHours: number) {
  return {
    text: `Migration Assessment Completed: ${platform} by ${email} - ${totalHours} estimated hours`,
  };
}

export function formatSignupNotification(email: string, company: string) {
  return {
    text: `New Signup: ${email} (${company})`,
  };
}
