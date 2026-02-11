import { sanitizeInput } from '@/lib/sanitize';
import { products } from '@/data/products';

const MAX_CHAT_MESSAGE_LENGTH = 500;

interface ChatContext {
  currentPath: string;
  currentPage: string;
  userAuthenticated: boolean;
  userName?: string;
}

interface QuickAction {
  label: string;
  message: string;
}

// ─── Product Knowledge ──────────────────────────────────

const PRODUCT_INFO: Record<string, { name: string; price: string; summary: string; slug: string }> = {};
for (const p of products) {
  PRODUCT_INFO[p.slug] = {
    name: p.title,
    price: p.priceMonthly > 0 ? `$${p.priceMonthly.toLocaleString()}/mo` : 'Free / Contact Sales',
    summary: p.description,
    slug: p.slug,
  };
}

// ─── Knowledge Base ─────────────────────────────────────

const KNOWLEDGE_BASE: Record<string, string[]> = {
  pricing: [
    'Our IQ products start at $1,000/month for single-user licenses. Team licenses (5 users) are $5,000/month. Enterprise pricing is available — contact sales for a custom quote.',
    'All products include Databricks integration, ongoing support, and regular updates. Annual plans with a discount can be arranged through sales.',
    'The AI Factory and Migration Suite are service/accelerator offerings — contact sales for engagement pricing.',
  ],
  migration: [
    'The Blueprint Data Migration Suite is a comprehensive, AI-driven toolset covering assessment, transformation, and optimization for enterprise data platform migrations to Databricks.',
    'The Migration Suite supports 11 platforms: Teradata, Snowflake, Oracle, Redshift, SQL Server, Informatica, Azure Synapse, SAP, Talend, GCP, and Unity Catalog.',
    'Each platform assessment covers environment details, data volumes, complexity scoring, ETL pipelines, security requirements, and target state architecture. It generates a ROM (Rough Order of Magnitude) cost estimate.',
    'Assessments include sections for data quality & readiness, disaster recovery planning, migration urgency, and rollback strategy. They typically take 15-20 minutes to complete.',
    'Results include time estimates, staffing recommendations, risk factors, and a detailed cost breakdown you can submit as a proposal request.',
  ],
  contact: [
    'Reach our team at Info@bpcs.com or call (206) 455-8326.',
    'Use the "Contact Sales" button on any product page for pricing discussions. We typically respond within 1 business day.',
    'You can also use the "Talk to Sales" button on the marketplace homepage or the Contact Sales modal on the AI Factory page.',
  ],
  databricks: [
    'All Blueprint products are built natively for Databricks. You need an active workspace to deploy.',
    'We support three deployment methods: OAuth one-click deploy, manual notebook download, or Databricks Asset Bundle (DAB) CLI deploy.',
    'Products leverage Delta Lake, Unity Catalog, and MLflow for enterprise-grade data management and governance.',
    'Connect your Databricks workspace from the Deployments page in your account dashboard.',
  ],
  'lakehouse-optimizer': [
    'Lakehouse Optimizer provides real-time cost monitoring, automated optimization recommendations, and multi-workspace governance for your Databricks Lakehouse.',
    'Key capabilities: Value Forecasting & Accountability, Cost Whipsaw Prevention, and Architectural Optimization for right-sizing workloads.',
    'It helps FinOps teams manage 200+ workspaces with visibility into budget-to-actual performance, compute costs, and ROI tracking.',
    'Starting at $1,000/mo for single user. Team license (5 users) at $5,000/mo.',
  ],
  'campaign-iq': [
    'CampaignIQ is an AI-powered campaign analytics engine that connects data from disparate sources into a single source of truth for marketing performance.',
    'Key capabilities: Intelligent Promotion Forecasting, Campaign Performance Scoring with real-time health scores, and Anomaly Detection & Alerts that monitor metrics 24/7.',
    'It helps achieve up to 35% higher campaign ROI, faster decision cycles with instant dashboards, and ML-powered forecasts that replace guesswork.',
    'Starting at $1,000/mo for single user. Team license (5 users) at $5,000/mo.',
  ],
  'sap-working-capital': [
    'SAP Working Capital provides real-time working capital intelligence powered by SAP and Databricks integration.',
    'It unifies SAP sources (receivables, payables, inventory) to automate pipeline and forecast cash flow with ML-driven analytics.',
    'Key capabilities: Cash Flow Prediction Engine, DPO/DSO/DIO Optimization, Supplier Risk Scoring, and Executive Dashboards.',
    'It eliminates costly data silos, enables AI-driven financial intelligence, and lowers TCO by shifting to cloud-first architecture.',
    'Starting at $1,000/mo for single user. Team license (5 users) at $5,000/mo.',
  ],
  'churn-iq': [
    'ChurnIQ is a predictive retention intelligence engine that identifies customers most likely to churn using behavioral patterns.',
    'Key capabilities: Predictive Churn Scoring (90%+ accuracy), Driver Analysis Engine that explains WHY customers churn, and Retention Playbook Generator with segment-specific strategies.',
    'It helps reduce churn by identifying at-risk customers weeks in advance and recommending the optimal intervention — discount, outreach, feature education, or loyalty reward.',
    'Starting at $1,000/mo for single user. Team license (5 users) at $5,000/mo.',
  ],
  'customer-support-iq': [
    'CustomerSupport IQ provides real-time transcript intelligence and agent coaching powered by GenAI.',
    'Key capabilities: Agent Coaching at Scale (surface coaching opportunities without listening to every call), Churn Signals & Escalation Risk detection, Sentiment & Trend Analysis, and Team Performance Accountability.',
    'It processes call transcripts in real-time, flags frustration or cancellation intent, and provides dashboards tracking call volume, themes, and sentiment.',
    'Starting at $1,000/mo for single user. Team license (5 users) at $5,000/mo.',
  ],
  'promotion-iq': [
    'PromotionIQ is a deep analytics engine for retail, CPG, and sportsbook promotion management.',
    'Key capabilities: Promotion Effectiveness Forecasting (beyond simple redemption tracking), Spend Accountability with per-dollar ROI tracking, and Marketing Team Enablement with self-service testing tools.',
    'It helps maximize promo ROI across user cohorts, eliminate waste with behavioral forecasting, and equip marketers to personalize offers.',
    'Starting at $1,000/mo for single user. Team license (5 users) at $5,000/mo.',
  ],
  'ai-factory': [
    "Blueprint's AI Factory is a 90-day engagement framework to build and deploy production-grade AI solutions on Databricks.",
    'Three engagement levels: Strategy Sprint (1-day workshop, $5K-$15K), Build & Prove (6-week foundations, $50K-$100K), and Scale & Embed (12-week build & deploy, $150K-$300K).',
    'The framework covers 5 phases: Alignment, POC, MVP, Pre-Production, and Production. It includes pre-built RAG templates, model governance, and production deployment patterns.',
    'Built on the Databricks Data Intelligence Platform and certified as a Databricks Brickbuilder Solution.',
  ],
  'data-migration-suite': [
    'The Blueprint Data Migration Suite covers three phases: Migration Analyzer (assessment & feasibility), Migration Transformer (automated code conversion), and Migration Optimizer (post-migration tuning).',
    'Supports 11 source platforms: Teradata, Snowflake, Oracle, SQL Server, Redshift, Informatica, Azure Synapse, SAP, Talend, GCP, and Unity Catalog.',
    'Each assessment includes environment analysis, data quality scoring, rollback planning, disaster recovery, and generates a detailed ROM cost estimate.',
  ],
  'top-trending-insight': [
    'Top Trending Insight is a whitepaper on how AI-Powered Forecasting is rewriting the marketing playbook.',
    'It explores how the AI Factory model predicts outcomes with precision using CampaignIQ for data-driven marketing strategies.',
  ],
  download: [
    'Downloads are available from your account dashboard after purchase.',
    'All downloads include license watermarking with your email for security.',
    'You can download Jupyter notebooks, Python wheels, and Databricks Asset Bundles.',
  ],
  account: [
    'Sign up for a free account to access downloads, deployments, and order history.',
    'Your dashboard shows purchased products, migration assessments, downloads, and deployment status.',
    'Manage your profile, company info, and notification preferences in Account Settings.',
    'Your wishlist lets you save products for later — accessible from the heart icon on any product card.',
  ],
  deployment: [
    'Deploy products to Databricks using three methods: OAuth one-click deploy, manual notebook upload, or Databricks Asset Bundle CLI.',
    'Visit your Deployments page to connect your Databricks workspace via OAuth.',
    'All deployments are tracked with version history and status updates.',
  ],
  search: [
    'Use the search bar in the header to find products by name, tag, or category.',
    'Search results show product type, description, and link directly to the product detail page.',
  ],
  wishlist: [
    'Save products to your wishlist by clicking the heart icon on any product card or detail page.',
    'View and manage your wishlist from the account dashboard.',
  ],
  cart: [
    'Add tool products to your cart from the marketplace or product detail pages.',
    'The cart supports monthly billing. Choose quantity and review your order before submitting a PO request.',
    'PO requests are submitted via Formspree and our team will follow up within 1 business day.',
  ],
};

