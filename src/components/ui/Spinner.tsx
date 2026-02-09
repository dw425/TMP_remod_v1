export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div role="status" className={`flex items-center justify-center ${className}`}>
      <div className="h-8 w-8 animate-spin border-4 border-blueprint-blue border-t-transparent" aria-hidden="true" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
