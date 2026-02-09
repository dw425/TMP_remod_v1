import type { MigrationSchema } from '@/types/migration';

export const teradataSchema: MigrationSchema = {
  platform: 'teradata',
  title: 'Teradata to Databricks Migration Assessment',
  subtitle:
    'Inventory your Teradata data warehouse, BTEQ scripts, and Teradata utilities for migration.',
  brandColor: '#F37421',
  romConfig: {
    objectCountFields: ['tableCount', 'viewCount', 'macroCount', 'storedProcCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 3, medium: 10, complex: 28, veryComplex: 65 },
    hourlyRate: { low: 170, high: 270 },
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
      id: 'td-inventory',
      title: 'Teradata Environment Inventory',
      subtitle: 'Detail your Teradata data warehouse footprint.',
      canMarkNA: true,
      fields: [
        { name: 'systemCount', label: 'Number of TD Systems', type: 'number', min: 0 },
        {
          name: 'tdVersion',
          label: 'Teradata Version',
          type: 'select',
          options: [
            { value: '17', label: 'Teradata 17.x' },
            { value: '16', label: 'Teradata 16.x' },
            { value: '15', label: 'Teradata 15.x or older' },
            { value: 'vantage', label: 'Vantage (Cloud)' },
          ],
        },
        { name: 'databaseCount', label: 'Number of Databases', type: 'number', min: 0 },
        { name: 'tableCount', label: 'Total Table Count', type: 'number', min: 0, defaultValue: 0 },
        { name: 'viewCount', label: 'View Count', type: 'number', min: 0, defaultValue: 0 },
        { name: 'totalDataSize', label: 'Total Data Size (TB)', type: 'number', min: 0 },
      ],
    },
    {
      id: 'code-objects',
      title: 'BTEQ, Macros & Code Objects',
      canMarkNA: true,
      fields: [
        { name: 'macroCount', label: 'Macros', type: 'number', min: 0, defaultValue: 0 },
        { name: 'storedProcCount', label: 'Stored Procedures', type: 'number', min: 0, defaultValue: 0 },
        { name: 'bteqScriptCount', label: 'BTEQ Scripts', type: 'number', min: 0 },
        { name: 'fastloadCount', label: 'FastLoad / MultiLoad Jobs', type: 'number', min: 0 },
        { name: 'tptScriptCount', label: 'TPT Scripts', type: 'number', min: 0 },
      ],
    },
    {
      id: 'etl',
      title: 'ETL & Scheduling',
      canMarkNA: true,
      fields: [
        {
          name: 'etlTools',
          label: 'ETL / Orchestration Tools',
          type: 'checkbox-group',
          options: [
            { value: 'informatica', label: 'Informatica' },
            { value: 'datastage', label: 'DataStage' },
            { value: 'abinitio', label: 'Ab Initio' },
            { value: 'controlm', label: 'Control-M' },
            { value: 'autosys', label: 'AutoSys' },
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
        { name: 'currentAnnualSpend', label: 'Current Annual Teradata Spend ($)', type: 'number', min: 0 },
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
