import { useAlertStore } from '@/features/notifications/alertStore';
import { cn } from '@/lib/cn';

export function AlertContainer() {
  const alerts = useAlertStore((state) => state.alerts);
  const dismiss = useAlertStore((state) => state.dismiss);

  if (alerts.length === 0) return null;

  return (
    <div role="region" aria-label="Notifications" aria-live="assertive" className="fixed top-20 right-4 z-50 space-y-2 max-w-md">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          role="alert"
          className={cn(
            'bg-white dark:bg-slate-900 border-l-4 shadow-lg p-4 animate-pop-in',
            {
              'border-green-500': alert.type === 'success',
              'border-red-500': alert.type === 'error',
              'border-yellow-500': alert.type === 'warning',
              'border-blue-500': alert.type === 'info',
            }
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 dark:text-gray-100">{alert.title}</h4>
              {alert.message && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alert.message}</p>}
            </div>
            <button
              onClick={() => dismiss(alert.id)}
              aria-label={`Dismiss ${alert.title}`}
              className="ml-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
