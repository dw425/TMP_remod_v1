import { useState } from 'react';
import type { Product } from '@/types/product';
import { SharpCard } from '@/components/ui/SharpCard';

interface ReadinessChecklistProps {
  product: Product;
}

const DEFAULT_CHECKLIST = [
  'Executive sponsorship confirmed',
  'Budget approved for current fiscal year',
  'IT team aligned on Databricks platform',
  'Data governance framework in place',
  'Use cases identified and prioritized',
  'Technical POC completed successfully',
  'Security and compliance requirements mapped',
  'Migration timeline established',
  'Success metrics defined',
];

export function ReadinessChecklist({ product }: ReadinessChecklistProps) {
  const checklist = product.readinessChecklist || DEFAULT_CHECKLIST;
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const handleToggle = (index: number) => {
    setChecked((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const totalCount = checklist.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <SharpCard className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Readiness Checklist</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {completedCount} of {totalCount} items complete ({percentage}%)
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full bg-blueprint-blue transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Checklist Items */}
        <div className="space-y-2">
          {checklist.map((item, index) => (
            <label key={index} className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={checked[index] || false}
                onChange={() => handleToggle(index)}
                className="mt-0.5 w-4 h-4 text-blueprint-blue border-gray-300 focus:ring-blueprint-blue cursor-pointer"
              />
              <span
                className={`text-sm ${
                  checked[index] ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                }`}
              >
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>
    </SharpCard>
  );
}
