import { describe, it, expect, beforeEach } from 'vitest';
import {
  formatFileSize,
  getEntitlements,
  grantEntitlement,
  isEntitled,
  checkRateLimit,
  recordRateLimit,
  hasAcceptedTerms,
  acceptTerms,
} from '../downloadService';

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 B');
  });

  it('formats kilobytes', () => {
    expect(formatFileSize(2048)).toBe('2.0 KB');
  });

  it('formats megabytes', () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB');
  });
});

describe('entitlements', () => {
  const userId = 'user-1';

  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty array for user with no entitlements', () => {
    expect(getEntitlements(userId)).toEqual([]);
  });

  it('grants and checks entitlement', () => {
    grantEntitlement(userId, 'product-a');
    expect(isEntitled(userId, 'product-a')).toBe(true);
    expect(isEntitled(userId, 'product-b')).toBe(false);
  });

  it('does not duplicate entitlements', () => {
    grantEntitlement(userId, 'product-a');
    grantEntitlement(userId, 'product-a');
    expect(getEntitlements(userId)).toHaveLength(1);
  });
});

describe('rate limiting', () => {
  const userId = 'user-1';

  beforeEach(() => {
    localStorage.clear();
  });

  it('allows downloads within rate limit', () => {
    expect(checkRateLimit(userId)).toBe(true);
  });

  it('blocks after exceeding rate limit', () => {
    for (let i = 0; i < 5; i++) {
      recordRateLimit(userId);
    }
    expect(checkRateLimit(userId)).toBe(false);
  });
});

describe('terms acceptance', () => {
  const userId = 'user-1';

  beforeEach(() => {
    localStorage.clear();
  });

  it('returns false when terms not accepted', () => {
    expect(hasAcceptedTerms(userId)).toBe(false);
  });

  it('returns true after accepting terms', () => {
    acceptTerms(userId);
    expect(hasAcceptedTerms(userId)).toBe(true);
  });
});
