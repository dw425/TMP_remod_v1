import { useState } from 'react';
import { products } from '@/data/products';
import { CategoryFilter } from '@/components/composed/CategoryFilter';
import { ProductGrid } from '@/components/composed/ProductGrid';
import { ProductModal } from '@/components/composed/ProductModal';
import { useCart } from '@/features/cart/useCart';
import { useAlerts } from '@/features/notifications/useAlerts';
import type { Product } from '@/types/product';

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { add } = useCart();
  const { push } = useAlerts();

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory || p.tags.includes(activeCategory));

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    add({
      id: product.id,
      title: product.title,
      type: product.type,
      billing: 'monthly',
      price: product.priceMonthly,
    });
    push({
      type: 'success',
      title: 'Added to cart',
      message: `${product.title} has been added to your cart.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blueprint Marketplace</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Production-ready Databricks solutions, migration accelerators, and AI frameworks built by Blueprint
          Professional Consulting Services.
        </p>
      </div>

      <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <ProductGrid products={filteredProducts} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} />

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
