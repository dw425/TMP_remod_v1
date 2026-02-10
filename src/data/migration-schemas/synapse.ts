import type { MigrationSchema } from '@/types/migration';

export const synapseSchema: MigrationSchema = {
  platform: 'synapse',
  title: 'Azure Synapse to Databricks Migration Assessment',
  subtitle:
    'Assess your Dedicated SQL Pools, Serverless, and Pipelines for a seamless migration to the Lakehouse.',
  brandColor: '#0078D4',
  romConfig: {
    objectCountFields: ['tableCount', 'viewCount', 'spCount', 'pipelineCount', 'dataFlowCount', 'notebookCount', 'triggerCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 2, medium: 6, complex: 20, veryComplex: 50 },
    hourlyRate: { low: 155, high: 255 },
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
        { name: 'businessDriver', label: 'Business Driver for Migration', type: 'textarea', placeholder: 'e.g., Unified governance, cost reduction, moving off proprietary SQL pools...' },
        { name: 'organizationName', label: 'Organization / Company Name', type: 'text', required: true, helpText: 'Legal entity or business name' },
        { name: 'department', label: 'Department or Business Unit', type: 'text', helpText: 'Primary department sponsoring this migration' },
        { name: 'migrationUrgency', label: 'Migration Urgency', type: 'select', helpText: 'How soon does this migration need to start?', options: [{ value: 'critical', label: 'Critical (< 3 months)' }, { value: 'high', label: 'High (3-6 months)' }, { value: 'normal', label: 'Normal (6-12 months)' }, { value: 'planning', label: 'Planning (12+ months)' }] },
      ],
    },

    // ── 1. Current Synapse Environment ─────────────────────────────────
    {
      id: 'synapse-environment',
      title: '1. Current Synapse Environment',
      subtitle: 'Pools, compute, database objects, and data features.',
      canMarkNA: true,
      fields: [
        // 1.1 Pools & Compute
        { name: 'dedicatedPoolCount', label: 'Dedicated SQL Pools (DW)', type: 'number', min: 0, defaultValue: 0 },
        { name: 'serverlessCount', label: 'Serverless SQL Endpoints', type: 'number', min: 0, defaultValue: 0 },
        { name: 'sparkPoolCount', label: 'Spark Pools', type: 'number', min: 0, defaultValue: 0 },
        { name: 'sparkVersions', label: 'Spark Pool Versions', type: 'text', placeholder: 'e.g. 3.1, 3.3' },

        // 1.2 Database Objects (Dedicated SQL)
        { name: 'tableCount', label: 'Total Tables', type: 'number', min: 0, defaultValue: 0 },
        { name: 'tableComplexity', label: 'Distribution Complexity (1 = Round Robin, 5 = Replicated/Partitioned)', type: 'range', min: 1, max: 5, defaultValue: 3 },
        { name: 'viewCount', label: 'Total Views', type: 'number', min: 0, defaultValue: 0 },
        { name: 'viewComplexity', label: 'View Complexity (1 = Simple, 5 = Materialized/Complex)', type: 'range', min: 1, max: 5, defaultValue: 2 },
        { name: 'schemaCount', label: 'Schemas', type: 'number', min: 0, defaultValue: 0 },
        { name: 'extTableCount', label: 'External Tables', type: 'number', min: 0, defaultValue: 0 },
        { name: 'totalDataSize', label: 'Data Size (TB)', type: 'number', min: 0 },

        // 1.3 Data Features
        {
          name: 'synFeatures',
          label: 'Feature Usage',
          type: 'checkbox-group',
          options: [
            { value: 'polybase', label: 'PolyBase / COPY INTO' },
            { value: 'result_set_caching', label: 'Result Set Caching' },
            { value: 'materialized_views', label: 'Materialized Views' },
            { value: 'workload_management', label: 'Workload Management (WLM)' },
          ],
        },
        { name: 'workspaceCount', label: 'Number of Workspaces', type: 'number', min: 0, helpText: 'Total Synapse workspaces in scope' },
        { name: 'linkedServicesCount', label: 'Linked Services', type: 'number', min: 0, helpText: 'Total linked services configured' },
        { name: 'managedVNet', label: 'Managed Virtual Network', type: 'select', helpText: 'Using managed VNet for data exfiltration protection?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
      ],
    },

    // ── 2. Code, Logic & Pipelines ─────────────────────────────────────
    {
      id: 'code-logic-pipelines',
      title: '2. Code, Logic & Pipelines',
      subtitle: 'SQL logic, Synapse pipelines, and Spark notebooks.',
      canMarkNA: true,
      fields: [
        // 2.1 SQL Logic (T-SQL)
        { name: 'spCount', label: 'Stored Procedures', type: 'number', min: 0, defaultValue: 0 },
        { name: 'spComplexity', label: 'T-SQL Complexity (1 = Basic SQL, 5 = Dyn. SQL/Cursors)', type: 'range', min: 1, max: 5, defaultValue: 3 },
        { name: 'udfCount', label: 'Functions (UDFs)', type: 'number', min: 0, defaultValue: 0 },
        { name: 'dynamicSql', label: 'Dynamic SQL Usage', type: 'textarea', placeholder: 'Describe reliance on EXEC() or sp_executesql.' },

        // 2.2 Synapse Pipelines (Integration)
        { name: 'pipelineCount', label: 'Pipelines', type: 'number', min: 0, defaultValue: 0 },
        { name: 'pipelineComplexity', label: 'Pipeline Complexity (1 = Copy Data, 5 = Complex/Custom Activities)', type: 'range', min: 1, max: 5, defaultValue: 3 },
        { name: 'dataFlowCount', label: 'Mapping Data Flows', type: 'number', min: 0, defaultValue: 0 },
        { name: 'dataFlowComplexity', label: 'Transformation Level (1 = Simple Map, 5 = Complex Joins/Windowing)', type: 'range', min: 1, max: 5, defaultValue: 3 },
        { name: 'irSetup', label: 'Integration Runtime (IR)', type: 'textarea', placeholder: 'Self-hosted IR usage? VNet configuration?' },

        // 2.3 Spark & Notebooks
        { name: 'notebookCount', label: 'Notebooks / Spark Jobs', type: 'number', min: 0, defaultValue: 0 },
        { name: 'notebookComplexity', label: 'Code Complexity (1 = Simple ETL, 5 = ML/Complex Logic)', type: 'range', min: 1, max: 5, defaultValue: 2 },
        { name: 'languages', label: 'Languages Used', type: 'text', placeholder: 'PySpark, Scala, SparkSQL, .NET' },
      ],
    },

    // ── 3. Orchestration & Storage ─────────────────────────────────────
    {
      id: 'orchestration-storage',
      title: '3. Orchestration & Storage',
      subtitle: 'Triggers, scheduling, and Data Lake storage.',
      canMarkNA: true,
      fields: [
        // 3.1 Triggers & Scheduling
        { name: 'triggerCount', label: 'Pipeline Triggers', type: 'number', min: 0, defaultValue: 0 },
        { name: 'triggerComplexity', label: 'Orch. Complexity (1 = Time-based, 5 = Event-Driven)', type: 'range', min: 1, max: 5, defaultValue: 2 },

        // 3.2 Data Lake Storage (ADLS Gen2)
        { name: 'linkedServiceCount', label: 'Linked Services', type: 'number', min: 0, defaultValue: 0 },
        { name: 'fileFormats', label: 'File Formats', type: 'text', placeholder: 'Parquet, Delta, CSV, JSON' },
        { name: 'adlsStructure', label: 'Data Lake Structure', type: 'textarea', placeholder: 'Describe folder hierarchy (Bronze/Silver/Gold) and mounting strategy.' },
      ],
    },

    // ── 4. Security & Governance ───────────────────────────────────────
    {
      id: 'security-governance',
      title: '4. Security & Governance',
      canMarkNA: true,
      fields: [
        { name: 'iam', label: 'Identity Management', type: 'textarea', placeholder: 'Azure AD (Entra ID) integration, Managed Identities, Service Principals.' },
        {
          name: 'secFeatures',
          label: 'Security Features',
          type: 'checkbox-group',
          options: [
            { value: 'rls', label: 'Row-Level Security (RLS)' },
            { value: 'ddm', label: 'Dynamic Data Masking' },
            { value: 'cl', label: 'Column-Level Encryption' },
            { value: 'vnet', label: 'Private Endpoints / VNet' },
          ],
        },
      ],
    },

    // ── 5. Cost & Priorities ───────────────────────────────────────────
    {
      id: 'cost-priorities',
      title: '5. Cost & Priorities',
      canMarkNA: true,
      fields: [
        { name: 'totalSpend', label: 'Annual Synapse Spend ($)', type: 'number', min: 0 },
        { name: 'servicesBudget', label: 'Services Budget ($)', type: 'number', min: 0 },
        {
          name: 'migrationStrategy',
          label: 'Migration Strategy',
          type: 'select',
          options: [
            { value: 'replatform', label: 'Replatform (Migrate SQL to Databricks SQL)' },
            { value: 'refactor', label: 'Refactor (Convert SQL/Pipelines to PySpark)' },
            { value: 'hybrid', label: 'Hybrid' },
          ],
        },
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
        { name: 'completionDate', label: 'Date', type: 'date', required: true },
      ],
    },
  ],
};
