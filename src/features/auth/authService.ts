import type { LoginCredentials, SignupCredentials, User } from '@/types/auth';

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

  const users = getStoredUsers();
  const entry = users[credentials.email];

  if (!entry || entry.passwordHash !== simpleHash(credentials.password)) {
    throw new Error('Invalid email or password');
  }

  entry.user.lastLogin = new Date().toISOString();
  saveUsers(users);

  const token = generateToken();
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId: entry.user.id, token }));

  return { user: entry.user, token };
}

export async function signup(credentials: SignupCredentials): Promise<{ user: User; token: string }> {
  await new Promise((r) => setTimeout(r, 500));

  const users = getStoredUsers();

  if (users[credentials.email]) {
    throw new Error('An account with this email already exists');
  }

  const user: User = {
    id: crypto.randomUUID(),
    email: credentials.email,
    firstName: credentials.firstName,
    lastName: credentials.lastName,
    company: credentials.company,
    role: 'user',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  users[credentials.email] = {
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

  Object.assign(entry.user, updates);
  saveUsers(users);
  return entry.user;
}