// ─── Fuzzy Matching ─────────────────────────────────────

function levenshtein(a: string, b: string): number {
  const m = b.length + 1;
  const n = a.length + 1;
  const matrix = Array.from({ length: m }, (_, i) => {
    const row = new Array<number>(n).fill(0);
    row[0] = i;
    return row;
  });
  for (let j = 1; j < n; j++) matrix[0]![j] = j;
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1;
      matrix[i]![j] = Math.min(
        matrix[i - 1]![j]! + 1,
        matrix[i]![j - 1]! + 1,
        matrix[i - 1]![j - 1]! + cost,
      );
    }
  }
  return matrix[b.length]![a.length]!;
}

function fuzzyMatch(input: string, target: string): boolean {
  if (input.length < 3) return input === target;
  if (target.includes(input)) return true;
  return levenshtein(input, target) <= Math.floor(target.length * 0.3);
}

// ─── Intent Detection ───────────────────────────────────

type Intent = 'greeting' | 'pricing' | 'product_info' | 'migration' | 'contact' | 'deployment' | 'download' | 'account' | 'ai-factory' | 'search' | 'wishlist' | 'cart' | 'recommendation' | 'comparison' | 'unknown';

const KEYWORD_MAP: Record<string, string[]> = {
  pricing: ['price', 'pricing', 'cost', 'how much', 'plan', 'license', 'subscription', 'pay', 'billing', 'enterprise', 'team'],
  migration: ['migrat', 'assess', 'rom', 'platform', 'snowflake', 'oracle', 'redshift', 'sql server', 'informatica', 'synapse', 'teradata', 'talend', 'gcp', 'unity catalog', 'data warehouse', 'edw'],
  contact: ['contact', 'email', 'reach', 'support', 'help', 'sales', 'talk', 'phone', 'call'],
  deployment: ['deploy', 'databricks', 'workspace', 'cluster', 'notebook', 'oauth', 'install', 'asset bundle'],
  download: ['download', 'wheel', 'bundle', 'file', 'watermark'],
  account: ['account', 'sign up', 'register', 'login', 'profile', 'settings', 'password', 'dashboard'],
  'ai-factory': ['ai factory', 'engagement', 'tier', 'consulting', '90 day', '90-day', 'sprint', 'workshop', 'brickbuilder'],
  search: ['search', 'find', 'browse', 'look for', 'where is'],
  wishlist: ['wishlist', 'wish list', 'save for later', 'favorite', 'heart'],
  cart: ['cart', 'checkout', 'purchase order', 'po request', 'buy', 'order'],
  recommendation: ['recommend', 'suggest', 'what should', 'which product', 'best for', 'right for'],
  comparison: ['compare', 'difference', 'vs', 'versus', 'between'],
};

