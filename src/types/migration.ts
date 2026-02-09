export interface MigrationField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'number'
    | 'select'
    | 'textarea'
    | 'range'
    | 'checkbox'
    | 'checkbox-group'
    | 'date';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  defaultValue?: string | number | boolean | string[];
}

export interface MigrationSection {
  id: string;
  title: string;
  subtitle?: string;
  canMarkNA: boolean;
  fields: MigrationField[];
}

export interface ComplexityBreakdown {
  simple: number;
  medium: number;
  complex: number;
  veryComplex: number;
}

export interface ROMResult {
  totalObjects: number;
  breakdown: ComplexityBreakdown;
  estimatedHours: number;
  estimatedCost: { low: number; high: number };
}

/**
 * Per-platform ROM calculation configuration.
 * Each platform can customize its own hours-per-object rates, hourly cost rates,
 * complexity distribution weights, and object count / complexity field mappings.
 * For fully custom logic, provide a `calculate` function override.
 */
export interface ROMConfig {
  /** Form field names whose numeric values are summed as total objects */
  objectCountFields: string[];
  /** Form field name for the complexity slider (1-5) */
  complexityField: string;
  /** Hours per object at each complexity level (platform-specific) */
  hoursPerObject: ComplexityBreakdown;
  /** Hourly rate range for cost estimation */
  hourlyRate: { low: number; high: number };
  /**
   * Optional custom distribution weights per slider level (1-5).
   * Each entry maps slider value -> [simple%, medium%, complex%, veryComplex%].
   * If omitted, the default distribution table is used.
   */
  distributionWeights?: Record<number, [number, number, number, number]>;
  /**
   * Optional fully custom calculation function.
   * When provided, it overrides the default algorithm entirely.
   */
  calculate?: (formData: Record<string, unknown>) => ROMResult;
}

export interface MigrationSchema {
  platform: string;
  title: string;
  subtitle: string;
  brandColor: string;
  sections: MigrationSection[];
  romConfig: ROMConfig;
}

export interface Platform {
  id: string;
  slug: string;
  name: string;
  brandColor: string;
  description: string;
  /** Short tag label shown below platform name on tile (e.g. "Cloud Platform") */
  tag: string;
  logo?: string;
  /** 'svg-text' for Talend's inline SVG text element */
  logoType?: 'url' | 'svg-text';
}
