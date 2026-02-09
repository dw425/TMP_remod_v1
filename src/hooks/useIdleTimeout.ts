import { useEffect, useRef, useCallback } from 'react';

export function useIdleTimeout(
  onIdle: () => void,
  onWarning: () => void,
  timeoutMs = 30 * 60 * 1000,
  warningMs = 2 * 60 * 1000,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const warningRef = useRef<ReturnType<typeof setTimeout>>();

  const resetTimer = useCallback(() => {
    clearTimeout(timeoutRef.current);
    clearTimeout(warningRef.current);
    warningRef.current = setTimeout(onWarning, timeoutMs - warningMs);
    timeoutRef.current = setTimeout(onIdle, timeoutMs);
  }, [onIdle, onWarning, timeoutMs, warningMs]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'] as const;
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      clearTimeout(timeoutRef.current);
      clearTimeout(warningRef.current);
    };
  }, [resetTimer]);

  return { resetTimer };
}
