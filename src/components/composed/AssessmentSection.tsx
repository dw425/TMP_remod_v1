import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { MigrationSection } from '@/types/migration';
import { FormField } from './FormField';

interface AssessmentSectionProps {
  section: MigrationSection;
  form: UseFormReturn<Record<string, unknown>>;
  index: number;
  total: number;
  brandColor?: string;
}

export function AssessmentSection({ section, form, index, total, brandColor }: AssessmentSectionProps) {
  const [isNA, setIsNA] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const accentColor = brandColor || '#1d4ed8';

  return (
    <div
      className={`bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 overflow-hidden transition-opacity ${
        isNA ? 'opacity-50' : ''
      }`}
      style={{ borderLeftWidth: 4, borderLeftColor: accentColor }}
    >
      {/* Section Header — always visible */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        onClick={() => setCollapsed(!collapsed)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCollapsed(!collapsed); } }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Step number */}
          <span
            className="shrink-0 w-7 h-7 flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: accentColor }}
          >
            {index + 1}
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 truncate">{section.title}</h3>
            {section.subtitle && (
              <p className="text-xs text-gray-400 truncate">{section.subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          {/* Step counter */}
          <span className="hidden sm:inline text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {index + 1} / {total}
          </span>

          {/* N/A toggle */}
          {section.canMarkNA && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIsNA(!isNA); }}
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border transition-colors ${
                isNA
                  ? 'bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-slate-500'
                  : 'bg-white dark:bg-slate-800 text-gray-400 border-gray-200 dark:border-slate-600 hover:border-gray-400'
              }`}
            >
              N/A
            </button>
          )}

          {/* Collapse chevron */}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${collapsed ? '' : 'rotate-180'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Section Body — collapsible */}
      {!collapsed && (
        <div className="px-6 pb-6 border-t border-gray-100 dark:border-slate-700">
          {section.description && (
            <p className="text-sm text-gray-500 mt-4 mb-4 leading-relaxed">{section.description}</p>
          )}
          <div className="space-y-5 mt-4">
            {section.fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                register={form.register}
                errors={form.formState.errors}
                disabled={isNA}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
