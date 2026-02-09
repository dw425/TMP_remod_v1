import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { ROUTES } from '@/config/routes';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const inputClass =
    'w-full border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:border-blueprint-blue focus:ring-1 focus:ring-blueprint-blue';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white border border-gray-300 border-t-4 border-t-blueprint-blue p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {submitted ? (
          <div className="space-y-4">
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm">
              If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly.
            </div>
            <Link to={ROUTES.LOGIN} className="text-sm text-blueprint-blue hover:underline block text-center">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
            <Link to={ROUTES.LOGIN} className="text-sm text-blueprint-blue hover:underline block text-center">
              Back to sign in
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
