import type { MigrationSchema } from '@/types/migration';

export const talendSchema: MigrationSchema = {
  platform: 'talend',
  title: 'Talend to Databricks Migration Assessment',
  subtitle:
    'Inventory your Talend jobs and data integration flows for conversion to Databricks workflows.',
  brandColor: '#FF6D70',
  romConfig: {
    objectCountFields: ['jobCount', 'routeCount', 'serviceCount', 'contextCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 2, medium: 8, complex: 24, veryComplex: 56 },
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
      id: 'talend-environment',
      title: 'Talend Environment',
      subtitle: 'Describe your Talend platform and version.',
      canMarkNA: true,
      fields: [
        {
          name: 'talendVersion',
          label: 'Talend Platform',
          type: 'select',
          options: [
            { value: 'open', label: 'Talend Open Studio' },
            { value: 'di', label: 'Talend Data Integration' },
            { value: 'bdp', label: 'Talend Big Data Platform' },
            { value: 'cloud', label: 'Talend Cloud' },
            { value: 'mixed', label: 'Mixed Environment' },
          ],
        },
        { name: 'projectCount', label: 'Number of Projects', type: 'number', min: 0 },
      ],
    },
    {
      id: 'jobs',
      title: 'Jobs & Components',
      subtitle: 'Detail your Talend job inventory.',
      canMarkNA: true,
      fields: [
        { name: 'jobCount', label: 'Number of Jobs', type: 'number', min: 0, defaultValue: 0 },
        { name: 'routeCount', label: 'Number of Routes (ESB)', type: 'number', min: 0, defaultValue: 0 },
        { name: 'serviceCount', label: 'Number of Services', type: 'number', min: 0, defaultValue: 0 },
        { name: 'contextCount', label: 'Context Groups', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'componentTypes',
          label: 'Common Component Types',
          type: 'checkbox-group',
          options: [
            { value: 'tmap', label: 'tMap' },
            { value: 'tjoin', label: 'tJoin' },
            { value: 'tfilter', label: 'tFilterRow' },
            { value: 'tagg', label: 'tAggregateRow' },
            { value: 'tsort', label: 'tSortRow' },
            { value: 'trest', label: 'tRESTClient' },
          ],
        },
      ],
    },
    {
      id: 'connections',
      title: 'Database & API Connections',
      canMarkNA: true,
      fields: [
        { name: 'dbConnectionCount', label: 'Database Connections', type: 'number', min: 0 },
        { name: 'fileConnectionCount', label: 'File/FTP Connections', type: 'number', min: 0 },
        { name: 'apiConnectionCount', label: 'API/Web Service Connections', type: 'number', min: 0 },
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
        { name: 'currentAnnualSpend', label: 'Current Annual Talend Spend ($)', type: 'number', min: 0 },
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
