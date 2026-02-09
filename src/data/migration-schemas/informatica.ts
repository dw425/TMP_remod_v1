import type { MigrationSchema } from '@/types/migration';

export const informaticaSchema: MigrationSchema = {
  platform: 'informatica',
  title: 'Informatica to Databricks Migration Assessment',
  subtitle:
    'Inventory your Informatica PowerCenter estate to generate a precise ROM estimate and migration roadmap.',
  brandColor: '#FF4D00',
  romConfig: {
    objectCountFields: ['mappingCount', 'workflowCount', 'sessionCount', 'mappletCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 3, medium: 10, complex: 30, veryComplex: 72 },
    hourlyRate: { low: 160, high: 260 },
  },
  sections: [
    /* ------------------------------------------------------------------ */
    /*  Executive Summary                                                 */
    /* ------------------------------------------------------------------ */
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
          placeholder: 'e.g., Q4 2025',
        },
        { name: 'contactEmail', label: 'Contact Email', type: 'email', required: true },
        {
          name: 'businessDriver',
          label: 'Business Driver for Migration',
          type: 'textarea',
          placeholder:
            'e.g., Reduce licensing costs, modernize data platform, enable AI/ML...',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  1. Current Informatica Estate                                     */
    /* ------------------------------------------------------------------ */
    {
      id: 'estate',
      title: '1. Current Informatica Estate',
      subtitle: '1.1 System Stats',
      canMarkNA: true,
      fields: [
        {
          name: 'powerCenterVersion',
          label: 'PowerCenter Version',
          type: 'text',
          placeholder: 'e.g., 10.4, 10.5',
        },
        {
          name: 'repoCount',
          label: 'Number of Repositories',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'serverSetup',
          label: 'Server Setup',
          type: 'textarea',
          placeholder:
            'Describe the server environment (OS, on-premise vs. cloud, high availability, grid)...',
        },
      ],
    },
    {
      id: 'dataArchitecture',
      title: '1.2 Data Architecture',
      canMarkNA: true,
      fields: [
        {
          name: 'sourceSystems',
          label: 'Source Systems',
          type: 'textarea',
          placeholder: 'Oracle, SAP, Mainframe, Flat Files...',
        },
        {
          name: 'targetSystems',
          label: 'Target Systems',
          type: 'textarea',
          placeholder: 'Snowflake, Teradata, Oracle...',
        },
        {
          name: 'tableStructures',
          label: 'Common Table Structures & Features',
          type: 'textarea',
          placeholder:
            'Describe typical data models (SCD Type 1/2, Fact/Dim). Do jobs rely on specific DB features like Partitioning, Materialized Views, or Stored Procs?',
        },
        {
          name: 'dbFeatures',
          label: 'DB Performance Features',
          type: 'textarea',
          placeholder: 'Reliance on partitioning, indexing strategies, etc.',
        },
      ],
    },
    {
      id: 'workflows',
      title: '1.3 Workflows & Orchestration',
      canMarkNA: true,
      fields: [
        {
          name: 'workflowCount',
          label: 'Total Workflows',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'workflowComplexity',
          label: 'Workflow Complexity (1 = Simple Linear, 5 = Complex Dependencies)',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        {
          name: 'sessionCount',
          label: 'Total Sessions',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'workletCount',
          label: 'Reusable Worklets',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'schedulingTool',
          label: 'Scheduling Tool',
          type: 'text',
          placeholder: 'Autosys, Control-M',
        },
        {
          name: 'recoverySla',
          label: 'Recovery & SLAs',
          type: 'textarea',
          placeholder:
            'Describe critical SLAs (e.g. 6AM cutoff) and typical failure recovery strategies.',
        },
        {
          name: 'wfLogicComplex',
          label: 'Workflow Logic Complexity',
          type: 'textarea',
          placeholder:
            'Describe conditional branching, event waits, or timer dependencies.',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  2. Mappings & Transformations                                     */
    /* ------------------------------------------------------------------ */
    {
      id: 'mappingInventory',
      title: '2. Mappings & Transformations',
      subtitle: '2.1 Mapping Inventory',
      canMarkNA: true,
      fields: [
        {
          name: 'mappingCount',
          label: 'Total Mappings',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'mappingComplexity',
          label: 'Transformation Complexity (1 = 1:1 Passthrough, 5 = Heavy Transformation)',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
      ],
    },
    {
      id: 'transformationTypes',
      title: '2.2 Critical Transformation Types',
      subtitle: 'Check all that are frequently used. These impact conversion automation rates.',
      canMarkNA: true,
      fields: [
        {
          name: 'transforms',
          label: 'Transformation Types Used',
          type: 'checkbox-group',
          options: [
            { value: 'aggregator', label: 'Aggregator' },
            { value: 'expression', label: 'Expression' },
            { value: 'filter', label: 'Filter' },
            { value: 'joiner', label: 'Joiner' },
            { value: 'lookup', label: 'Lookup' },
            { value: 'normalizer', label: 'Normalizer' },
            { value: 'rank', label: 'Rank' },
            { value: 'router', label: 'Router' },
            { value: 'sequence', label: 'Sequence Gen' },
            { value: 'sorter', label: 'Sorter' },
            { value: 'sq', label: 'Source Qualifier' },
            { value: 'union', label: 'Union' },
            { value: 'update', label: 'Update Strategy' },
            { value: 'xml', label: 'XML Parser' },
            { value: 'stored_proc', label: 'Stored Proc' },
          ],
        },
        {
          name: 'mappletCount',
          label: 'Mapplets Count',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'udfCount',
          label: 'User Defined Functions (UDFs)',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'lookupComplexity',
          label: 'Lookup Complexity',
          type: 'textarea',
          placeholder:
            'Describe lookup usage: persistent caching, dynamic lookups, SQL overrides?',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  3. Operational Dependencies                                       */
    /* ------------------------------------------------------------------ */
    {
      id: 'scriptsCommands',
      title: '3. Operational Dependencies',
      subtitle: '3.1 Scripts & Commands',
      canMarkNA: true,
      fields: [
        {
          name: 'scriptCount',
          label: 'Total Scripts / Cmds',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'scriptComplexity',
          label: 'Script Complexity (1 = File Movers, 5 = Data Manipulation)',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
      ],
    },
    {
      id: 'sessionConfigs',
      title: '3.2 Advanced Session Configs',
      canMarkNA: true,
      fields: [
        {
          name: 'sessionFeatures',
          label: 'Session Features',
          type: 'checkbox-group',
          options: [
            { value: 'partitioning', label: 'Session Partitioning' },
            { value: 'pushdown', label: 'Pushdown Optimization (PDO)' },
            { value: 'target_load_type', label: 'Bulk Load Mode' },
            { value: 'error_handling', label: 'Custom Error Handling' },
          ],
        },
        {
          name: 'parameterFiles',
          label: 'Parameter Files Strategy',
          type: 'textarea',
          placeholder:
            'Describe the extent and complexity of parameter file usage across workflows.',
        },
        {
          name: 'prepostCommands',
          label: 'Pre/Post-Session Commands',
          type: 'textarea',
          placeholder:
            'Are shell scripts used for file cleanup, archiving, or triggering external events?',
        },
      ],
    },
    {
      id: 'sourceTargetScope',
      title: '3.3 Source & Target Scope',
      canMarkNA: true,
      fields: [
        {
          name: 'tableCount',
          label: 'Total Tables Involved',
          type: 'number',
          min: 0,
          defaultValue: 0,
          placeholder: 'Sum of Source and Target Tables',
        },
        {
          name: 'tableComplexity',
          label: 'Schema Complexity (1 = Wide/Flat, 5 = Highly Normalized)',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 2,
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  4. Target Architecture & Priorities                               */
    /* ------------------------------------------------------------------ */
    {
      id: 'targetArchitecture',
      title: '4. Target Architecture & Priorities',
      subtitle: '4.1 Target Cloud & Strategy',
      canMarkNA: true,
      fields: [
        {
          name: 'cloudProvider',
          label: 'Target Cloud Provider',
          type: 'select',
          options: [
            { value: 'aws', label: 'AWS' },
            { value: 'azure', label: 'Azure' },
            { value: 'gcp', label: 'GCP' },
          ],
        },
        {
          name: 'migrationApproach',
          label: 'Preferred Approach',
          type: 'select',
          options: [
            { value: 'replatform', label: 'Convert to Databricks SQL / DLT (Auto-conversion)' },
            { value: 'refactor', label: 'Redesign for Spark/PySpark (Optimization)' },
            { value: 'hybrid', label: 'Hybrid (Convert Simple, Refactor Complex)' },
          ],
        },
        {
          name: 'dbxFeatures',
          label: 'Databricks Features of Interest',
          type: 'checkbox-group',
          options: [
            { value: 'dlt', label: 'Delta Live Tables (DLT)' },
            { value: 'workflows', label: 'Databricks Workflows' },
            { value: 'autoloader', label: 'Auto Loader' },
            { value: 'unity', label: 'Unity Catalog' },
            { value: 'dbsql', label: 'Databricks SQL' },
          ],
        },
        {
          name: 'criticalWorkloads',
          label: 'Critical Workloads (Phase 1)',
          type: 'textarea',
          placeholder:
            'List workloads that must migrate first (high value, low complexity, or urgent deadline)...',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  5. Cost & Success Criteria                                        */
    /* ------------------------------------------------------------------ */
    {
      id: 'budget',
      title: '5. Cost & Success Criteria',
      subtitle: '5.1 Budgeting',
      canMarkNA: true,
      fields: [
        {
          name: 'currentAnnualSpend',
          label: 'Current Informatica Spend ($)',
          type: 'number',
          min: 0,
        },
        {
          name: 'migrationBudget',
          label: 'Migration Services Budget ($)',
          type: 'number',
          min: 0,
        },
        {
          name: 'costSavingsTarget',
          label: 'Cost Savings Target (%)',
          type: 'number',
          min: 0,
        },
        {
          name: 'performanceTarget',
          label: 'Performance Improvement (%)',
          type: 'number',
          min: 0,
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Overall Complexity (kept from existing schema)                     */
    /* ------------------------------------------------------------------ */
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

    /* ------------------------------------------------------------------ */
    /*  Source & Target Connections (kept from existing schema)            */
    /* ------------------------------------------------------------------ */
    {
      id: 'connections',
      title: 'Source & Target Connections',
      canMarkNA: true,
      fields: [
        { name: 'sourceConnectionCount', label: 'Source Connections', type: 'number', min: 0 },
        { name: 'targetConnectionCount', label: 'Target Connections', type: 'number', min: 0 },
        {
          name: 'connectionTypes',
          label: 'Connection Types',
          type: 'checkbox-group',
          options: [
            { value: 'oracle', label: 'Oracle' },
            { value: 'sqlserver', label: 'SQL Server' },
            { value: 'files', label: 'Flat Files' },
            { value: 's3', label: 'S3 / Cloud Storage' },
            { value: 'salesforce', label: 'Salesforce' },
            { value: 'api', label: 'REST/SOAP APIs' },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Form Completion Details                                           */
    /* ------------------------------------------------------------------ */
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
