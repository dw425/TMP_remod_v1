import type { MigrationSchema } from '@/types/migration';

export const redshiftSchema: MigrationSchema = {
  platform: 'redshift',
  title: 'AWS Redshift to Databricks Migration Assessment',
  subtitle:
    'Inventory your Redshift cluster, S3 usage, and workloads to generate a precise ROM estimate and migration roadmap.',
  brandColor: '#232F3E',
  romConfig: {
    objectCountFields: ['tableCount', 'viewCount', 'spCount', 'udfTotalCount', 'pipelineCount', 'scriptCount', 'orchCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 1, medium: 5, complex: 18, veryComplex: 45 },
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
        { name: 'timeline', label: 'Timeline Expectations', type: 'text', placeholder: 'e.g., Q4 2024' },
        { name: 'contactEmail', label: 'Contact Email', type: 'email', required: true },
        {
          name: 'businessDriver',
          label: 'Business Driver for Migration',
          type: 'textarea',
          placeholder: 'e.g., Cost optimization, platform consolidation, desire for Lakehouse architecture...',
        },
        { name: 'organizationName', label: 'Organization / Company Name', type: 'text', required: true, helpText: 'Legal entity or business name' },
        { name: 'department', label: 'Department or Business Unit', type: 'text', helpText: 'Primary department sponsoring this migration' },
        { name: 'migrationUrgency', label: 'Migration Urgency', type: 'select', helpText: 'How soon does this migration need to start?', options: [{ value: 'critical', label: 'Critical (< 3 months)' }, { value: 'high', label: 'High (3-6 months)' }, { value: 'normal', label: 'Normal (6-12 months)' }, { value: 'planning', label: 'Planning (12+ months)' }] },
      ],
    },

    // ── 1. Current Redshift Cluster ────────────────────────────────────
    // 1.1 Infrastructure & Features
    {
      id: 'cluster-infra',
      title: '1. Current Redshift Cluster — Infrastructure & Features',
      subtitle: 'Detail your Redshift compute nodes and advanced features.',
      canMarkNA: true,
      fields: [
        { name: 'nodeType', label: 'Primary Node Type', type: 'text', placeholder: 'e.g., ra3.4xlarge, dc2.large' },
        { name: 'nodeCount', label: 'Number of Nodes', type: 'number', min: 1 },
        {
          name: 'redshiftFeatures',
          label: 'Advanced Features in Use',
          type: 'checkbox-group',
          options: [
            { value: 'concurrency_scaling', label: 'Concurrency Scaling' },
            { value: 'spectrum', label: 'Redshift Spectrum' },
            { value: 'data_sharing', label: 'Data Sharing' },
            { value: 'aqua', label: 'AQUA (Query Accelerator)' },
          ],
        },
        { name: 'reservedNodes', label: 'Reserved Nodes', type: 'select', helpText: 'Using reserved node pricing?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
        { name: 'raEnabled', label: 'RA3 Node Types', type: 'select', helpText: 'Are RA3 managed-storage node types in use?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
        { name: 'crossRegionCopy', label: 'Cross-Region Snapshot Copy', type: 'select', helpText: 'Cross-region snapshot replication enabled?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
      ],
    },

    // 1.2 Database Object Inventory
    {
      id: 'db-object-inventory',
      title: '1. Current Redshift Cluster — Database Object Inventory',
      subtitle: 'Count tables, views, schemas and their complexity.',
      canMarkNA: true,
      fields: [
        { name: 'tableCount', label: 'Total Tables', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'tableComplexity',
          label: 'Dist/Sort Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        { name: 'viewCount', label: 'Total Views', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'viewComplexity',
          label: 'View Logic Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 2,
        },
        { name: 'databaseCount', label: 'Databases', type: 'number', min: 0, defaultValue: 0 },
        { name: 'schemaCount', label: 'Schemas', type: 'number', min: 0, defaultValue: 0 },
        { name: 'matViewCount', label: 'Materialized Views', type: 'number', min: 0, defaultValue: 0 },
        { name: 'totalDataSize', label: 'Total Data Size (TB)', type: 'number', min: 0 },
      ],
    },

    // 1.3 Data Optimization
    {
      id: 'data-optimization',
      title: '1. Current Redshift Cluster — Data Optimization',
      subtitle: 'Describe distribution and sort key strategies.',
      canMarkNA: true,
      fields: [
        {
          name: 'distStyle',
          label: 'Distribution Style Usage',
          type: 'textarea',
          placeholder: 'Describe prevalence of KEY vs. EVEN vs. ALL distribution.',
        },
        {
          name: 'sortKeys',
          label: 'Sort Key Strategy',
          type: 'textarea',
          placeholder: 'Are Compound or Interleaved sort keys heavily used?',
        },
      ],
    },

    // ── 2. Workloads & Logic ───────────────────────────────────────────
    // 2.1 Stored Procedures & UDFs
    {
      id: 'sp-udf',
      title: '2. Workloads & Logic — Stored Procedures & UDFs',
      subtitle: 'Inventory stored procedures, UDFs, and procedural patterns.',
      canMarkNA: true,
      fields: [
        { name: 'spCount', label: 'Stored Procedures', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'spComplexity',
          label: 'Procedural Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        { name: 'udfTotalCount', label: 'Total Functions (UDFs)', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'udfComplexity',
          label: 'Function Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        {
          name: 'spPatterns',
          label: 'SP Patterns (Check all that apply)',
          type: 'checkbox-group',
          options: [
            { value: 'temp_tables', label: 'Heavy Temp Table usage' },
            { value: 'cursors', label: 'Cursors / Loops' },
            { value: 'dynamic_sql', label: 'Dynamic SQL Generation' },
            { value: 'transaction', label: 'Explicit Transaction Control' },
          ],
        },
      ],
    },

    // 2.2 Ingestion & Data Movement
    {
      id: 'ingestion',
      title: '2. Workloads & Logic — Ingestion & Data Movement',
      subtitle: 'Describe data ingestion pipelines, COPY usage, and streaming tools.',
      canMarkNA: true,
      fields: [
        { name: 'pipelineCount', label: 'Ingestion Pipelines', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'ingestComplexity',
          label: 'Ingestion Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 2,
        },
        {
          name: 'copyUsage',
          label: 'COPY Command Usage',
          type: 'textarea',
          placeholder: 'Describe formats (Parquet, CSV, JSON) and sources (S3, EMR, DynamoDB).',
        },
        {
          name: 'streaming',
          label: 'Streaming Tools',
          type: 'checkbox-group',
          options: [
            { value: 'kinesis', label: 'Kinesis Firehose' },
            { value: 'dms', label: 'AWS DMS (CDC)' },
            { value: 'kafka', label: 'MSK / Kafka' },
          ],
        },
      ],
    },

    // 2.3 Workload Management (WLM)
    {
      id: 'wlm',
      title: '2. Workloads & Logic — Workload Management (WLM)',
      subtitle: 'Describe WLM configuration and connected BI tools.',
      canMarkNA: true,
      fields: [
        {
          name: 'wlmConfig',
          label: 'WLM Configuration',
          type: 'textarea',
          placeholder: 'Manual vs Auto WLM? How are queues/priorities managed?',
        },
        {
          name: 'biTools',
          label: 'BI Tools Connected',
          type: 'text',
          placeholder: 'Tableau, QuickSight, Power BI, Looker...',
        },
      ],
    },

    // ── 3. Data Lake & AWS Ecosystem ───────────────────────────────────
    // 3.1 S3 & Spectrum
    {
      id: 's3-spectrum',
      title: '3. Data Lake & AWS Ecosystem — S3 & Spectrum',
      subtitle: 'Describe S3 usage, data volumes, and file formats.',
      canMarkNA: true,
      fields: [
        {
          name: 's3Usage',
          label: 'S3 Use Cases',
          type: 'textarea',
          placeholder: 'Staging for COPY? Spectrum external tables? Unloading data?',
        },
        { name: 's3DataVolume', label: 'S3 Data Volume (TB)', type: 'number', min: 0 },
        {
          name: 's3FileFormats',
          label: 'File Formats',
          type: 'text',
          placeholder: 'Parquet, ORC, CSV...',
        },
      ],
    },

    // 3.2 Glue & Orchestration
    {
      id: 'glue-orchestration',
      title: '3. Data Lake & AWS Ecosystem — Glue & Orchestration',
      subtitle: 'Inventory Glue jobs, external scripts, and orchestration workflows.',
      canMarkNA: true,
      fields: [
        { name: 'scriptCount', label: 'External Scripts (Glue/Py)', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'scriptComplexity',
          label: 'Script Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        { name: 'orchCount', label: 'Orchestration Workflows', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'orchComplexity',
          label: 'Orchestration Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        { name: 'glueDbCount', label: 'Glue Databases', type: 'number', min: 0, defaultValue: 0 },
        { name: 'glueTableCount', label: 'Glue Tables', type: 'number', min: 0, defaultValue: 0 },
      ],
    },

    // ── 4. Security & Governance ───────────────────────────────────────
    {
      id: 'security',
      title: '4. Security & Governance',
      canMarkNA: true,
      fields: [
        {
          name: 'iamUsage',
          label: 'IAM Usage Strategy',
          type: 'textarea',
          placeholder: 'Role chaining? Federated access?',
        },
        {
          name: 'secFeatures',
          label: 'Data Security Features',
          type: 'checkbox-group',
          options: [
            { value: 'kms', label: 'AWS KMS (Encryption)' },
            { value: 'column_level', label: 'Column-level Security' },
            { value: 'rls', label: 'Row-level Security (RLS)' },
            { value: 'tokenization', label: 'Tokenization' },
          ],
        },
      ],
    },

    // ── 5. Target State & Priorities ───────────────────────────────────
    // 5.1 Architecture
    {
      id: 'target-architecture',
      title: '5. Target State & Priorities — Architecture',
      subtitle: 'Define the target Databricks architecture and cloud provider.',
      canMarkNA: true,
      fields: [
        {
          name: 'targetCloudProvider',
          label: 'Target Cloud',
          type: 'select',
          options: [
            { value: 'aws', label: 'AWS (Preferred)' },
            { value: 'azure', label: 'Azure' },
            { value: 'gcp', label: 'GCP' },
          ],
        },
        {
          name: 'migrationStrategy',
          label: 'Strategy',
          type: 'select',
          options: [
            { value: 'replatform', label: 'Replatform (DLT/Auto-Loader)' },
            { value: 'refactor', label: 'Refactor (Spark/Python)' },
          ],
        },
        {
          name: 'dbxFeatures',
          label: 'Databricks Features',
          type: 'checkbox-group',
          options: [
            { value: 'uc', label: 'Unity Catalog' },
            { value: 'dbsql', label: 'Databricks SQL (Serverless)' },
            { value: 'dlt', label: 'Delta Live Tables' },
            { value: 'mlflow', label: 'MLflow' },
          ],
        },
      ],
    },

    // 5.2 Budget & Costs
    {
      id: 'budget',
      title: '5. Target State & Priorities — Budget & Costs',
      canMarkNA: true,
      fields: [
        { name: 'totalSpend', label: 'Current Annual Redshift Spend ($)', type: 'number', min: 0 },
        { name: 'servicesBudget', label: 'Services Budget ($)', type: 'number', min: 0 },
        { name: 'downtimeAcceptable', label: 'Acceptable Downtime Window', type: 'select', helpText: 'Maximum acceptable downtime during cutover', options: [{ value: 'zero', label: 'Zero downtime' }, { value: 'minimal', label: 'Minimal (< 1 hour)' }, { value: 'moderate', label: 'Moderate (< 4 hours)' }, { value: 'flexible', label: 'Flexible' }] },
        { name: 'dataRetentionYears', label: 'Data Retention Requirement', type: 'number', min: 0, unit: 'years', helpText: 'How many years of historical data must be migrated?' },
        { name: 'disasterRecovery', label: 'Disaster Recovery Strategy', type: 'select', helpText: 'Target DR architecture post-migration', options: [{ value: 'active-active', label: 'Active-Active' }, { value: 'active-passive', label: 'Active-Passive' }, { value: 'backup-only', label: 'Backup Only' }, { value: 'none', label: 'None' }] },
      ],
    },

    // ── Data Quality & Readiness ─────────────────────────────────────────
    {
      id: 'data-quality',
      title: 'Data Quality & Readiness',
      subtitle: 'Assess current data quality and migration readiness',
      canMarkNA: true,
      fields: [
        { name: 'dataQualityScore', label: 'Overall Data Quality', type: 'range', min: 1, max: 5, defaultValue: 3, helpText: 'Rate the overall quality and consistency of your data' },
        { name: 'dataLineageDocumented', label: 'Data Lineage Documentation', type: 'select', helpText: 'Is data lineage documented for key pipelines?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'partial', label: 'Partial' }] },
        { name: 'testingStrategy', label: 'Testing & Validation Approach', type: 'textarea', helpText: 'Describe how data accuracy and completeness will be validated post-migration' },
        { name: 'rollbackPlan', label: 'Rollback Strategy', type: 'textarea', helpText: 'What is the plan if the migration needs to be reversed?' },
      ],
    },

    // ── Overall Complexity Assessment ──────────────────────────────────
    {
      id: 'complexity',
      title: 'Overall Complexity Assessment',
      canMarkNA: false,
      fields: [
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

    // ── Form Completion Details ────────────────────────────────────────
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
