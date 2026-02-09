import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDatabricksAuth } from '@/features/databricks/useDatabricksAuth';
import { Spinner } from '@/components/ui';
import { ROUTES } from '@/config/routes';

export default function DatabricksCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleCallback } = useDatabricksAuth();

  const initialError = useMemo(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) return searchParams.get('error_description') || 'Authentication failed';
    if (!searchParams.get('code')) return 'No authorization code received';
    return null;
  }, [searchParams]);

  const [error, setError] = useState<string | null>(initialError);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !initialError) {
      handleCallback(code)
        .then(() => navigate(ROUTES.DEPLOYMENTS, { replace: true }))
        .catch(() => setError('Failed to complete authentication'));
    }
  }, [searchParams, handleCallback, navigate, initialError]);

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="bg-white border border-gray-300 p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Connection Failed</h1>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => navigate(ROUTES.DEPLOYMENTS)}
            className="text-blueprint-blue hover:underline text-sm"
          >
            Return to Deployments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Spinner className="mb-4" />
        <p className="text-gray-500">Connecting to Databricks...</p>
      </div>
    </div>
  );
}
