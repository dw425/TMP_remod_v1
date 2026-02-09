import type { Product } from '@/types/product';

/** Readiness checklist shared across all tool products (from modals.js amIReadyModal) */
const defaultReadinessChecklist = [
  'We have identified a business sponsor for this initiative.',
  'Our data is accessible in a cloud or hybrid environment.',
  'We have a Databricks workspace provisioned (or planned).',
  'A technical team member has been assigned as the primary point of contact.',
  'We have a defined use case or problem statement.',
  'Relevant source data has been identified and can be sampled.',
  'Initial data quality is known and documented.',
  'We have a target timeline for a proof of concept (POC).',
  'Executive stakeholders are aware and supportive of this evaluation.',
];

export const products: Product[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // CRITICAL: TOP TRENDING INSIGHT MUST BE FIRST. DO NOT CHANGE ORDER.
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 7,
    slug: 'top-trending-insight',
    title: 'Top Trending Insight',
    subtitle: 'How AI-Powered Forecasting Rewrites the Marketing Playbook',
    type: 'accelerator',
    categories: [],
    description:
      'Stop Guessing: Winning in today\'s market requires a shift from hindsight to foresight. Discover how the "AI Factory" model predicts outcomes with precision using CampaignIQ.',
    features: [],
    priceMonthly: 0,
    priceAnnual: 0,
    tags: ['AI Strategy', 'Marketing', 'Forecasting'],
    detailPage: '/content/top-trending-insight',
  },

  // ── Tool Products ──────────────────────────────────────────────────────
  {
    id: 1,
    slug: 'lakehouse-optimizer',
    title: 'Lakehouse Optimizer',
    subtitle: 'AI-Powered Databricks Lakehouse Optimization.',
    type: 'tool',
    categories: ['financial-services', 'gaming', 'media', 'oil-gas', 'defense'],
    description:
      'Control costs, optimize architecture, and forecast value. Stop the "cost management whipsaw" and ensure financial accountability for your Databricks commitment.',
    longDescription:
      'A FinOps Director at a Fortune 500 company manages over 200 Databricks workspaces and faces growing compute costs, inconsistent table formats, and difficulty tracking optimization ROI across business units. The Lakehouse Optimizer provides real-time visibility, automated recommendations, and cost governance across the entire Databricks estate.',
    features: [
      'Real-time cost monitoring and alerts',
      'Automated optimization recommendations',
      'Forecast modeling and ROI tracking',
      'Multi-workspace governance dashboard',
    ],
    priceMonthly: 1000,
    priceAnnual: 10000,
    videoUrl: 'https://www.youtube.com/embed/OREruNWafPE',
    architectureImage: 'lho.png',
    readinessChecklist: defaultReadinessChecklist,
    tags: ['FinOps', 'Optimization', 'Databricks'],
    industries: ['All Industries'],
    cartId: 'lho-1',
    cartName: 'Lakehouse Optimizer - Single User',
    cartType: 'Software',
    whatItDoes: [
      {
        heading: 'Control costs, optimize architecture, and forecast value',
        paragraphs: [
          'Value Forecasting & Accountability: Forecast how your investment translates into measurable business outcomes. We break down planned usage into specific initiatives, allowing you to track budget-to-actual performance quarterly and hold business owners accountable for adoption targets.',
          'Stop the "Cost Whipsaw": Migration delays often lead to under-consumption, followed by panic-driven spikes in usage that overrun budgets. Lakehouse Optimizer provides the visibility needed to smooth out consumption, preventing the operational chaos of resource overuse.',
          'Architectural Optimization: Don\'t just shut things down to save money. We identify specific workloads that are inefficient or over-provisioned and recommend architectural changes to right-size your environment. This ensures you balance cost management with performance and scalability.',
        ],
      },
    ],
    benefits: [
      { title: 'Real-time Cost and Performance Insights.', description: '' },
      { title: 'Workload-specific Optimization Opportunities.', description: '' },
      { title: 'Roadmap for Sustainable Architecture.', description: '' },
    ],
    pricingTiers: [
      { name: 'Single User', price: '$1,000.00', action: 'addToCart' },
      { name: 'Team Account', price: '$5,000.00', action: 'contactSales' },
    ],
  },
  {
    id: 15,
    slug: 'campaign-iq',
    title: 'CampaignIQ',
    subtitle: 'AI-Powered Promotion & Campaign Analytics.',
    type: 'tool',
    categories: ['gaming', 'media'],
    description:
      'AI-powered media planning. Campaign IQ\'s ROAS Maximizer connects campaign data from disparate sources, providing a single source of truth for your marketing performance.',
    longDescription:
      'A CMO at a global retailer oversees $50M+ in annual promotional spend but struggles with inconsistent campaign attribution and slow reporting cycles. CampaignIQ connects to existing data infrastructure and provides real-time campaign intelligence, predictive performance modeling, and automated optimization recommendations.',
    features: [
      'Predictive campaign performance modeling',
      'Automated budget optimization across channels',
      'Real-time ROI tracking and attribution',
      'Integration with major ad platforms',
    ],
    priceMonthly: 1000,
    priceAnnual: 10000,
    videoUrl: 'https://www.youtube.com/embed/smNEBimkSGI',
    architectureImage: 'Slide15.JPG',
    readinessChecklist: defaultReadinessChecklist,
    tags: ['AI', 'Marketing', 'ROAS'],
    industries: ['All Industries', 'Gaming', 'Media'],
    cartId: 'ciq-1',
    cartName: 'CampaignIQ - Single User',
    cartType: 'Software',
    whatItDoes: [
      {
        heading: 'Forecast campaign outcomes and optimize marketing spend',
        paragraphs: [
          'Intelligent Promotion Forecasting: Uses machine learning models trained on your historical campaign data to predict the performance of upcoming promotions before they launch — giving marketers confidence in their planning decisions.',
          'Campaign Performance Scoring: Assigns a real-time health score to every active campaign based on engagement velocity, conversion rates, and budget burn rate. Surface underperforming campaigns early and reallocate spend to top performers.',
          'Anomaly Detection & Alerts: Monitors campaign metrics 24/7 and automatically flags unusual patterns — whether it\'s a sudden spike in CPC, a drop in conversion rate, or an attribution discrepancy across channels.',
        ],
      },
    ],
    benefits: [
      { title: 'Higher Campaign ROI', description: 'Data-driven allocation increases return on ad spend by up to 35%.' },
      { title: 'Faster Decision Cycles', description: 'Real-time dashboards replace weekly reporting with instant insights.' },
      { title: 'Eliminate Guesswork', description: 'ML-powered forecasts replace intuition with validated predictions.' },
    ],
    pricingTiers: [
      { name: 'Single User', price: '$1,000.00', action: 'addToCart' },
      { name: 'Team Account', price: '$5,000.00', action: 'contactSales' },
    ],
  },
  {
    id: 16,
    slug: 'sap-working-capital',
    title: 'SAP Working Capital',
    subtitle: 'Real-Time Working Capital Intelligence from SAP.',
    type: 'tool',
    categories: ['financial-services'],
    description:
      'Real-Time Working Capital Intelligence Powered by SAP and Databricks. Unify disparate SAP sources (receivables, payables, inventory) to automate pipeline and forecast cash flow.',
    longDescription:
      'SAP has long been the backbone of enterprise operations, but its rigid architecture and siloed data structures limit modern analytics capabilities. Traditional SAP environments impose a "tax" on operations—high labor costs for data movement and latency due to inaccessible data. Blueprint\'s SAP Databricks solution integrates SAP data into an open, scalable Lakehouse architecture, enabling real-time insights, AI-driven automation, and seamless integration across business units.',
    features: [
      'Direct SAP ERP integration',
      'Cash flow forecasting with ML',
      'Supplier risk scoring and alerts',
      'Executive dashboards and reporting',
    ],
    priceMonthly: 1000,
    priceAnnual: 10000,
    placeholderIcon: 'bar-chart',
    architectureImage: 'sap_image2.png',
    readinessChecklist: defaultReadinessChecklist,
    tags: ['Finance', 'SAP', 'Manufacturing'],
    industries: ['All Industries', 'Financial Services'],
    cartId: 'sap-wc-1',
    cartName: 'SAP Working Capital - Single User',
    cartType: 'Software',
    whatItDoes: [
      {
        heading: 'How We Do It',
        paragraphs: [
          'Eliminating Costly Data Silos: We enable businesses to access SAP and external data instantly—without expensive integrations or manual transformations. This ensures a faster, more cost-efficient flow of insights across the organization.',
          'AI-Driven Financial Intelligence: With real-time AI-powered analytics, finance teams can optimize revenue forecasting, cash flow management, and operational efficiency. This allows for faster, data-backed decision-making.',
          'Lowering TCO & Maximizing ROI: By shifting to a cloud-first architecture that separates storage from compute, organizations can significantly reduce SAP-related infrastructure costs while maintaining scalability and control.',
          'Enhancing Financial Agility: Our approach moves organizations beyond slow, outdated reporting cycles. With real-time scenario modeling, cost optimization, and dynamic business planning, companies can protect margins and capitalize on market shifts.',
        ],
      },
    ],
    benefits: [
      { title: 'Improved Cash Position', description: 'Unlock trapped working capital with data-driven payment optimization.' },
      { title: 'Faster Close Cycles', description: 'Automated reconciliation and forecasting reduce month-end close time.' },
      { title: 'Proactive Risk Management', description: 'Detect supplier and receivables risk before it impacts operations.' },
    ],
    pricingTiers: [
      { name: 'Single User', price: '$1,000.00', action: 'addToCart' },
      { name: 'Team Account', price: '$5,000.00', action: 'contactSales' },
    ],
  },
  {
    id: 17,
    slug: 'promotion-iq',
    title: 'PromotionIQ',
    subtitle: 'Analyze, Optimize, and Recommend Promotions with AI.',
    type: 'tool',
    categories: ['gaming', 'media'],
    description:
      'Analyze, Optimize, and Recommend Promotions. Forecast promotion effectiveness beyond redemptions and track spend accountability with AI.',
    longDescription:
      'The VP of Marketing at a top-tier sportsbook has an aggressive bonus budget and is under pressure to drive new user acquisition, boost retention, and increase deposit frequency. Her goal: ensure promotional spend delivers ROI and validate that campaigns are effectively personalized for maximum impact.',
    features: [
      'Historical promotion performance analysis',
      'A/B test recommendations',
      'Segment-based targeting optimization',
      'Predictive lift modeling',
    ],
    priceMonthly: 1000,
    priceAnnual: 10000,
    placeholderIcon: 'dollar-circle',
    architectureImage: 'promotioniq.png',
    readinessChecklist: defaultReadinessChecklist,
    tags: ['Marketing', 'Promotion', 'Sportsbook'],
    industries: ['All Industries', 'Gaming', 'Media'],
    cartId: 'promo-1',
    cartName: 'PromotionIQ - Single User',
    cartType: 'Software',
    whatItDoes: [
      {
        heading: 'Forecast effectiveness and optimize spend accountability',
        paragraphs: [
          'Promotion Effectiveness Forecasting: Move beyond simple redemption tracking. PromotionIQ helps you understand which campaigns drive actual deposits, bets, and long-term retention. It segments users by behavior and predicts how different promotions might perform before they launch.',
          'Spend Accountability: With millions allocated to bonuses, you need a clear roadmap for outcomes. We break down offer redemptions, post-redemption behavioral changes, and alignment with business KPIs to ensure every dollar is accounted for.',
          'Marketing Team Enablement: Equip campaign managers with tools to test, learn, and optimize offer structures without heavy reliance on data teams. Using foundation models trained on sportsbook data, PromotionIQ suggests new strategies to reduce bonus waste and increase lifetime value.',
        ],
      },
    ],
    benefits: [
      { title: 'Maximize Promo ROI', description: 'Identify high-ROI promotions across different user cohorts.' },
      { title: 'Eliminate Waste', description: 'Forecast and explain performance outcomes based on behavior.' },
      { title: 'Strategic Planning', description: 'Equip marketers to personalize offers and reduce bonus waste.' },
    ],
    pricingTiers: [
      { name: 'Single User', price: '$1,000.00', action: 'addToCart' },
      { name: 'Team Account', price: '$5,000.00', action: 'contactSales' },
    ],
  },
  {
    id: 18,
    slug: 'churn-iq',
    title: 'ChurnIQ',
    subtitle: 'Predictive Retention Intelligence.',
    type: 'tool',
    categories: ['financial-services', 'gaming', 'media'],
    description:
      'Predict, Segment, and Retain Customers with Databricks. Proactively identify at-risk users using behavioral patterns and generate tailored next-best actions.',
    longDescription:
      'A VP of Player Retention at a major gaming operator is seeing rising churn rates despite increasing marketing spend. The team has data on player behavior, transactions, and support interactions — but no scalable way to predict who will leave or why. ChurnIQ transforms raw behavioral data into actionable retention intelligence.',
    features: [
      'Churn prediction with 90%+ accuracy',
      'Dynamic customer segmentation',
      'Automated retention workflows',
      'LTV and churn cost analysis',
    ],
    priceMonthly: 1000,
    priceAnnual: 10000,
    placeholderIcon: 'users',
    architectureImage: 'chunrIQ.png',
    readinessChecklist: defaultReadinessChecklist,
    tags: ['Customer Success', 'Churn', 'Gaming'],
    industries: ['All Industries'],
    cartId: 'churn-iq-1',
    cartName: 'ChurnIQ - Single User',
    cartType: 'Software',
    whatItDoes: [
      {
        heading: 'Predict and prevent customer churn before it happens',
        paragraphs: [
          'Predictive Churn Scoring: Assigns a real-time churn probability score to every customer based on behavioral signals — login frequency, transaction patterns, support interactions, and engagement trends. Scores update continuously as new data arrives.',
          'Driver Analysis Engine: Goes beyond prediction to explain WHY customers are likely to churn. Surfaces the top contributing factors for each at-risk segment — whether it\'s pricing sensitivity, product friction, competitive switching, or service dissatisfaction.',
          'Retention Playbook Generator: Automatically generates segment-specific retention strategies based on churn drivers. Recommends the optimal intervention — discount offer, personal outreach, feature education, or loyalty reward — with expected impact estimates.',
        ],
      },
    ],
    benefits: [
      { title: 'Reduce Churn', description: 'Identify at-risk customers weeks before they leave.' },
      { title: 'Targeted Interventions', description: 'Match the right retention action to each customer segment.' },
      { title: 'Revenue Protection', description: 'Quantify the revenue impact of churn and retention programs.' },
    ],
    pricingTiers: [
      { name: 'Single User', price: '$1,000.00', action: 'addToCart' },
      { name: 'Team Account', price: '$5,000.00', action: 'contactSales' },
    ],
  },
  {
    id: 19,
    slug: 'customer-support-iq',
    title: 'CustomerSupport IQ',
    subtitle: 'Real-Time Transcript Intelligence and Agent Coaching with GenAI.',
    type: 'tool',
    categories: ['healthcare'],
    description:
      'Real-Time Transcript Intelligence and Agent Coaching with GenAI. Elevating Customer Experience Through GenAI-Powered Insights.',
    longDescription:
      'The VP of Customer Support at a global enterprise is responsible for improving customer satisfaction, reducing churn, and coaching a distributed team of agents handling thousands of customer calls weekly. CustomerSupport IQ leverages GenAI to analyze call transcripts in real-time, surface coaching opportunities, detect churn signals, and track sentiment trends.',
    features: [
      'Real-time transcript processing with GenAI',
      'Sentiment and intent analysis',
      'Automated coaching recommendations',
      'Quality assurance dashboards',
    ],
    priceMonthly: 1000,
    priceAnnual: 10000,
    placeholderIcon: 'microphone',
    architectureImage: 'csiq.png',
    readinessChecklist: defaultReadinessChecklist,
    tags: ['Customer Support', 'GenAI', 'Sentiment Analysis'],
    industries: ['All Industries'],
    cartId: 'cs-iq-1',
    cartName: 'CustomerSupport IQ - Single User',
    cartType: 'Software',
    whatItDoes: [
      {
        heading: 'Scale agent coaching and detect risk in real-time',
        paragraphs: [
          'Agent Coaching at Scale: Identify coaching opportunities without listening to every call. The system surfaces real examples showing where agents need support on tone, accuracy, or escalation handling.',
          'Churn Signals & Escalation Risk: Gain real-time visibility into when customers express frustration, intent to cancel, or dissatisfaction. The solution alerts stakeholders to potential churn risks before the customer is lost.',
          'Sentiment & Trend Analysis: Understand which topics are trending in calls and how sentiment varies across teams and time. This data helps support leaders coach better and provides critical feedback loops to product and operations teams.',
          'Team Performance Accountability: Compare teams and agents based on call quality, resolution rates, and coaching improvements. Use data-driven insights to recognize high performers and support struggling teams effectively.',
        ],
      },
    ],
    benefits: [
      { title: 'Faster Resolution', description: 'Summarized coaching feedback per agent and call.' },
      { title: 'Agent Efficiency', description: 'Real-time alerts for churn signals or escalation keywords.' },
      { title: 'Proactive Service', description: 'Dashboards to track call volume, themes, and sentiment.' },
    ],
    pricingTiers: [
      { name: 'Single User', price: '$1,000.00', action: 'addToCart' },
      { name: 'Team Account', price: '$5,000.00', action: 'contactSales' },
    ],
  },

  // ── Non-tool products ──────────────────────────────────────────────────
  {
    id: 13,
    slug: 'ai-factory',
    title: "Blueprint's AI Factory",
    subtitle: 'From strategy to production in 90 days.',
    type: 'service',
    categories: ['healthcare', 'oil-gas', 'defense'],
    description:
      'The assembly line for business-ready AI. Shift from experimentation to industrialized delivery reducing risk and accelerating value.',
    features: [
      '90-Day implementation roadmap',
      'Pre-built RAG templates',
      'Model governance and monitoring',
      'Production deployment patterns',
    ],
    priceMonthly: 0,
    priceAnnual: 0,
    videoUrl: 'https://www.youtube.com/embed/48gEgOcCaKo',
    tags: ['GenAI', 'RAG', 'Tutorial'],
    industries: ['All Industries', 'Defense', 'Oil & Gas'],
    detailPage: '/content/ai-factory',
  },
  {
    id: 20,
    slug: 'data-migration-suite',
    title: 'The Blueprint Data Migration Suite',
    subtitle: 'End-to-End Migration Assessment & Acceleration',
    type: 'accelerator',
    categories: [],
    description:
      'Assess, transform, and enhance your data migration initiative.\n\nMigration Analyzer: Delivers a deep assessment of EDW migration feasibility, complexity, and cost using AI-driven insights.\n\nMigration Transformer: Automates schema, code, and pipeline migration to Databricks using metadata-driven frameworks.\n\nMigration Optimizer: Enhances performance, governance, and BI modernization post-migration using AI-driven cost tuning.',
    features: [
      'Platform-specific assessment forms',
      'Automated ROM calculator',
      'Migration playbooks and templates',
      'Post-migration optimization',
    ],
    priceMonthly: 0,
    priceAnnual: 0,
    tags: ['Migration', 'Modernization', 'Legacy'],
    industries: ['All Industries'],
    detailPage: '/migration',
  },
];
