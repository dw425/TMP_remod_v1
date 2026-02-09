/** Business email & password validation utilities */

const PERSONAL_DOMAINS = new Set([
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'protonmail.com',
  'mail.com',
  'zoho.com',
  'yandex.com',
  'gmx.com',
  'live.com',
  'me.com',
  'msn.com',
]);

const COMMON_PASSWORDS = new Set([
  'password', 'password1', '12345678', '123456789', '1234567890',
  'qwerty12', 'qwertyui', 'letmein1', 'welcome1', 'monkey12',
  'dragon12', 'master12', 'shadow12', 'sunshine', 'princess',
  'football', 'baseball', 'trustno1', 'iloveyou', 'superman',
  'batman12', 'access12', 'hello123', 'charlie1', 'donald12',
  'password123', 'admin123', 'passw0rd', 'p@ssword', 'p@ssw0rd',
  'welcome123', 'abc12345', 'qwerty123', 'letmein123', '1q2w3e4r',
  'changeme', 'test1234', 'guest1234', 'master1234', 'root1234',
]);

export interface EmailValidationResult {
  valid: boolean;
  error?: string;
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: 'Too Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  errors: string[];
}

export function validateBusinessEmail(email: string): EmailValidationResult {
  const trimmed = email.trim().toLowerCase();

  if (!trimmed) {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  const domain = trimmed.split('@')[1];
  if (!domain) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  if (PERSONAL_DOMAINS.has(domain)) {
    return { valid: false, error: 'Please use your business email address' };
  }

  // Check domain has reasonable TLD
  const parts = domain.split('.');
  const tld = parts[parts.length - 1];
  if (!tld || tld.length < 2) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  return { valid: true };
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const errors: string[] = [];
  let score = 0;

  if (password.length < 8) {
    errors.push('At least 8 characters');
  } else {
    score++;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('At least 1 uppercase letter');
  } else {
    score++;
  }

  if (!/[a-z]/.test(password)) {
    errors.push('At least 1 lowercase letter');
  } else {
    score++;
  }

  if (!/[0-9]/.test(password)) {
    errors.push('At least 1 number');
  } else {
    score++;
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('At least 1 special character');
  } else {
    // Bonus: only counts if base requirements met
    if (password.length >= 8) score++;
  }

  // Cap at 4
  const finalScore = Math.min(score, 4) as 0 | 1 | 2 | 3 | 4;

  const labelMap = {
    0: 'Too Weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Strong',
    4: 'Very Strong',
  } as const;

  return { score: finalScore, label: labelMap[finalScore], errors };
}

export function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.has(password.toLowerCase());
}

/** Rate limiting for signup (per session) */
const SIGNUP_LIMIT_KEY = 'blueprint_signup_attempts';
const SIGNUP_MAX_ATTEMPTS = 3;
const SIGNUP_WINDOW_MS = 60 * 60 * 1000; // 1 hour

interface RateLimitEntry {
  attempts: number;
  windowStart: number;
}

export function checkSignupRateLimit(): { allowed: boolean; retryAfterMs?: number } {
  try {
    const raw = sessionStorage.getItem(SIGNUP_LIMIT_KEY);
    if (!raw) return { allowed: true };

    const entry: RateLimitEntry = JSON.parse(raw);
    const elapsed = Date.now() - entry.windowStart;

    if (elapsed > SIGNUP_WINDOW_MS) {
      sessionStorage.removeItem(SIGNUP_LIMIT_KEY);
      return { allowed: true };
    }

    if (entry.attempts >= SIGNUP_MAX_ATTEMPTS) {
      return { allowed: false, retryAfterMs: SIGNUP_WINDOW_MS - elapsed };
    }

    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

export function recordSignupAttempt(): void {
  try {
    const raw = sessionStorage.getItem(SIGNUP_LIMIT_KEY);
    let entry: RateLimitEntry;

    if (raw) {
      entry = JSON.parse(raw);
      const elapsed = Date.now() - entry.windowStart;
      if (elapsed > SIGNUP_WINDOW_MS) {
        entry = { attempts: 1, windowStart: Date.now() };
      } else {
        entry.attempts++;
      }
    } else {
      entry = { attempts: 1, windowStart: Date.now() };
    }

    sessionStorage.setItem(SIGNUP_LIMIT_KEY, JSON.stringify(entry));
  } catch {
    // ignore storage errors
  }
}

/** Login rate limiting (per email, stored in localStorage) */
const LOGIN_LIMIT_KEY = 'blueprint_login_attempts';
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

interface LoginAttemptRecord {
  attempts: number;
  windowStart: number;
}

function getLoginAttempts(): Record<string, LoginAttemptRecord> {
  try {
    return JSON.parse(localStorage.getItem(LOGIN_LIMIT_KEY) || '{}');
  } catch {
    return {};
  }
}

export function checkLoginRateLimit(email: string): { allowed: boolean; retryAfterMs?: number; attemptsRemaining?: number } {
  const records = getLoginAttempts();
  const key = email.trim().toLowerCase();
  const record = records[key];

  if (!record) return { allowed: true, attemptsRemaining: LOGIN_MAX_ATTEMPTS };

  const elapsed = Date.now() - record.windowStart;
  if (elapsed > LOGIN_WINDOW_MS) {
    delete records[key];
    localStorage.setItem(LOGIN_LIMIT_KEY, JSON.stringify(records));
    return { allowed: true, attemptsRemaining: LOGIN_MAX_ATTEMPTS };
  }

  if (record.attempts >= LOGIN_MAX_ATTEMPTS) {
    return { allowed: false, retryAfterMs: LOGIN_WINDOW_MS - elapsed };
  }

  return { allowed: true, attemptsRemaining: LOGIN_MAX_ATTEMPTS - record.attempts };
}

export function recordLoginFailure(email: string): void {
  const records = getLoginAttempts();
  const key = email.trim().toLowerCase();
  const existing = records[key];

  if (existing) {
    const elapsed = Date.now() - existing.windowStart;
    if (elapsed > LOGIN_WINDOW_MS) {
      records[key] = { attempts: 1, windowStart: Date.now() };
    } else {
      existing.attempts++;
    }
  } else {
    records[key] = { attempts: 1, windowStart: Date.now() };
  }

  localStorage.setItem(LOGIN_LIMIT_KEY, JSON.stringify(records));
}

export function clearLoginFailures(email: string): void {
  const records = getLoginAttempts();
  const key = email.trim().toLowerCase();
  delete records[key];
  localStorage.setItem(LOGIN_LIMIT_KEY, JSON.stringify(records));
}
