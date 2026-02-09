import type { MigrationSchema } from '@/types/migration';

export const unityCatalogSchema: MigrationSchema = {
  platform: 'unity-catalog',
  title: 'Unity Catalog Migration Assessment',
  subtitle:
    'Inventory your current catalogs, tables, and code to generate a precise upgrade roadmap.',
  brandColor: '#FF3621',
  romConfig: {
    objectCountFields: ['tableCount', 'viewCount', 'functionCount', 'externalLocationCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 1, medium: 4, complex: 14, veryComplex: 36 },
    hourlyRate: { low: 150, high: 240 },
  },
  sections: [
    /* ------------------------------------------------------------------ */
    /*  Application & Ownership  (from HTML header section, no N/A)       */
    /* ------------------------------------------------------------------ */
    {
      id: 'app-ownership',
      title: 'Application & Ownership',
      canMarkNA: false,
      fields: [
        {
          name: 'appName',
          label: 'Application/Team Name',
          type: 'text',
          required: true,
        },
        {
          name: 'appWorkspaces',
          label: 'Databricks Workspaces',
          type: 'text',
          required: true,
        },
        {
          name: 'businessOwner',
          label: 'Business Owner',
          type: 'text',
          required: true,
        },
        {
          name: 'techOwner',
          label: 'Technical Owner',
          type: 'text',
          required: true,
        },
        {
          name: 'appType',
          label: 'Application Type',
          type: 'select',
          options: [
            { value: 'internal', label: 'Internal' },
            { value: 'customer_facing', label: 'Customer-Facing' },
            { value: 'third_party', label: 'Third-Party' },
          ],
        },
        {
          name: 'appCriticality',
          label: 'Criticality',
          type: 'select',
          options: [
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' },
          ],
        },
        {
          name: 'upstreamTeams',
          label: 'Upstream Data Ownership',
          type: 'textarea',
          placeholder: 'Do you own the upstream data? If not, list dependencies.',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  1. Current Catalog & Environment                                  */
    /* ------------------------------------------------------------------ */
    {
      id: 'current-catalog',
      title: '1. Current Catalog & Environment',
      subtitle: 'Source systems and environment inventory.',
      canMarkNA: true,
      fields: [
        /* --- 1.1 Source Systems --- */
        {
          name: 'sourceCatalog',
          label: 'Primary Source Catalog',
          type: 'select',
          options: [
            { value: 'hms', label: 'Hive Metastore (Legacy)' },
            { value: 'glue', label: 'AWS Glue' },
            { value: 'purview', label: 'Azure Purview' },
            { value: 'gcp', label: 'Google Data Catalog' },
          ],
        },
        {
          name: 'otherCatalogs',
          label: 'Other Catalog Tools',
          type: 'textarea',
          placeholder: 'e.g., Alation, Collibra (one per line)',
        },
        /* --- 1.2 Environment Inventory --- */
        {
          name: 'tableCount',
          label: 'Total Tables',
          type: 'number',
          min: 0,
          defaultValue: 0,
          placeholder: 'Tables to upgrade to UC',
        },
        {
          name: 'tableComplexity',
          label: 'Table Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 2,
        },
        {
          name: 'workspaceCount',
          label: 'Workspaces Involved',
          type: 'number',
          min: 0,
          defaultValue: 0,
          placeholder: 'Workspaces needing UC binding',
        },
        {
          name: 'workspaceComplexity',
          label: 'Isolation Level',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 2,
        },
        {
          name: 'dbCount',
          label: 'Databases',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'schemaCount',
          label: 'Schemas',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'envBuckets',
          label: 'Storage Buckets/Containers',
          type: 'textarea',
          placeholder: 'List primary S3 buckets, ADLS containers, or GCS buckets.',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  2. Data & Schema Details                                          */
    /* ------------------------------------------------------------------ */
    {
      id: 'data-schema',
      title: '2. Data & Schema Details',
      canMarkNA: true,
      fields: [
        /* --- 2.1 Table Properties --- */
        {
          name: 'partitioningStrategy',
          label: 'Partitioning Strategy',
          type: 'textarea',
          placeholder: 'Describe partitioning on large tables.',
        },
        {
          name: 'zordering',
          label: 'Z-Ordering',
          type: 'textarea',
          placeholder: 'Tables using Z-ORDER?',
        },
        /* --- 2.2 Data Types --- */
        {
          name: 'dataTypes',
          label: 'Complex Types',
          type: 'checkbox-group',
          options: [
            { value: 'struct', label: 'STRUCT' },
            { value: 'array', label: 'ARRAY' },
            { value: 'map', label: 'MAP' },
            { value: 'json', label: 'JSON Parsing' },
          ],
        },
        /* --- 2.3 Dependencies --- */
        {
          name: 'readTables',
          label: 'Read Tables (Inputs)',
          type: 'textarea',
          placeholder: 'List schema.table inputs...',
        },
        {
          name: 'writeTables',
          label: 'Write Tables (Outputs)',
          type: 'textarea',
          placeholder: 'List schema.table outputs...',
        },
        {
          name: 'downstreamConsumers',
          label: 'Downstream Consumers',
          type: 'textarea',
          placeholder: 'BI Reports, other teams...',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  3. Security & Access Control                                      */
    /* ------------------------------------------------------------------ */
    {
      id: 'security',
      title: '3. Security & Access Control',
      canMarkNA: true,
      fields: [
        /* --- 3.1 Identity --- */
        {
          name: 'identityProvider',
          label: 'Identity Provider (IdP)',
          type: 'textarea',
          placeholder: 'Azure AD, Okta, SCIM status...',
        },
        {
          name: 'groupStructure',
          label: 'Group Structure',
          type: 'textarea',
          placeholder: 'How are groups/roles structured today?',
        },
        {
          name: 'authMethod',
          label: 'Authentication',
          type: 'textarea',
          placeholder: 'Service Principals, PATs?',
        },
        /* --- 3.2 Permissions --- */
        {
          name: 'dataAccessModel',
          label: 'Current Access Control',
          type: 'textarea',
          placeholder: 'Hive ACLs, S3 Policies, ADLS ACLs?',
        },
        {
          name: 'rowLevelSecurity',
          label: 'Row-Level Security (RLS)',
          type: 'textarea',
          placeholder: 'Current RLS implementation?',
        },
        {
          name: 'columnMasking',
          label: 'Column Masking',
          type: 'textarea',
          placeholder: 'Current masking implementation?',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  4. Workloads & Code                                               */
    /* ------------------------------------------------------------------ */
    {
      id: 'workloads',
      title: '4. Workloads & Code',
      canMarkNA: true,
      fields: [
        /* --- 4.1 Execution Environment --- */
        {
          name: 'notebookCount',
          label: 'Notebooks/Jobs to Refactor',
          type: 'number',
          min: 0,
          defaultValue: 0,
          placeholder: 'Est. count of items needing path updates',
        },
        {
          name: 'codeComplexity',
          label: 'Code Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        {
          name: 'codeLocation',
          label: 'Code Location',
          type: 'textarea',
          placeholder: 'Repos, Workspace paths...',
        },
        {
          name: 'codeExecution',
          label: 'Job Orchestrator',
          type: 'textarea',
          placeholder: 'DBJobs, Airflow, ADF...',
        },
        /* --- 4.2 Performance --- */
        {
          name: 'perfSLAs',
          label: 'SLAs',
          type: 'textarea',
          placeholder: 'Critical job timings.',
        },
        {
          name: 'drPlan',
          label: 'Disaster Recovery',
          type: 'textarea',
          placeholder: 'Current DR strategy.',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  5. Migration Strategy                                             */
    /* ------------------------------------------------------------------ */
    {
      id: 'migration-strategy',
      title: '5. Migration Strategy',
      canMarkNA: true,
      fields: [
        {
          name: 'scimStatus',
          label: 'Account-Level SCIM Ready?',
          type: 'select',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
            { value: 'unknown', label: 'Unknown' },
          ],
        },
        {
          name: 'cloudPermissions',
          label: 'Cloud Permissions Ready?',
          type: 'select',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
            { value: 'unknown', label: 'Unknown' },
          ],
        },
        {
          name: 'migrationTooling',
          label: 'Tooling Plan',
          type: 'textarea',
          placeholder: 'SYNC command, UCX, Partners?',
        },
        {
          name: 'migrationPhasing',
          label: 'Phasing Strategy',
          type: 'textarea',
          placeholder: 'By workspace, business unit, or layer?',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  6. Target Architecture                                            */
    /* ------------------------------------------------------------------ */
    {
      id: 'target-architecture',
      title: '6. Target Architecture',
      canMarkNA: true,
      fields: [
        {
          name: 'metastoreStrategy',
          label: 'Metastore Strategy',
          type: 'textarea',
          placeholder: 'One per region? Prod vs Non-Prod?',
        },
        {
          name: 'catalogDesign',
          label: 'Catalog Design',
          type: 'textarea',
          placeholder: 'Catalog per BU, Environment, or Source?',
        },
        {
          name: 'storageCredentials',
          label: 'Storage Credentials',
          type: 'textarea',
          placeholder: 'Managed Identities, Instance Profiles?',
        },
        {
          name: 'ownershipModel',
          label: 'Governance Model',
          type: 'textarea',
          placeholder: 'Centralized vs Decentralized ownership.',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  7. Readiness                                                      */
    /* ------------------------------------------------------------------ */
    {
      id: 'readiness',
      title: '7. Readiness',
      canMarkNA: true,
      fields: [
        {
          name: 'trainingPlan',
          label: 'Training Plan',
          type: 'textarea',
          placeholder: 'Enablement for teams on UC concepts.',
        },
        {
          name: 'communicationPlan',
          label: 'Communication',
          type: 'textarea',
          placeholder: 'Plan for communicating downtime/changes.',
        },
        {
          name: 'newHiveTables',
          label: 'Future Growth',
          type: 'textarea',
          placeholder: 'Planned expansions in next 6-12 months.',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Form Completion Details  (no N/A)                                 */
    /* ------------------------------------------------------------------ */
    {
      id: 'contact',
      title: 'Form Completion Details',
      canMarkNA: false,
      fields: [
        {
          name: 'completedBy',
          label: 'Questionnaire Completed By',
          type: 'text',
          required: true,
        },
        {
          name: 'completionDate',
          label: 'Date',
          type: 'date',
          required: true,
        },
      ],
    },
  ],
};
