import type { MigrationSchema } from '@/types/migration';

export const unityCatalogSchema: MigrationSchema = {
  platform: 'unity-catalog',
  title: 'Unity Catalog Migration Assessment',
  subtitle:
    'Consolidate Hive metastores, external catalogs, and access controls into Unity Catalog.',
  brandColor: '#FF3621',
  romConfig: {
    objectCountFields: ['tableCount', 'viewCount', 'functionCount', 'externalLocationCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 1, medium: 4, complex: 14, veryComplex: 36 },
    hourlyRate: { low: 150, high: 240 },
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
      id: 'current-state',
      title: 'Current Metastore State',
      subtitle: 'Describe your current catalog and metastore landscape.',
      canMarkNA: true,
      fields: [
        { name: 'workspaceCount', label: 'Databricks Workspaces', type: 'number', min: 0 },
        {
          name: 'metastoreType',
          label: 'Current Metastore',
          type: 'select',
          options: [
            { value: 'hive', label: 'Hive Metastore (legacy)' },
            { value: 'aws-glue', label: 'AWS Glue Catalog' },
            { value: 'external', label: 'External Metastore' },
            { value: 'mixed', label: 'Mixed (multiple types)' },
          ],
        },
        { name: 'catalogCount', label: 'Number of Catalogs to Create', type: 'number', min: 0 },
        { name: 'schemaCount', label: 'Number of Schemas', type: 'number', min: 0 },
        { name: 'tableCount', label: 'Total Table Count', type: 'number', min: 0, defaultValue: 0 },
        { name: 'viewCount', label: 'View Count', type: 'number', min: 0, defaultValue: 0 },
      ],
    },
    {
      id: 'objects',
      title: 'Functions & External Locations',
      canMarkNA: true,
      fields: [
        { name: 'functionCount', label: 'UDFs to Migrate', type: 'number', min: 0, defaultValue: 0 },
        { name: 'externalLocationCount', label: 'External Locations', type: 'number', min: 0, defaultValue: 0 },
        { name: 'storageCredentialCount', label: 'Storage Credentials', type: 'number', min: 0 },
        {
          name: 'tableFormats',
          label: 'Table Formats in Use',
          type: 'checkbox-group',
          options: [
            { value: 'delta', label: 'Delta Lake' },
            { value: 'parquet', label: 'Parquet' },
            { value: 'csv', label: 'CSV' },
            { value: 'json', label: 'JSON' },
            { value: 'orc', label: 'ORC' },
            { value: 'avro', label: 'Avro' },
          ],
        },
      ],
    },
    {
      id: 'access-control',
      title: 'Access Control & Governance',
      canMarkNA: true,
      fields: [
        { name: 'groupCount', label: 'Groups / Principals', type: 'number', min: 0 },
        { name: 'grantCount', label: 'Estimated Permission Grants', type: 'number', min: 0 },
        {
          name: 'authSource',
          label: 'Identity Provider',
          type: 'select',
          options: [
            { value: 'aad', label: 'Azure AD / Entra ID' },
            { value: 'okta', label: 'Okta' },
            { value: 'aws-iam', label: 'AWS IAM' },
            { value: 'scim', label: 'SCIM' },
            { value: 'other', label: 'Other' },
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
        { name: 'currentAnnualSpend', label: 'Current Annual Platform Spend ($)', type: 'number', min: 0 },
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
