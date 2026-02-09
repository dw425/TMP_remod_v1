import { useCallback, useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { useTrack } from '@/features/analytics/useTrack';
import { useAlerts } from '@/features/notifications/useAlerts';
import { EVENTS } from '@/features/analytics/events';
import * as downloadService from './downloadService';
import * as githubService from './githubService';
import type { DownloadableAsset } from './types';

function triggerBrowserDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function useSecureDownload() {
  const { user, isAuthenticated } = useAuth();
  const track = useTrack();
  const { showInfo, showSuccess, showError, showWarning } = useAlerts();
  const [pendingAsset, setPendingAsset] = useState<DownloadableAsset | null>(null);
  const [showTerms, setShowTerms] = useState(false);

  const executeDownload = useCallback(
    async (asset: DownloadableAsset) => {
      if (!user) return;

      downloadService.recordRateLimit(user.id);
      downloadService.recordDownload(user.id, asset.assetId, asset.fileName);

      track(EVENTS.DOWNLOAD_INITIATED, { assetId: asset.assetId, fileType: asset.fileType });

      const downloadId = crypto.randomUUID();

      // Try GitHub download if configured
      if (asset.githubRepo && asset.githubPath && githubService.isGitHubConfigured()) {
        try {
          let blob = await githubService.fetchAsset(asset);

          // Apply watermark to text-based files
          if (githubService.isWatermarkable(asset)) {
            blob = await githubService.applyWatermark(blob, user.email, downloadId);
          }

          triggerBrowserDownload(blob, asset.fileName);
          showSuccess('Download complete', asset.displayName);
          track(EVENTS.DOWNLOAD_COMPLETED, { assetId: asset.assetId, source: 'github' });
          return;
        } catch {
          // Fall through to demo mode
          showInfo('Using demo download', 'GitHub source unavailable — generating demo file.');
        }
      }

      // Demo mode: generate watermarked placeholder file
      const licenseHeader = `# Licensed to: ${user.email}\n# Download ID: ${downloadId}\n# Date: ${new Date().toISOString()}\n# PROPRIETARY - DO NOT DISTRIBUTE\n\n`;
      const content = `${licenseHeader}# ${asset.displayName} v${asset.version}\n# This is a demo download.\n`;
      const blob = new Blob([content], { type: 'application/octet-stream' });
      triggerBrowserDownload(blob, asset.fileName);

      showSuccess('Download complete', asset.displayName);
      track(EVENTS.DOWNLOAD_COMPLETED, { assetId: asset.assetId, source: 'demo' });
    },
    [user, track, showSuccess, showInfo],
  );

  const download = useCallback(
    (asset: DownloadableAsset) => {
      if (!isAuthenticated || !user) {
        showWarning('Login Required', 'Please sign in to download content.');
        return;
      }

      if (!downloadService.isEntitled(user.id, asset.productSlug)) {
        showError('Not Available', 'You need to purchase this product to download it.');
        track('download_blocked', { assetId: asset.assetId, reason: 'not_entitled' });
        return;
      }

      if (!downloadService.checkRateLimit(user.id)) {
        showError('Rate Limited', 'Too many downloads. Please try again in an hour.');
        track('download_blocked', { assetId: asset.assetId, reason: 'rate_limited' });
        return;
      }

      if (!downloadService.hasAcceptedTerms(user.id)) {
        setPendingAsset(asset);
        setShowTerms(true);
        return;
      }

      showInfo('Starting download...', asset.displayName);
      executeDownload(asset);
    },
    [isAuthenticated, user, track, showInfo, showWarning, showError, executeDownload],
  );

  const onAcceptTerms = useCallback(() => {
    if (!user || !pendingAsset) return;
    downloadService.acceptTerms(user.id);
    setShowTerms(false);
    showInfo('Starting download...', pendingAsset.displayName);
    executeDownload(pendingAsset);
    setPendingAsset(null);
  }, [user, pendingAsset, showInfo, executeDownload]);

  const onDeclineTerms = useCallback(() => {
    setShowTerms(false);
    setPendingAsset(null);
  }, []);

  return {
    download,
    showTerms,
    onAcceptTerms,
    onDeclineTerms,
  };
}
