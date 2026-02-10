import { useState } from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { MigrationField } from '@/types/migration';

interface FormFieldProps {
  field: MigrationField;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
  disabled?: boolean;
}

const RANGE_LABELS: Record<number, string> = {
  1: 'Simple',
  2: 'Low',
  3: 'Moderate',
  4: 'High',
  5: 'Very Complex',
};

export function FormField({ field, register, errors, disabled }: FormFieldProps) {
  const error = errors[field.name];
  const [rangeValue, setRangeValue] = useState(
    field.defaultValue !== undefined ? Number(field.defaultValue) : 3,
  );

  const baseInputClass =
    'w-full border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-blueprint-blue focus:ring-1 focus:ring-blueprint-blue disabled:bg-gray-100 disabled:text-gray-400 transition-colors dark:bg-slate-800 dark:border-slate-600 dark:text-gray-100 dark:placeholder-gray-500 dark:disabled:bg-slate-700';

  const registerOptions: Record<string, unknown> = {};
  if (field.required) registerOptions.required = `${field.label} is required`;
  if (field.type === 'email') {
    registerOptions.pattern = {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    };
  }
  if (field.type === 'number' && field.min !== undefined) {
    registerOptions.min = { value: field.min, message: `Minimum value is ${field.min}` };
    registerOptions.valueAsNumber = true;
  }

  return (
    <div>
      {/* Label + help text */}
      {field.type !== 'checkbox' && (
        <div className="mb-1.5">
          <label htmlFor={field.name} className="block text-sm font-semibold text-gray-800">
            {field.label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          {field.helpText && (
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{field.helpText}</p>
          )}
        </div>
      )}

      {/* Textarea */}
      {field.type === 'textarea' ? (
        <textarea
          id={field.name}
          rows={3}
          className={baseInputClass}
          placeholder={field.placeholder}
          disabled={disabled}
          {...register(field.name, registerOptions)}
        />

      /* Select */
      ) : field.type === 'select' ? (
        <select
          id={field.name}
          className={baseInputClass}
          disabled={disabled}
          {...register(field.name, registerOptions)}
        >
          <option value="">Select...</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

      /* Checkbox Group — 2-column grid */
      ) : field.type === 'checkbox-group' ? (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {field.options?.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700 py-1">
              <input
                type="checkbox"
                value={opt.value}
                disabled={disabled}
                {...register(field.name)}
                className="h-4 w-4 border-gray-300 text-blueprint-blue focus:ring-blueprint-blue"
              />
              {opt.label}
            </label>
          ))}
        </div>

      /* Single Checkbox */
      ) : field.type === 'checkbox' ? (
        <label className="flex items-center gap-2 text-sm text-gray-700 py-1">
          <input
            type="checkbox"
            disabled={disabled}
            {...register(field.name)}
            className="h-4 w-4 border-gray-300 text-blueprint-blue focus:ring-blueprint-blue"
          />
          {field.label}
          {field.helpText && (
            <span className="text-xs text-gray-400 ml-1">({field.helpText})</span>
          )}
        </label>

      /* Range Slider with value bubble + labels */
      ) : field.type === 'range' ? (
        <div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 w-12 shrink-0">{RANGE_LABELS[field.min ?? 1]}</span>
            <input
              id={field.name}
              type="range"
              min={field.min ?? 1}
              max={field.max ?? 5}
              defaultValue={rangeValue}
              className="flex-1 accent-blueprint-blue h-2 cursor-pointer"
              disabled={disabled}
              {...register(field.name, {
                valueAsNumber: true,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setRangeValue(Number(e.target.value)),
              })}
            />
            <span className="text-xs text-gray-400 w-20 shrink-0 text-right">{RANGE_LABELS[field.max ?? 5]}</span>
          </div>
          <div className="text-center mt-1">
            <span className="inline-block text-xs font-bold text-blueprint-blue bg-blue-50 px-2 py-0.5">
              {rangeValue} — {RANGE_LABELS[rangeValue] || rangeValue}
            </span>
          </div>
        </div>

      /* Number with unit label */
      ) : field.type === 'number' && field.unit ? (
        <div className="relative">
          <input
            id={field.name}
            type="number"
            className={`${baseInputClass} pr-12`}
            placeholder={field.placeholder}
            disabled={disabled}
            defaultValue={field.defaultValue !== undefined ? String(field.defaultValue) : undefined}
            {...register(field.name, registerOptions)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
            {field.unit}
          </span>
        </div>

      /* Default: text/email/number/date */
      ) : (
        <input
          id={field.name}
          type={field.type}
          className={baseInputClass}
          placeholder={field.placeholder}
          disabled={disabled}
          defaultValue={field.defaultValue !== undefined ? String(field.defaultValue) : undefined}
          {...register(field.name, registerOptions)}
        />
      )}

      {/* Error message */}
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error.message as string}
        </p>
      )}
    </div>
  );
}
