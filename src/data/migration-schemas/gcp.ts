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
    // ── Executive Summary ──────────────────────────────────────────────
    {
      id: 'exec',
      title: 'Executive Summary',
      canMarkNA: true,
      fields: [
        { name: 'projectName', label: 'Project Name', type: 'text', required: true },
        { name: 'stakeholder', label: 'Primary Stakeholder', type: 'text', required: true },
        { name: 'timeline', label: 'Timeline Expectations', type: 'text', placeholder: 'e.g., Q3 2026' },
        { name: 'contactEmail', label: 'Contact Email', type: 'email', required: true },
        {
          name: 'businessDriver',
          label: 'Business Driver for Migration',
          type: 'textarea',
          placeholder:
            'Describe the primary reasons for migrating (e.g., cost reduction, modernization, licensing renewal)...',
        },
      ],
    },

    // ── 1. Current GCP Environment Assessment ──────────────────────────
    {
      id: 'gcpEnvironment',
      title: '1. Current GCP Environment Assessment',
      subtitle: 'Inventory the GCP services and compute resources in scope for migration.',
      canMarkNA: true,
      fields: [
        // 1.1 Current Platform Details
        {
          name: 'gcpServices',
          label: 'GCP Services Currently in Scope',
          type: 'checkbox-group',
          options: [
            { value: 'dataproc', label: 'Dataproc (Hadoop/Spark)' },
            { value: 'dataflow', label: 'Dataflow (Apache Beam)' },
            { value: 'bigquery', label: 'BigQuery (EDW)' },
            { value: 'composer', label: 'Cloud Composer (Airflow)' },
            { value: 'functions', label: 'Cloud Functions' },
            { value: 'cloudrun', label: 'Cloud Run' },
            { value: 'vertexai', label: 'Vertex AI / AI Platform' },
            { value: 'pubsub', label: 'Pub/Sub' },
            { value: 'bigtable', label: 'Bigtable' },
          ],
        },
        {
          name: 'otherServices',
          label: 'Other Services',
          type: 'text',
          placeholder: 'Specify any other relevant GCP services...',
        },

        // 1.2 Data Processing Workloads
        {
          name: 'totalJobs',
          label: 'Total Processing Jobs',
          type: 'number',
          min: 0,
          defaultValue: 0,
          placeholder: 'Dataproc jobs, Dataflow pipelines, etc.',
        },
        {
          name: 'jobsComplexity',
          label: 'Job Complexity Distribution (1 = Mostly Simple / Standard ETL, 5 = Highly Complex / Streaming & Custom)',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },

        // 1.3 Compute Resources
        { name: 'activeClusters', label: 'Active Clusters', type: 'number', min: 0 },
        {
          name: 'clusterSizes',
          label: 'Typical Cluster Nodes',
          type: 'text',
          placeholder: 'e.g., 5-50 nodes',
        },
        {
          name: 'instanceTypes',
          label: 'Instance Types',
          type: 'text',
          placeholder: 'e.g., n1-standard-4',
        },
      ],
    },

    // ── 2. Data Architecture & Storage ──────────────────────────────────
    {
      id: 'dataArchitecture',
      title: '2. Data Architecture & Storage',
      subtitle: 'Detail your BigQuery objects, storage metrics, and data movement patterns.',
      canMarkNA: true,
      fields: [
        // 2.1 Detailed Object Inventory
        {
          name: 'tableCount',
          label: 'Total Tables',
          type: 'number',
          min: 0,
          defaultValue: 0,
          placeholder: 'BigQuery Tables, External Tables',
        },
        {
          name: 'tableComplexity',
          label: 'Table Complexity (1 = Simple, 5 = Complex Schema)',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 2,
        },
        {
          name: 'viewCount',
          label: 'Total Views',
          type: 'number',
          min: 0,
          defaultValue: 0,
          placeholder: 'Logical Views, Materialized Views',
        },
        {
          name: 'viewComplexity',
          label: 'View Logic Complexity (1 = Simple Joins, 5 = Nested/Heavy Logic)',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },

        // 2.2 Storage Metrics
        { name: 'totalDataVolume', label: 'Total Data Volume (TB)', type: 'number', min: 0 },
        { name: 'bucketCount', label: 'GCS Buckets', type: 'number', min: 0 },
        { name: 'bqDatasets', label: 'BigQuery Datasets', type: 'number', min: 0 },
        {
          name: 'dataFormats',
          label: 'Data Formats in Use',
          type: 'text',
          placeholder: 'Parquet, Avro, JSON, CSV, Delta Lake...',
        },
        {
          name: 'otherStorage',
          label: 'Other Storage Systems',
          type: 'textarea',
          placeholder: 'Cloud SQL (Postgres/MySQL), Firestore, Spanner, etc.',
        },

        // 2.3 Data Movement Patterns
        { name: 'dailyIngestion', label: 'Daily Ingestion Volume (GB)', type: 'number', min: 0 },
        {
          name: 'ingestionRatio',
          label: 'Real-time vs Batch Ratio',
          type: 'text',
          placeholder: 'e.g., 20% Real-time / 80% Batch',
        },
        {
          name: 'apiSources',
          label: 'Data Sources (Upstream)',
          type: 'textarea',
          placeholder: 'List upstream systems (Salesforce, SAP, Oracle, IoT streams)...',
        },
      ],
    },

    // ── 3. Applications & Code Base ─────────────────────────────────────
    {
      id: 'applications',
      title: '3. Applications & Code Base',
      subtitle: 'Inventory stored procedures, scripts, and notebooks.',
      canMarkNA: true,
      fields: [
        // 3.1 Procedural Logic
        {
          name: 'totalProcs',
          label: 'Stored Procedures',
          type: 'number',
          min: 0,
          defaultValue: 0,
          placeholder: 'SQL Stored Procedures, UDFs',
        },
        {
          name: 'procComplexity',
          label: 'Procedural Complexity (1 = Standard, 5 = Heavy Business Logic)',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 4,
        },
        {
          name: 'totalScripts',
          label: 'Scripts / Notebooks',
          type: 'number',
          min: 0,
          defaultValue: 0,
          placeholder: 'Python, Scala, Shell, R',
        },
        {
          name: 'scriptComplexity',
          label: 'Code Complexity (1 = Standard Libs, 5 = Custom Frameworks)',
          type: 'range',
          min: 1,
          max: 5,
          defaultValue: 3,
        },
      ],
    },

    // ── 4. Orchestration & Workflow Management ──────────────────────────
    {
      id: 'orchestration',
      title: '4. Orchestration & Workflow Management',
      canMarkNA: true,
      fields: [
        {
          name: 'workflowTools',
          label: 'Orchestration Tools in Use',
          type: 'checkbox-group',
          options: [
            { value: 'airflow', label: 'Cloud Composer (Apache Airflow)' },
            { value: 'scheduler', label: 'Cloud Scheduler / Cron' },
            { value: 'templates', label: 'Dataflow Templates' },
            { value: 'dbt', label: 'dbt (Data Build Tool)' },
            { value: 'custom', label: 'Custom / Proprietary Orchestration' },
          ],
        },
        {
          name: 'orchDetails',
          label: 'Orchestration Details',
          type: 'textarea',
          placeholder: 'Describe DAG complexity, dependencies, external triggers...',
        },
      ],
    },

    // ── 5. Security & Compliance ────────────────────────────────────────
    {
      id: 'security',
      title: '5. Security & Compliance',
      canMarkNA: true,
      fields: [
        // 5.1 Authentication & Authorization
        {
          name: 'securityAuth',
          label: 'Authentication & Authorization',
          type: 'checkbox-group',
          options: [
            { value: 'iam', label: 'Google Cloud IAM' },
            { value: 'ad', label: 'Active Directory Integration' },
            { value: 'sa', label: 'Service Accounts Management' },
            { value: 'sso', label: 'Single Sign-On (SSO)' },
          ],
        },
        // 5.2 Data Protection
        {
          name: 'dataProtection',
          label: 'Data Protection',
          type: 'checkbox-group',
          options: [
            { value: 'cmek', label: 'CMEK (Customer Managed Keys)' },
            { value: 'dlp', label: 'Cloud DLP (Data Loss Prevention)' },
            { value: 'vpc', label: 'VPC Service Controls' },
          ],
        },
        {
          name: 'complianceReqs',
          label: 'Specific Compliance Requirements',
          type: 'textarea',
          placeholder: 'HIPAA, GDPR, PCI-DSS, FedRAMP...',
        },
      ],
    },

    // ── 6. Performance & SLA Requirements ───────────────────────────────
    {
      id: 'performance',
      title: '6. Performance & SLA Requirements',
      canMarkNA: true,
      fields: [
        {
          name: 'criticalJobTime',
          label: 'Critical Job Completion Time',
          type: 'text',
          placeholder: 'e.g., Daily ETL must finish by 6:00 AM',
        },
        {
          name: 'dataFreshness',
          label: 'Data Freshness Requirement',
          type: 'text',
          placeholder: 'e.g., < 15 minutes latency',
        },
        {
          name: 'concurrency',
          label: 'Concurrency Requirements',
          type: 'text',
          placeholder: 'e.g., 50 concurrent BI users',
        },
        {
          name: 'dataGrowthRate',
          label: 'Annual Data Growth Rate (%)',
          type: 'number',
          min: 0,
        },
      ],
    },

    // ── 7. Cost & Budget Considerations ─────────────────────────────────
    {
      id: 'budget',
      title: '7. Cost & Budget Considerations',
      canMarkNA: true,
      fields: [
        { name: 'totalSpend', label: 'Current Monthly Spend ($)', type: 'number', min: 0 },
        { name: 'targetSpend', label: 'Target Future Monthly Spend ($)', type: 'number', min: 0 },
        {
          name: 'costDrivers',
          label: 'Primary Cost Drivers',
          type: 'textarea',
          placeholder:
            'e.g., BigQuery on-demand analysis, long-running Dataproc clusters...',
        },
      ],
    },

    // ── 8. Migration Priorities & Phases ────────────────────────────────
    {
      id: 'priorities',
      title: '8. Migration Priorities & Phases',
      canMarkNA: true,
      fields: [
        {
          name: 'criticalWorkloads',
          label: 'Critical Workloads (Phase 1)',
          type: 'textarea',
          placeholder:
            'List workloads that must migrate first (high value, low complexity, or urgent deadline)...',
        },
        {
          name: 'standardWorkloads',
          label: 'Standard Workloads (Phase 2)',
          type: 'textarea',
          placeholder: 'List core business workloads...',
        },
        {
          name: 'deprecationCandidates',
          label: 'Deprecation Candidates',
          type: 'textarea',
          placeholder: 'List workloads to be retired or archived...',
        },
      ],
    },

    // ── 9. Success Criteria ─────────────────────────────────────────────
    {
      id: 'success',
      title: '9. Success Criteria',
      canMarkNA: true,
      fields: [
        {
          name: 'businessSuccess',
          label: 'Business Success Criteria',
          type: 'checkbox-group',
          options: [
            { value: 'cost', label: 'Cost Reduction' },
            { value: 'perf', label: 'Performance Improvement' },
            { value: 'scale', label: 'Scalability / Elasticity' },
            { value: 'unified', label: 'Unified Governance' },
            { value: 'ai', label: 'Enable AI/ML Capabilities' },
          ],
        },
        {
          name: 'successMetrics',
          label: 'Detailed Success Metrics (KPIs)',
          type: 'textarea',
          placeholder:
            'e.g., Reduce ETL runtime by 50%, Lower TCO by 30%, Enable real-time dashboarding...',
        },
        { name: 'costSavingsTarget', label: 'Cost Savings Target (%)', type: 'number', min: 0 },
        {
          name: 'performanceTarget',
          label: 'Performance Improvement Target (%)',
          type: 'number',
          min: 0,
        },
      ],
    },

    // ── Overall Complexity Assessment (ROM calculation) ─────────────────
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

    // ── Form Completion Details ──────────────────────────────────────────
    {
      id: 'contact',
      title: 'Form Completion Details',
      canMarkNA: false,
      fields: [
        { name: 'completedBy', label: 'Questionnaire Completed By', type: 'text', required: true },
        { name: 'completionDate', label: 'Date', type: 'date' },
      ],
    },
  ],
};
