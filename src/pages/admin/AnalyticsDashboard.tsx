import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { SEO } from '@/components/SEO';
import {
  ResponsiveContainer,
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend,
} from 'recharts';
import {
  dbGetRecentInteractions,
  dbGetAllUsers,
  dbGetAllOrders,
  dbGetAllAssessments,
  type DBInteraction,
  type DBUser,
  type DBOrder,
  type DBAssessment,
} from '@/lib/db';

/* ═══════════════════════════════════════════════════════════
   Constants & Helpers
   ═══════════════════════════════════════════════════════════ */

const COLORS = {
  primary: '#1d4ed8',
  secondary: '#3b82f6',
  indigo: '#6366f1',
  sky: '#0ea5e9',
  violet: '#8b5cf6',
  teal: '#14b8a6',
  emerald: '#10b981',
  good: '#16a34a',
  warning: '#ca8a04',
  bad: '#dc2626',
};

const SERIES = [COLORS.primary, COLORS.secondary, COLORS.indigo, COLORS.sky, COLORS.violet, COLORS.teal, COLORS.emerald];

const TOOLTIP_STYLE = {
  border: '1px solid #e5e7eb',
  borderRadius: 0,
  fontFamily: 'DM Sans, sans-serif',
  fontSize: 12,
  boxShadow: '0 4px 6px -1px rgba(0,0,0,.1)',
};

const AXIS_TICK = { fontSize: 11, fill: '#6b7280', fontFamily: 'DM Sans, sans-serif' };

const EVENT_LABELS: Record<string, string> = {
  page_tagged: 'Page View', cart_item_added: 'Cart Add', cart_item_removed: 'Cart Remove',
  checkout_started: 'Checkout Started', checkout_completed: 'Checkout Completed',
  login_completed: 'Login', signup_completed: 'Signup', migration_rom_generated: 'ROM Generated',
  product_card_clicked: 'Product Clicked', product_modal_tab_changed: 'Modal Tab',
  category_filtered: 'Category Filter', scroll_depth: 'Scroll Depth',
  time_on_page: 'Time on Page', chat_message_sent: 'Chat Message', chat_opened: 'Chat Opened',
  download_initiated: 'Download Started', download_completed: 'Download Complete',
  modal_interaction: 'Modal Action', contact_form_submitted: 'Contact Form', cta_clicked: 'CTA Clicked',
};

function friendlyEvent(e: string) {
  return EVENT_LABELS[e] || e.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/* ─── Aggregation helpers ─────────────────────────────── */

function bucketByDay(items: { timestamp: string }[], days: number, now: number) {
  const DAY = 86_400_000;
  const startOfToday = new Date(now).setHours(0, 0, 0, 0);
  const buckets: { label: string; count: number }[] = [];
  for (let d = days - 1; d >= 0; d--) {
    const dayStart = startOfToday - d * DAY;
    const date = new Date(dayStart);
    buckets.push({
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: 0,
    });
  }
  for (const item of items) {
    const t = new Date(item.timestamp).getTime();
    const idx = days - 1 - Math.floor((startOfToday + DAY - t) / DAY);
    if (idx >= 0 && idx < days) buckets[idx]!.count++;
  }
  return buckets;
}

function categorizeEvents(interactions: DBInteraction[]) {
  const cats = { Navigation: 0, Commerce: 0, Content: 0, Migration: 0, Engagement: 0, Other: 0 };
  const nav = new Set(['page_tagged', '$pageview', 'nav_link_clicked', 'bpcs_link_clicked', 'mega_menu_opened']);
  const comm = new Set(['cart_item_added', 'cart_item_removed', 'checkout_started', 'checkout_completed', 'cart_viewed']);
  const content = new Set(['product_card_clicked', 'product_modal_opened', 'product_page_viewed', 'product_modal_tab_changed', 'category_filtered']);
  const migration = new Set(['migration_assessment_started', 'migration_rom_generated', 'migration_section_completed']);
  const engage = new Set(['scroll_depth', 'time_on_page', 'chat_message_sent', 'chat_opened', 'cta_clicked', 'download_initiated', 'download_completed', 'contact_form_submitted', 'modal_interaction']);

  for (const i of interactions) {
    if (nav.has(i.event)) cats.Navigation++;
    else if (comm.has(i.event)) cats.Commerce++;
    else if (content.has(i.event)) cats.Content++;
    else if (migration.has(i.event)) cats.Migration++;
    else if (engage.has(i.event)) cats.Engagement++;
    else cats.Other++;
  }
  return Object.entries(cats)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));
}

interface KPIs {
  events24h: number;
  events7d: number;
  conversionRate: number;
  pageViews: number;
  checkouts: number;
  cartAdds: number;
  cartAbandonment: number;
  engagementScore: number;
}

