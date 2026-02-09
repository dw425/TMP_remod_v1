/** Input sanitization utilities — defense-in-depth against XSS */

/**
 * Sanitize a single string value by stripping HTML tags and encoding
 * dangerous characters. React already escapes JSX output, but this
 * protects data sent to Formspree, PostHog, and other external services.
 */
export function sanitizeInput(str: string): string {
  if (!str) return str;

  return str
    // Strip HTML tags
    .replace(/<[^>]*>/g, '')
    // Encode HTML entities
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Recursively sanitize all string values in an object.
 * Preserves the structure but sanitizes every string leaf.
 */
export function sanitizeFormData<T extends Record<string, unknown>>(data: T): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      result[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === 'string'
          ? sanitizeInput(item)
          : typeof item === 'object' && item !== null
            ? sanitizeFormData(item as Record<string, unknown>)
            : item,
      );
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeFormData(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
