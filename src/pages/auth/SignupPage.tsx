import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { Button } from '@/components/ui';
import { SEO } from '@/components/SEO';
import { ROUTES } from '@/config/routes';
import {
  validateBusinessEmail,
  evaluatePasswordStrength,
  isCommonPassword,
} from '@/features/auth/validation';
import { BPCS_LINKS } from '@/config/bpcs';
import { useTrack } from '@/features/analytics/useTrack';
import { EVENTS } from '@/features/analytics/events';

const STRENGTH_COLORS: Record<number, string> = {
  0: 'bg-red-500',
  1: 'bg-red-400',
  2: 'bg-yellow-500',
  3: 'bg-green-500',
  4: 'bg-green-600',
};

const STRENGTH_WIDTHS: Record<number, string> = {
  0: 'w-0',
  1: 'w-1/4',
  2: 'w-2/4',
  3: 'w-3/4',
  4: 'w-full',
};

export default function SignupPage() {
  const { signup, error } = useAuth();
  const navigate = useNavigate();
  const track = useTrack();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
    website: '', // honeypot
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailValidation = useMemo(
    () => (form.email ? validateBusinessEmail(form.email) : null),
    [form.email],
  );

  const passwordStrength = useMemo(
    () => (form.password ? evaluatePasswordStrength(form.password) : null),
    [form.password],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check — bots will fill the hidden field
    if (form.website) return;

    // Client-side email validation
    if (emailValidation && !emailValidation.valid) {
      setLocalError(emailValidation.error || 'Invalid email');
      return;
    }

    // Password match
    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    // Password strength
    if (passwordStrength && passwordStrength.score < 2) {
      setLocalError('Password is too weak. ' + passwordStrength.errors.join(', '));
      return;
    }

    // Common password check
    if (isCommonPassword(form.password)) {
      setLocalError('This password is too common. Please choose a stronger one.');
      return;
    }

    setSubmitting(true);
    try {
      await signup({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        company: form.company,
      });
      track(EVENTS.SIGNUP_COMPLETED, { email: form.email, company: form.company });
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch {
      // error set in store
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = localError || error;
  const inputClass =
    'w-full border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:border-blueprint-blue focus:ring-1 focus:ring-blueprint-blue';

  const showEmailError = emailTouched && emailValidation && !emailValidation.valid;

  return (
    <div className="w-full max-w-md">
      <SEO title="Create Account" description="Create a Blueprint Marketplace account to access enterprise Databricks solutions." />
      <div className="bg-white border border-gray-300 border-t-4 border-t-blueprint-blue p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h1>

        {displayError && (
          <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="signup-firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input id="signup-firstName" type="text" name="firstName" value={form.firstName} onChange={handleChange} required autoComplete="given-name" className={inputClass} />
            </div>
            <div>
              <label htmlFor="signup-lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input id="signup-lastName" type="text" name="lastName" value={form.lastName} onChange={handleChange} required autoComplete="family-name" className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
            <input
              id="signup-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={() => setEmailTouched(true)}
              required
              autoComplete="email"
              className={`${inputClass} ${showEmailError ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {showEmailError && (
              <p className="mt-1 text-xs text-red-600">{emailValidation?.error}</p>
            )}
          </div>

          <div>
            <label htmlFor="signup-company" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input id="signup-company" type="text" name="company" value={form.company} onChange={handleChange} required autoComplete="organization" className={inputClass} />
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input id="signup-password" type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required minLength={8} autoComplete="new-password" className={inputClass} />
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

            {/* Password strength meter */}
            {form.password && passwordStrength && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-gray-200">
                  <div
                    className={`h-full transition-all duration-300 ${STRENGTH_COLORS[passwordStrength.score]} ${STRENGTH_WIDTHS[passwordStrength.score]}`}
                  />
                </div>
                <p className={`text-xs mt-1 ${passwordStrength.score < 2 ? 'text-red-600' : passwordStrength.score < 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {passwordStrength.label}
                  {passwordStrength.errors.length > 0 && (
                    <span className="text-gray-500"> — Needs: {passwordStrength.errors.join(', ')}</span>
                  )}
                </p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="signup-confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input id="signup-confirmPassword" type={showPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required autoComplete="new-password" className={inputClass} />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
            )}
          </div>

          {/* Honeypot — hidden from users, bots will fill it */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="signup-website">Website</label>
            <input
              id="signup-website"
              type="text"
              name="website"
              value={form.website}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-500">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-blueprint-blue hover:underline">
            Sign in
          </Link>
        </p>

        <p className="mt-4 text-[11px] text-gray-400 text-center leading-relaxed">
          By creating an account you agree to our{' '}
          <a href={BPCS_LINKS.terms} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Terms of Service</a>
          {' '}and{' '}
          <a href={BPCS_LINKS.privacy} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
