import type { MigrationSchema } from '@/types/migration';

export const snowflakeSchema: MigrationSchema = {
  platform: 'snowflake',
  title: 'Snowflake to Databricks Migration Assessment',
  subtitle:
    'Inventory your Snowflake ecosystem to generate a precise ROM estimate and migration roadmap.',
  brandColor: '#29B5E8',
  romConfig: {
    objectCountFields: ['tableCount', 'viewCount', 'spCount', 'udfCount', 'pipelineCount', 'taskCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 1, medium: 4, complex: 16, veryComplex: 40 },
    hourlyRate: { low: 150, high: 250 },
  },
  sections: [
    // ── Executive Summary ──────────────────────────────────────────────
    {
      id: 'exec',
      title: 'Executive Summary',
      canMarkNA: true,
      fields: [
        { name: 'projectName', label: 'Project Name', type: 'text', required: true },
        { name: 'stakeholder', label: 'Primary Stakeholder', type: 'text', required: true },
        { name: 'timeline', label: 'Timeline Expectations', type: 'text', placeholder: 'e.g., Q3 2025' },
        { name: 'contactEmail', label: 'Contact Email', type: 'email', required: true },
        {
          name: 'businessDriver',
          label: 'Business Driver for Migration',
          type: 'textarea',
          placeholder: 'e.g., Cost optimization, platform consolidation, AI/ML initiatives...',
        },
      ],
    },

    // ── 1. Current Snowflake Environment ───────────────────────────────
    {
      id: 'environment',
      title: '1. Current Snowflake Environment',
      subtitle: 'Edition, object inventory, and storage details.',
      canMarkNA: true,
      fields: [
        // 1.1 Edition & Cloud
        {
          name: 'snowflakeEdition',
          label: 'Snowflake Edition',
          type: 'select',
          options: [
            { value: 'standard', label: 'Standard' },
            { value: 'enterprise', label: 'Enterprise' },
            { value: 'business_critical', label: 'Business Critical' },
          ],
        },
        {
          name: 'cloudProvider',
          label: 'Cloud Provider',
          type: 'select',
          options: [
            { value: 'aws', label: 'AWS' },
            { value: 'azure', label: 'Azure' },
            { value: 'gcp', label: 'GCP' },
          ],
        },

        // 1.2 Object Inventory
        { name: 'tableCount', label: 'Total Tables', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'tableComplexity',
          label: 'Table Complexity (Clustering)',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
          placeholder: 'Standard | Mixed | Heavy Clustering/Transient',
        },
        { name: 'viewCount', label: 'Total Views', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'viewComplexity',
          label: 'View Logic Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 2,
          placeholder: 'Simple | Nested | Secure/Materialized',
        },
        { name: 'databaseCount', label: 'Databases', type: 'number', min: 0, defaultValue: 0 },
        { name: 'schemaCount', label: 'Schemas', type: 'number', min: 0, defaultValue: 0 },
        { name: 'totalDataSize', label: 'Data Size (TB)', type: 'number', min: 0 },

        // 1.3 Structure & Optimization
        {
          name: 'tableTypes',
          label: 'Table Types Used',
          type: 'checkbox-group',
          options: [
            { value: 'transient', label: 'Transient Tables' },
            { value: 'temporary', label: 'Temporary Tables' },
            { value: 'external', label: 'External Tables' },
          ],
        },
        {
          name: 'clusteringKeys',
          label: 'Clustering Keys',
          type: 'textarea',
          placeholder: 'Describe manual clustering usage on large tables.',
        },
      ],
    },

    // ── 2. Compute & Code ──────────────────────────────────────────────
    {
      id: 'compute',
      title: '2. Compute & Code',
      subtitle: 'Virtual warehouses, stored procedures, and UDFs.',
      canMarkNA: true,
      fields: [
        // 2.1 Virtual Warehouses
        { name: 'warehouseCount', label: 'Count of Warehouses', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'warehouseSizes',
          label: 'Common Sizes',
          type: 'text',
          placeholder: 'XS, L, 2XL, 4XL...',
        },
        {
          name: 'warehouseUsage',
          label: 'Usage Patterns',
          type: 'textarea',
          placeholder: 'Workload separation (ETL vs BI), Multi-cluster usage, Auto-suspend settings.',
        },

        // 2.2 Stored Procedures & UDFs
        { name: 'spCount', label: 'Stored Procedures', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'spComplexity',
          label: 'SP Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
          placeholder: 'SQL Scripting | Mixed | Heavy JavaScript/Python',
        },
        { name: 'udfCount', label: 'UDFs', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'udfComplexity',
          label: 'UDF Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
          placeholder: 'SQL | Mixed | Java/Python/External',
        },
        {
          name: 'snowsqlScripts',
          label: 'SnowSQL Scripts',
          type: 'textarea',
          placeholder: 'Complexity of external SnowSQL orchestration scripts.',
        },
      ],
    },

    // ── 3. Ingestion & Orchestration ───────────────────────────────────
    {
      id: 'ingestion',
      title: '3. Ingestion & Orchestration',
      subtitle: 'Data loading methods, pipelines, and scheduling.',
      canMarkNA: true,
      fields: [
        // 3.1 Data Loading
        { name: 'pipelineCount', label: 'Ingestion Pipelines', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'ingestComplexity',
          label: 'Ingestion Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
          placeholder: 'Bulk Copy | Mixed | Streaming/CDC',
        },
        {
          name: 'ingestionMethods',
          label: 'Methods Used',
          type: 'checkbox-group',
          options: [
            { value: 'snowpipe', label: 'Snowpipe (Auto-Ingest)' },
            { value: 'copy', label: 'COPY Command' },
            { value: 'streams', label: 'Streams & Tasks (CDC)' },
            { value: 'third_party', label: 'Fivetran/Matillion/dbt' },
          ],
        },

        // 3.2 Orchestration
        { name: 'taskCount', label: 'Scheduled Tasks/DAGs', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'orchComplexity',
          label: 'Orchestration Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
          placeholder: 'Simple Schedule | Mixed | Dependency Trees/DAGs',
        },
        {
          name: 'externalSchedulers',
          label: 'External Tools',
          type: 'textarea',
          placeholder: 'Airflow, Control-M, dbt Cloud...',
        },
      ],
    },

    // ── 4. Security & Governance ───────────────────────────────────────
    {
      id: 'security',
      title: '4. Security & Governance',
      subtitle: 'Access control, security policies, and compliance requirements.',
      canMarkNA: true,
      fields: [
        {
          name: 'accessManagement',
          label: 'User & Role Management',
          type: 'textarea',
          placeholder: 'SCIM, SSO, Hierarchy complexity.',
        },
        {
          name: 'secFeatures',
          label: 'Security Features',
          type: 'checkbox-group',
          options: [
            { value: 'rls', label: 'Row-Access Policies' },
            { value: 'masking', label: 'Dynamic Masking' },
            { value: 'tagging', label: 'Object Tagging' },
          ],
        },
        {
          name: 'compliance',
          label: 'Compliance',
          type: 'checkbox-group',
          options: [
            { value: 'gdpr', label: 'GDPR' },
            { value: 'hipaa', label: 'HIPAA' },
            { value: 'pci', label: 'PCI DSS' },
          ],
        },
      ],
    },

    // ── 5. Target State & Priorities ───────────────────────────────────
    {
      id: 'target',
      title: '5. Target State & Priorities',
      subtitle: 'Desired Databricks architecture, budget, and SLAs.',
      canMarkNA: true,
      fields: [
        // 5.1 Architecture
        {
          name: 'targetCloudProvider',
          label: 'Target Cloud',
          type: 'select',
          options: [
            { value: 'aws', label: 'AWS' },
            { value: 'azure', label: 'Azure' },
            { value: 'gcp', label: 'GCP' },
          ],
        },
        {
          name: 'dbxFeatures',
          label: 'Databricks Features',
          type: 'checkbox-group',
          options: [
            { value: 'uc', label: 'Unity Catalog' },
            { value: 'dbsql', label: 'Databricks SQL' },
            { value: 'dlt', label: 'Delta Live Tables' },
            { value: 'liquid', label: 'Liquid Clustering' },
          ],
        },

        // 5.2 Budget & Costs
        { name: 'totalSpend', label: 'Annual Snowflake Spend ($)', type: 'number', min: 0 },
        { name: 'servicesBudget', label: 'Services Budget ($)', type: 'number', min: 0 },
        {
          name: 'jobSLAs',
          label: 'Critical SLAs',
          type: 'textarea',
          placeholder: 'Time-sensitive reporting or batch windows.',
        },

        // Overall complexity (ROM driver)
        {
          name: 'overallComplexity',
          label: 'Overall Environment Complexity (1 = simple, 5 = very complex)',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
      ],
    },

    // ── Form Completion Details ─────────────────────────────────────────
    {
      id: 'contact',
      title: 'Form Completion Details',
      canMarkNA: false,
      fields: [
        { name: 'completedBy', label: 'Questionnaire Completed By', type: 'text', required: true },
        { name: 'completionDate', label: 'Date', type: 'date' },
      ],
    },
  ],
};
