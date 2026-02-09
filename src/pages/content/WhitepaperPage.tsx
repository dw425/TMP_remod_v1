import { useParams, Navigate } from 'react-router-dom';

interface WhitepaperContent {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  sections: { heading: string; body: string }[];
}

const WHITEPAPERS: Record<string, WhitepaperContent> = {
  'top-trending-insight': {
    slug: 'top-trending-insight',
    title: 'Stop Guessing: How AI-Powered Trend Forecasting Transforms Marketing',
    subtitle:
      'Winning in today\'s market requires a shift from hindsight to foresight.',
    date: 'January 2026',
    readTime: '8 min read',
    sections: [
      {
        heading: 'The Problem with Reactive Marketing',
        body: 'Most marketing teams rely on historical data and intuition to guide strategy. By the time a trend is identified through traditional analytics, the window of opportunity has often passed. Brands that react to trends instead of predicting them consistently underperform their forward-looking competitors.',
      },
      {
        heading: 'From Hindsight to Foresight',
        body: 'AI-powered trend forecasting uses machine learning models trained on real-time signals — social media velocity, search trends, competitor activity, and macroeconomic indicators — to identify emerging trends before they peak. This gives marketing teams a 2-6 week lead time advantage over traditional methods.',
      },
      {
        heading: 'The Databricks Advantage',
        body: 'Building trend forecasting on Databricks Lakehouse provides three key advantages: (1) unified data from dozens of sources in a single platform, (2) scalable ML model training and serving with MLflow, and (3) real-time streaming ingestion for up-to-the-minute signal processing. Blueprint\'s Top Trending Insight product packages these capabilities into a ready-to-deploy solution.',
      },
      {
        heading: 'Real-World Impact',
        body: 'Early adopters of AI-driven trend forecasting report 25-40% improvement in campaign ROAS, 30% reduction in wasted ad spend, and significantly faster time-to-market for trend-aligned content. The shift from reactive to proactive strategy is not incremental — it\'s transformational.',
      },
      {
        heading: 'Getting Started',
        body: 'Blueprint\'s Top Trending Insight product is available in the marketplace. It includes pre-built models for social signal processing, configurable trend scoring algorithms, and executive dashboards. Deployment takes less than a day on an existing Databricks workspace.',
      },
    ],
  },
};

export default function WhitepaperPage() {
  const { slug } = useParams<{ slug: string }>();
  const paper = slug ? WHITEPAPERS[slug] : undefined;

  if (!paper) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <article>
        <header className="mb-10">
          <p className="text-sm text-blueprint-blue font-medium mb-2">Whitepaper</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{paper.title}</h1>
          <p className="text-lg text-gray-600 mb-4">{paper.subtitle}</p>
          <div className="flex gap-4 text-sm text-gray-400">
            <span>{paper.date}</span>
            <span>&middot;</span>
            <span>{paper.readTime}</span>
          </div>
        </header>

        <div className="space-y-8">
          {paper.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {section.heading}
              </h2>
              <p className="text-gray-700 leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
