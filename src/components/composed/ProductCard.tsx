import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const isTool = product.type === 'tool' || product.type === 'service';
  const isTrending = product.id === 7;

  const borderClass = isTrending
    ? 'border-green-400 border-2 bg-green-50'
    : 'sharp-card';

  return (
    <div
      className={`group ${borderClass} p-6 flex flex-col hover:shadow-lg transition-all duration-300 cursor-pointer grid-item h-full relative overflow-hidden`}
      onClick={() => onViewDetails(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetails(product);
        }
      }}
    >
      <div className="flex-grow">
        <h4 className="text-lg font-bold text-blueprint-blue transition-colors mb-2 tracking-tight leading-snug">
          {isTrending && (
            <svg className="w-5 h-5 text-yellow-400 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )}
          {product.title}
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed mb-0 line-clamp-3">
          {product.description}
        </p>
      </div>

      {isTool ? (
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold uppercase tracking-wide text-gray-400">
          <span>Tool</span>
          <div className="flex space-x-1 text-gray-500">
            {product.tags.slice(0, 2).map((tag, i) => (
              <span key={tag}>
                {i > 0 && <span className="text-gray-300 mr-1">|</span>}
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold uppercase tracking-wide">
          <span className="text-blueprint-blue group-hover:underline">
            {product.videoUrl ? 'Watch Video' : 'Read Paper'} &rarr;
          </span>
          <div className="flex space-x-1 text-gray-400">
            {product.tags.slice(0, 2).map((tag, i) => (
              <span key={tag}>
                {i > 0 && <span className="text-gray-300 mr-1">|</span>}
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
