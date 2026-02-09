import type { ComplexityBreakdown, ROMConfig } from '@/types/migration';

const STORAGE_KEY = 'rom-config-overrides';

export interface ROMConfigOverride {
  hoursPerObject: ComplexityBreakdown;
  hourlyRate: { low: number; high: number };
  distributionWeights?: Record<number, [number, number, number, number]>;
}

/**
 * Reads all ROM config overrides from localStorage.
 * Returns a map of platform slug -> override values.
 */
export function getAllOverrides(): Record<string, ROMConfigOverride> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, ROMConfigOverride>;
  } catch {
    return {};
  }
}

/**
 * Gets the ROM config override for a specific platform, or undefined if none set.
 */
export function getOverride(platform: string): ROMConfigOverride | undefined {
  return getAllOverrides()[platform];
}

/**
 * Saves a ROM config override for a specific platform.
 */
export function saveOverride(platform: string, override: ROMConfigOverride): void {
  const all = getAllOverrides();
  all[platform] = override;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

/**
 * Removes the ROM config override for a specific platform, reverting to schema defaults.
 */
export function removeOverride(platform: string): void {
  const all = getAllOverrides();
  delete all[platform];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

/**
 * Removes all ROM config overrides.
 */
export function clearAllOverrides(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Merges a schema's romConfig with any localStorage overrides.
 * Overrides take precedence over schema defaults.
 */
export function getEffectiveConfig(platform: string, schemaConfig: ROMConfig): ROMConfig {
  const override = getOverride(platform);
  if (!override) return schemaConfig;

  return {
    ...schemaConfig,
    hoursPerObject: override.hoursPerObject,
    hourlyRate: override.hourlyRate,
    distributionWeights: override.distributionWeights ?? schemaConfig.distributionWeights,
  };
}
