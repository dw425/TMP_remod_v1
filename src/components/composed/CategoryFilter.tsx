import { categories } from '@/data/categories';
import { cn } from '@/lib/cn';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            'px-4 py-2 font-medium transition-all border-b-2',
            activeCategory === category.id
              ? 'text-blueprint-blue border-blueprint-blue'
              : 'text-gray-600 border-transparent hover:text-blueprint-blue'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
