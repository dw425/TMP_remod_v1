import { ROUTES } from '@/config/routes';

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface MegaMenuItem {
  title: string;
  description?: string;
  href: string;
  external?: boolean;
}

export interface MegaMenuColumn {
  title: string;
  links: NavLink[];
}

/** "What we do" mega menu — 4 columns matching bpcs.com */
export const whatWeDoMenu: MegaMenuColumn[] = [
  {
    title: 'AI & Analytics',
    links: [
      { label: 'Generative AI', href: 'https://bpcs.com/genai', external: true },
      { label: 'AI Factory', href: 'https://bpcs.com/genai/ai-factory', external: true },
      { label: 'CampaignIQ', href: 'https://bpcs.com/genai/campaigniq', external: true },
      { label: 'Intelligent SOP', href: 'https://bpcs.com/intelligent-sop', external: true },
      { label: 'Video Analytics', href: 'https://bpcs.com/video-analytics', external: true },
      { label: 'Data Science', href: 'https://bpcs.com/data-science', external: true },
    ],
  },
  {
    title: 'Modern Platforms',
    links: [
      { label: 'Platform Modernization', href: 'https://bpcs.com/data-platform-modernization', external: true },
      { label: 'Lakehouse Optimization', href: 'https://bpcs.com/lakehouse-optimization', external: true },
      { label: 'Cloud & Infrastructure', href: 'https://bpcs.com/cloud-and-infrastructure', external: true },
      { label: 'Data Migration', href: 'https://bpcs.com/data-migration', external: true },
    ],
  },
  {
    title: 'Data Management',
    links: [
      { label: 'Data Governance', href: 'https://bpcs.com/data-governance', external: true },
      { label: 'Data Management', href: 'https://bpcs.com/data-management', external: true },
      { label: 'Data Catalog', href: 'https://bpcs.com/data-management/data-catalog', external: true },
      { label: 'Data Sharing Portal', href: 'https://bpcs.com/data-management/data-sharing-portal', external: true },
      { label: 'TCO Planning', href: 'https://bpcs.com/tco-planning', external: true },
    ],
  },
  {
    title: 'App & Strategy',
    links: [
      { label: 'Application Development', href: 'https://bpcs.com/application-development', external: true },
      { label: 'Productization', href: 'https://bpcs.com/productization', external: true },
      { label: 'Future Proofing', href: 'https://bpcs.com/future-proofing', external: true },
      { label: 'Localization', href: 'https://bpcs.com/localization', external: true },
    ],
  },
];

/** "Databricks" mega menu — descriptive cards matching bpcs.com */
export const databricksMenu: MegaMenuItem[] = [
  {
    title: 'Databricks + Blueprint',
    description: 'Our partnership with Databricks helps organizations unify their data, analytics and AI.',
    href: 'https://bpcs.com/databricks',
    external: true,
  },
  {
    title: 'Data Intelligence Platform',
    description: 'Unlock the full potential of your data with the Databricks Data Intelligence Platform.',
    href: 'https://bpcs.com/databricks/data-intelligence',
    external: true,
  },
  {
    title: 'Data Migration',
    description: 'Modernize your data estate and migrate to the Databricks Lakehouse.',
    href: 'https://bpcs.com/databricks/data-migration',
    external: true,
  },
  {
    title: 'Snowflake to Databricks',
    description: 'Accelerated migration path from Snowflake to the Databricks Lakehouse.',
    href: 'https://bpcs.com/databricks/accelerated-snowflake-to-databricks-migration',
    external: true,
  },
  {
    title: 'SAP + Databricks',
    description: 'Unlock SAP data for AI and analytics by integrating with the Databricks Lakehouse.',
    href: 'https://bpcs.com/databricks/sap-databricks',
    external: true,
  },
  {
    title: 'Lakehouse Optimizer',
    description: 'Optimize your Databricks environment for cost, performance, and governance.',
    href: 'https://bpcs.com/databricks/lakehouse-optimizer',
    external: true,
  },
  {
    title: 'Unity Catalog Migration',
    description: 'Upgrade to Unity Catalog for fine-grained governance across your data and AI assets.',
    href: 'https://bpcs.com/databricks/unity-catalog-migration',
    external: true,
  },
  {
    title: 'Collaborate with Us',
    description: 'Partner with Blueprint to build and scale Databricks solutions.',
    href: 'https://bpcs.com/databricks/collaborate-with-us',
    external: true,
  },
  {
    title: 'Databricks Workshops',
    description: 'Hands-on workshops to accelerate your Databricks adoption and skills.',
    href: 'https://bpcs.com/databricks-workshops',
    external: true,
  },
];

/** Top-level nav links that are NOT dropdowns */
export const mainNav: NavLink[] = [
  { label: 'Marketplace', href: ROUTES.HOME },
  { label: 'Migration Suite', href: ROUTES.MIGRATION_HOME },
  { label: 'AI Factory', href: ROUTES.AI_FACTORY },
];

export const footerSocialLinks = [
  { label: 'Facebook', href: '#' },
  { label: 'Twitter', href: '#' },
  { label: 'LinkedIn', href: '#' },
];
