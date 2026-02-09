import { useParams, Navigate, Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { ROUTES } from '@/config/routes';

export default function WhitepaperPage() {
  const { slug } = useParams<{ slug: string }>();

  // Only support the top-trending-insight whitepaper
  if (slug !== 'top-trending-insight') {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title="Stop guessing: Why AI forecasting is your new marketing strategy"
        description="How AI-powered forecasting transforms marketing from a cost center into a predictable engine for revenue generation."
        canonical="/content/top-trending-insight"
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8">
        <Link to={ROUTES.HOME} className="hover:text-blueprint-blue">Home</Link>
        <span>/</span>
        <span className="hover:text-blueprint-blue cursor-pointer">Insights</span>
        <span>/</span>
        <span className="text-blueprint-blue">AI Forecasting</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Article */}
        <div className="lg:col-span-8">
          <article className="sharp-card p-8 md:p-12 border-t-4 border-t-blueprint-blue bg-white">
            <header className="mb-10 border-b border-gray-100 pb-8">
              <h1 className="text-3xl md:text-5xl font-bold text-blueprint-blue tracking-tight mb-6 leading-tight">
                Stop guessing: Why AI forecasting is your new marketing strategy
              </h1>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold text-xs">
                    BP
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">By Blueprint Team</p>
                    <p className="text-xs text-gray-500">October 2025</p>
                  </div>
                </div>
              </div>
            </header>

            <div className="article-body">
              <p className="font-medium text-lg text-gray-700">
                The pressure on marketing leaders to prove return on investment (ROI) has never been greater. Yet, the tools many teams rely on for campaign forecasting remain rooted in the past.
              </p>
              <p>
                Disconnected data sources, manual spreadsheets, and delayed reporting cycles force you to make critical budget decisions with incomplete information. This reactive approach creates a constant cycle of guesswork, wasted spend, and missed opportunities. The competition isn&apos;t waiting for your post-campaign analysis; they are already optimizing their next move.
              </p>
              <p>
                Winning in today&apos;s market requires a fundamental shift from hindsight to foresight. It demands a system that unifies your data, predicts outcomes with precision, and allows you to simulate your marketing strategy before you commit a single dollar. This is where generative AI becomes more than a buzzword, it becomes your production line for intelligence.
              </p>
              <p>
                By embedding AI-driven forecasting directly into your planning process, you can transform your marketing function from a cost center into a predictable engine for revenue generation. This is the new standard for high-performance marketing, and it&apos;s powered by solutions that deliver measurable, data-driven confidence.
              </p>

              <h2>The flaw in traditional campaign forecasting</h2>
              <p>
                For years, marketers have stitched together insights from various platforms, trying to form a cohesive picture of performance. This fragmented reality is a significant handicap. When campaign data lives in silos (social media platforms, ad networks, CRM systems, web analytics) it&apos;s impossible to get a true, unified view of your return on ad spend (ROAS).
              </p>
              <p>This leads to several critical business challenges:</p>
              <ul>
                <li><strong>Delayed Insights:</strong> Manual data pulls and reporting mean you&apos;re often looking at last week&apos;s or last month&apos;s performance. By the time you spot an underperforming channel, a significant portion of the budget is already spent.</li>
                <li><strong>Inaccurate Projections:</strong> Relying on historical averages alone doesn&apos;t account for market dynamics, audience shifts, or the nuanced interplay between different campaigns. The result is a forecast that&apos;s often more hope than reality.</li>
                <li><strong>Inability to Pivot:</strong> Without the ability to model different scenarios, you can&apos;t answer crucial &quot;what-if&quot; questions. What happens if we shift 15% of our budget from Campaign A to Campaign B? How would a compressed timeline impact our target CPA? Answering these questions becomes a high-risk gamble.</li>
                <li><strong>Lack of Credibility:</strong> When you can&apos;t confidently connect marketing spend to revenue outcomes, it becomes difficult to secure the budgets needed for growth and innovation.</li>
              </ul>
              <p>
                The core problem is that traditional methods measure what happened, but they can&apos;t reliably predict what will happen. To outmaneuver the competition, you need to operate at the speed of the market, armed with predictive insights that guide your every move.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-10">
                <div>
                  <h2>A factory for intelligence: The AI-powered solution</h2>
                  <p>
                    Imagine a centralized system where all your campaign data is unified, governed, and activated by a suite of intelligent agents. This is the &quot;AI Factory&quot; model: a repeatable, scalable system for manufacturing intelligence. It&apos;s not about one-off experiments; it&apos;s about embedding AI into the core of your marketing operations to drive measurable outcomes.
                  </p>
                  <p>
                    This is precisely why we built <strong>CampaignIQ</strong>. As a Databricks-native application, it leverages the full power of the Databricks Data Intelligence Platform to provide a single source of truth for your marketing performance. It transforms the chaotic process of campaign management into a disciplined, data-driven practice.
                  </p>
                </div>
                <div>
                  <img
                    src={`${import.meta.env.BASE_URL}images/wp_image1of2.png`}
                    alt="CampaignIQ Factory Intelligence Interface"
                    className="w-full h-auto border border-gray-200 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-10">
                <div className="order-2 md:order-1">
                  <img
                    src={`${import.meta.env.BASE_URL}images/wp_image2of2.png`}
                    alt="Unity Catalog Governance Dashboard"
                    className="w-full h-auto border border-gray-200 shadow-sm"
                  />
                </div>
                <div className="order-1 md:order-2">
                  <h2>Unify your data with Unity Catalog governance</h2>
                  <p>
                    The foundation of any successful AI strategy is clean, reliable, and governed data. CampaignIQ is built on Databricks and utilizes Unity Catalog to connect campaign data from all your disparate sources. This ensures every piece of data, from ad spend and impressions to conversions and revenue, is organized, auditable, and accessible. With a governed data foundation, your forecasting models are trained on a complete and trustworthy dataset, leading to far more accurate predictions.
                  </p>
                </div>
              </div>

              <h2>See the future with ROAS forecast</h2>
              <p>
                At the heart of CampaignIQ is its ROAS Forecast capability. Powered by a Mosaic AI Forecasting Agent, it analyzes historical campaign data and media inputs to generate precise 7- and 14-day projections for revenue, ad spend, and ROAS across every channel. Instead of waiting for results, you can see the likely future of your campaigns. This allows you to identify high-performing channels to double down on and underperforming ones to adjust, all in near-real-time.
              </p>

              <h2>Plan with confidence using the What-If Planner</h2>
              <p>
                The true power of AI-driven forecasting comes from the ability to simulate your marketing strategy. The What-If Planner in CampaignIQ is a Databricks App that lets you do just that.
              </p>
              <ul>
                <li>Test changes to budget, timeline, target CPA, and CPM.</li>
                <li>Explore how shifting funds between campaigns could impact overall ROAS.</li>
                <li>Use generative AI-powered tactical recommendations to identify where to focus for maximum returns.</li>
              </ul>
              <p>
                By pulling these different levers, you can map out multiple scenarios and see their projected impact before making a final decision. This moves your team from reactive optimization to proactive strategy, building campaigns designed for success from day one.
              </p>

              <h2>Turning data into decisions: From brief to ROI</h2>
              <p>
                A successful marketing strategy depends on more than just numbers; it requires a deep understanding of the context behind each campaign. CampaignIQ connects the strategic &quot;why&quot; with the performance &quot;what.&quot;
              </p>
              <p>
                As highlighted in the TDWI webinar, &quot;Turning Data into Decisions,&quot; the goal is to centralize data and apply AI-driven forecasting to evaluate scenarios before spending.
              </p>

              <div className="my-10 sharp-card border border-gray-200">
                <div className="aspect-video w-full bg-black">
                  <iframe
                    src="https://www.youtube.com/embed/RREDkHtJZDY"
                    title="CampaignIQ TDWI Webinar"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold text-blueprint-blue mb-3 mt-0">Summary</h3>
                  <p className="text-gray-600 leading-relaxed text-sm mb-0">
                    CampaignIQ is a Databricks-native solution that empowers marketers with AI-driven ROAS forecasting, scenario simulation, and spend optimization. It unifies data, governance, and analytics to improve campaign performance and accelerate decision-making.
                  </p>
                </div>
              </div>

              <p>
                CampaignIQ operationalizes this concept through a suite of integrated tools:
              </p>
              <ul>
                <li><strong>Campaign Explorer:</strong> Gain a comprehensive overview of any selected campaign. It centralizes the strategic brief, channel allocations, creative tone, and historical performance metrics in one place. A Brief Extraction Agent, built using Mosaic AI, automatically parses campaign briefs to structure key information like challenges, positioning, and messaging.</li>
                <li><strong>Audience Segmentation:</strong> An Audience Segment Agent intelligently groups users into meaningful cohorts (e.g., High-Spenders, New Parents) based on behavior, allowing for more targeted and effective campaigns.</li>
                <li><strong>Strategic Recommendations:</strong> A Strategy Agent analyzes forecast outputs to surface optimization opportunities, recommending the most efficient allocation of your budget to maximize ROI.</li>
                <li><strong>Databricks AI/BI Dashboards:</strong> Visualize ROAS trends, media efficiency, and audience performance over time. These dashboards provide the real-time feedback loop needed to track impact and justify your marketing strategy to the C-suite.</li>
              </ul>
              <p>
                By combining these capabilities, CampaignIQ creates a seamless workflow from initial brief to final ROI analysis. It ensures every decision is grounded in data, every dollar is accountable, and every campaign is an opportunity to learn and improve.
              </p>

              <h2>The competitive edge of predictive marketing</h2>
              <p>
                Enterprises that embed generative AI into their forecasting and planning processes are building an insurmountable competitive advantage. They operate with a level of agility and confidence that their rivals simply cannot match.
              </p>
              <p>The benefits are clear and measurable:</p>
              <ul>
                <li><strong>Increased ROAS:</strong> By continuously optimizing spend toward the most profitable channels and campaigns, you directly improve your return.</li>
                <li><strong>Reduced Wasted Spend:</strong> Proactively identify and correct underperforming efforts before they drain your budget.</li>
                <li><strong>Faster Decision Cycles:</strong> Shrink planning and analysis time from weeks to hours, enabling your team to focus on strategy and execution.</li>
                <li><strong>Improved Cross-Functional Alignment:</strong> A single source of truth ensures marketing, finance, and leadership are all working from the same data and toward the same goals.</li>
                <li><strong>Predictable Revenue Generation:</strong> Move beyond vanity metrics and demonstrate a clear, causal link between your marketing campaigns and business growth.</li>
              </ul>
              <p>
                The future of marketing isn&apos;t about who has the most data; it&apos;s about who has the best system for turning that data into decisive action.
              </p>

              <h2>Build your future with CampaignIQ</h2>
              <p>
                The time for siloed tools and manual forecasting is over. To lead your market, you need an AI-powered solution that delivers the speed, accuracy, and strategic foresight necessary to win. CampaignIQ provides the Databricks-native framework to make every media decision smarter, faster, and more accountable. Stop guessing and start building your future with data-driven confidence.
              </p>

              <div className="mt-12 p-8 bg-gray-50 border-l-4 border-blueprint-blue sharp-card">
                <h3 className="text-xl font-bold text-blueprint-blue mt-0 mb-4">
                  Ready to see how AI-powered forecasting can transform your marketing strategy?
                </h3>
                <p className="mb-6">Schedule a demo of CampaignIQ or buy it today to start maximizing your ROAS.</p>
                <Link
                  to="/products/campaign-iq"
                  className="inline-block bg-blueprint-blue text-white font-bold py-3 px-8 uppercase tracking-widest text-xs hover:bg-blue-800 transition-colors"
                >
                  Explore CampaignIQ
                </Link>
              </div>
            </div>
          </article>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Related Solution */}
          <div className="sharp-card p-6 border-t-4 border-black bg-white">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
              Related Solution
            </h3>
            <div className="mb-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">CampaignIQ</h4>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                The AI-powered ROAS analysis tool to maximize your advertising investment. Unify data, forecast outcomes, and simulate strategies.
              </p>
            </div>
            <Link
              to="/products/campaign-iq"
              className="block w-full text-center bg-blueprint-blue text-white font-bold py-4 uppercase tracking-widest text-[10px] hover:bg-blue-800 transition-colors"
            >
              View Product
            </Link>
          </div>

          {/* Stay Updated */}
          <div className="sharp-card p-6 border border-gray-200 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Get the latest insights on Data & AI delivered directly to your inbox.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Business Email"
                className="w-full p-3 border border-gray-300 text-xs focus:border-blueprint-blue outline-none sharp-card"
              />
              <button className="w-full bg-black text-white font-bold py-3 uppercase tracking-widest text-[10px] hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </form>
          </div>

          {/* Topics */}
          <div className="sharp-card p-6 border border-gray-200 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {['AI', 'Marketing', 'Forecasting', 'Databricks'].map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-wide border border-gray-200"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
