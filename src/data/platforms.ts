import type { Platform } from '@/types/migration';

export const platforms: Platform[] = [
  {
    id: 'sap',
    slug: 'sap',
    name: 'SAP',
    brandColor: '#008FD3',
    description: 'Migrate SAP ERP, BW, and HANA workloads to Databricks Lakehouse.',
  },
  {
    id: 'snowflake',
    slug: 'snowflake',
    name: 'Snowflake',
    brandColor: '#29B5E8',
    description: 'Transition Snowflake data warehouses and pipelines to Databricks.',
  },
  {
    id: 'oracle',
    slug: 'oracle',
    name: 'Oracle',
    brandColor: '#C74634',
    description: 'Migrate Oracle databases, PL/SQL, and ETL workflows to Databricks.',
  },
  {
    id: 'redshift',
    slug: 'redshift',
    name: 'AWS Redshift',
    brandColor: '#232F3E',
    description: 'Move Redshift clusters, Spectrum queries, and Glue jobs to Databricks.',
  },
  {
    id: 'sql-server',
    slug: 'sql-server',
    name: 'SQL Server',
    brandColor: '#737373',
    description: 'Migrate SQL Server databases, SSIS packages, and SSRS reports.',
  },
  {
    id: 'informatica',
    slug: 'informatica',
    name: 'Informatica',
    brandColor: '#FF4D00',
    description: 'Convert Informatica PowerCenter and IICS mappings to Databricks.',
  },
  {
    id: 'synapse',
    slug: 'synapse',
    name: 'Azure Synapse',
    brandColor: '#0078D4',
    description: 'Migrate Synapse dedicated pools, pipelines, and Spark notebooks.',
  },
  {
    id: 'teradata',
    slug: 'teradata',
    name: 'Teradata',
    brandColor: '#F37421',
    description: 'Transition Teradata data warehouses and BTEQ scripts to Databricks.',
  },
  {
    id: 'talend',
    slug: 'talend',
    name: 'Talend',
    brandColor: '#FF6D70',
    description: 'Convert Talend jobs and data integration flows to Databricks workflows.',
  },
  {
    id: 'gcp',
    slug: 'gcp',
    name: 'Google Cloud',
    brandColor: '#4285F4',
    description: 'Migrate BigQuery, Dataflow, and Composer pipelines to Databricks.',
  },
  {
    id: 'unity-catalog',
    slug: 'unity-catalog',
    name: 'Unity Catalog',
    brandColor: '#FF3621',
    description: 'Consolidate Hive metastores and external catalogs into Unity Catalog.',
  },
];

export function getPlatformBySlug(slug: string): Platform | undefined {
  return platforms.find((p) => p.slug === slug);
}
