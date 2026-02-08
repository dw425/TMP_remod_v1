export interface Product {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  type: 'tool' | 'accelerator' | 'service';
  category: string;
  description: string;
  longDescription?: string;
  features: string[];
  priceMonthly: number;
  priceAnnual: number;
  videoUrl?: string;
  architectureImage?: string;
  readinessChecklist?: string[];
  tags: string[];
}
