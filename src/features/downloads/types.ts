export interface DownloadableAsset {
  assetId: string;
  displayName: string;
  fileName: string;
  fileType: 'notebook' | 'bundle' | 'wheel' | 'report';
  productSlug: string;
  version: string;
  sizeBytes: number;
  githubRepo?: string;
  githubPath?: string;
  githubBranch?: string;
}

export interface DownloadRecord {
  assetId: string;
  downloadedAt: string;
  fileName: string;
}

export interface Entitlement {
  productSlug: string;
  grantedAt: string;
  expiresAt: string | null;
}
