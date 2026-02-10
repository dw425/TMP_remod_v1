import type { MigrationSchema } from '@/types/migration';

export const sqlServerSchema: MigrationSchema = {
  platform: 'sql-server',
  title: 'SQL Server to Databricks Migration Assessment',
  subtitle:
    'Inventory your SQL Server, Oracle, or Postgres estate to generate a precise ROM estimate.',
  brandColor: '#737373',
  romConfig: {
    objectCountFields: [
      'tableCount',
      'viewCount',
      'spCount',
      'udfCount',
      'triggerCount',
      'etlCount',
      'scriptCount',
      'jobCount',
    ],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 2, medium: 8, complex: 22, veryComplex: 55 },
    hourlyRate: { low: 150, high: 250 },
  },
  sections: [
    // ── Executive Summary ───────────────────────────────────────────────
    {
      id: 'exec',
      title: 'Executive Summary',
      canMarkNA: true,
      fields: [
        { name: 'projectName', label: 'Project Name', type: 'text', required: true },
        { name: 'stakeholder', label: 'Primary Stakeholder', type: 'text', required: true },
        {
          name: 'timeline',
          label: 'Timeline Expectations',
          type: 'text',
          placeholder: 'e.g., Q2 2025',
        },
        { name: 'contactEmail', label: 'Contact Email', type: 'email', required: true },
        {
          name: 'businessDriver',
          label: 'Business Driver for Migration',
          type: 'textarea',
          placeholder:
            'e.g., License renewal, performance issues, move to Lakehouse...',
        },
        { name: 'organizationName', label: 'Organization / Company Name', type: 'text', required: true, helpText: 'Legal entity or business name' },
        { name: 'department', label: 'Department or Business Unit', type: 'text', helpText: 'Primary department sponsoring this migration' },
        { name: 'migrationUrgency', label: 'Migration Urgency', type: 'select', helpText: 'How soon does this migration need to start?', options: [{ value: 'critical', label: 'Critical (< 3 months)' }, { value: 'high', label: 'High (3-6 months)' }, { value: 'normal', label: 'Normal (6-12 months)' }, { value: 'planning', label: 'Planning (12+ months)' }] },
      ],
    },

    // ── 1. Current SQL Environment ──────────────────────────────────────
    {
      id: 'current-env',
      title: '1. Current SQL Environment',
      subtitle: 'System, hosting, object inventory, and data structure details.',
      canMarkNA: true,
      fields: [
        // ── 1.1 System & Hosting ──
        {
          name: 'sqlSystem',
          label: 'Source SQL System',
          type: 'select',
          options: [
            { value: 'sqlserver', label: 'SQL Server (T-SQL)' },
            { value: 'oracle', label: 'Oracle (PL/SQL)' },
            { value: 'postgresql', label: 'PostgreSQL' },
            { value: 'mysql', label: 'MySQL' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          name: 'hostingEnv',
          label: 'Hosting Environment',
          type: 'select',
          options: [
            { value: 'on_premises', label: 'On-Premises' },
            { value: 'aws_rds', label: 'AWS (RDS)' },
            { value: 'azure_sql', label: 'Azure (SQL DB / MI)' },
            { value: 'gcp_sql', label: 'GCP (Cloud SQL)' },
            { value: 'other_cloud', label: 'Other Cloud/VM' },
          ],
        },

        // ── 1.2 Object Inventory ──
        { name: 'tableCount', label: 'Total Tables', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'tableComplexity',
          label: 'Schema Complexity',
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
        { name: 'totalDataSize', label: 'Data Size (TB)', type: 'number', min: 0 },

        // ── 1.3 Data Structure & Features ──
        {
          name: 'dataFeatures',
          label: 'Features Used',
          type: 'checkbox-group',
          options: [
            { value: 'temp_tables', label: 'Temporary Tables' },
            { value: 'ext_tables', label: 'External Tables' },
            { value: 'm_views', label: 'Materialized Views' },
            { value: 'partitioning', label: 'Data Partitioning' },
            { value: 'clr', label: 'CLR Assemblies (.NET)' },
            { value: 'java_db', label: 'Java in DB' },
          ],
        },
        {
          name: 'indexingStrategy',
          label: 'Indexing & Partitioning',
          type: 'textarea',
          placeholder:
            'Describe clustered indexes, partitioning keys, and performance tuning strategies.',
        },
        { name: 'linkCount', label: 'Linked Servers / DB Links Count', type: 'number', min: 0, defaultValue: 0 },
        { name: 'sqlEdition', label: 'SQL Server Edition', type: 'select', options: [{ value: 'express', label: 'Express' }, { value: 'standard', label: 'Standard' }, { value: 'enterprise', label: 'Enterprise' }, { value: 'developer', label: 'Developer' }] },
        { name: 'alwaysOn', label: 'Always On Availability Groups', type: 'select', helpText: 'High availability groups configured?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
        { name: 'replicationSetup', label: 'Replication Topology', type: 'textarea', helpText: 'Describe transactional/merge replication if any' },
        { name: 'clrAssemblies', label: 'CLR Assemblies', type: 'number', min: 0, helpText: 'Count of .NET CLR assemblies deployed in database' },
      ],
    },

    // ── 2. Compute, Logic & ETL ─────────────────────────────────────────
    {
      id: 'compute-logic-etl',
      title: '2. Compute, Logic & ETL',
      subtitle: 'Stored procedures, functions, ETL packages, and external scripts.',
      canMarkNA: true,
      fields: [
        // ── 2.1 Stored Procedures & Logic ──
        { name: 'spCount', label: 'Stored Procedures', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'spComplexity',
          label: 'Procedural Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        { name: 'udfCount', label: 'User-Defined Functions', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'udfComplexity',
          label: 'Function Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        { name: 'triggerCount', label: 'Triggers', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'spDetails',
          label: 'SP/Trigger Details',
          type: 'text',
          placeholder: 'Dynamic SQL, Transaction Control?',
        },

        // ── 2.2 Data Loading & ETL ──
        { name: 'etlCount', label: 'ETL Packages (SSIS/Other)', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'etlComplexity',
          label: 'ETL Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        {
          name: 'ingestionMethods',
          label: 'Ingestion Methods',
          type: 'checkbox-group',
          options: [
            { value: 'log_shipping', label: 'Log Shipping/Replication' },
            { value: 'bulk_insert', label: 'Bulk Insert/BCP' },
            { value: 'cdc', label: 'CDC (Change Data Capture)' },
            { value: 'ssis', label: 'SSIS/Integration Services' },
          ],
        },
        {
          name: 'ssisPackages',
          label: 'SSIS/ETL Details',
          type: 'textarea',
          placeholder:
            'Describe complexity of SSIS packages (Script tasks, custom components).',
        },

        // ── 2.3 External Scripts ──
        { name: 'scriptCount', label: 'External Scripts (.bat/ps1)', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'scriptComplexity',
          label: 'Script Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 2,
        },
        {
          name: 'sqlScripts',
          label: 'Script Details',
          type: 'textarea',
          placeholder:
            'Describe reliance on external batch, PowerShell, or shell scripts.',
        },
      ],
    },

    // ── 3. Orchestration & Infrastructure ───────────────────────────────
    {
      id: 'orchestration-infra',
      title: '3. Orchestration & Infrastructure',
      subtitle: 'Job scheduling, orchestration methods, and server infrastructure.',
      canMarkNA: true,
      fields: [
        // ── 3.1 Job Scheduling ──
        { name: 'jobCount', label: 'Scheduled Jobs (Agent)', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'jobComplexity',
          label: 'Job Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        {
          name: 'orchestration',
          label: 'Orchestration Methods',
          type: 'checkbox-group',
          options: [
            { value: 'db_jobs', label: 'Database Jobs (Agent)' },
            { value: 'airflow', label: 'External (Airflow)' },
            { value: 'third_party', label: '3rd Party (Control-M, Autosys)' },
          ],
        },

        // ── 3.2 Server Infrastructure ──
        { name: 'serverCount', label: 'Server Count', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'serverSpecs',
          label: 'Specs (Avg)',
          type: 'text',
          placeholder: 'vCores, RAM...',
        },
        {
          name: 'instanceUsage',
          label: 'Instance Usage',
          type: 'textarea',
          placeholder: 'HA/DR setup, OLTP vs OLAP separation.',
        },
      ],
    },

    // ── 4. Security & Governance ────────────────────────────────────────
    {
      id: 'security-governance',
      title: '4. Security & Governance',
      canMarkNA: true,
      fields: [
        {
          name: 'accessManagement',
          label: 'User & Role Management',
          type: 'textarea',
          placeholder: 'Active Directory integration, Windows Auth, Mixed Mode?',
        },
        {
          name: 'secFeatures',
          label: 'Security Features',
          type: 'checkbox-group',
          options: [
            { value: 'rls', label: 'Row-Level Security' },
            { value: 'masking', label: 'Dynamic Masking' },
            { value: 'tde', label: 'TDE (Transparent Encryption)' },
          ],
        },
      ],
    },

    // ── 5. Cost & Priorities ────────────────────────────────────────────
    {
      id: 'cost-priorities',
      title: '5. Cost & Priorities',
      canMarkNA: true,
      fields: [
        { name: 'totalSpend', label: 'Annual Licensing Cost ($)', type: 'number', min: 0 },
        { name: 'servicesBudget', label: 'Services Budget ($)', type: 'number', min: 0 },
        {
          name: 'jobSLAs',
          label: 'Critical SLAs',
          type: 'textarea',
          placeholder: 'Time windows for batch processing.',
        },
      ],
    },

    // ── 6. Target State ─────────────────────────────────────────────────
    {
      id: 'target-state',
      title: '6. Target State',
      canMarkNA: true,
      fields: [
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
          ],
        },
        { name: 'downtimeAcceptable', label: 'Acceptable Downtime Window', type: 'select', helpText: 'Maximum acceptable downtime during cutover', options: [{ value: 'zero', label: 'Zero downtime' }, { value: 'minimal', label: 'Minimal (< 1 hour)' }, { value: 'moderate', label: 'Moderate (< 4 hours)' }, { value: 'flexible', label: 'Flexible' }] },
        { name: 'dataRetentionYears', label: 'Data Retention Requirement', type: 'number', min: 0, unit: 'years', helpText: 'How many years of historical data must be migrated?' },
        { name: 'disasterRecovery', label: 'Disaster Recovery Strategy', type: 'select', helpText: 'Target DR architecture post-migration', options: [{ value: 'active-active', label: 'Active-Active' }, { value: 'active-passive', label: 'Active-Passive' }, { value: 'backup-only', label: 'Backup Only' }, { value: 'none', label: 'None' }] },
      ],
    },

    // ── Data Quality & Readiness ──────────────────────────────────────────
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

    // ── Overall Complexity Assessment ───────────────────────────────────
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
