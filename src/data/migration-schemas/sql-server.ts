import type { MigrationSchema } from '@/types/migration';

export const sqlServerSchema: MigrationSchema = {
  platform: 'sql-server',
  title: 'SQL Server to Databricks Migration Assessment',
  subtitle:
    'Inventory your SQL Server databases, SSIS packages, and SSRS reports for Databricks migration.',
  brandColor: '#737373',
  romConfig: {
    objectCountFields: ['tableCount', 'viewCount', 'storedProcCount', 'ssisPackageCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 2, medium: 8, complex: 22, veryComplex: 55 },
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
      id: 'database-inventory',
      title: 'SQL Server Database Inventory',
      subtitle: 'Detail your SQL Server environment.',
      canMarkNA: true,
      fields: [
        { name: 'instanceCount', label: 'Number of Instances', type: 'number', min: 0 },
        {
          name: 'sqlVersion',
          label: 'SQL Server Version',
          type: 'select',
          options: [
            { value: '2022', label: 'SQL Server 2022' },
            { value: '2019', label: 'SQL Server 2019' },
            { value: '2017', label: 'SQL Server 2017' },
            { value: '2016', label: 'SQL Server 2016' },
            { value: 'older', label: 'SQL Server 2014 or older' },
            { value: 'azure', label: 'Azure SQL Database' },
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
      title: 'T-SQL & Code Objects',
      canMarkNA: true,
      fields: [
        { name: 'storedProcCount', label: 'Stored Procedures', type: 'number', min: 0, defaultValue: 0 },
        { name: 'functionCount', label: 'Functions (Scalar + Table)', type: 'number', min: 0 },
        { name: 'triggerCount', label: 'Triggers', type: 'number', min: 0 },
        { name: 'linkedServerCount', label: 'Linked Servers', type: 'number', min: 0 },
      ],
    },
    {
      id: 'ssis-ssrs',
      title: 'SSIS & SSRS Inventory',
      subtitle: 'Detail your ETL and reporting landscape.',
      canMarkNA: true,
      fields: [
        { name: 'ssisPackageCount', label: 'SSIS Packages', type: 'number', min: 0, defaultValue: 0 },
        { name: 'ssrsReportCount', label: 'SSRS Reports', type: 'number', min: 0 },
        { name: 'ssasModelCount', label: 'SSAS Models', type: 'number', min: 0 },
        {
          name: 'agentJobCount',
          label: 'SQL Agent Jobs',
          type: 'number',
          min: 0,
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
        { name: 'currentAnnualSpend', label: 'Current Annual SQL Server Spend ($)', type: 'number', min: 0 },
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
