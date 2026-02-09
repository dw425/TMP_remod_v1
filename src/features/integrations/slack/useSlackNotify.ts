import { useCallback } from 'react';
import {
  sendSlackNotification,
  formatPONotification,
  formatContactNotification,
  formatMigrationNotification,
  formatSignupNotification,
} from './slackService';

export function useSlackNotify() {
  const notifyPO = useCallback(
    (email: string, company: string, itemCount: number, total: string) =>
      sendSlackNotification(formatPONotification(email, company, itemCount, total)),
    [],
  );

  const notifyContact = useCallback(
    (name: string, email: string, subject: string) =>
      sendSlackNotification(formatContactNotification(name, email, subject)),
    [],
  );

  const notifyMigration = useCallback(
    (platform: string, email: string, totalHours: number) =>
      sendSlackNotification(formatMigrationNotification(platform, email, totalHours)),
    [],
  );

  const notifySignup = useCallback(
    (email: string, company: string) =>
      sendSlackNotification(formatSignupNotification(email, company)),
    [],
  );

  return { notifyPO, notifyContact, notifyMigration, notifySignup };
}
