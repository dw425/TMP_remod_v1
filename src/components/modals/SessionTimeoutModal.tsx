import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onLogout: () => void;
  countdownSeconds?: number;
}

export function SessionTimeoutModal({
  isOpen,
  onContinue,
  onLogout,
  countdownSeconds = 120,
}: SessionTimeoutModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(countdownSeconds);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(countdownSeconds);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, countdownSeconds, onLogout]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <Modal isOpen={isOpen} onClose={onContinue} title="Session Expiring">
      <div className="space-y-4">
        <p className="text-gray-700">
          Your session is about to expire due to inactivity.
        </p>
        <p className="text-2xl font-bold text-center text-gray-900">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </p>
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="secondary" onClick={onLogout}>
            Logout Now
          </Button>
          <Button onClick={onContinue}>Continue Session</Button>
        </div>
      </div>
    </Modal>
  );
}
