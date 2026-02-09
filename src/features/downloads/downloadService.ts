import type { DownloadRecord, Entitlement } from './types';

const ENTITLEMENTS_KEY = 'blueprint_entitlements';
const DOWNLOADS_KEY = 'blueprint_downloads';
const TERMS_KEY = 'blueprint_terms_accepted';
const RATE_KEY = 'blueprint_download_rate';

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

export function getEntitlements(userId: string): Entitlement[] {
  try {
    const all: Record<string, Entitlement[]> = JSON.parse(localStorage.getItem(ENTITLEMENTS_KEY) || '{}');
    return all[userId] || [];
  } catch {
    return [];
  }
}

export function grantEntitlement(userId: string, productSlug: string) {
  const all: Record<string, Entitlement[]> = JSON.parse(localStorage.getItem(ENTITLEMENTS_KEY) || '{}');
  const userEntitlements = all[userId] || [];

  if (userEntitlements.some((e) => e.productSlug === productSlug)) return;

  userEntitlements.push({
    productSlug,
    grantedAt: new Date().toISOString(),
    expiresAt: null,
  });
  all[userId] = userEntitlements;
  localStorage.setItem(ENTITLEMENTS_KEY, JSON.stringify(all));
}

export function isEntitled(userId: string, productSlug: string): boolean {
  const entitlements = getEntitlements(userId);
  return entitlements.some(
    (e) => e.productSlug === productSlug && (!e.expiresAt || new Date(e.expiresAt) > new Date()),
  );
}

export function getDownloadHistory(userId: string): DownloadRecord[] {
  try {
    const all: Record<string, DownloadRecord[]> = JSON.parse(localStorage.getItem(DOWNLOADS_KEY) || '{}');
    return (all[userId] || []).sort((a, b) => b.downloadedAt.localeCompare(a.downloadedAt));
  } catch {
    return [];
  }
}

export function recordDownload(userId: string, assetId: string, fileName: string) {
  const all: Record<string, DownloadRecord[]> = JSON.parse(localStorage.getItem(DOWNLOADS_KEY) || '{}');
  const records = all[userId] || [];
  records.push({ assetId, downloadedAt: new Date().toISOString(), fileName });
  all[userId] = records;
  localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(all));
}

export function hasAcceptedTerms(userId: string): boolean {
  try {
    const accepted: Record<string, boolean> = JSON.parse(localStorage.getItem(TERMS_KEY) || '{}');
    return !!accepted[userId];
  } catch {
    return false;
  }
}

export function acceptTerms(userId: string) {
  const accepted: Record<string, boolean> = JSON.parse(localStorage.getItem(TERMS_KEY) || '{}');
  accepted[userId] = true;
  localStorage.setItem(TERMS_KEY, JSON.stringify(accepted));
}

export function checkRateLimit(userId: string): boolean {
  try {
    const rates: Record<string, number[]> = JSON.parse(localStorage.getItem(RATE_KEY) || '{}');
    const timestamps = (rates[userId] || []).filter((t) => Date.now() - t < RATE_WINDOW_MS);
    return timestamps.length < RATE_LIMIT;
  } catch {
    return true;
  }
}

export function recordRateLimit(userId: string) {
  const rates: Record<string, number[]> = JSON.parse(localStorage.getItem(RATE_KEY) || '{}');
  const timestamps = (rates[userId] || []).filter((t) => Date.now() - t < RATE_WINDOW_MS);
  timestamps.push(Date.now());
  rates[userId] = timestamps;
  localStorage.setItem(RATE_KEY, JSON.stringify(rates));
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