function detectIntent(message: string): { intent: Intent; productSlug?: string } {
  const lower = message.toLowerCase().trim();

  // Greeting
  if (['hi', 'hello', 'hey', 'help', 'hi there', 'good morning', 'good afternoon'].includes(lower)) {
    return { intent: 'greeting' };
  }

  // Product-specific query
  for (const [slug, info] of Object.entries(PRODUCT_INFO)) {
    const nameWords = info.name.toLowerCase().split(/\s+/);
    if (nameWords.some((w) => fuzzyMatch(w, lower) || lower.includes(w)) || lower.includes(slug)) {
      return { intent: 'product_info', productSlug: slug };
    }
  }

  // General intent
  for (const [intent, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some((k) => lower.includes(k))) {
      return { intent: intent as Intent };
    }
  }

  return { intent: 'unknown' };
}

// ─── Response Generation ────────────────────────────────

function getProductResponse(slug: string): string {
  const info = PRODUCT_INFO[slug];
  const kb = KNOWLEDGE_BASE[slug];

  if (info && kb && kb.length > 0) {
    return `**${info.name}** (${info.price})\n\n${kb[0]}${kb.length > 1 ? '\n\n' + kb[1] : ''}`;
  }
  if (info) {
    return `**${info.name}** — ${info.summary}\n\nPricing: ${info.price}`;
  }
  return "I don't have specific details about that product. Would you like to browse our marketplace?";
}

