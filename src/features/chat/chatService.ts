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
  if (p.type === 'tool') {
    PRODUCT_INFO[p.slug] = {
      name: p.title,
      price: `$${p.priceMonthly.toLocaleString()}/mo`,
      summary: p.description,
      slug: p.slug,
    };
  }
}

// ─── Knowledge Base ─────────────────────────────────────

const KNOWLEDGE_BASE: Record<string, string[]> = {
  pricing: [
    'Our IQ products start at $1,000/month for single-user licenses. Team licenses (5 users) are $5,000/month. Enterprise pricing is available — contact sales for a custom quote.',
    'All products include Databricks integration, ongoing support, and regular updates.',
    'We offer monthly billing. Annual plans with a discount can be arranged through sales.',
  ],
  migration: [
    'The Migration Suite supports 11 platforms: SAP, Snowflake, Oracle, Redshift, SQL Server, Informatica, Azure Synapse, Teradata, Talend, GCP, and Unity Catalog.',
    'Each assessment generates a ROM (Rough Order of Magnitude) cost estimate based on environment complexity, data volume, and migration scope.',
    'Assessments typically take 15-20 minutes. Results include time estimates, staffing recommendations, and risk factors.',
  ],
  contact: [
    'Reach our team at Info@bpcs.com or call (206) 455-8326.',
    'Use the "Contact Sales" button on any product page for pricing discussions. We typically respond within 1 business day.',
  ],
  databricks: [
    'All Blueprint products are built for Databricks. You need an active workspace to deploy.',
    'We support one-click deployment via OAuth, manual notebook download, or Asset Bundle CLI deploy.',
    'Products leverage Delta Lake, Unity Catalog, and MLflow for enterprise-grade data management.',
  ],
  lho: [
    'Lakehouse Optimizer continuously analyzes your Databricks Lakehouse to identify optimization opportunities.',
    'Key features: Automated Table Optimization, Query Performance Insights, and Cost Governance Engine.',
    'Starting at $1,000/mo for single user. Team license (5 users) at $5,000/mo.',
  ],
  campaigniq: [
    'CampaignIQ is an AI-powered promotion & campaign analytics engine for marketing teams.',
    'It provides Intelligent Promotion Forecasting, Campaign Performance Scoring, and Anomaly Detection & Alerts.',
    'CampaignIQ helps achieve higher campaign ROI, faster decision cycles, and eliminates guesswork.',
  ],
  'sap-working-capital': [
    'SAP Working Capital connects to your SAP ERP environment for cash flow optimization.',
    'Features include Cash Flow Prediction Engine, DPO/DSO/DIO Optimization, and Supplier Risk Scoring.',
  ],
  churniq: [
    'ChurnIQ is a machine learning engine that identifies customers most likely to churn.',
    'It provides Predictive Churn Scoring, Driver Analysis Engine, and Retention Playbook Generator.',
  ],
  'customersupport-iq': [
    'CustomerSupport IQ is an AI layer on your support operations for smarter ticketing.',
    'Features: Smart Ticket Routing, Agent Performance Analytics, and Predictive Escalation Engine.',
  ],
  promotioniq: [
    'PromotionIQ is a deep analytics engine for retail and CPG promotion management.',
    'It analyzes Promotion Performance, Cannibalization & Halo effects, and optimizes Promotional Calendars.',
  ],
  aifactory: [
    'The AI Factory offers a 90-day engagement framework to build and deploy AI solutions.',
    'Three engagement levels: Strategy Sprint (1-day workshop), Build & Prove (6-week foundations), and Scale & Embed (12-week build & deploy).',
    'The framework covers 5 phases: Alignment, POC, MVP, Pre-Production, and Production.',
  ],
  download: [
    'Downloads are available from your account dashboard after purchase.',
    'All downloads include license watermarking with your email for security.',
    'You can download Jupyter notebooks, Python wheels, and asset bundles.',
  ],
  account: [
    'Sign up for a free account to access downloads and deployments.',
    'Your dashboard shows order history, downloads, and deployment status.',
    'Update your profile and company information in Account Settings.',
  ],
  deployment: [
    'Deploy products to Databricks using three methods: OAuth one-click deploy, manual notebook upload, or Asset Bundle CLI.',
    'Visit your Deployments page to connect your Databricks workspace via OAuth.',
    'All deployments are tracked with version history and status updates.',
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

type Intent = 'greeting' | 'pricing' | 'product_info' | 'migration' | 'contact' | 'deployment' | 'download' | 'account' | 'aifactory' | 'recommendation' | 'comparison' | 'unknown';

const KEYWORD_MAP: Record<string, string[]> = {
  pricing: ['price', 'pricing', 'cost', 'how much', 'plan', 'license', 'subscription', 'pay', 'billing', 'enterprise', 'team'],
  migration: ['migrat', 'assess', 'rom', 'platform', 'sap', 'snowflake', 'oracle', 'redshift', 'sql server', 'informatica', 'synapse', 'teradata', 'talend', 'gcp', 'unity catalog'],
  contact: ['contact', 'email', 'reach', 'support', 'help', 'sales', 'talk', 'phone', 'call'],
  deployment: ['deploy', 'databricks', 'workspace', 'cluster', 'notebook', 'oauth', 'install'],
  download: ['download', 'wheel', 'bundle', 'file'],
  account: ['account', 'sign up', 'register', 'login', 'profile', 'settings', 'password'],
  aifactory: ['ai factory', 'engagement', 'tier', 'consulting', '90 day', '90-day', 'sprint', 'workshop'],
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
  if (lower.includes('marketing') || lower.includes('campaign') || lower.includes('promotion')) {
    return 'Based on your interest, I\'d recommend **CampaignIQ** for campaign analytics or **PromotionIQ** for retail promotion management. Both start at $1,000/mo.';
  }
  if (lower.includes('churn') || lower.includes('retention') || lower.includes('customer')) {
    return 'For customer retention, check out **ChurnIQ** — it uses ML to predict churn and generate retention playbooks. For support optimization, **CustomerSupport IQ** is great.';
  }
  if (lower.includes('sap') || lower.includes('cash') || lower.includes('finance')) {
    return 'For financial operations, **SAP Working Capital** connects to your SAP ERP for cash flow optimization and supplier risk scoring.';
  }
  if (lower.includes('databricks') || lower.includes('lakehouse') || lower.includes('performance')) {
    return 'For Databricks optimization, **Lakehouse Optimizer** continuously tunes your workspace for faster queries and lower costs.';
  }
  return 'We offer 6 IQ products across analytics, customer intelligence, and operations. Could you tell me more about your use case? I\'ll recommend the best fit.';
}

function getComparison(): string {
  return 'Here\'s a quick comparison of our IQ products:\n\n' +
    '- **Lakehouse Optimizer**: Databricks performance tuning\n' +
    '- **CampaignIQ**: Marketing campaign analytics\n' +
    '- **SAP Working Capital**: Cash flow optimization\n' +
    '- **ChurnIQ**: Customer churn prediction\n' +
    '- **CustomerSupport IQ**: Support ticket intelligence\n' +
    '- **PromotionIQ**: Retail promotion analytics\n\n' +
    'All are priced at $1,000/mo (single user) or $5,000/mo (team). Want details on any specific product?';
}

function findBestResponse(message: string): string {
  const { intent, productSlug } = detectIntent(message);

  switch (intent) {
    case 'product_info':
      return productSlug ? getProductResponse(productSlug) : getComparison();
    case 'pricing': {
      const responses = KNOWLEDGE_BASE['pricing'];
      return responses?.[Math.floor(Math.random() * responses.length)] ?? '';
    }
    case 'migration': {
      const responses = KNOWLEDGE_BASE['migration'];
      return responses?.[Math.floor(Math.random() * responses.length)] ?? '';
    }
    case 'contact': {
      const responses = KNOWLEDGE_BASE['contact'];
      return responses?.[Math.floor(Math.random() * responses.length)] ?? '';
    }
    case 'deployment': {
      const responses = KNOWLEDGE_BASE['deployment'] || KNOWLEDGE_BASE['databricks'];
      return responses?.[Math.floor(Math.random() * responses.length)] ?? '';
    }
    case 'download': {
      const responses = KNOWLEDGE_BASE['download'];
      return responses?.[Math.floor(Math.random() * responses.length)] ?? '';
    }
    case 'account': {
      const responses = KNOWLEDGE_BASE['account'];
      return responses?.[Math.floor(Math.random() * responses.length)] ?? '';
    }
    case 'aifactory': {
      const responses = KNOWLEDGE_BASE['aifactory'];
      return responses?.[Math.floor(Math.random() * responses.length)] ?? '';
    }
    case 'recommendation':
      return getRecommendation(message);
    case 'comparison':
      return getComparison();
    default:
      return "I can help with product information, pricing, migration assessments, downloads, deployments, and account questions. Try asking about a specific product like \"Tell me about CampaignIQ\" or \"What are the pricing options?\".";
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
