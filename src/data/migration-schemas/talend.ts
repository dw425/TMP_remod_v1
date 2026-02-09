import type { MigrationSchema } from '@/types/migration';

export const talendSchema: MigrationSchema = {
  platform: 'talend',
  title: 'Talend to Databricks Migration Assessment',
  subtitle:
    'Inventory your Talend Data Integration/Big Data jobs to generate a precise ROM estimate.',
  brandColor: '#FF6D70',
  romConfig: {
    objectCountFields: ['jobCount', 'routeCount', 'serviceCount', 'contextCount'],
    complexityField: 'overallComplexity',
    hoursPerObject: { simple: 2, medium: 8, complex: 24, veryComplex: 56 },
    hourlyRate: { low: 155, high: 255 },
  },
  sections: [
    /* ------------------------------------------------------------------ */
    /*  Executive Summary                                                 */
    /* ------------------------------------------------------------------ */
    {
      id: 'exec',
      title: 'Executive Summary',
      canMarkNA: true,
      fields: [
        { name: 'projectName', label: 'Project Name', type: 'text', required: true },
        { name: 'stakeholder', label: 'Primary Stakeholder', type: 'text', required: true },
        {
          name: 'timeline',
          label: 'Timeline Expectations',
          type: 'text',
          placeholder: 'e.g., Q3 2025',
        },
        { name: 'contactEmail', label: 'Contact Email', type: 'email', required: true },
        {
          name: 'businessDriver',
          label: 'Business Driver for Migration',
          type: 'textarea',
          placeholder:
            'e.g., Modernize ETL, Reduce licensing costs, Real-time streaming...',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  1. Current Talend Environment                                     */
    /* ------------------------------------------------------------------ */
    {
      id: 'talend-environment',
      title: '1. Current Talend Environment',
      canMarkNA: true,
      fields: [
        /* --- 1.1 System & Version --- */
        {
          name: 'talendVersion',
          label: 'Talend Version',
          type: 'text',
          placeholder: 'e.g., 7.3, 8.0, Open Studio',
        },
        {
          name: 'talendEdition',
          label: 'Edition',
          type: 'select',
          options: [
            { value: 'open_studio', label: 'Open Studio (TOS)' },
            { value: 'data_integration', label: 'Data Integration (DI)' },
            { value: 'big_data', label: 'Big Data / Real-Time' },
            { value: 'data_fabric', label: 'Talend Data Fabric' },
          ],
        },
        {
          name: 'tacFeatures',
          label: 'Administration Center (TAC)',
          type: 'checkbox-group',
          options: [
            { value: 'job_conductor', label: 'Job Conductor (Scheduling)' },
            { value: 'amc', label: 'Activity Monitoring Console (AMC)' },
            { value: 'nexus', label: 'Artifact Repository (Nexus/Artifactory)' },
          ],
        },

        /* --- 1.2 Project Scope --- */
        { name: 'projectCount', label: 'Number of Projects', type: 'number', min: 0, defaultValue: 0 },
        {
          name: 'totalJobCount',
          label: 'Total Jobs (All Environments)',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'sourceControl',
          label: 'Source Control',
          type: 'text',
          placeholder: 'Git, SVN? Hosted where?',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  2. Job Inventory & Complexity                                     */
    /* ------------------------------------------------------------------ */
    {
      id: 'jobs',
      title: '2. Job Inventory & Complexity',
      canMarkNA: true,
      fields: [
        /* --- 2.1 Job Types --- */
        {
          name: 'diJobCount',
          label: 'Standard DI Jobs (Batch)',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'diComplexity',
          label: 'DI Job Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        {
          name: 'bdJobCount',
          label: 'Big Data / Streaming Jobs',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'bdComplexity',
          label: 'BD Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        {
          name: 'components',
          label: 'Common Components Used',
          type: 'checkbox-group',
          options: [
            { value: 'tmap', label: 'tMap (Complex Mapping)' },
            { value: 'tjava', label: 'tJava / tJavaRow' },
            { value: 'trunjob', label: 'tRunJob (Parent/Child)' },
            { value: 'rest', label: 'tRESTClient / API' },
            { value: 'file', label: 'File IO (Excel, XML, JSON)' },
          ],
        },

        /* --- 2.2 Custom Code & Logic --- */
        {
          name: 'routineCount',
          label: 'Custom Routines (Java)',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'routineComplexity',
          label: 'Code Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
        {
          name: 'contextStrategy',
          label: 'Context Variables Strategy',
          type: 'textarea',
          placeholder:
            'How are contexts managed? (DB table, flat file, TAC context parameters).',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  3. Orchestration & Integration                                    */
    /* ------------------------------------------------------------------ */
    {
      id: 'orchestration',
      title: '3. Orchestration & Integration',
      canMarkNA: true,
      fields: [
        /* --- 3.1 Scheduling --- */
        {
          name: 'taskCount',
          label: 'TAC Tasks / Execution Plans',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'orchComplexity',
          label: 'Orchestration Complexity',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 2,
        },
        {
          name: 'externalSchedulers',
          label: 'External Schedulers',
          type: 'text',
          placeholder: 'Control-M, Airflow, Autosys (if not using TAC)',
        },

        /* --- 3.2 Connectivity --- */
        {
          name: 'sources',
          label: 'Source Systems',
          type: 'textarea',
          placeholder: 'Oracle, SAP, Salesforce, S3, FTP...',
        },
        {
          name: 'targets',
          label: 'Target Systems',
          type: 'textarea',
          placeholder: 'Snowflake, Redshift, Databricks, Files...',
        },
        {
          name: 'cdcUsage',
          label: 'CDC (Change Data Capture)',
          type: 'textarea',
          placeholder:
            'Are you using Talend CDC or triggers for incremental loads?',
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  4. Target State & Priorities                                      */
    /* ------------------------------------------------------------------ */
    {
      id: 'target-state',
      title: '4. Target State & Priorities',
      canMarkNA: true,
      fields: [
        /* --- 4.1 Architecture --- */
        {
          name: 'targetCloudProvider',
          label: 'Target Cloud',
          type: 'select',
          options: [
            { value: 'aws', label: 'AWS' },
            { value: 'azure', label: 'Azure' },
            { value: 'gcp', label: 'GCP' },
          ],
        },
        {
          name: 'migrationStrategy',
          label: 'Strategy',
          type: 'select',
          options: [
            { value: 'replatform', label: 'Replatform (Lift & Shift Logic to PySpark)' },
            { value: 'refactor', label: 'Refactor (Rebuild in DLT)' },
          ],
        },
        {
          name: 'dbxFeatures',
          label: 'Databricks Features',
          type: 'checkbox-group',
          options: [
            { value: 'workflows', label: 'Databricks Workflows' },
            { value: 'dlt', label: 'Delta Live Tables (DLT)' },
            { value: 'autoloader', label: 'Auto Loader' },
            { value: 'uc', label: 'Unity Catalog' },
          ],
        },

        /* --- 4.2 Cost & Value --- */
        {
          name: 'totalSpend',
          label: 'Current Talend Renewal ($)',
          type: 'number',
          min: 0,
        },
        {
          name: 'servicesBudget',
          label: 'Migration Budget ($)',
          type: 'number',
          min: 0,
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Form Completion Details                                           */
    /* ------------------------------------------------------------------ */
    {
      id: 'contact',
      title: 'Form Completion Details',
      canMarkNA: false,
      fields: [
        { name: 'completedBy', label: 'Questionnaire Completed By', type: 'text', required: true },
        { name: 'completionDate', label: 'Date', type: 'date', required: true },
      ],
    },
  ],
};
