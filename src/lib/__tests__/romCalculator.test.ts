import { describe, it, expect } from 'vitest';
import { distribute, calculateROM } from '../romCalculator';
import type { ROMConfig } from '@/types/migration';

describe('distribute', () => {
  it('distributes 100 objects at slider=1 (mostly simple)', () => {
    const result = distribute(100, 1);
    expect(result.simple).toBe(80);
    expect(result.medium).toBe(20);
    expect(result.complex).toBe(0);
    expect(result.veryComplex).toBe(0);
  });

  it('distributes 100 objects at slider=5 (mostly complex)', () => {
    const result = distribute(100, 5);
    expect(result.simple).toBe(10);
    expect(result.medium).toBe(20);
    expect(result.complex).toBe(40);
    expect(result.veryComplex).toBe(30);
  });

  it('handles zero total', () => {
    const result = distribute(0, 3);
    expect(result.simple).toBe(0);
    expect(result.medium).toBe(0);
    expect(result.complex).toBe(0);
    expect(result.veryComplex).toBe(0);
  });

  it('clamps slider value to range 1-5', () => {
    const low = distribute(100, -1);
    expect(low.simple).toBe(80); // treated as 1

    const high = distribute(100, 10);
    expect(high.veryComplex).toBe(30); // treated as 5
  });

  it('uses default slider=3 for NaN', () => {
    const result = distribute(100, NaN);
    expect(result.simple).toBe(40);
    expect(result.medium).toBe(40);
  });
});

describe('calculateROM', () => {
  const mockConfig: ROMConfig = {
    objectCountFields: ['tables', 'views'],
    complexityField: 'complexity',
    hoursPerObject: { simple: 2, medium: 4, complex: 8, veryComplex: 16 },
    hourlyRate: { low: 150, high: 250 },
  };

  it('calculates ROM from form data', () => {
    const result = calculateROM({ tables: 50, views: 50, complexity: 3 }, mockConfig);
    expect(result.totalObjects).toBe(100);
    expect(result.estimatedHours).toBeGreaterThan(0);
    expect(result.estimatedCost.low).toBeLessThan(result.estimatedCost.high);
  });

  it('uses custom calculate function when provided', () => {
    const custom: ROMConfig = {
      ...mockConfig,
      calculate: () => ({
        totalObjects: 42,
        breakdown: { simple: 42, medium: 0, complex: 0, veryComplex: 0 },
        estimatedHours: 84,
        estimatedCost: { low: 12600, high: 21000 },
      }),
    };
    const result = calculateROM({}, custom);
    expect(result.totalObjects).toBe(42);
    expect(result.estimatedHours).toBe(84);
  });
});
