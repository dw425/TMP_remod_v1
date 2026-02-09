import type { MigrationSchema } from '@/types/migration';

export const gcpSchema: MigrationSchema = {
  platform: 'gcp',
  title: 'Google Cloud to Databricks Migration Assessment',
  subtitle:
    'Map your BigQuery, Dataflow, and Composer pipelines for transition to Databricks.',
  brandColor: '#4285F4',
  romConfig: {
    objectCountFields: ['tableCount', 'viewCount', 'dataflowJobCount', 'composerDagCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 2, medium: 6, complex: 20, veryComplex: 48 },
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
      id: 'bigquery',
      title: 'BigQuery Inventory',
      subtitle: 'Detail your BigQuery datasets and objects.',
      canMarkNA: true,
      fields: [
        { name: 'gcpProjectCount', label: 'GCP Projects with Data Workloads', type: 'number', min: 0 },
        { name: 'datasetCount', label: 'BigQuery Datasets', type: 'number', min: 0 },
        { name: 'tableCount', label: 'Total Table Count', type: 'number', min: 0, defaultValue: 0 },
        { name: 'viewCount', label: 'View Count (incl. materialized)', type: 'number', min: 0, defaultValue: 0 },
        { name: 'totalStorageTB', label: 'Total Storage (TB)', type: 'number', min: 0 },
        { name: 'scheduledQueryCount', label: 'Scheduled Queries', type: 'number', min: 0 },
      ],
    },
    {
      id: 'pipelines',
      title: 'Dataflow & Composer Pipelines',
      canMarkNA: true,
      fields: [
        { name: 'dataflowJobCount', label: 'Dataflow Jobs', type: 'number', min: 0, defaultValue: 0 },
        { name: 'composerDagCount', label: 'Composer DAGs (Airflow)', type: 'number', min: 0, defaultValue: 0 },
        { name: 'dataprocClusterCount', label: 'Dataproc Clusters', type: 'number', min: 0 },
        {
          name: 'gcpServices',
          label: 'GCP Services in Data Stack',
          type: 'checkbox-group',
          options: [
            { value: 'bigquery', label: 'BigQuery' },
            { value: 'dataflow', label: 'Dataflow' },
            { value: 'composer', label: 'Cloud Composer' },
            { value: 'dataproc', label: 'Dataproc' },
            { value: 'pubsub', label: 'Pub/Sub' },
            { value: 'gcs', label: 'Cloud Storage' },
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
        { name: 'currentAnnualSpend', label: 'Current Annual GCP Data Spend ($)', type: 'number', min: 0 },
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
