import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { Button } from '@/components/ui';
import { SEO } from '@/components/SEO';
import { ROUTES } from '@/config/routes';

export default function SignupPage() {
  const { signup, error } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setLocalError('Password must be at least 8 characters');
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
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input id="signup-email" type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" className={inputClass} />
          </div>
          <div>
            <label htmlFor="signup-company" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input id="signup-company" type="text" name="company" value={form.company} onChange={handleChange} required autoComplete="organization" className={inputClass} />
          </div>
          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input id="signup-password" type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} autoComplete="new-password" className={inputClass} />
          </div>
          <div>
            <label htmlFor="signup-confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input id="signup-confirmPassword" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required autoComplete="new-password" className={inputClass} />
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
      </div>
    </div>
  );
}
