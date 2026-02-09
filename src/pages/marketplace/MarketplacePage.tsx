import { useState } from 'react';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { CategoryFilter } from '@/components/composed/CategoryFilter';
import { ProductCard } from '@/components/composed/ProductCard';
import { ProductModal } from '@/components/composed/ProductModal';
import { SEO } from '@/components/SEO';
import { usePageTag, useScrollDepthTracking } from '@/features/analytics/pageTagging';
import { useTrack } from '@/features/analytics/useTrack';
import { EVENTS } from '@/features/analytics/events';
import type { Product } from '@/types/product';

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const track = useTrack();
  usePageTag({ pageName: 'Marketplace', pageType: 'marketplace' });
  useScrollDepthTracking();

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.categories.includes(activeCategory));

  const activeCategoryName =
    categories.find((c) => c.id === activeCategory)?.name || 'All Industries';

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    track(EVENTS.PRODUCT_CARD_CLICKED, { productId: product.id, productName: product.title });
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title="Blueprint Technology Marketplace"
        description="Production-ready Databricks solutions, migration accelerators, and AI frameworks from Blueprint Professional Consulting Services."
        canonical="/"
      />

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

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
