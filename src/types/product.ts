export interface ProductBenefit {
  title: string;
  description: string;
}

export interface WhatItDoesSection {
  heading: string;
  paragraphs: string[];
}

export interface PricingTier {
  name: string;
  price: string;
  action: 'addToCart' | 'contactSales';
}

export interface Product {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  type: 'tool' | 'accelerator' | 'service';
  /** Industry categories for homepage filtering */
  categories: string[];
  description: string;
  longDescription?: string;
  features: string[];
  priceMonthly: number;
  priceAnnual: number;
  videoUrl?: string;
  /** SVG placeholder type for products without video */
  placeholderIcon?: 'bar-chart' | 'users' | 'microphone' | 'dollar-circle';
  architectureImage?: string;
  readinessChecklist?: string[];
  tags: string[];
  /** Rich content for product detail pages */
  benefits?: ProductBenefit[];
  whatItDoes?: WhatItDoesSection[];
  pricingTiers?: PricingTier[];
  industries?: string[];
  /** Cart data attributes matching original site */
  cartId?: string;
  cartName?: string;
  cartType?: string;
  /** Link destination for non-tool products (insight, engagement, suite) */
  detailPage?: string;
}
