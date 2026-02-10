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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            {/* Left: copy + CTAs */}
            <div className="max-w-2xl">
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

            {/* Right: featured icons — aligned to CTA buttons */}
            {activeCategory === 'all' && featuredProducts.length > 0 && (
              <div className="flex gap-14 md:gap-16 shrink-0 self-end mb-[-8px]">
                {featuredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleViewDetails(product)}
                    className="flex flex-col items-center gap-3 group"
                  >
                    {product.id === 1 && (
                      <svg className="w-16 h-16 text-yellow-400 group-hover:text-yellow-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )}
                    {product.id === 15 && (
                      <svg className="w-16 h-16 text-yellow-400 group-hover:text-yellow-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                    )}
                    {product.id === 13 && (
                      <svg className="w-16 h-16 text-yellow-400 group-hover:text-yellow-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                    <span className="text-sm font-bold text-white font-dm-sans text-center uppercase tracking-wide group-hover:text-yellow-300 transition-colors">
                      {product.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Catalog */}
      <main ref={gridRef} className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <CategoryFilter activeCategory={activeCategory} onCategoryChange={(cat) => {
          setActiveCategory(cat);
          track(EVENTS.CATEGORY_FILTERED, { category: cat, resultCount: cat === 'all' ? products.length : products.filter(p => p.categories.includes(cat)).length });
        }} />

        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-medium text-black dark:text-gray-100 tracking-tight">
              {activeCategoryName}
            </h3>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No products found in this category.</p>
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
