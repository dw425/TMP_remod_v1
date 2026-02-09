import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../formatCurrency';

describe('formatCurrency', () => {
  it('formats whole dollar amounts', () => {
    expect(formatCurrency(100)).toBe('$100');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('formats thousands with commas', () => {
    expect(formatCurrency(1500)).toBe('$1,500');
  });

  it('rounds cents to whole dollars', () => {
    expect(formatCurrency(99.99)).toBe('$100');
  });

  it('formats large amounts', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000');
  });
});