function getRecommendation(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('marketing') || lower.includes('campaign') || lower.includes('ad') || lower.includes('roas')) {
    return 'Based on your interest, I\'d recommend **CampaignIQ** for campaign analytics and ROAS optimization, or **PromotionIQ** for retail/sportsbook promotion management. Both start at $1,000/mo.';
  }
  if (lower.includes('churn') || lower.includes('retention') || lower.includes('customer loss')) {
    return 'For customer retention, check out **ChurnIQ** — it predicts churn with 90%+ accuracy and generates segment-specific retention playbooks. Starts at $1,000/mo.';
  }
  if (lower.includes('support') || lower.includes('call center') || lower.includes('agent') || lower.includes('transcript')) {
    return '**CustomerSupport IQ** uses GenAI to analyze call transcripts in real-time, coach agents at scale, and detect churn signals. Starts at $1,000/mo.';
  }
  if (lower.includes('sap') || lower.includes('cash') || lower.includes('finance') || lower.includes('working capital')) {
    return 'For financial operations, **SAP Working Capital** integrates with your SAP ERP for real-time cash flow forecasting, supplier risk scoring, and DPO/DSO optimization.';
  }
  if (lower.includes('databricks') || lower.includes('lakehouse') || lower.includes('performance') || lower.includes('finops') || lower.includes('cost')) {
    return 'For Databricks optimization, **Lakehouse Optimizer** provides real-time cost monitoring, automated recommendations, and multi-workspace governance. Starts at $1,000/mo.';
  }
  if (lower.includes('migrat') || lower.includes('legacy') || lower.includes('warehouse') || lower.includes('edw')) {
    return 'For data platform migration, the **Blueprint Data Migration Suite** covers 11 source platforms with AI-driven assessment, automated code conversion, and post-migration optimization.';
  }
  if (lower.includes('ai') || lower.includes('genai') || lower.includes('rag') || lower.includes('model')) {
    return "**Blueprint's AI Factory** takes you from strategy to production-grade AI in 90 days. Three engagement tiers available — from a 1-day Strategy Sprint to a 12-week Scale & Embed program.";
  }
  return 'We offer 6 tool products (Lakehouse Optimizer, CampaignIQ, SAP Working Capital, ChurnIQ, CustomerSupport IQ, PromotionIQ), plus the AI Factory service and Data Migration Suite. Could you tell me more about your use case? I\'ll recommend the best fit.';
}

function getComparison(): string {
  return 'Here\'s our full product lineup:\n\n' +
    '**Tools** ($1,000/mo single user, $5,000/mo team):\n' +
    '- **Lakehouse Optimizer**: Databricks FinOps & performance tuning\n' +
    '- **CampaignIQ**: AI-powered campaign & marketing analytics\n' +
    '- **SAP Working Capital**: Cash flow & working capital intelligence\n' +
    '- **ChurnIQ**: Predictive customer retention\n' +
    '- **CustomerSupport IQ**: GenAI-powered transcript intelligence\n' +
    '- **PromotionIQ**: Promotion effectiveness & spend optimization\n\n' +
    '**Services & Accelerators** (contact sales):\n' +
    '- **AI Factory**: 90-day AI deployment framework\n' +
    '- **Data Migration Suite**: 11-platform migration assessment & acceleration\n\n' +
    'Want details on any specific product?';
}

function findBestResponse(message: string): string {
  const { intent, productSlug } = detectIntent(message);

  switch (intent) {
    case 'product_info':
      return productSlug ? getProductResponse(productSlug) : getComparison();
    case 'recommendation':
      return getRecommendation(message);
    case 'comparison':
      return getComparison();
    default: {
      const responses = KNOWLEDGE_BASE[intent];
      if (responses && responses.length > 0) {
        return responses[Math.floor(Math.random() * responses.length)] ?? '';
      }
      return "I can help with product information, pricing, migration assessments, downloads, deployments, cart, wishlist, and account questions. Try asking about a specific product like \"Tell me about CampaignIQ\" or \"What are the pricing options?\".";
    }
  }
}

