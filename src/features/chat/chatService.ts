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

const KNOWLEDGE_BASE: Record<string, string[]> = {
  pricing: [
    'Our IQ products start at $1,000/month for single-user licenses.',
    'Enterprise pricing is available for teams of 10+. Contact sales for a custom quote.',
    'All products include Databricks integration and ongoing support.',
  ],
  migration: [
    'The Migration Suite supports 11 platforms: SAP, Snowflake, Oracle, Redshift, SQL Server, Informatica, Synapse, Teradata, Talend, GCP, and Unity Catalog.',
    'Each assessment generates a ROM (Rough Order of Magnitude) cost estimate based on your environment complexity.',
    'Visit the Migration Suite to start a free assessment.',
  ],
  contact: [
    'Email us at marketplace@bpcs.com for general inquiries.',
    'Use the Contact Sales button on any product page for pricing discussions.',
    'Our team typically responds within 1 business day.',
  ],
  databricks: [
    'All Blueprint products are built for Databricks. You need an active workspace to deploy.',
    'We support one-click deployment via OAuth, manual notebook download, or Asset Bundle CLI deploy.',
    'Visit your Deployments page to connect your workspace.',
  ],
  products: [
    'CampaignIQ: Marketing analytics and attribution modeling.',
    'Customer Segmentation Suite: AI-powered audience clustering.',
    'Attribution Engine: Multi-touch attribution for marketing spend optimization.',
    'Data Pipeline Templates: Pre-built ETL workflows for common data sources.',
  ],
  aifactory: [
    'The AI Factory offers three engagement tiers: Starter, Professional, and Enterprise.',
    'Each tier includes a 90-day engagement framework with defined milestones.',
    'Visit the AI Factory page to learn more and request an engagement.',
  ],
  download: [
    'Downloads are available from your account dashboard after purchase.',
    'All downloads include license watermarking with your email for security.',
    'You can download notebooks, Python wheels, and asset bundles.',
  ],
  account: [
    'Sign up for a free account to access downloads and deployments.',
    'Your dashboard shows order history, downloads, and deployment status.',
    'Update your profile and company information in Account Settings.',
  ],
};

function findBestResponse(message: string): string {
  const lower = message.toLowerCase();

  const keywordMap: Record<string, string[]> = {
    pricing: ['price', 'pricing', 'cost', 'how much', 'plan', 'license', 'subscription', 'pay'],
    migration: ['migrat', 'assess', 'rom', 'platform', 'sap', 'snowflake', 'oracle', 'redshift'],
    contact: ['contact', 'email', 'reach', 'support', 'help', 'sales', 'talk'],
    databricks: ['databricks', 'workspace', 'deploy', 'cluster', 'notebook'],
    products: ['product', 'campaigniq', 'ciq', 'segmentat', 'attribution', 'pipeline'],
    aifactory: ['ai factory', 'engagement', 'tier', 'consulting'],
    download: ['download', 'install', 'wheel', 'bundle'],
    account: ['account', 'sign up', 'register', 'login', 'profile', 'settings'],
  };

  for (const [topic, keywords] of Object.entries(keywordMap)) {
    if (keywords.some((k) => lower.includes(k))) {
      const responses = KNOWLEDGE_BASE[topic];
      if (responses && responses.length > 0) {
        return responses[Math.floor(Math.random() * responses.length)] ?? '';
      }
    }
  }

  return "I can help with product information, pricing, migration assessments, downloads, deployments, and account questions. What would you like to know?";
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
    return "Interested in AI Factory services? I can explain the engagement tiers.";
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
  return "Welcome to Blueprint Marketplace! How can I help you today?";
}

export function getQuickActions(currentPath: string): QuickAction[] {
  if (currentPath.includes('/migration') && !currentPath.includes('/calculator')) {
    return [
      { label: 'Supported Platforms', message: 'What platforms do you support for migration?' },
      { label: 'ROM Estimate', message: 'How is the ROM cost estimate calculated?' },
      { label: 'Get Started', message: 'How do I start a migration assessment?' },
    ];
  }
  if (currentPath.includes('/products/') || currentPath === '/') {
    return [
      { label: 'Show Pricing', message: 'What are the pricing options?' },
      { label: 'Compare Products', message: 'Can you compare the available products?' },
      { label: 'Deployment Info', message: 'How do I deploy products to Databricks?' },
    ];
  }
  if (currentPath.includes('/cart')) {
    return [
      { label: 'PO Process', message: 'How does the PO request process work?' },
      { label: 'Pricing Help', message: 'Tell me about enterprise pricing.' },
    ];
  }
  if (currentPath.includes('/content/ai-factory')) {
    return [
      { label: 'Engagement Tiers', message: 'What are the AI Factory engagement tiers?' },
      { label: 'Timeline', message: 'How long does a typical AI Factory engagement take?' },
    ];
  }
  if (currentPath.includes('/account')) {
    return [
      { label: 'Downloads', message: 'How do I access my downloads?' },
      { label: 'Deploy Help', message: 'How do I deploy to Databricks?' },
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

  // Check for greeting
  const lower = message.toLowerCase().trim();
  if (['hi', 'hello', 'hey', 'help'].includes(lower)) {
    return getContextGreeting(context);
  }

  return findBestResponse(message);
}
