import { useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { useSecureDownload } from '@/features/downloads/useSecureDownload';
import { useEntitlements } from '@/features/downloads/useEntitlements';
import { DownloadTermsModal } from '@/components/modals/DownloadTermsModal';
import { DOWNLOAD_CATALOG } from '@/features/downloads/downloadCatalog';
import * as downloadService from '@/features/downloads/downloadService';
import { isGitHubConfigured } from '@/features/downloads/githubService';
import { Button } from '@/components/ui';
import type { DownloadRecord } from '@/features/downloads/types';

const fileTypeLabels: Record<string, string> = {
  notebook: 'Jupyter Notebook',
  bundle: 'Archive Bundle',
  wheel: 'Python Wheel',
  report: 'Report Template',
};

export default function DownloadsPage() {
  const { user } = useAuth();
  const { download, showTerms, onAcceptTerms, onDeclineTerms } = useSecureDownload();
  const { isEntitled } = useEntitlements();
  const [history, setHistory] = useState<DownloadRecord[]>(() =>
    user ? downloadService.getDownloadHistory(user.id) : [],
  );

  if (!user) return null;

  const availableAssets = DOWNLOAD_CATALOG.filter((a) => isEntitled(a.productSlug));
  const lockedAssets = DOWNLOAD_CATALOG.filter((a) => !isEntitled(a.productSlug));

  const handleDownload = (asset: (typeof DOWNLOAD_CATALOG)[number]) => {
    download(asset);
    setTimeout(() => {
      setHistory(downloadService.getDownloadHistory(user.id));
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Downloads</h1>

      {!isGitHubConfigured() && (
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 text-blue-800 text-sm">
          <span className="font-medium">Demo Mode</span> — Real downloads available after deployment configuration.
        </div>
      )}

      {availableAssets.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Available Downloads</h2>
          <div className="space-y-3">
            {availableAssets.map((asset) => (
              <div key={asset.assetId} className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 p-5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 dark:text-gray-100">{asset.displayName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {fileTypeLabels[asset.fileType] || asset.fileType} &middot; v{asset.version} &middot;{' '}
                    {downloadService.formatFileSize(asset.sizeBytes)}
                  </p>
                </div>
                <Button onClick={() => handleDownload(asset)}>Download</Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {lockedAssets.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Locked</h2>
          <div className="space-y-3">
            {lockedAssets.map((asset) => (
              <div key={asset.assetId} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-5 flex items-center justify-between opacity-60">
                <div>
                  <p className="font-bold text-gray-700 dark:text-gray-300">{asset.displayName}</p>
                  <p className="text-sm text-gray-400 dark:text-gray-400">
                    {fileTypeLabels[asset.fileType] || asset.fileType} &middot; v{asset.version}
                  </p>
                </div>
                <span className="text-sm text-gray-400 dark:text-gray-400 font-medium">Purchase Required</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Download History</h2>
        {history.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No downloads yet.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                  <th className="text-left px-4 py-3 font-medium text-gray-700 dark:text-gray-300">File</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, i) => (
                  <tr key={`${record.assetId}-${i}`} className="border-b border-gray-100 dark:border-slate-700 last:border-0">
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{record.fileName}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{new Date(record.downloadedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DownloadTermsModal isOpen={showTerms} onAccept={onAcceptTerms} onDecline={onDeclineTerms} />
    </div>
  );
}
