import { ROUTES } from '@/config/routes';
import { BPCS_LINKS } from '@/config/bpcs';

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface MegaMenuColumn {
  title: string;
  links: NavLink[];
}

export const mainNav: NavLink[] = [
  { label: 'Marketplace', href: ROUTES.HOME },
  { label: 'Migration Suite', href: ROUTES.MIGRATION_HOME },
  { label: 'AI Factory', href: ROUTES.AI_FACTORY },
];

export const megaMenuColumns: MegaMenuColumn[] = [
  {
    title: 'Products',
    links: [
      { label: 'All Products', href: ROUTES.HOME },
      { label: 'Tools & Solutions', href: '/#tools' },
      { label: 'Accelerators', href: '/#accelerators' },
      { label: 'Case Studies', href: BPCS_LINKS.blog, external: true },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'AI Factory', href: ROUTES.AI_FACTORY },
      { label: 'Migration Suite', href: ROUTES.MIGRATION_HOME },
      { label: 'Consulting', href: BPCS_LINKS.contact, external: true },
      { label: 'Training', href: BPCS_LINKS.docs, external: true },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: BPCS_LINKS.docs, external: true },
      { label: 'Blog', href: BPCS_LINKS.blog, external: true },
      { label: 'Support', href: BPCS_LINKS.support, external: true },
      { label: 'Status', href: BPCS_LINKS.status, external: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Blueprint', href: BPCS_LINKS.about, external: true },
      { label: 'Careers', href: BPCS_LINKS.careers, external: true },
      { label: 'Contact', href: BPCS_LINKS.contact, external: true },
    ],
  },
];

export const footerLinks = {
  products: [
    { label: 'All Products', href: ROUTES.HOME },
    { label: 'Migration Suite', href: ROUTES.MIGRATION_HOME },
    { label: 'AI Factory', href: ROUTES.AI_FACTORY },
  ],
  company: [
    { label: 'About', href: BPCS_LINKS.about, external: true },
    { label: 'Blog', href: BPCS_LINKS.blog, external: true },
    { label: 'Careers', href: BPCS_LINKS.careers, external: true },
    { label: 'Contact', href: BPCS_LINKS.contact, external: true },
  ],
  legal: [
    { label: 'Privacy Policy', href: BPCS_LINKS.privacy, external: true },
    { label: 'Terms of Service', href: BPCS_LINKS.terms, external: true },
    { label: 'Security', href: BPCS_LINKS.security, external: true },
  ],
  support: [
    { label: 'Documentation', href: BPCS_LINKS.docs, external: true },
    { label: 'Support Center', href: BPCS_LINKS.support, external: true },
    { label: 'System Status', href: BPCS_LINKS.status, external: true },
  ],
};
