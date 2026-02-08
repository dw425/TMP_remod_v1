export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="h-8 w-8 animate-spin border-4 border-blueprint-blue border-t-transparent" />
    </div>
  );
}
