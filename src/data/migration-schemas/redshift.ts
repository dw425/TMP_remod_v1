import type { MigrationSchema } from '@/types/migration';

export const redshiftSchema: MigrationSchema = {
  platform: 'redshift',
  title: 'AWS Redshift to Databricks Migration Assessment',
  subtitle:
    'Map your Redshift clusters, Spectrum queries, and Glue pipelines for Databricks migration.',
  brandColor: '#232F3E',
  romConfig: {
    objectCountFields: ['tableCount', 'viewCount', 'storedProcCount', 'glueJobCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 1, medium: 5, complex: 18, veryComplex: 45 },
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
      id: 'cluster-inventory',
      title: 'Redshift Cluster Inventory',
      subtitle: 'Detail your Redshift compute and storage environment.',
      canMarkNA: true,
      fields: [
        { name: 'clusterCount', label: 'Number of Clusters', type: 'number', min: 0 },
        {
          name: 'clusterType',
          label: 'Primary Cluster Type',
          type: 'select',
          options: [
            { value: 'ra3', label: 'RA3 (managed storage)' },
            { value: 'dc2', label: 'DC2 (dense compute)' },
            { value: 'ds2', label: 'DS2 (dense storage)' },
            { value: 'serverless', label: 'Redshift Serverless' },
          ],
        },
        { name: 'tableCount', label: 'Total Table Count', type: 'number', min: 0, defaultValue: 0 },
        { name: 'viewCount', label: 'View Count', type: 'number', min: 0, defaultValue: 0 },
        { name: 'totalStorageTB', label: 'Total Storage (TB)', type: 'number', min: 0 },
        { name: 'spectrumTables', label: 'Spectrum External Tables', type: 'number', min: 0 },
      ],
    },
    {
      id: 'code-objects',
      title: 'SQL & Code Objects',
      canMarkNA: true,
      fields: [
        { name: 'storedProcCount', label: 'Stored Procedures', type: 'number', min: 0, defaultValue: 0 },
        { name: 'udfCount', label: 'UDFs (SQL/Python)', type: 'number', min: 0 },
        { name: 'scheduledQueryCount', label: 'Scheduled Queries', type: 'number', min: 0 },
      ],
    },
    {
      id: 'aws-integration',
      title: 'AWS Integration Layer',
      canMarkNA: true,
      fields: [
        { name: 'glueJobCount', label: 'Glue Jobs', type: 'number', min: 0, defaultValue: 0 },
        { name: 'lambdaCount', label: 'Lambda Functions (data-related)', type: 'number', min: 0 },
        { name: 'stepFunctionCount', label: 'Step Functions', type: 'number', min: 0 },
        {
          name: 'awsServices',
          label: 'AWS Services in Data Stack',
          type: 'checkbox-group',
          options: [
            { value: 's3', label: 'S3' },
            { value: 'glue', label: 'Glue / Glue Catalog' },
            { value: 'emr', label: 'EMR' },
            { value: 'kinesis', label: 'Kinesis' },
            { value: 'msk', label: 'MSK (Kafka)' },
            { value: 'sagemaker', label: 'SageMaker' },
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
        { name: 'currentAnnualSpend', label: 'Current Annual AWS Data Spend ($)', type: 'number', min: 0 },
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
