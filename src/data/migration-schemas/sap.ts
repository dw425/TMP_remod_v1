import type { MigrationSchema } from '@/types/migration';

export const sapSchema: MigrationSchema = {
  platform: 'sap',
  title: 'SAP to Databricks Migration Assessment',
  subtitle:
    'Inventory your SAP ERP, BW, and HANA landscapes to generate a precise ROM estimate.',
  brandColor: '#008FD3',
  romConfig: {
    objectCountFields: ['tableCount', 'bwObjectCount', 'viewCount', 'pipelineCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 4, medium: 12, complex: 32, veryComplex: 80 },
    hourlyRate: { low: 175, high: 275 },
  },
  sections: [
    {
      id: 'exec',
      title: 'Executive Summary',
      subtitle: 'High-level project information and business context.',
      canMarkNA: false,
      fields: [
        { name: 'projectName', label: 'Project Name', type: 'text', required: true },
        { name: 'stakeholder', label: 'Key Stakeholder', type: 'text', required: true },
        {
          name: 'timeline',
          label: 'Target Timeline',
          type: 'text',
          placeholder: 'e.g., Q3 2026',
        },
        { name: 'contactEmail', label: 'Contact Email', type: 'email', required: true },
        {
          name: 'businessDriver',
          label: 'Business Driver',
          type: 'textarea',
          placeholder: 'e.g., S/4HANA upgrade, cost reduction...',
        },
      ],
    },
    {
      id: 'source-landscape',
      title: 'Source ERP & Database Landscape',
      subtitle: 'Describe your current SAP environment and data footprint.',
      canMarkNA: true,
      fields: [
        {
          name: 'sapSystem',
          label: 'SAP System',
          type: 'select',
          options: [
            { value: 'ecc6', label: 'ECC 6.0' },
            { value: 's4hana', label: 'S/4HANA' },
            { value: 'bw4hana', label: 'BW/4HANA' },
            { value: 'bw', label: 'BW on HANA' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          name: 'databaseType',
          label: 'Database Type',
          type: 'text',
          placeholder: 'e.g., Oracle, HANA, DB2',
        },
        {
          name: 'modules',
          label: 'SAP Modules in Scope',
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
        { name: 'tableCount', label: 'Estimated Table Count', type: 'number', min: 0, defaultValue: 0 },
        { name: 'bwObjectCount', label: 'BW Object Count', type: 'number', min: 0, defaultValue: 0 },
        { name: 'totalDataSize', label: 'Total Data Size (TB)', type: 'number', min: 0 },
      ],
    },
    {
      id: 'hana-views',
      title: 'HANA/CDS Views & Dependencies',
      subtitle: 'Detail your HANA calculation views and CDS layer.',
      canMarkNA: true,
      fields: [
        { name: 'viewCount', label: 'Calculation/CDS View Count', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'viewComplexity',
          label: 'View Complexity (1 = simple, 5 = very complex)',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        {
          name: 'viewDependencies',
          label: 'Cross-View Dependencies',
          type: 'select',
          options: [
            { value: 'none', label: 'None / Minimal' },
            { value: 'moderate', label: 'Moderate (some chains)' },
            { value: 'heavy', label: 'Heavy (deep nesting)' },
          ],
        },
      ],
    },
    {
      id: 'etl',
      title: 'ETL & Integration Layer',
      subtitle: 'Describe existing data pipelines and integration tools.',
      canMarkNA: true,
      fields: [
        { name: 'pipelineCount', label: 'Number of ETL Pipelines', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'etlTools',
          label: 'ETL Tools Used',
          type: 'checkbox-group',
          options: [
            { value: 'bods', label: 'SAP BODS' },
            { value: 'sdi', label: 'SAP SDI/SDA' },
            { value: 'informatica', label: 'Informatica' },
            { value: 'talend', label: 'Talend' },
            { value: 'adf', label: 'Azure Data Factory' },
            { value: 'custom', label: 'Custom Scripts' },
          ],
        },
        {
          name: 'schedulingTool',
          label: 'Scheduling / Orchestration',
          type: 'text',
          placeholder: 'e.g., Control-M, Airflow, cron',
        },
      ],
    },
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
    {
      id: 'budget',
      title: 'Budget & Cost Information',
      subtitle: 'Current spend and migration budget expectations.',
      canMarkNA: true,
      fields: [
        {
          name: 'currentAnnualSpend',
          label: 'Current Annual Data Platform Spend ($)',
          type: 'number',
          min: 0,
          placeholder: 'e.g., 500000',
        },
        {
          name: 'migrationBudget',
          label: 'Migration Services Budget ($)',
          type: 'number',
          min: 0,
          placeholder: 'e.g., 200000',
        },
      ],
    },
    {
      id: 'contact',
      title: 'Form Completion Details',
      canMarkNA: false,
      fields: [
        { name: 'completedBy', label: 'Completed By', type: 'text', required: true },
        { name: 'completionDate', label: 'Date', type: 'date' },
      ],
    },
  ],
};
