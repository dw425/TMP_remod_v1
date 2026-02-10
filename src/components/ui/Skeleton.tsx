export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-slate-700 ${className}`} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="sharp-card p-6 flex flex-col h-full">
      <Skeleton className="h-4 w-20 mb-4" />
      <Skeleton className="h-5 w-3/4 mb-3" />
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-2/3 mb-6" />
      <div className="mt-auto pt-3 border-t border-gray-100 dark:border-slate-700">
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export function MarketplaceGridSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
