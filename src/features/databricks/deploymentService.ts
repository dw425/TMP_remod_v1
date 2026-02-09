import type { DeploymentRecord } from './types';

const DEPLOYMENTS_KEY = 'blueprint_deployments';
const CONNECTION_KEY = 'blueprint_dbx_connection';

export function getDeployments(userId: string): DeploymentRecord[] {
  try {
    const all: Record<string, DeploymentRecord[]> = JSON.parse(localStorage.getItem(DEPLOYMENTS_KEY) || '{}');
    return (all[userId] || []).sort((a, b) => b.deployedAt.localeCompare(a.deployedAt));
  } catch {
    return [];
  }
}

export function recordDeployment(userId: string, record: DeploymentRecord) {
  const all: Record<string, DeploymentRecord[]> = JSON.parse(localStorage.getItem(DEPLOYMENTS_KEY) || '{}');
  const records = all[userId] || [];
  records.push(record);
  all[userId] = records;
  localStorage.setItem(DEPLOYMENTS_KEY, JSON.stringify(all));
}

export function saveConnection(workspaceUrl: string) {
  sessionStorage.setItem(CONNECTION_KEY, JSON.stringify({
    workspaceUrl,
    connectedAt: Date.now(),
  }));
}

export function getSavedConnection(): { workspaceUrl: string; connectedAt: number } | null {
  try {
    const raw = sessionStorage.getItem(CONNECTION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearConnection() {
  sessionStorage.removeItem(CONNECTION_KEY);
}
