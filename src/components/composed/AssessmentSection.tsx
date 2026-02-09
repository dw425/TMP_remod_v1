import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { MigrationSection } from '@/types/migration';
import { FormField } from './FormField';

interface AssessmentSectionProps {
  section: MigrationSection;
  form: UseFormReturn<Record<string, unknown>>;
}

export function AssessmentSection({ section, form }: AssessmentSectionProps) {
  const [isNA, setIsNA] = useState(false);

  return (
    <div
      className={`bg-white border border-gray-300 border-t-4 border-t-blueprint-blue p-6 ${
        isNA ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
          {section.subtitle && (
            <p className="text-sm text-gray-500 mt-1">{section.subtitle}</p>
          )}
        </div>
        {section.canMarkNA && (
          <label className="flex items-center gap-2 text-sm text-gray-500 shrink-0 ml-4">
            <input
              type="checkbox"
              checked={isNA}
              onChange={(e) => setIsNA(e.target.checked)}
              className="h-4 w-4 border-gray-300 text-gray-500"
            />
            N/A
          </label>
        )}
      </div>

      <div className="space-y-4">
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
  );
}
