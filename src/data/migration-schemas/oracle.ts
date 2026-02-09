import type { MigrationSchema } from '@/types/migration';

export const oracleSchema: MigrationSchema = {
  platform: 'oracle',
  title: 'Oracle to Databricks Migration Assessment',
  subtitle:
    'Inventory your Oracle databases, PL/SQL code, and ETL workflows for migration planning.',
  brandColor: '#C74634',
  romConfig: {
    objectCountFields: ['tableCount', 'viewCount', 'plsqlObjectCount', 'pipelineCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 3, medium: 10, complex: 28, veryComplex: 70 },
    hourlyRate: { low: 165, high: 265 },
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
      id: 'database-landscape',
      title: 'Oracle Database Landscape',
      subtitle: 'Describe your Oracle database environment.',
      canMarkNA: true,
      fields: [
        { name: 'instanceCount', label: 'Number of Oracle Instances', type: 'number', min: 0 },
        {
          name: 'oracleEdition',
          label: 'Oracle Edition',
          type: 'select',
          options: [
            { value: 'ee', label: 'Enterprise Edition' },
            { value: 'se', label: 'Standard Edition' },
            { value: 'xe', label: 'Express Edition' },
            { value: 'cloud', label: 'Oracle Cloud (Autonomous)' },
          ],
        },
        { name: 'tableCount', label: 'Total Table Count', type: 'number', min: 0, defaultValue: 0 },
        { name: 'viewCount', label: 'View Count', type: 'number', min: 0, defaultValue: 0 },
        { name: 'totalDataSize', label: 'Total Data Size (TB)', type: 'number', min: 0 },
        {
          name: 'partitionedTables',
          label: 'Partitioned Tables',
          type: 'number',
          min: 0,
        },
      ],
    },
    {
      id: 'plsql',
      title: 'PL/SQL & Code Objects',
      canMarkNA: true,
      fields: [
        { name: 'plsqlObjectCount', label: 'PL/SQL Packages + Procedures', type: 'number', min: 0, defaultValue: 0 },
        { name: 'triggerCount', label: 'Triggers', type: 'number', min: 0 },
        { name: 'mviewCount', label: 'Materialized Views', type: 'number', min: 0 },
        { name: 'dbLinksCount', label: 'Database Links', type: 'number', min: 0 },
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
        { name: 'currentAnnualSpend', label: 'Current Annual Oracle Spend ($)', type: 'number', min: 0 },
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
