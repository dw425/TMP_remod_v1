import { useState, useCallback, useEffect } from 'react';
import { useTrack } from '@/features/analytics/useTrack';
import * as deploymentService from './deploymentService';
import type { DatabricksConnection } from './types';

function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 64);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function useDatabricksAuth() {
  const [connection, setConnection] = useState<DatabricksConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const track = useTrack();

  useEffect(() => {
    const saved = deploymentService.getSavedConnection();
    if (saved) {
      setConnection({
        workspaceUrl: saved.workspaceUrl,
        accessToken: 'demo-token',
        tokenExpiry: saved.connectedAt + 3600000,
      });
    }
  }, []);

  const connect = useCallback(
    async (workspaceUrl: string) => {
      setIsConnecting(true);
      track('databricks_auth_started', { workspaceUrl });

      const clientId = import.meta.env.VITE_DATABRICKS_CLIENT_ID;

      if (clientId) {
        // Real OAuth flow
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        sessionStorage.setItem('dbx_code_verifier', codeVerifier);
        sessionStorage.setItem('dbx_workspace_url', workspaceUrl);

        const authUrl = new URL(`${workspaceUrl}/oidc/v1/authorize`);
        authUrl.searchParams.set('client_id', clientId);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('redirect_uri', `${window.location.origin}/TMP_remod_v1/auth/databricks/callback`);
        authUrl.searchParams.set('scope', 'all-apis offline_access');
        authUrl.searchParams.set('code_challenge', codeChallenge);
        authUrl.searchParams.set('code_challenge_method', 'S256');
        authUrl.searchParams.set('state', crypto.randomUUID());

        window.location.href = authUrl.toString();
      } else {
        // Demo mode: simulate connection
        await new Promise((r) => setTimeout(r, 1000));

        deploymentService.saveConnection(workspaceUrl);
        setConnection({
          workspaceUrl,
          accessToken: 'demo-token-' + crypto.randomUUID(),
          tokenExpiry: Date.now() + 3600000,
        });
        track('databricks_auth_completed', { workspaceUrl });
        setIsConnecting(false);
      }
    },
    [track],
  );

  const handleCallback = useCallback(
    async (code: string) => {
      const verifier = sessionStorage.getItem('dbx_code_verifier');
      const workspaceUrl = sessionStorage.getItem('dbx_workspace_url');

      if (!verifier || !workspaceUrl) throw new Error('Missing OAuth state');

      const clientId = import.meta.env.VITE_DATABRICKS_CLIENT_ID;
      const tokenResponse = await fetch(`${workspaceUrl}/oidc/v1/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          code_verifier: verifier,
          redirect_uri: `${window.location.origin}/TMP_remod_v1/auth/databricks/callback`,
        }),
      });

      const tokens = await tokenResponse.json();

      deploymentService.saveConnection(workspaceUrl);
      setConnection({
        workspaceUrl,
        accessToken: tokens.access_token,
        tokenExpiry: Date.now() + tokens.expires_in * 1000,
      });

      sessionStorage.removeItem('dbx_code_verifier');
      sessionStorage.removeItem('dbx_workspace_url');

      track('databricks_auth_completed', { workspaceUrl });
    },
    [track],
  );

  const disconnect = useCallback(() => {
    deploymentService.clearConnection();
    setConnection(null);
  }, []);

  return {
    connection,
    isConnected: !!connection,
    isConnecting,
    connect,
    handleCallback,
    disconnect,
  };
}
