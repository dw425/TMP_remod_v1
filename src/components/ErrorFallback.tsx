interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

export function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-bg-primary font-dm-sans flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-blueprint-blue mb-4">Oops</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-8">
          An unexpected error occurred. Please try again or return to the homepage.
        </p>
        {import.meta.env.DEV && error && (
          <pre className="mb-6 p-4 bg-red-50 border border-red-200 text-left text-xs text-red-700 overflow-auto max-h-40">
            {error.message}
            {'\n'}
            {error.stack}
          </pre>
        )}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onReset}
            className="px-6 py-3 bg-blueprint-blue text-white font-bold hover:bg-blue-800 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/TMP_remod_v1/"
            className="px-6 py-3 border-2 border-blueprint-blue text-blueprint-blue font-bold hover:bg-blueprint-blue hover:text-white transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
