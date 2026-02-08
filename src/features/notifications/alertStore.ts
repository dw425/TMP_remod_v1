import { create } from 'zustand';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message?: string;
  duration?: number;
}

interface AlertStore {
  alerts: Alert[];
  push: (alert: Omit<Alert, 'id'>) => void;
  dismiss: (id: string) => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  push: (alert) => {
    const id = crypto.randomUUID();
    const newAlert = { ...alert, id };
    set((state) => ({ alerts: [...state.alerts, newAlert] }));

    const duration = alert.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) }));
      }, duration);
    }
  },
  dismiss: (id) => set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
}));
