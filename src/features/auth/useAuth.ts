import { useCallback } from 'react';
import { useAuthStore } from './authStore';
import * as authService from './authService';
import type { LoginCredentials, SignupCredentials } from '@/types/auth';

export function useAuth() {
  const { user, token, isLoading, error, setUser, setLoading, setError, logout: clearAuth } = useAuthStore();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);
      setError(null);
      try {
        const result = await authService.login(credentials);
        setUser(result.user, result.token);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed');
        throw err;
      }
    },
    [setUser, setLoading, setError],
  );

  const signup = useCallback(
    async (credentials: SignupCredentials) => {
      setLoading(true);
      setError(null);
      try {
        const result = await authService.signup(credentials);
        setUser(result.user, result.token);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Signup failed');
        throw err;
      }
    },
    [setUser, setLoading, setError],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    clearAuth();
  }, [clearAuth]);

  const restoreSession = useCallback(async () => {
    setLoading(true);
    const session = await authService.restoreSession();
    if (session) {
      setUser(session.user, session.token);
    } else {
      setUser(null, null);
    }
  }, [setUser, setLoading]);

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    restoreSession,
  };
}
