import { useAlertStore } from './alertStore';

export function useAlerts() {
  return {
    push: useAlertStore((state) => state.push),
    dismiss: useAlertStore((state) => state.dismiss),
  };
}
