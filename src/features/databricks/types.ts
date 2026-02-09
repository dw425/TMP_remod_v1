export interface DatabricksConnection {
  workspaceUrl: string;
  accessToken: string;
  tokenExpiry: number;
}

export interface DeploymentRecord {
  id: string;
  assetId: string;
  productName: string;
  workspaceUrl: string;
  importPath: string;
  deployedAt: string;
  status: 'success' | 'failed';
}
