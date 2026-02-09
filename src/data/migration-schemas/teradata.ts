import type { MigrationSchema } from '@/types/migration';

export const teradataSchema: MigrationSchema = {
  platform: 'teradata',
  title: 'Teradata to Databricks Migration Assessment',
  subtitle:
    'Inventory your Teradata appliances, BTEQ scripts, and workloads to generate a precise ROM estimate.',
  brandColor: '#F37421',
  romConfig: {
    objectCountFields: ['tableCount', 'viewCount', 'macroCount', 'spCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 3, medium: 10, complex: 28, veryComplex: 65 },
    hourlyRate: { low: 170, high: 270 },
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
        { name: 'timeline', label: 'Timeline Expectations', type: 'text', placeholder: 'e.g., Q2 2025' },
        { name: 'contactEmail', label: 'Contact Email', type: 'email', required: true },
        {
          name: 'businessDriver',
          label: 'Business Driver for Migration',
          type: 'textarea',
          placeholder: 'e.g., Cost reduction, appliance retirement, performance...',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  1. Current Teradata Environment                                   */
    /* ------------------------------------------------------------------ */
    {
      id: 'td-environment',
      title: '1. Current Teradata Environment',
      subtitle: 'Detail your Teradata data warehouse footprint.',
      canMarkNA: true,
      fields: [
        /* --- 1.1 System Details --- */
        {
          name: 'teradataVersion',
          label: 'Teradata Version',
          type: 'text',
          placeholder: 'e.g., 16.20, Vantage',
        },
        {
          name: 'deploymentType',
          label: 'Deployment Type',
          type: 'select',
          options: [
            { value: 'on-prem', label: 'On-Premise Appliance' },
            { value: 'cloud', label: 'Cloud (IntelliCloud/Vantage)' },
            { value: 'vmware', label: 'VMware' },
          ],
        },

        /* --- 1.2 Object Inventory --- */
        { name: 'tableCount', label: 'Total Tables', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'tableComplexity',
          label: 'Schema Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
          placeholder: 'Simple | Mixed | Heavy PPI/Skew',
        },
        { name: 'viewCount', label: 'Total Views', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'viewComplexity',
          label: 'View Logic Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
          placeholder: '1:1 | Joins/Aggs | Recursive/Complex',
        },
        { name: 'databaseCount', label: 'Databases', type: 'number', min: 0, defaultValue: 0 },
        { name: 'macroCount', label: 'Macros', type: 'number', min: 0, defaultValue: 0 },
        { name: 'spCount', label: 'Stored Procedures', type: 'number', min: 0, defaultValue: 0 },
        { name: 'totalDataSize', label: 'Total Data Size (TB)', type: 'number', min: 0 },

        /* --- 1.3 Advanced Optimization --- */
        {
          name: 'indexTypes',
          label: 'Index Types',
          type: 'checkbox-group',
          options: [
            { value: 'upi', label: 'Unique Primary (UPI)' },
            { value: 'nupi', label: 'Non-Unique (NUPI)' },
            { value: 'usi', label: 'Unique Secondary (USI)' },
            { value: 'nusi', label: 'Non-Unique Secondary' },
            { value: 'join', label: 'Join / Hash Indexes' },
          ],
        },
        {
          name: 'partitioningStrategy',
          label: 'Partitioning (PPI)',
          type: 'textarea',
          placeholder: 'Describe partitioning strategies (e.g., Multi-level PPI).',
        },
        {
          name: 'skewFactor',
          label: 'Data Skew',
          type: 'textarea',
          placeholder: 'Known skew issues on large tables?',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  2. Scripts & Workloads                                            */
    /* ------------------------------------------------------------------ */
    {
      id: 'scripts-workloads',
      title: '2. Scripts & Workloads',
      canMarkNA: true,
      fields: [
        /* --- 2.1 Utilities & Scripts --- */
        { name: 'bteqCount', label: 'BTEQ Scripts', type: 'number', min: 0, defaultValue: 0 },
        { name: 'fastloadCount', label: 'FastLoad/MultiLoad', type: 'number', min: 0, defaultValue: 0 },
        { name: 'tptCount', label: 'TPT Scripts', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'scriptComplexity',
          label: 'Script Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
          placeholder: 'Simple SQL | Mixed | Heavy Logic/Loops',
        },

        /* --- 2.2 Procedural Logic --- */
        {
          name: 'procComplexity',
          label: 'Procedural Logic Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
          placeholder: 'SQL Wrapper | Mixed | Cursors/Dyn. SQL',
        },

        /* --- 2.3 Queries & BI --- */
        { name: 'avgQueriesPerDay', label: 'Avg Queries/Day', type: 'number', min: 0, defaultValue: 0 },
        { name: 'concurrentUsers', label: 'Concurrent Users', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'biTools',
          label: 'BI Tools',
          type: 'textarea',
          placeholder: 'Tableau, Power BI, MicroStrategy...',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  3. Orchestration                                                  */
    /* ------------------------------------------------------------------ */
    {
      id: 'orchestration',
      title: '3. Orchestration',
      canMarkNA: true,
      fields: [
        { name: 'dagCount', label: 'Workflows / Jobs', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'orchComplexity',
          label: 'Orchestration Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 2,
          placeholder: 'Time-based | Mixed | Dependency Chains',
        },
        {
          name: 'workflowTools',
          label: 'Scheduler',
          type: 'textarea',
          placeholder: 'Autosys, Control-M, Airflow...',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  4. Governance & Operations                                        */
    /* ------------------------------------------------------------------ */
    {
      id: 'governance',
      title: '4. Governance & Operations',
      canMarkNA: true,
      fields: [
        {
          name: 'accessManagement',
          label: 'Access Management',
          type: 'textarea',
          placeholder: 'LDAP, AD, Roles/Profiles?',
        },
        {
          name: 'secFeatures',
          label: 'Security',
          type: 'checkbox-group',
          options: [
            { value: 'rls', label: 'Row-Level Security' },
            { value: 'masking', label: 'Column Masking' },
          ],
        },
        {
          name: 'workloadManagement',
          label: 'Workload Management (TASM)',
          type: 'textarea',
          placeholder: 'Describe TASM rules, priority schedulers.',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  5. Target State                                                   */
    /* ------------------------------------------------------------------ */
    {
      id: 'target-state',
      title: '5. Target State',
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
          name: 'migrationStrategy',
          label: 'Migration Strategy',
          type: 'select',
          options: [
            { value: 'replatform', label: 'Replatform (DLT/Auto-Loader)' },
            { value: 'refactor', label: 'Refactor (Spark)' },
          ],
        },
        { name: 'totalSpend', label: 'Annual Spend ($)', type: 'number', min: 0 },
        { name: 'servicesBudget', label: 'Migration Budget ($)', type: 'number', min: 0 },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Overall Complexity Assessment                                     */
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
