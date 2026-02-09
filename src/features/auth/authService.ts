import type { LoginCredentials, SignupCredentials, User } from '@/types/auth';
import {
  validateBusinessEmail,
  evaluatePasswordStrength,
  isCommonPassword,
  checkLoginRateLimit,
  recordLoginFailure,
  clearLoginFailures,
  checkSignupRateLimit,
  recordSignupAttempt,
} from './validation';
import { sanitizeInput } from '@/lib/sanitize';

const USERS_KEY = 'blueprint_users';
const SESSION_KEY = 'blueprint_session';

function getStoredUsers(): Record<string, { user: User; passwordHash: string }> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, { user: User; passwordHash: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(36);
}

function generateToken(): string {
  return crypto.randomUUID() + '-' + Date.now().toString(36);
}

export async function login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  await new Promise((r) => setTimeout(r, 500));

  const email = credentials.email.trim().toLowerCase();

  // Check rate limit
  const rateCheck = checkLoginRateLimit(email);
  if (!rateCheck.allowed) {
    const minutes = Math.ceil((rateCheck.retryAfterMs || 0) / 60000);
    throw new Error(`Too many failed attempts. Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`);
  }

  const users = getStoredUsers();
  const entry = users[credentials.email] || users[email];

  if (!entry || entry.passwordHash !== simpleHash(credentials.password)) {
    recordLoginFailure(email);
    const remaining = (rateCheck.attemptsRemaining || 1) - 1;
    if (remaining <= 2 && remaining > 0) {
      throw new Error(`Invalid email or password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`);
    }
    throw new Error('Invalid email or password');
  }

  // Clear failures on successful login
  clearLoginFailures(email);

  entry.user.lastLogin = new Date().toISOString();
  saveUsers(users);

  const token = generateToken();
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId: entry.user.id, token }));

  return { user: entry.user, token };
}

export async function signup(credentials: SignupCredentials): Promise<{ user: User; token: string }> {
  await new Promise((r) => setTimeout(r, 500));

  // Check signup rate limit
  const rateCheck = checkSignupRateLimit();
  if (!rateCheck.allowed) {
    const minutes = Math.ceil((rateCheck.retryAfterMs || 0) / 60000);
    throw new Error(`Too many signup attempts. Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`);
  }

  recordSignupAttempt();

  // Validate business email
  const emailResult = validateBusinessEmail(credentials.email);
  if (!emailResult.valid) {
    throw new Error(emailResult.error || 'Invalid email');
  }

  // Validate password strength
  const strength = evaluatePasswordStrength(credentials.password);
  if (strength.score < 2) {
    throw new Error('Password is too weak. ' + strength.errors.join(', '));
  }

  if (isCommonPassword(credentials.password)) {
    throw new Error('This password is too common. Please choose a stronger one.');
  }

  const email = credentials.email.trim().toLowerCase();
  const users = getStoredUsers();

  // Case-insensitive duplicate check
  if (users[email] || users[credentials.email]) {
    throw new Error('An account with this email already exists');
  }

  const user: User = {
    id: crypto.randomUUID(),
    email,
    firstName: sanitizeInput(credentials.firstName.trim()),
    lastName: sanitizeInput(credentials.lastName.trim()),
    company: sanitizeInput(credentials.company.trim()),
    role: 'user',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  users[email] = {
    user,
    passwordHash: simpleHash(credentials.password),
  };
  saveUsers(users);

  const token = generateToken();
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, token }));

  return { user, token };
}

export async function logout(): Promise<void> {
  sessionStorage.removeItem(SESSION_KEY);
}

export async function restoreSession(): Promise<{ user: User; token: string } | null> {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const { userId, token } = JSON.parse(raw);
    const users = getStoredUsers();
    const entry = Object.values(users).find((u) => u.user.id === userId);
    if (!entry) return null;
    return { user: entry.user, token };
  } catch {
    return null;
  }
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<User, 'firstName' | 'lastName' | 'company'>>,
): Promise<User> {
  await new Promise((r) => setTimeout(r, 300));

  const users = getStoredUsers();
  const entry = Object.values(users).find((u) => u.user.id === userId);
  if (!entry) throw new Error('User not found');

  // Sanitize inputs
  const sanitized: Partial<Pick<User, 'firstName' | 'lastName' | 'company'>> = {};
  if (updates.firstName) sanitized.firstName = sanitizeInput(updates.firstName.trim());
  if (updates.lastName) sanitized.lastName = sanitizeInput(updates.lastName.trim());
  if (updates.company) sanitized.company = sanitizeInput(updates.company.trim());

  Object.assign(entry.user, sanitized);
  saveUsers(users);
  return entry.user;
}
