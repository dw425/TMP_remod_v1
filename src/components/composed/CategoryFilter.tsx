import { categories } from '@/data/categories';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <section className="mb-10 border-b border-gray-300 pb-2">
      <div className="flex flex-wrap gap-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`filter-btn px-4 py-3 uppercase tracking-wider text-xs ${
              activeCategory === category.id ? 'active' : ''
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </section>
  );
}
