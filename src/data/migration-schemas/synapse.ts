import type { MigrationSchema } from '@/types/migration';

export const synapseSchema: MigrationSchema = {
  platform: 'synapse',
  title: 'Azure Synapse to Databricks Migration Assessment',
  subtitle:
    'Map your Synapse dedicated pools, pipelines, and Spark notebooks for Databricks transition.',
  brandColor: '#0078D4',
  romConfig: {
    objectCountFields: ['tableCount', 'viewCount', 'storedProcCount', 'pipelineCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 2, medium: 6, complex: 20, veryComplex: 50 },
    hourlyRate: { low: 155, high: 255 },
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
      id: 'synapse-inventory',
      title: 'Synapse Workspace Inventory',
      subtitle: 'Detail your Synapse environment.',
      canMarkNA: true,
      fields: [
        { name: 'workspaceCount', label: 'Number of Workspaces', type: 'number', min: 0 },
        {
          name: 'poolTypes',
          label: 'Pool Types in Use',
          type: 'checkbox-group',
          options: [
            { value: 'dedicated', label: 'Dedicated SQL Pool' },
            { value: 'serverless', label: 'Serverless SQL Pool' },
            { value: 'spark', label: 'Apache Spark Pool' },
            { value: 'de', label: 'Data Explorer Pool' },
          ],
        },
        { name: 'tableCount', label: 'Total Table Count', type: 'number', min: 0, defaultValue: 0 },
        { name: 'viewCount', label: 'View Count', type: 'number', min: 0, defaultValue: 0 },
        { name: 'totalStorageTB', label: 'Total Storage (TB)', type: 'number', min: 0 },
      ],
    },
    {
      id: 'code-objects',
      title: 'Code Objects & Notebooks',
      canMarkNA: true,
      fields: [
        { name: 'storedProcCount', label: 'Stored Procedures', type: 'number', min: 0, defaultValue: 0 },
        { name: 'notebookCount', label: 'Spark Notebooks', type: 'number', min: 0 },
        { name: 'sqlScriptCount', label: 'SQL Scripts', type: 'number', min: 0 },
      ],
    },
    {
      id: 'pipelines',
      title: 'Pipelines & Integration',
      canMarkNA: true,
      fields: [
        { name: 'pipelineCount', label: 'Synapse Pipelines', type: 'number', min: 0, defaultValue: 0 },
        { name: 'dataFlowCount', label: 'Data Flows', type: 'number', min: 0 },
        { name: 'linkedServiceCount', label: 'Linked Services', type: 'number', min: 0 },
        { name: 'triggerCount', label: 'Triggers', type: 'number', min: 0 },
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
        { name: 'currentAnnualSpend', label: 'Current Annual Azure Data Spend ($)', type: 'number', min: 0 },
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
