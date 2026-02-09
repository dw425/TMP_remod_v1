import { useState, useCallback } from 'react';

interface BPCSSession {
  token: string;
  expiresAt: string;
}

/**
 * Dormant hook for future bpcs.com SSO integration.
 * Will be activated when bpcs.com API is ready.
 */
export function useBPCSAuth() {
  const [session, setSession] = useState<BPCSSession | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      // TODO: Replace with actual bpcs.com OAuth flow
      console.info('[BPCS] SSO integration pending - bpcs.com API not yet available');
      setSession(null);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setSession(null);
  }, []);

  return {
    session,
    isConnected: !!session,
    isConnecting,
    connect,
    disconnect,
  };
}
