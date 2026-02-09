import type { MigrationSchema } from '@/types/migration';

export const snowflakeSchema: MigrationSchema = {
  platform: 'snowflake',
  title: 'Snowflake to Databricks Migration Assessment',
  subtitle:
    'Map your Snowflake warehouses, stages, and pipelines for a seamless transition to Databricks.',
  brandColor: '#29B5E8',
  romConfig: {
    objectCountFields: ['tableCount', 'viewCount', 'storedProcCount', 'pipelineCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 1, medium: 4, complex: 16, veryComplex: 40 },
    hourlyRate: { low: 150, high: 250 },
  },
  sections: [
    {
      id: 'exec',
      title: 'Executive Summary',
      canMarkNA: false,
      fields: [
        { name: 'projectName', label: 'Project Name', type: 'text', required: true },
        { name: 'stakeholder', label: 'Key Stakeholder', type: 'text', required: true },
        { name: 'timeline', label: 'Target Timeline', type: 'text', placeholder: 'e.g., Q3 2026' },
        { name: 'contactEmail', label: 'Contact Email', type: 'email', required: true },
        { name: 'businessDriver', label: 'Business Driver', type: 'textarea' },
      ],
    },
    {
      id: 'warehouses',
      title: 'Snowflake Warehouse Inventory',
      subtitle: 'Detail your Snowflake compute and storage footprint.',
      canMarkNA: true,
      fields: [
        { name: 'warehouseCount', label: 'Number of Warehouses', type: 'number', min: 0 },
        { name: 'databaseCount', label: 'Number of Databases', type: 'number', min: 0 },
        { name: 'schemaCount', label: 'Number of Schemas', type: 'number', min: 0 },
        { name: 'tableCount', label: 'Total Table Count', type: 'number', min: 0, defaultValue: 0 },
        { name: 'viewCount', label: 'View Count', type: 'number', min: 0, defaultValue: 0 },
        { name: 'totalStorageTB', label: 'Total Storage (TB)', type: 'number', min: 0 },
        {
          name: 'creditUsageMonthly',
          label: 'Avg Monthly Credit Usage',
          type: 'number',
          min: 0,
        },
      ],
    },
    {
      id: 'code-objects',
      title: 'Code Objects & Transformations',
      canMarkNA: true,
      fields: [
        { name: 'storedProcCount', label: 'Stored Procedures', type: 'number', min: 0, defaultValue: 0 },
        { name: 'udfCount', label: 'UDFs (SQL + JavaScript)', type: 'number', min: 0 },
        { name: 'taskCount', label: 'Snowflake Tasks', type: 'number', min: 0 },
        { name: 'streamCount', label: 'Streams (CDC)', type: 'number', min: 0 },
        {
          name: 'snowpipeCount',
          label: 'Snowpipe Definitions',
          type: 'number',
          min: 0,
        },
      ],
    },
    {
      id: 'etl',
      title: 'ETL & Integration Layer',
      canMarkNA: true,
      fields: [
        { name: 'pipelineCount', label: 'Number of ETL Pipelines', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'etlTools',
          label: 'ETL / ELT Tools',
          type: 'checkbox-group',
          options: [
            { value: 'dbt', label: 'dbt' },
            { value: 'fivetran', label: 'Fivetran' },
            { value: 'matillion', label: 'Matillion' },
            { value: 'airflow', label: 'Airflow' },
            { value: 'informatica', label: 'Informatica' },
            { value: 'custom', label: 'Custom Scripts' },
          ],
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
      canMarkNA: true,
      fields: [
        { name: 'currentAnnualSpend', label: 'Current Annual Snowflake Spend ($)', type: 'number', min: 0 },
        { name: 'migrationBudget', label: 'Migration Services Budget ($)', type: 'number', min: 0 },
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
