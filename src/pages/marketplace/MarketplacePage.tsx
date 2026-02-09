import { useState, useRef } from 'react';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { CategoryFilter } from '@/components/composed/CategoryFilter';
import { ProductCard } from '@/components/composed/ProductCard';
import { ProductModal } from '@/components/composed/ProductModal';
import { SEO } from '@/components/SEO';
import { usePageTag, useScrollDepthTracking } from '@/features/analytics/pageTagging';
import { useTrack } from '@/features/analytics/useTrack';
import { EVENTS } from '@/features/analytics/events';
import { BPCS_LINKS } from '@/config/bpcs';
import type { Product } from '@/types/product';

const FEATURED_IDS = [1, 15, 13]; // Lakehouse Optimizer, CampaignIQ, AI Factory

const STATS = [
  { value: '11', label: 'Migration Platforms' },
  { value: '6', label: 'AI Products' },
  { value: '90-Day', label: 'Delivery' },
];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const track = useTrack();
  usePageTag({ pageName: 'Marketplace', pageType: 'marketplace' });
  useScrollDepthTracking();

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.categories.includes(activeCategory));

  const activeCategoryName =
    categories.find((c) => c.id === activeCategory)?.name || 'All Industries';

  const featuredProducts = products.filter((p) => FEATURED_IDS.includes(p.id));

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    track(EVENTS.PRODUCT_CARD_CLICKED, { productId: product.id, productName: product.title });
  };

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SEO
        title="Blueprint Technology Marketplace"
        description="Production-ready Databricks solutions, migration accelerators, and AI frameworks from Blueprint Professional Consulting Services."
        canonical="/"
      />

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-blueprint-blue to-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
              Production-Ready AI &amp; Data Solutions
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              Deploy Databricks-native tools, migration accelerators, and AI frameworks from Blueprint.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={scrollToGrid}
                className="bg-white text-blueprint-blue font-bold py-3 px-8 text-sm uppercase tracking-wider hover:bg-blue-50 transition-colors btn-rounded"
              >
                Browse Solutions
              </button>
              <a
                href={BPCS_LINKS.contact}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white font-bold py-3 px-8 text-sm uppercase tracking-wider hover:bg-white/10 transition-colors btn-rounded"
              >
                Talk to Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-bold text-blueprint-blue">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-500 font-medium uppercase tracking-wide mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products (only when "All" is selected) */}
      {activeCategory === 'all' && featuredProducts.length > 0 && (
        <section className="bg-bg-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
              Featured Solutions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="sharp-card p-6 cursor-pointer hover:shadow-lg transition-all group relative"
                  onClick={() => handleViewDetails(product)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleViewDetails(product);
                    }
                  }}
                >
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blueprint-blue px-2 py-1">
                    Featured
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blueprint-blue transition-colors mb-1 pr-16">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{product.subtitle}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-blueprint-blue uppercase tracking-wide">
                    Learn More &rarr;
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Catalog */}
      <main ref={gridRef} className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CategoryFilter activeCategory={activeCategory} onCategoryChange={(cat) => {
          setActiveCategory(cat);
          track(EVENTS.CATEGORY_FILTERED, { category: cat, resultCount: cat === 'all' ? products.length : products.filter(p => p.categories.includes(cat)).length });
        }} />

        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-light text-gray-900 tracking-tight">
              {activeCategoryName}
            </h3>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
