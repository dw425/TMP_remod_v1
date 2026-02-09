import { describe, it, expect, beforeEach } from 'vitest';
import { signup, login, logout, restoreSession } from '../authService';

const testCredentials = {
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User',
  company: 'ACME',
};

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('signs up a new user', async () => {
    const result = await signup(testCredentials);
    expect(result.user.email).toBe('test@example.com');
    expect(result.user.firstName).toBe('Test');
    expect(result.token).toBeTruthy();
  });

  it('rejects duplicate signup', async () => {
    await signup(testCredentials);
    await expect(signup(testCredentials)).rejects.toThrow('already exists');
  });

  it('logs in with correct credentials', async () => {
    await signup(testCredentials);
    const result = await login({ email: 'test@example.com', password: 'password123' });
    expect(result.user.email).toBe('test@example.com');
    expect(result.token).toBeTruthy();
  });

  it('rejects login with wrong password', async () => {
    await signup(testCredentials);
    await expect(login({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow('Invalid email or password');
  });

  it('restores session after login', async () => {
    await signup(testCredentials);
    const { user } = await login({ email: 'test@example.com', password: 'password123' });
    const restored = await restoreSession();
    expect(restored?.user.id).toBe(user.id);
  });

  it('returns null after logout', async () => {
    await signup(testCredentials);
    await login({ email: 'test@example.com', password: 'password123' });
    await logout();
    const restored = await restoreSession();
    expect(restored).toBeNull();
  });
});
