import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { useSecureDownload } from '@/features/downloads/useSecureDownload';
import { useEntitlements } from '@/features/downloads/useEntitlements';
import { DownloadTermsModal } from '@/components/modals/DownloadTermsModal';
import { DOWNLOAD_CATALOG } from '@/features/downloads/downloadCatalog';
import * as downloadService from '@/features/downloads/downloadService';
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
  const [history, setHistory] = useState<DownloadRecord[]>([]);

  useEffect(() => {
    if (user) setHistory(downloadService.getDownloadHistory(user.id));
  }, [user]);

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
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Downloads</h1>

      {availableAssets.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Available Downloads</h2>
          <div className="space-y-3">
            {availableAssets.map((asset) => (
              <div key={asset.assetId} className="bg-white border border-gray-300 p-5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">{asset.displayName}</p>
                  <p className="text-sm text-gray-500">
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
          <h2 className="text-lg font-bold text-gray-900 mb-4">Locked</h2>
          <div className="space-y-3">
            {lockedAssets.map((asset) => (
              <div key={asset.assetId} className="bg-gray-50 border border-gray-200 p-5 flex items-center justify-between opacity-60">
                <div>
                  <p className="font-bold text-gray-700">{asset.displayName}</p>
                  <p className="text-sm text-gray-400">
                    {fileTypeLabels[asset.fileType] || asset.fileType} &middot; v{asset.version}
                  </p>
                </div>
                <span className="text-sm text-gray-400 font-medium">Purchase Required</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Download History</h2>
        {history.length === 0 ? (
          <div className="bg-white border border-gray-300 p-8 text-center">
            <p className="text-gray-500">No downloads yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-300">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-700">File</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, i) => (
                  <tr key={`${record.assetId}-${i}`} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 text-gray-900">{record.fileName}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(record.downloadedAt).toLocaleString()}</td>
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
