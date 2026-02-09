import type { ComplexityBreakdown, ROMConfig, ROMResult } from '@/types/migration';

/** Default complexity distribution weights (slider value 1-5). */
const DEFAULT_WEIGHTS: Record<number, [number, number, number, number]> = {
  1: [0.8, 0.2, 0, 0],
  2: [0.6, 0.3, 0.1, 0],
  3: [0.4, 0.4, 0.2, 0],
  4: [0.2, 0.4, 0.3, 0.1],
  5: [0.1, 0.2, 0.4, 0.3],
};

/**
 * Distributes a total object count across complexity levels based on a slider value (1-5).
 * Accepts optional custom weights per platform.
 */
export function distribute(
  total: number,
  sliderVal: number,
  customWeights?: Record<number, [number, number, number, number]>,
): ComplexityBreakdown {
  const t = total || 0;
  const val = Math.min(5, Math.max(1, Math.round(sliderVal || 3)));
  const weights = customWeights ?? DEFAULT_WEIGHTS;
  const w: [number, number, number, number] = weights[val] ?? DEFAULT_WEIGHTS[3] ?? [0.4, 0.4, 0.2, 0];
  const [s, m, c, v] = w;

  return {
    simple: Math.floor(t * s),
    medium: Math.floor(t * m),
    complex: Math.floor(t * c),
    veryComplex: Math.floor(t * v),
  };
}

/**
 * Calculates ROM result using the platform's ROMConfig.
 * If the config provides a custom `calculate` function, that is used instead.
 */
export function calculateROM(
  formData: Record<string, unknown>,
  config: ROMConfig,
): ROMResult {
  // Allow full custom override per platform
  if (config.calculate) {
    return config.calculate(formData);
  }

  const totalObjects = config.objectCountFields.reduce((sum, field) => {
    return sum + (Number(formData[field]) || 0);
  }, 0);

  const complexity = Number(formData[config.complexityField]) || 3;
  const breakdown = distribute(totalObjects, complexity, config.distributionWeights);

  const estimatedHours =
    breakdown.simple * config.hoursPerObject.simple +
    breakdown.medium * config.hoursPerObject.medium +
    breakdown.complex * config.hoursPerObject.complex +
    breakdown.veryComplex * config.hoursPerObject.veryComplex;

  return {
    totalObjects,
    breakdown,
    estimatedHours,
    estimatedCost: {
      low: estimatedHours * config.hourlyRate.low,
      high: estimatedHours * config.hourlyRate.high,
    },
  };
}
