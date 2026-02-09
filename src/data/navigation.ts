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
      { label: 'TCO Planning', href: 'https://bpcs.com/tco-planning', external: true },
    ],
  },
  {
    title: 'App & Strategy',
    links: [
      { label: 'Application Development', href: 'https://bpcs.com/application-development', external: true },
      { label: 'Productization', href: 'https://bpcs.com/productization', external: true },
      { label: 'Future Proofing', href: 'https://bpcs.com/future-proofing', external: true },
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
    title: 'Migration Accelerators',
    description: 'Assess your environment and accelerate your migration to the Databricks Lakehouse.',
    href: ROUTES.MIGRATION_HOME,
  },
  {
    title: 'Lakehouse Optimization',
    description: 'Optimize your Databricks environment for performance, cost, and reliability.',
    href: 'https://bpcs.com/lakehouse-optimization',
    external: true,
  },
  {
    title: 'Unity Catalog Migration',
    description: 'Upgrade to Unity Catalog to enable fine-grained governance across your data and AI.',
    href: '/migration/unity-catalog',
  },
  {
    title: 'Databricks SQL',
    description: 'Run your data warehousing and BI workloads directly on your data lake.',
    href: 'https://bpcs.com/databricks-sql',
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
