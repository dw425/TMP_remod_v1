import type { MigrationSchema } from '@/types/migration';

export const informaticaSchema: MigrationSchema = {
  platform: 'informatica',
  title: 'Informatica to Databricks Migration Assessment',
  subtitle:
    'Inventory your Informatica PowerCenter and IICS mappings for conversion to Databricks workflows.',
  brandColor: '#FF4D00',
  romConfig: {
    objectCountFields: ['mappingCount', 'workflowCount', 'sessionCount', 'mappletCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 3, medium: 10, complex: 30, veryComplex: 72 },
    hourlyRate: { low: 160, high: 260 },
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
      id: 'environment',
      title: 'Informatica Environment',
      subtitle: 'Describe your Informatica platform and version.',
      canMarkNA: true,
      fields: [
        {
          name: 'informaticaVersion',
          label: 'Informatica Platform',
          type: 'select',
          options: [
            { value: 'pc10', label: 'PowerCenter 10.x' },
            { value: 'pc9', label: 'PowerCenter 9.x' },
            { value: 'iics', label: 'IICS (Cloud)' },
            { value: 'bdm', label: 'Big Data Management' },
            { value: 'mixed', label: 'Mixed Environment' },
          ],
        },
        { name: 'repositoryCount', label: 'Number of Repositories', type: 'number', min: 0 },
        { name: 'folderCount', label: 'Number of Folders', type: 'number', min: 0 },
      ],
    },
    {
      id: 'mappings',
      title: 'Mappings & Workflows',
      subtitle: 'Detail your ETL object inventory.',
      canMarkNA: true,
      fields: [
        { name: 'mappingCount', label: 'Number of Mappings', type: 'number', min: 0, defaultValue: 0 },
        { name: 'mappletCount', label: 'Number of Mapplets', type: 'number', min: 0, defaultValue: 0 },
        { name: 'workflowCount', label: 'Number of Workflows', type: 'number', min: 0, defaultValue: 0 },
        { name: 'sessionCount', label: 'Number of Sessions', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'transformationTypes',
          label: 'Transformation Types Used',
          type: 'checkbox-group',
          options: [
            { value: 'sq', label: 'Source Qualifier' },
            { value: 'exp', label: 'Expression' },
            { value: 'lkp', label: 'Lookup' },
            { value: 'jnr', label: 'Joiner' },
            { value: 'agg', label: 'Aggregator' },
            { value: 'rtr', label: 'Router' },
          ],
        },
      ],
    },
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
        { name: 'currentAnnualSpend', label: 'Current Annual Informatica Spend ($)', type: 'number', min: 0 },
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
