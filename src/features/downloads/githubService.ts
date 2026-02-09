import { env } from '@/config/env';
import type { DownloadableAsset } from './types';

const GITHUB_API = 'https://api.github.com';

interface GitHubContentResponse {
  content: string;
  encoding: string;
  download_url: string;
  size: number;
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (env.VITE_GITHUB_DOWNLOAD_TOKEN) {
    headers['Authorization'] = `Bearer ${env.VITE_GITHUB_DOWNLOAD_TOKEN}`;
  }
  return headers;
}

/**
 * Check if GitHub downloads are configured (token present for private repos,
 * or repos are public and accessible).
 */
export function isGitHubConfigured(): boolean {
  return !!env.VITE_GITHUB_DOWNLOAD_TOKEN;
}

/**
 * Fetch a file from GitHub and return it as a Blob.
 * For files under 100MB, GitHub returns base64-encoded content.
 * For larger files, we follow the download_url redirect.
 */
export async function fetchAsset(asset: DownloadableAsset): Promise<Blob> {
  if (!asset.githubRepo || !asset.githubPath) {
    throw new Error('Asset does not have GitHub source configured');
  }

  const org = env.VITE_GITHUB_ORG;
  const branch = asset.githubBranch || 'main';
  const url = `${GITHUB_API}/repos/${org}/${asset.githubRepo}/contents/${asset.githubPath}?ref=${branch}`;

  const response = await fetch(url, { headers: getHeaders() });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('File not found in repository');
    }
    if (response.status === 403) {
      throw new Error('Access denied. Check GitHub token configuration.');
    }
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const data: GitHubContentResponse = await response.json();

  // For files with base64 content
  if (data.content && data.encoding === 'base64') {
    const decoded = atob(data.content.replace(/\n/g, ''));
    const bytes = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
      bytes[i] = decoded.charCodeAt(i);
    }
    return new Blob([bytes], { type: 'application/octet-stream' });
  }

  // For larger files, use the download URL
  if (data.download_url) {
    // Validate the download URL is from a known GitHub domain
    const downloadUrl = new URL(data.download_url);
    if (!downloadUrl.hostname.endsWith('githubusercontent.com') && !downloadUrl.hostname.endsWith('github.com')) {
      throw new Error('Unexpected download URL domain');
    }

    const fileResponse = await fetch(data.download_url, { headers: getHeaders() });
    if (!fileResponse.ok) {
      throw new Error(`Download failed: ${fileResponse.status}`);
    }
    return fileResponse.blob();
  }

  throw new Error('Unable to download file from GitHub');
}

/**
 * Apply a license watermark to text-based files (notebooks, Python files).
 */
export function applyWatermark(content: Blob, userEmail: string, downloadId: string): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const header = `# Licensed to: ${userEmail}\n# Download ID: ${downloadId}\n# Date: ${new Date().toISOString()}\n# PROPRIETARY - DO NOT DISTRIBUTE\n\n`;
      resolve(new Blob([header + text], { type: 'application/octet-stream' }));
    };
    reader.onerror = () => resolve(content); // fallback to unwatermarked
    reader.readAsText(content);
  });
}

/**
 * Check if an asset can be watermarked (text-based file types).
 */
export function isWatermarkable(asset: DownloadableAsset): boolean {
  return asset.fileType === 'notebook' || asset.fileType === 'report';
}
