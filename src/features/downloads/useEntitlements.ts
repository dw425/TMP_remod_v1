import { useState, useCallback } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import * as downloadService from './downloadService';
import type { Entitlement } from './types';

export function useEntitlements() {
  const { user } = useAuth();
  const [entitlements, setEntitlements] = useState<Entitlement[]>(() =>
    user ? downloadService.getEntitlements(user.id) : [],
  );

  const refresh = useCallback(() => {
    if (user) {
      setEntitlements(downloadService.getEntitlements(user.id));
    }
  }, [user]);

  const isEntitled = useCallback(
    (productSlug: string) => {
      if (!user) return false;
      return downloadService.isEntitled(user.id, productSlug);
    },
    [user],
  );

  const grant = useCallback(
    (productSlug: string) => {
      if (!user) return;
      downloadService.grantEntitlement(user.id, productSlug);
      refresh();
    },
    [user, refresh],
  );

  return { entitlements, isEntitled, grant, refresh };
}
