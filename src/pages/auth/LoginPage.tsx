import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { Button } from '@/components/ui';
import { SEO } from '@/components/SEO';
import { ROUTES } from '@/config/routes';
import { BPCS_LINKS } from '@/config/bpcs';
import { checkLoginRateLimit } from '@/features/auth/validation';
import { useTrack } from '@/features/analytics/useTrack';
import { EVENTS } from '@/features/analytics/events';

export default function LoginPage() {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const track = useTrack();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || ROUTES.DASHBOARD;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lockoutMs, setLockoutMs] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const checkLockout = useCallback(() => {
    if (!email) return;
    const result = checkLoginRateLimit(email);
    if (!result.allowed && result.retryAfterMs) {
      setLockoutMs(result.retryAfterMs);
    } else {
      setLockoutMs(0);
    }
  }, [email]);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutMs <= 0) return;
    const timer = setInterval(() => {
      setLockoutMs((prev) => {
        const next = prev - 1000;
        if (next <= 0) {
          clearInterval(timer);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutMs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Re-check lockout before attempting
    const rateCheck = checkLoginRateLimit(email);
    if (!rateCheck.allowed) {
      setLockoutMs(rateCheck.retryAfterMs || 0);
      return;
    }

    setSubmitting(true);
    try {
      await login({ email, password });
      track(EVENTS.LOGIN_COMPLETED, { email });
      navigate(returnTo, { replace: true });
    } catch {
      // error is set in store — re-check lockout
      checkLockout();
    } finally {
      setSubmitting(false);
    }
  };

  const isLockedOut = lockoutMs > 0;
  const lockoutMinutes = Math.ceil(lockoutMs / 60000);
  const lockoutSeconds = Math.ceil(lockoutMs / 1000);

  const inputClass =
    'w-full border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:border-blueprint-blue focus:ring-1 focus:ring-blueprint-blue';

  return (
    <div className="w-full max-w-md">
      <SEO title="Sign In" description="Sign in to your Blueprint Marketplace account." />
      <div className="bg-white border border-gray-300 border-t-4 border-t-blueprint-blue p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h1>

        {isLockedOut && (
          <div role="alert" className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
            <p className="font-medium">Account temporarily locked</p>
            <p className="mt-1">
              Too many failed attempts. Try again in{' '}
              {lockoutSeconds > 60
                ? `${lockoutMinutes} minute${lockoutMinutes !== 1 ? 's' : ''}`
                : `${lockoutSeconds} second${lockoutSeconds !== 1 ? 's' : ''}`}.
            </p>
          </div>
        )}

        {error && !isLockedOut && (
          <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={checkLockout}
              required
              autoComplete="email"
              className={inputClass}
              disabled={isLockedOut}
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="current-password"
                className={inputClass}
                disabled={isLockedOut}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={submitting || isLockedOut}>
            {submitting ? 'Signing in...' : isLockedOut ? 'Locked Out' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-sm text-center space-y-2">
          <Link to={ROUTES.FORGOT_PASSWORD} className="text-blueprint-blue hover:underline block">
            Forgot password?
          </Link>
          <p className="text-gray-500">
            Don't have an account?{' '}
            <Link to={ROUTES.SIGNUP} className="text-blueprint-blue hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-6 text-[11px] text-gray-400 text-center leading-relaxed">
          By signing in you agree to our{' '}
          <a href={BPCS_LINKS.terms} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Terms of Service</a>
          {' '}and{' '}
          <a href={BPCS_LINKS.privacy} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