function calculateKPIs(interactions: DBInteraction[], now: number): KPIs {
  const DAY = 86_400_000;
  let events24h = 0, events7d = 0, pageViews = 0, checkouts = 0, cartAdds = 0;
  const scrollDepths: number[] = [];
  const durations: number[] = [];

  for (const i of interactions) {
    const age = now - new Date(i.timestamp).getTime();
    if (age < DAY) events24h++;
    if (age < 7 * DAY) events7d++;
    if (i.event === 'page_tagged' || i.event === '$pageview') pageViews++;
    if (i.event === 'checkout_completed') checkouts++;
    if (i.event === 'cart_item_added') cartAdds++;
    if (i.event === 'scroll_depth' && typeof i.properties.depth === 'number') scrollDepths.push(i.properties.depth as number);
    if (i.event === 'time_on_page' && typeof i.properties.durationSec === 'number') durations.push(i.properties.durationSec as number);
  }

  const conversionRate = pageViews > 0 ? (checkouts / pageViews) * 100 : 0;
  const cartAbandonment = cartAdds > 0 ? ((cartAdds - checkouts) / cartAdds) * 100 : 0;

  // Engagement score: composite 0-100
  const avgScroll = scrollDepths.length > 0 ? scrollDepths.reduce((a, b) => a + b, 0) / scrollDepths.length : 0;
  const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
  const scrollPoints = Math.min(30, (avgScroll / 100) * 30);
  const durationPoints = Math.min(30, (Math.min(avgDuration, 120) / 120) * 30);
  const volumePoints = Math.min(40, (Math.min(interactions.length, 200) / 200) * 40);
  const engagementScore = Math.round(scrollPoints + durationPoints + volumePoints);

  return { events24h, events7d, conversionRate, pageViews, checkouts, cartAdds, cartAbandonment, engagementScore };
}

function calculateFunnel(interactions: DBInteraction[]) {
  let views = 0, clicks = 0, carts = 0, checkoutStart = 0, checkoutDone = 0;
  for (const i of interactions) {
    if (i.event === 'page_tagged' || i.event === '$pageview') views++;
    if (i.event === 'product_card_clicked') clicks++;
    if (i.event === 'cart_item_added') carts++;
    if (i.event === 'checkout_started') checkoutStart++;
    if (i.event === 'checkout_completed') checkoutDone++;
  }
  const base = Math.max(views, 1);
  return [
    { step: 'Page Views', count: views, pct: 100 },
    { step: 'Product Clicks', count: clicks, pct: Math.round((clicks / base) * 100) },
    { step: 'Cart Adds', count: carts, pct: Math.round((carts / base) * 100) },
    { step: 'Checkout Started', count: checkoutStart, pct: Math.round((checkoutStart / base) * 100) },
    { step: 'Completed', count: checkoutDone, pct: Math.round((checkoutDone / base) * 100) },
  ];
}

/* ═══════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════ */

