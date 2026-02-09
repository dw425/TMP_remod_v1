import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { MigrationField } from '@/types/migration';

interface FormFieldProps {
  field: MigrationField;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
  disabled?: boolean;
}

export function FormField({ field, register, errors, disabled }: FormFieldProps) {
  const error = errors[field.name];
  const baseInputClass =
    'w-full border border-gray-300 px-3 py-2 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-blueprint-blue focus:ring-1 focus:ring-blueprint-blue disabled:bg-gray-100 disabled:text-gray-400';

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
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-600 ml-1">*</span>}
      </label>

      {field.type === 'textarea' ? (
        <textarea
          id={field.name}
          rows={3}
          className={baseInputClass}
          placeholder={field.placeholder}
          disabled={disabled}
          {...register(field.name, registerOptions)}
        />
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
      ) : field.type === 'checkbox-group' ? (
        <div className="space-y-2">
          {field.options?.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700">
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
      ) : field.type === 'checkbox' ? (
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            disabled={disabled}
            {...register(field.name)}
            className="h-4 w-4 border-gray-300 text-blueprint-blue focus:ring-blueprint-blue"
          />
          {field.label}
        </label>
      ) : field.type === 'range' ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{field.min ?? 1}</span>
          <input
            id={field.name}
            type="range"
            min={field.min ?? 1}
            max={field.max ?? 5}
            defaultValue={
              field.defaultValue !== undefined ? Number(field.defaultValue) : 3
            }
            className="flex-1 accent-blueprint-blue"
            disabled={disabled}
            {...register(field.name, { valueAsNumber: true })}
          />
          <span className="text-sm text-gray-500">{field.max ?? 5}</span>
        </div>
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

      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message as string}</p>
      )}
    </div>
  );
}
