import type { MigrationSchema } from '@/types/migration';

export const oracleSchema: MigrationSchema = {
  platform: 'oracle',
  title: 'Oracle to Databricks Migration Assessment',
  subtitle:
    'Assess your Oracle database environment, PL/SQL logic, and integration patterns to generate a precise ROM estimate.',
  brandColor: '#C74634',
  romConfig: {
    objectCountFields: ['tableCount', 'viewCount', 'plsqlObjectCount', 'pipelineCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 3, medium: 10, complex: 28, veryComplex: 70 },
    hourlyRate: { low: 165, high: 265 },
  },
  sections: [
    /* ── Executive Summary ─────────────────────────────────────────────── */
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
            'e.g., License renewal, Exadata retirement, move to Lakehouse...',
        },
        { name: 'organizationName', label: 'Organization / Company Name', type: 'text', required: true, helpText: 'Legal entity or business name' },
        { name: 'department', label: 'Department or Business Unit', type: 'text', helpText: 'Primary department sponsoring this migration' },
        { name: 'migrationUrgency', label: 'Migration Urgency', type: 'select', helpText: 'How soon does this migration need to start?', options: [{ value: 'critical', label: 'Critical (< 3 months)' }, { value: 'high', label: 'High (3-6 months)' }, { value: 'normal', label: 'Normal (6-12 months)' }, { value: 'planning', label: 'Planning (12+ months)' }] },
      ],
    },

    /* ── 1. Current Oracle Environment ─────────────────────────────────── */
    {
      id: 'oracle-environment',
      title: '1. Current Oracle Environment',
      subtitle: 'Describe your Oracle database environment, object inventory, and data features.',
      canMarkNA: true,
      fields: [
        /* — 1.1 System Details — */
        {
          name: 'oracleVersion',
          label: 'Oracle Version',
          type: 'text',
          placeholder: 'e.g., 11g, 12c, 19c',
        },
        {
          name: 'oracleEdition',
          label: 'Edition & Hosting',
          type: 'text',
          placeholder: 'e.g., Enterprise Edition, RAC, Exadata, RDS',
        },
        {
          name: 'oracleOptions',
          label: 'Advanced Options in Use',
          type: 'checkbox-group',
          options: [
            { value: 'rac', label: 'Real Application Clusters (RAC)' },
            { value: 'partitioning', label: 'Partitioning' },
            { value: 'advanced_compression', label: 'Advanced Compression' },
            { value: 'multitenant', label: 'Multitenant (CDB/PDB)' },
            { value: 'golden_gate', label: 'GoldenGate' },
          ],
        },

        /* — 1.2 Database Object Inventory — */
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
        { name: 'schemaCount', label: 'Schemas/Users', type: 'number', min: 0, defaultValue: 0 },
        { name: 'indexCount', label: 'Indexes', type: 'number', min: 0, defaultValue: 0 },
        { name: 'mviewCount', label: 'Materialized Views', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'totalDataSize',
          label: 'Total Data Size (TB)',
          type: 'number',
          min: 0,
        },

        /* — 1.3 Data Features — */
        {
          name: 'dataTypes',
          label: 'Data Types',
          type: 'textarea',
          placeholder:
            'Note usage of CLOB, BLOB, XMLType, JSON, Spatial, or User Defined Types (UDTs).',
        },
        {
          name: 'dbLinks',
          label: 'DB Links',
          type: 'textarea',
          placeholder:
            'Describe dependencies on DB Links to other Oracle instances or external systems.',
        },
        { name: 'oracleEditionSelect', label: 'Oracle Edition', type: 'select', options: [{ value: 'standard', label: 'Standard' }, { value: 'enterprise', label: 'Enterprise' }, { value: 'xe', label: 'Express (XE)' }] },
        { name: 'realApplicationClusters', label: 'RAC Enabled', type: 'select', helpText: 'Real Application Clusters in use?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
        { name: 'dataGuard', label: 'Data Guard', type: 'select', helpText: 'Oracle Data Guard configured?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
        { name: 'flashbackEnabled', label: 'Flashback Enabled', type: 'select', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
      ],
    },

    /* ── 2. PL/SQL & Logic ─────────────────────────────────────────────── */
    {
      id: 'plsql',
      title: '2. PL/SQL & Logic',
      subtitle: 'Stored procedures, packages, functions, triggers, and advanced logic patterns.',
      canMarkNA: true,
      fields: [
        /* — 2.1 Stored Procedures & Packages — */
        {
          name: 'plsqlObjectCount',
          label: 'Procedures & Packages',
          type: 'number',
          min: 0,
          defaultValue: 0,
          placeholder: 'Count standalone Procs + Package Bodies',
        },
        {
          name: 'procComplexity',
          label: 'PL/SQL Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        { name: 'funcCount', label: 'Functions', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'funcComplexity',
          label: 'Function Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        { name: 'triggerCount', label: 'Triggers', type: 'number', min: 0, defaultValue: 0 },
        { name: 'sequenceCount', label: 'Sequences', type: 'number', min: 0, defaultValue: 0 },
        { name: 'synonymCount', label: 'Synonyms', type: 'number', min: 0, defaultValue: 0 },

        /* — 2.2 Advanced Logic Patterns — */
        {
          name: 'logicPatterns',
          label: 'Logic Patterns (Check all that apply)',
          type: 'checkbox-group',
          options: [
            { value: 'dynamic_sql', label: 'Dynamic SQL (Execute Immediate)' },
            { value: 'collections', label: 'PL/SQL Tables / Arrays / Collections' },
            { value: 'utl_file', label: 'UTL_FILE / UTL_HTTP / UTL_SMTP' },
            { value: 'scheduler', label: 'DBMS_SCHEDULER / DBMS_JOB' },
            { value: 'java_stored', label: 'Java Stored Procedures' },
          ],
        },
        {
          name: 'externalTables',
          label: 'External Tables & Loading',
          type: 'textarea',
          placeholder: 'Usage of SQL*Loader, External Tables, or Oracle Data Pump.',
        },
      ],
    },

    /* ── 3. Integration & ETL ──────────────────────────────────────────── */
    {
      id: 'etl',
      title: '3. Integration & ETL',
      subtitle: 'Data movement, ETL tools, upstream/downstream dependencies.',
      canMarkNA: true,
      fields: [
        /* — 3.1 Data Movement — */
        {
          name: 'pipelineCount',
          label: 'ETL Jobs / Interfaces',
          type: 'number',
          min: 0,
          defaultValue: 0,
          placeholder: 'ODI Mappings, GoldenGate, Informatica, etc.',
        },
        {
          name: 'jobComplexity',
          label: 'Integration Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        {
          name: 'etlTools',
          label: 'ETL Tools Used',
          type: 'checkbox-group',
          options: [
            { value: 'odi', label: 'Oracle Data Integrator (ODI)' },
            { value: 'goldengate', label: 'GoldenGate' },
            { value: 'informatica', label: 'Informatica' },
            { value: 'talend', label: 'Talend' },
            { value: 'custom', label: 'Custom Scripts' },
          ],
        },

        /* — 3.2 Dependencies — */
        {
          name: 'upstream',
          label: 'Upstream Sources',
          type: 'textarea',
          placeholder: 'ERP, CRM, Mainframe, Flat Files...',
        },
        {
          name: 'downstream',
          label: 'Downstream Consumers',
          type: 'textarea',
          placeholder: 'Tableau, PowerBI, Custom Apps, Extracts...',
        },
        {
          name: 'scriptsUsage',
          label: 'Scripts (Shell/Python)',
          type: 'textarea',
          placeholder: 'Are shell scripts or Python used to orchestrate sqlplus or SQLcl?',
        },
      ],
    },

    /* ── 4. Target State & Priorities ──────────────────────────────────── */
    {
      id: 'target-state',
      title: '4. Target State & Priorities',
      subtitle: 'Target architecture, cloud provider, migration strategy, and Databricks features.',
      canMarkNA: true,
      fields: [
        /* — 4.1 Architecture — */
        {
          name: 'targetCloudProvider',
          label: 'Target Cloud',
          type: 'select',
          options: [
            { value: 'aws', label: 'AWS' },
            { value: 'azure', label: 'Azure' },
            { value: 'gcp', label: 'GCP' },
            { value: 'oci', label: 'OCI (Oracle Cloud)' },
          ],
        },
        {
          name: 'migrationStrategy',
          label: 'Strategy',
          type: 'select',
          options: [
            { value: 'replatform', label: 'Replatform (Automated Conversion to Databricks SQL)' },
            { value: 'refactor', label: 'Refactor (Rewrite PL/SQL to PySpark)' },
            { value: 'hybrid', label: 'Hybrid' },
          ],
        },
        {
          name: 'dbxFeatures',
          label: 'Databricks Features',
          type: 'checkbox-group',
          options: [
            { value: 'uc', label: 'Unity Catalog' },
            { value: 'dbsql', label: 'Databricks SQL' },
            { value: 'dlt', label: 'Delta Live Tables (DLT)' },
            { value: 'autoloader', label: 'Auto Loader' },
          ],
        },
        { name: 'downtimeAcceptable', label: 'Acceptable Downtime Window', type: 'select', helpText: 'Maximum acceptable downtime during cutover', options: [{ value: 'zero', label: 'Zero downtime' }, { value: 'minimal', label: 'Minimal (< 1 hour)' }, { value: 'moderate', label: 'Moderate (< 4 hours)' }, { value: 'flexible', label: 'Flexible' }] },
        { name: 'dataRetentionYears', label: 'Data Retention Requirement', type: 'number', min: 0, unit: 'years', helpText: 'How many years of historical data must be migrated?' },
        { name: 'disasterRecovery', label: 'Disaster Recovery Strategy', type: 'select', helpText: 'Target DR architecture post-migration', options: [{ value: 'active-active', label: 'Active-Active' }, { value: 'active-passive', label: 'Active-Passive' }, { value: 'backup-only', label: 'Backup Only' }, { value: 'none', label: 'None' }] },
      ],
    },

    /* ── 5. Cost & Success Criteria ────────────────────────────────────── */
    {
      id: 'budget',
      title: '5. Cost & Success Criteria',
      subtitle: 'Budgeting targets and key performance indicators.',
      canMarkNA: true,
      fields: [
        /* — 5.1 Budgeting — */
        { name: 'currentAnnualSpend', label: 'Current Annual Oracle Spend ($)', type: 'number', min: 0 },
        { name: 'migrationBudget', label: 'Migration Services Budget ($)', type: 'number', min: 0 },

        /* — 5.2 KPIs — */
        { name: 'costSavingsTarget', label: 'Cost Savings Target (%)', type: 'number', min: 0 },
        { name: 'performanceTarget', label: 'Performance Improvement (%)', type: 'number', min: 0 },
      ],
    },

    /* ── Data Quality & Readiness ────────────────────────────────────── */
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

    /* ── Overall Complexity Assessment ─────────────────────────────────── */
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

    /* ── Form Completion Details ───────────────────────────────────────── */
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
