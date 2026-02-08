import { useAlertStore } from './alertStore';

export function useAlerts() {
  const push = useAlertStore((state) => state.push);
  const dismiss = useAlertStore((state) => state.dismiss);

  const showSuccess = (title: string, message?: string) => {
    push({ type: 'success', title, message });
  };

  const showError = (title: string, message?: string) => {
    push({ type: 'error', title, message });
  };

  const showWarning = (title: string, message?: string) => {
    push({ type: 'warning', title, message });
  };

  const showInfo = (title: string, message?: string) => {
    push({ type: 'info', title, message });
  };

  return {
    push,
    dismiss,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
