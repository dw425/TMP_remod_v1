import { useCallback, useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { useTrack } from '@/features/analytics/useTrack';
import { useAlerts } from '@/features/notifications/useAlerts';
import { EVENTS } from '@/features/analytics/events';
import * as deploymentService from './deploymentService';
import type { DatabricksConnection, DeploymentRecord } from './types';

interface DeployTarget {
  assetId: string;
  productName: string;
  fileName: string;
}

export function useDatabricksDeploy() {
  const { user } = useAuth();
  const track = useTrack();
  const { showSuccess, showError, showInfo } = useAlerts();
  const [deploying, setDeploying] = useState(false);

  const deploy = useCallback(
    async (target: DeployTarget, connection: DatabricksConnection) => {
      if (!user) return;

      setDeploying(true);
      showInfo('Deploying...', `Importing ${target.productName} to Databricks workspace`);
      track(EVENTS.DEPLOY_INITIATED, { assetId: target.assetId, workspaceUrl: connection.workspaceUrl });

      try {
        // Simulate deployment delay
        await new Promise((r) => setTimeout(r, 2000));

        const importPath = `/Users/${user.email}/Blueprint/${target.productName}`;

        const record: DeploymentRecord = {
          id: crypto.randomUUID(),
          assetId: target.assetId,
          productName: target.productName,
          workspaceUrl: connection.workspaceUrl,
          importPath,
          deployedAt: new Date().toISOString(),
          status: 'success',
        };

        deploymentService.recordDeployment(user.id, record);

        showSuccess('Deployment successful', `${target.productName} deployed to ${importPath}`);
        track(EVENTS.DEPLOY_COMPLETED, {
          assetId: target.assetId,
          workspaceUrl: connection.workspaceUrl,
          importPath,
        });

        return record;
      } catch (err) {
        showError('Deployment failed', 'Please check your workspace connection and try again.');
        track('deploy_failed', { assetId: target.assetId, error: String(err) });

        if (user) {
          deploymentService.recordDeployment(user.id, {
            id: crypto.randomUUID(),
            assetId: target.assetId,
            productName: target.productName,
            workspaceUrl: connection.workspaceUrl,
            importPath: '',
            deployedAt: new Date().toISOString(),
            status: 'failed',
          });
        }

        return null;
      } finally {
        setDeploying(false);
      }
    },
    [user, track, showSuccess, showError, showInfo],
  );

  return { deploy, deploying };
}