function getContextGreeting(context: ChatContext): string {
  if (context.currentPath.includes('/migration') && context.currentPath.includes('/calculator')) {
    return "I see you're reviewing your ROM estimate. Need help understanding the cost breakdown?";
  }
  if (context.currentPath.includes('/migration/')) {
    return "Working on a migration assessment? I can help explain any of the questions.";
  }
  if (context.currentPath.includes('/migration')) {
    return "Welcome to the Migration Suite! I can help you choose the right platform assessment.";
  }
  if (context.currentPath.includes('/products/')) {
    return "Looking at a product? I can tell you about pricing, features, or deployment options.";
  }
  if (context.currentPath.includes('/cart')) {
    return "Ready to check out? I can help with the PO request process.";
  }
  if (context.currentPath.includes('/content/ai-factory')) {
    return "Interested in AI Factory services? I can explain the engagement tiers and our 90-day delivery framework.";
  }
  if (context.currentPath.includes('/account/downloads')) {
    return "Need help with a download? All files include license watermarking for security.";
  }
  if (context.currentPath.includes('/account/deployments')) {
    return "Ready to deploy? Connect your Databricks workspace to get started.";
  }
  if (context.userAuthenticated && context.userName) {
    return `Hi ${context.userName}! How can I help you today?`;
  }
  return "Welcome to Blueprint Marketplace! I can help with products, pricing, migrations, and more. What would you like to know?";
}

export function getQuickActions(currentPath: string): QuickAction[] {
  if (currentPath.includes('/migration') && !currentPath.includes('/calculator')) {
    return [
      { label: 'Platforms', message: 'What platforms do you support for migration?' },
      { label: 'ROM Estimate', message: 'How is the ROM cost estimate calculated?' },
      { label: 'Get Started', message: 'How do I start a migration assessment?' },
    ];
  }
  if (currentPath.includes('/products/')) {
    return [
      { label: 'Pricing', message: 'What are the pricing options for this product?' },
      { label: 'Compare', message: 'Compare all products' },
      { label: 'Deployment', message: 'How do I deploy this product to Databricks?' },
    ];
  }
  if (currentPath === '/' || currentPath === '') {
    return [
      { label: 'Products', message: 'What products do you offer?' },
      { label: 'Recommend', message: 'What product do you recommend for my use case?' },
      { label: 'Pricing', message: 'What are the pricing options?' },
    ];
  }
  if (currentPath.includes('/cart')) {
    return [
      { label: 'PO Process', message: 'How does the PO request process work?' },
      { label: 'Enterprise', message: 'Tell me about enterprise pricing.' },
    ];
  }
  if (currentPath.includes('/content/ai-factory')) {
    return [
      { label: 'Tiers', message: 'What are the AI Factory engagement tiers?' },
      { label: 'Timeline', message: 'How long does a typical AI Factory engagement take?' },
      { label: 'Am I Ready?', message: 'What do I need before starting an AI Factory engagement?' },
    ];
  }
  if (currentPath.includes('/account')) {
    return [
      { label: 'Downloads', message: 'How do I access my downloads?' },
      { label: 'Deploy', message: 'How do I deploy to Databricks?' },
    ];
  }
  return [
    { label: 'Products', message: 'What products do you offer?' },
    { label: 'Pricing', message: 'What are the pricing options?' },
    { label: 'Migration', message: 'Tell me about migration assessments.' },
  ];
}

export async function generateResponse(
  message: string,
  context: ChatContext,
): Promise<string> {
  // Simulate typing delay
  await new Promise((r) => setTimeout(r, 500 + Math.random() * 1000));

  // Sanitize and length-limit input
  const sanitized = sanitizeInput(message.slice(0, MAX_CHAT_MESSAGE_LENGTH));

  // Check for greeting
  const { intent } = detectIntent(sanitized);
  if (intent === 'greeting') {
    return getContextGreeting(context);
  }

  return findBestResponse(sanitized);
}
