import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import * as downloadService from './downloadService';
import type { Entitlement } from './types';

export function useEntitlements() {
  const { user } = useAuth();
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);

  const refresh = useCallback(() => {
    if (user) {
      setEntitlements(downloadService.getEntitlements(user.id));
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

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