export default function AnalyticsDashboard() {
  const [interactions, setInteractions] = useState<DBInteraction[]>([]);
  const [users, setUsers] = useState<DBUser[]>([]);
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [assessments, setAssessments] = useState<DBAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [snapshotTime, setSnapshotTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'feed'>('dashboard');
  const [trendDays, setTrendDays] = useState<7 | 30>(7);

  useEffect(() => {
    Promise.all([
      dbGetRecentInteractions(500),
      dbGetAllUsers(),
      dbGetAllOrders(),
      dbGetAllAssessments(),
    ]).then(([i, u, o, a]) => {
      setInteractions(i);
      setUsers(u);
      setOrders(o);
      setAssessments(a);
      setSnapshotTime(Date.now());
      setLoading(false);
    });
  }, []);

  /* ─── Derived data ──────────────────────────────── */

  const derived = useMemo(() => {
    const now = snapshotTime;
    if (!now) return null;

    const kpis = calculateKPIs(interactions, now);
    const activityTrend = bucketByDay(interactions, trendDays, now);
    const signupTrend = bucketByDay(
      users.map((u) => ({ timestamp: u.createdAt })),
      30,
      now,
    );
    const eventCategories = categorizeEvents(interactions);
    const funnel = calculateFunnel(interactions);

    // Top pages
    const pageCounts = new Map<string, number>();
    for (const i of interactions) {
      if (i.event === 'page_tagged' || i.event === '$pageview') {
        const page = (i.properties.pageName as string) || i.page || 'Unknown';
        pageCounts.set(page, (pageCounts.get(page) || 0) + 1);
      }
    }
    const topPages = [...pageCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));

    // Top products
    const productCounts = new Map<string, number>();
    for (const i of interactions) {
      const pName = i.properties.productName as string | undefined;
      if (pName) productCounts.set(pName, (productCounts.get(pName) || 0) + 1);
    }
    const topProducts = [...productCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));

    // Avg time on page
    const timeMap = new Map<string, number[]>();
    for (const i of interactions) {
      if (i.event === 'time_on_page' && typeof i.properties.durationSec === 'number') {
        const page = (i.properties.pageName as string) || 'Unknown';
        if (!timeMap.has(page)) timeMap.set(page, []);
        timeMap.get(page)!.push(i.properties.durationSec as number);
      }
    }
    const avgTimeOnPage = [...timeMap.entries()]
      .map(([name, times]) => ({ name, value: Math.round(times.reduce((a, b) => a + b, 0) / times.length) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    // Assessments by platform
    const platformCounts = new Map<string, number>();
    for (const a of assessments) {
      platformCounts.set(a.platformName, (platformCounts.get(a.platformName) || 0) + 1);
    }
    const assessmentsByPlatform = [...platformCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));

    return { kpis, activityTrend, signupTrend, eventCategories, funnel, topPages, topProducts, avgTimeOnPage, assessmentsByPlatform };
  }, [interactions, users, assessments, snapshotTime, trendDays]);

  if (loading || !derived) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-500 text-center py-20">Loading analytics...</p>
      </main>
    );
  }

  const { kpis, activityTrend, signupTrend, eventCategories, funnel, topPages, topProducts, avgTimeOnPage, assessmentsByPlatform } = derived;
  const noData = interactions.length === 0;

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO title="Analytics Dashboard" description="Site activity and analytics overview." canonical="/admin/analytics" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Analytics Dashboard</h1>
          <p className="text-gray-500 text-sm">
            {interactions.length.toLocaleString()} events tracked &middot; {users.length} users &middot; {orders.length} orders
          </p>
        </div>
        <Link to={ROUTES.ADMIN_DASHBOARD} className="text-sm text-blueprint-blue hover:underline">&larr; Admin Portal</Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {(['dashboard', 'feed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-bold capitalize transition-colors border-b-2 ${
              activeTab === tab ? 'border-blueprint-blue text-blueprint-blue' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'dashboard' ? 'Dashboard' : 'Activity Feed'}
          </button>
        ))}
      </div>

      {/* ═══ Dashboard Tab ═══ */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Row 1: KPI Gauges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <GaugeCard label="Events (24h)" value={kpis.events24h} max={Math.max(kpis.events24h * 1.5, 50)} suffix="" color={COLORS.primary} sub={`${kpis.events7d} in 7d`} />
            <GaugeCard label="Conversion Rate" value={kpis.conversionRate} max={100} suffix="%" color={kpis.conversionRate > 5 ? COLORS.good : kpis.conversionRate > 1 ? COLORS.warning : COLORS.bad} sub={`${kpis.checkouts} of ${kpis.pageViews} visitors`} />
            <GaugeCard label="Cart Abandon" value={kpis.cartAbandonment} max={100} suffix="%" color={kpis.cartAbandonment < 50 ? COLORS.good : kpis.cartAbandonment < 80 ? COLORS.warning : COLORS.bad} sub={`${kpis.cartAdds} cart adds`} />
            <GaugeCard label="Engagement" value={kpis.engagementScore} max={100} suffix="/100" color={kpis.engagementScore > 60 ? COLORS.good : kpis.engagementScore > 30 ? COLORS.warning : COLORS.bad} sub="Composite score" />
          </div>

          {/* Row 2: Activity Over Time */}
          <ChartPanel title="Activity Over Time" right={
            <div className="flex gap-1">
              {([7, 30] as const).map((d) => (
                <button key={d} onClick={() => setTrendDays(d)} className={`px-3 py-1 text-xs font-bold transition-colors ${trendDays === d ? 'bg-blueprint-blue text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  {d}D
                </button>
              ))}
            </div>
          }>
            {noData ? <EmptyChart /> : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={activityTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad-activity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" tick={AXIS_TICK} />
                  <YAxis tick={AXIS_TICK} allowDecimals={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Area type="monotone" dataKey="count" stroke={COLORS.primary} strokeWidth={2} fill="url(#grad-activity)" name="Events" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartPanel>

          {/* Row 3: Top Pages + Event Breakdown Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPanel title="Top Pages">
              {topPages.length === 0 ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={topPages} layout="vertical" margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis type="number" tick={AXIS_TICK} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" tick={AXIS_TICK} width={110} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="value" fill={COLORS.primary} barSize={18} name="Views" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartPanel>

            <ChartPanel title="Event Categories">
              {eventCategories.length === 0 ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={eventCategories} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" nameKey="name" label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                      {eventCategories.map((_, idx) => (
                        <Cell key={idx} fill={SERIES[idx % SERIES.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Legend iconType="square" wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartPanel>
          </div>

          {/* Row 4: Top Products + Avg Time on Page */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPanel title="Top Products">
              {topProducts.length === 0 ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis type="number" tick={AXIS_TICK} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" tick={AXIS_TICK} width={130} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="value" fill={COLORS.indigo} barSize={18} name="Interactions" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartPanel>

            <ChartPanel title="Avg. Time on Page (sec)">
              {avgTimeOnPage.length === 0 ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={avgTimeOnPage} layout="vertical" margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis type="number" tick={AXIS_TICK} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" tick={AXIS_TICK} width={110} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="value" fill={COLORS.sky} barSize={18} name="Seconds" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartPanel>
          </div>

          {/* Row 5: User Signups + Assessments by Platform */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPanel title="User Signups (30 days)">
              {users.length === 0 ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={signupTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="grad-signups" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLORS.teal} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={COLORS.teal} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" tick={AXIS_TICK} />
                    <YAxis tick={AXIS_TICK} allowDecimals={false} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Area type="monotone" dataKey="count" stroke={COLORS.teal} strokeWidth={2} fill="url(#grad-signups)" name="Signups" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartPanel>

            <ChartPanel title="Assessments by Platform">
              {assessmentsByPlatform.length === 0 ? <EmptyChart text="No assessments yet" /> : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={assessmentsByPlatform} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={AXIS_TICK} interval={0} angle={-20} textAnchor="end" height={50} />
                    <YAxis tick={AXIS_TICK} allowDecimals={false} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="value" fill={COLORS.violet} barSize={28} name="Assessments" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartPanel>
          </div>

          {/* Row 6: Conversion Funnel */}
          <ChartPanel title="Conversion Funnel">
            <div className="space-y-3">
              {funnel.map((step, idx) => {
                const widthPct = Math.max(step.pct, 4);
                const color = SERIES[idx % SERIES.length];
                return (
                  <div key={step.step}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">{step.step}</span>
                      <span className="text-gray-500 text-xs">{step.count.toLocaleString()} ({step.pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-7 relative">
                      <div className="h-7 transition-all flex items-center pl-2" style={{ width: `${widthPct}%`, backgroundColor: color }}>
                        {step.pct > 10 && <span className="text-white text-xs font-bold">{step.pct}%</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartPanel>
        </div>
      )}

      {/* ═══ Activity Feed Tab ═══ */}
      {activeTab === 'feed' && (
        <div className="bg-white border border-gray-200 divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
          {interactions.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-12">No activity recorded yet. Browse the site to generate events.</p>
          ) : (
            interactions.slice(0, 100).map((i) => (
              <div key={i.id} className="px-4 py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-blueprint-blue text-xs font-bold whitespace-nowrap">
                    {friendlyEvent(i.event)}
                  </span>
                  <span className="text-gray-700 truncate">
                    {(i.properties.pageName as string) ||
                      (i.properties.productName as string) ||
                      (i.properties.category as string) ||
                      i.page}
                  </span>
                  {i.userId && (
                    <span className="text-gray-400 text-xs truncate hidden md:inline">
                      user: {i.userId.slice(0, 8)}...
                    </span>
                  )}
                </div>
                <span className="text-gray-400 text-xs whitespace-nowrap ml-4">{timeAgo(i.timestamp)}</span>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════════ */

/** SVG semicircle gauge KPI card */
function GaugeCard({ label, value, max, suffix, color, sub }: {
  label: string; value: number; max: number; suffix: string; color: string; sub?: string;
}) {
  const R = 55;
  const CIRC = Math.PI * R; // half-circle circumference
  const clamped = Math.min(Math.max(value, 0), max);
  const fill = max > 0 ? (clamped / max) * CIRC : 0;
  const display = suffix === '%' ? value.toFixed(1) : Math.round(value).toLocaleString();

  return (
    <div className="bg-white border border-gray-200 border-t-4 border-t-blueprint-blue p-4 text-center">
      <svg viewBox="0 0 130 75" className="w-full max-w-[160px] mx-auto">
        {/* Background track */}
        <path
          d="M 10 70 A 55 55 0 0 1 120 70"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
          strokeLinecap="butt"
        />
        {/* Filled arc */}
        <path
          d="M 10 70 A 55 55 0 0 1 120 70"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="butt"
          strokeDasharray={`${CIRC}`}
          strokeDashoffset={`${CIRC - fill}`}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
        {/* Value text */}
        <text x="65" y="62" textAnchor="middle" className="text-xl" style={{ fontSize: '20px', fontWeight: 900, fill: '#111827', fontFamily: 'DM Sans, sans-serif' }}>
          {display}{suffix}
        </text>
      </svg>
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

/** Chart panel wrapper with sharp-card styling */
function ChartPanel({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 border-t-4 border-t-blueprint-blue p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

/** Empty state for charts */
function EmptyChart({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center h-48 text-gray-400">
      <div className="text-center">
        <svg className="w-10 h-10 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm">{text || 'No data yet. Browse the site to generate events.'}</p>
      </div>
    </div>
  );
}
