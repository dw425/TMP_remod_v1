import type { MigrationSchema } from '@/types/migration';

export const sapSchema: MigrationSchema = {
  platform: 'sap',
  title: 'SAP to Databricks Migration Assessment',
  subtitle:
    'Inventory your SAP ERP, BW, and HANA landscapes to generate a precise ROM estimate and migration roadmap.',
  brandColor: '#008FD3',
  romConfig: {
    objectCountFields: ['tableCount', 'bwObjectCount', 'viewCount', 'abapCount', 'etlCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 4, medium: 12, complex: 32, veryComplex: 80 },
    hourlyRate: { low: 175, high: 275 },
  },
  sections: [
    /* ------------------------------------------------------------------ */
    /*  Executive Summary                                                 */
    /* ------------------------------------------------------------------ */
    {
      id: 'exec',
      title: 'Executive Summary',
      subtitle: 'High-level project information and business context.',
      canMarkNA: true,
      fields: [
        { name: 'projectName', label: 'Project Name', type: 'text', required: true },
        {
          name: 'stakeholder',
          label: 'Primary Stakeholder',
          type: 'text',
          required: true,
        },
        {
          name: 'timeline',
          label: 'Timeline Expectations',
          type: 'text',
          placeholder: 'e.g., Q3 2025',
        },
        {
          name: 'contactEmail',
          label: 'Contact Email',
          type: 'email',
          required: true,
        },
        {
          name: 'businessDriver',
          label: 'Business Driver for Migration',
          type: 'textarea',
          placeholder:
            'e.g., S/4HANA upgrade, BW retirement, cost reduction, real-time analytics...',
        },
        { name: 'organizationName', label: 'Organization / Company Name', type: 'text', required: true, helpText: 'Legal entity or business name' },
        { name: 'department', label: 'Department or Business Unit', type: 'text', helpText: 'Primary department sponsoring this migration' },
        { name: 'migrationUrgency', label: 'Migration Urgency', type: 'select', helpText: 'How soon does this migration need to start?', options: [{ value: 'critical', label: 'Critical (< 3 months)' }, { value: 'high', label: 'High (3-6 months)' }, { value: 'normal', label: 'Normal (6-12 months)' }, { value: 'planning', label: 'Planning (12+ months)' }] },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  1. Current SAP Landscape                                          */
    /* ------------------------------------------------------------------ */
    {
      id: 'source-landscape',
      title: '1. Current SAP Landscape',
      subtitle: 'Describe your current SAP environment and data footprint.',
      canMarkNA: true,
      fields: [
        /* --- 1.1 System Architecture --- */
        {
          name: 'sapSystem',
          label: 'Core System',
          type: 'select',
          options: [
            { value: 'ecc', label: 'SAP ECC 6.0' },
            { value: 's4', label: 'SAP S/4HANA' },
            { value: 'bw', label: 'SAP BW (NetWeaver)' },
            { value: 'bw4', label: 'SAP BW/4HANA' },
            { value: 'crm', label: 'SAP CRM/SRM' },
          ],
        },
        {
          name: 'databaseType',
          label: 'Underlying Database',
          type: 'text',
          placeholder: 'e.g., Oracle, HANA, DB2, SQL Server',
        },
        {
          name: 'modules',
          label: 'Modules in Scope',
          type: 'checkbox-group',
          options: [
            { value: 'fi_co', label: 'FI/CO (Finance)' },
            { value: 'sd', label: 'SD (Sales & Dist)' },
            { value: 'mm', label: 'MM (Materials)' },
            { value: 'pp', label: 'PP (Production)' },
            { value: 'hr', label: 'HR/HCM' },
            { value: 'bw', label: 'BW/BI Reporting' },
          ],
        },

        /* --- 1.2 Data Objects (Tables & BW) --- */
        {
          name: 'tableCount',
          label: 'Total Tables',
          type: 'number',
          min: 0,
          defaultValue: 0,
          placeholder: 'Transparent, Cluster, & Pool Tables',
        },
        {
          name: 'tableComplexity',
          label: 'Customization Level (Z-Tables)',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        {
          name: 'bwObjectCount',
          label: 'BW Objects (DSOs/Cubes)',
          type: 'number',
          min: 0,
          defaultValue: 0,
          placeholder: 'InfoCubes, DSOs, ADSOs',
        },
        {
          name: 'bwComplexity',
          label: 'BW Model Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        {
          name: 'totalDataSize',
          label: 'Total Data Volume (TB)',
          type: 'number',
          min: 0,
        },
        { name: 'sapVersion', label: 'Exact SAP Version / SP Level', type: 'text', helpText: 'e.g., ECC 6.0 EHP8 SP12' },
        { name: 'numberOfUsers', label: 'Named SAP Users', type: 'number', min: 0, helpText: 'Total licensed named users' },
        { name: 'customTransactions', label: 'Custom Z-Transactions', type: 'number', min: 0, helpText: 'Number of custom Z-code transactions' },
        { name: 'idocInterfaces', label: 'Active IDoc Interfaces', type: 'number', min: 0, helpText: 'Count of active IDoc message types' },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  2. Views, Code & Logic (ABAP/HANA)                                */
    /* ------------------------------------------------------------------ */
    {
      id: 'views-code-logic',
      title: '2. Views, Code & Logic (ABAP/HANA)',
      subtitle: 'Detail your HANA calculation views, CDS layer, and ABAP codebase.',
      canMarkNA: true,
      fields: [
        /* --- 2.1 Views & Virtual Models --- */
        {
          name: 'viewCount',
          label: 'HANA/CDS Views',
          type: 'number',
          min: 0,
          defaultValue: 0,
          placeholder: 'Calculation Views, CDS Views',
        },
        {
          name: 'viewComplexity',
          label: 'View Logic Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },

        /* --- 2.2 ABAP & Procedural Logic --- */
        {
          name: 'abapCount',
          label: 'ABAP Reports/Funcs',
          type: 'number',
          min: 0,
          defaultValue: 0,
          placeholder: 'Z-Programs, Function Modules',
        },
        {
          name: 'abapComplexity',
          label: 'ABAP Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        {
          name: 'logicFeatures',
          label: 'Logic Details',
          type: 'checkbox-group',
          options: [
            { value: 'amdp', label: 'AMDP (ABAP Managed Database Procedures)' },
            { value: 'bapi', label: 'BAPIs Custom Usage' },
            { value: 'hana_proc', label: 'Native HANA Stored Procedures' },
            { value: 'enhancements', label: 'User Exits / Enhancements' },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  3. Integration & ETL                                              */
    /* ------------------------------------------------------------------ */
    {
      id: 'etl',
      title: '3. Integration & ETL',
      subtitle: 'Describe existing data pipelines, integration tools, and dependencies.',
      canMarkNA: true,
      fields: [
        /* --- 3.1 Data Movement Tools --- */
        {
          name: 'etlCount',
          label: 'ETL Jobs / Chains',
          type: 'number',
          min: 0,
          defaultValue: 0,
          placeholder: 'BODS Jobs, BW Process Chains, SLT',
        },
        {
          name: 'etlComplexity',
          label: 'Integration Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        {
          name: 'etlTools',
          label: 'Tools in Use',
          type: 'checkbox-group',
          options: [
            { value: 'bods', label: 'SAP Data Services (BODS)' },
            { value: 'slt', label: 'SLT (Landscape Transformation)' },
            { value: 'sdi', label: 'HANA SDI / SDA' },
            { value: 'bw_extractors', label: 'Standard BW Extractors' },
            { value: 'po', label: 'SAP PO/PI' },
          ],
        },

        /* --- 3.2 Dependencies --- */
        {
          name: 'upstream',
          label: 'Source Systems (Upstream)',
          type: 'textarea',
          placeholder: 'Other SAP systems, Non-SAP DBs, Flat files...',
        },
        {
          name: 'downstream',
          label: 'Downstream Consumers',
          type: 'textarea',
          placeholder: 'BOBJ, Analytics Cloud, Tableau, PowerBI...',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  4. Security & Governance                                          */
    /* ------------------------------------------------------------------ */
    {
      id: 'security-governance',
      title: '4. Security & Governance',
      subtitle: 'Describe your authorization model and role structure.',
      canMarkNA: true,
      fields: [
        {
          name: 'analysisAuth',
          label: 'Analysis Authorizations',
          type: 'textarea',
          placeholder:
            'Describe complexity of BW/HANA analysis authorizations (Row-level security).',
        },
        {
          name: 'roleHierarchy',
          label: 'Role Hierarchy',
          type: 'textarea',
          placeholder: 'Derived roles, composite roles, structural authorizations?',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  5. Target State & Priorities                                      */
    /* ------------------------------------------------------------------ */
    {
      id: 'target-state',
      title: '5. Target State & Priorities',
      subtitle: 'Define your target Databricks architecture, strategy, and budget.',
      canMarkNA: true,
      fields: [
        /* --- 5.1 Architecture --- */
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
          label: 'Strategy',
          type: 'select',
          options: [
            { value: 'replicate', label: 'Replicate (Cortex/Fivetran -> Datalake)' },
            { value: 'federate', label: 'Federate (Query SAP directly)' },
            { value: 'migrate', label: 'Full Migration (Decommission SAP BW)' },
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
            { value: 'sap_connector', label: 'SAP Connectors (Spark)' },
          ],
        },

        /* --- 5.2 Budget & Costs --- */
        {
          name: 'totalSpend',
          label: 'Current Annual SAP Spend ($)',
          type: 'number',
          min: 0,
        },
        {
          name: 'servicesBudget',
          label: 'Services Budget ($)',
          type: 'number',
          min: 0,
        },
        { name: 'downtimeAcceptable', label: 'Acceptable Downtime Window', type: 'select', helpText: 'Maximum acceptable downtime during cutover', options: [{ value: 'zero', label: 'Zero downtime' }, { value: 'minimal', label: 'Minimal (< 1 hour)' }, { value: 'moderate', label: 'Moderate (< 4 hours)' }, { value: 'flexible', label: 'Flexible' }] },
        { name: 'dataRetentionYears', label: 'Data Retention Requirement', type: 'number', min: 0, unit: 'years', helpText: 'How many years of historical data must be migrated?' },
        { name: 'disasterRecovery', label: 'Disaster Recovery Strategy', type: 'select', helpText: 'Target DR architecture post-migration', options: [{ value: 'active-active', label: 'Active-Active' }, { value: 'active-passive', label: 'Active-Passive' }, { value: 'backup-only', label: 'Backup Only' }, { value: 'none', label: 'None' }] },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Data Quality & Readiness                                          */
    /* ------------------------------------------------------------------ */
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
        { name: 'completionDate', label: 'Date', type: 'date', required: true },
      ],
    },
  ],
};
