import { useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { useDatabricksAuth } from '@/features/databricks/useDatabricksAuth';
import { useDatabricksDeploy } from '@/features/databricks/useDatabricksDeploy';
import { useEntitlements } from '@/features/downloads/useEntitlements';
import { DatabricksConnectionModal } from '@/features/databricks/DatabricksConnectionModal';
import { DOWNLOAD_CATALOG } from '@/features/downloads/downloadCatalog';
import * as deploymentService from '@/features/databricks/deploymentService';
import { Button } from '@/components/ui';
import type { DeploymentRecord } from '@/features/databricks/types';

export default function DeploymentsPage() {
  const { user } = useAuth();
  const { connection, isConnected, isConnecting, connect, disconnect } = useDatabricksAuth();
  const { deploy, deploying } = useDatabricksDeploy();
  const { isEntitled } = useEntitlements();
  const [showConnect, setShowConnect] = useState(false);
  const [history, setHistory] = useState<DeploymentRecord[]>(() =>
    user ? deploymentService.getDeployments(user.id) : [],
  );

  if (!user) return null;

  const deployableAssets = DOWNLOAD_CATALOG.filter(
    (a) => isEntitled(a.productSlug) && (a.fileType === 'notebook' || a.fileType === 'bundle'),
  );

  const handleDeploy = async (asset: (typeof DOWNLOAD_CATALOG)[number]) => {
    if (!connection) {
      setShowConnect(true);
      return;
    }

    await deploy(
      { assetId: asset.assetId, productName: asset.displayName, fileName: asset.fileName },
      connection,
    );
    setHistory(deploymentService.getDeployments(user.id));
  };

  const handleConnect = (workspaceUrl: string) => {
    connect(workspaceUrl);
    setShowConnect(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Deployments</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Deploy products directly to your Databricks workspace.</p>

      {/* Connection Status */}
      <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Databricks Workspace</h2>
        {isConnected && connection ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-green-500 inline-block" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Connected to {connection.workspaceUrl}</span>
            </div>
            <Button variant="secondary" onClick={disconnect}>
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">No workspace connected</p>
            <Button onClick={() => setShowConnect(true)}>Connect Workspace</Button>
          </div>
        )}
      </div>

      {/* Deployable Assets */}
      {deployableAssets.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Available for Deployment</h2>
          <div className="space-y-3">
            {deployableAssets.map((asset) => (
              <div key={asset.assetId} className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 p-5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 dark:text-gray-100">{asset.displayName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">v{asset.version}</p>
                </div>
                <Button onClick={() => handleDeploy(asset)} disabled={deploying}>
                  {deploying ? 'Deploying...' : 'Deploy'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {deployableAssets.length === 0 && (
        <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 p-8 text-center mb-10">
          <p className="text-gray-500 dark:text-gray-400">No deployable products available. Purchase products to deploy them.</p>
        </div>
      )}

      {/* Deployment History */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Deployment History</h2>
        {history.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No deployments yet.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                  <th className="text-left px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Product</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Workspace</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 dark:border-slate-700 last:border-0">
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{record.productName}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs truncate max-w-[200px]">{record.workspaceUrl}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium border ${
                          record.status === 'success'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{new Date(record.deployedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DatabricksConnectionModal
        isOpen={showConnect}
        onClose={() => setShowConnect(false)}
        onConnect={handleConnect}
        isConnecting={isConnecting}
      />
    </div>
  );
}
