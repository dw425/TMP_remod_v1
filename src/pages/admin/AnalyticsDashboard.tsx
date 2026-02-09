import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { SEO } from '@/components/SEO';
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

/* ─── Helpers ──────────────────────────────────────────── */

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const EVENT_LABELS: Record<string, string> = {
  page_tagged: 'Page View',
  cart_item_added: 'Cart Add',
  cart_item_removed: 'Cart Remove',
  checkout_started: 'Checkout Started',
  checkout_completed: 'Checkout Completed',
  login_completed: 'Login',
  signup_completed: 'Signup',
  migration_rom_generated: 'ROM Generated',
  product_card_clicked: 'Product Clicked',
  product_modal_tab_changed: 'Modal Tab',
  category_filtered: 'Category Filter',
  scroll_depth: 'Scroll Depth',
  time_on_page: 'Time on Page',
  chat_message_sent: 'Chat Message',
  chat_opened: 'Chat Opened',
  download_initiated: 'Download Started',
  download_completed: 'Download Complete',
  modal_interaction: 'Modal Action',
  contact_form_submitted: 'Contact Form',
  cta_clicked: 'CTA Clicked',
};

function friendlyEvent(event: string): string {
  return EVENT_LABELS[event] || event.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ─── Component ────────────────────────────────────────── */

export default function AnalyticsDashboard() {
  const [interactions, setInteractions] = useState<DBInteraction[]>([]);
  const [users, setUsers] = useState<DBUser[]>([]);
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [assessments, setAssessments] = useState<DBAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [snapshotTime, setSnapshotTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'feed' | 'pages' | 'events' | 'products'>('feed');

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

  /* ─── Derived data ─────────────────────────────── */

  const { last24h, last7d, topPages, topEvents, topProducts, avgPageTimes } = useMemo(() => {
    const now = snapshotTime;
    const _last24h = interactions.filter((i) => now - new Date(i.timestamp).getTime() < 86_400_000);
    const _last7d = interactions.filter((i) => now - new Date(i.timestamp).getTime() < 7 * 86_400_000);

    // Page popularity
    const pageCounts = new Map<string, number>();
    for (const i of interactions) {
      if (i.event === 'page_tagged' || i.event === '$pageview') {
        const page = (i.properties.pageName as string) || i.page || 'Unknown';
        pageCounts.set(page, (pageCounts.get(page) || 0) + 1);
      }
    }
    const _topPages = [...pageCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Event breakdown
    const eventCounts = new Map<string, number>();
    for (const i of interactions) {
      eventCounts.set(i.event, (eventCounts.get(i.event) || 0) + 1);
    }
    const _topEvents = [...eventCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    // Top products (by clicks, cart adds, modal opens)
    const productInteractions = interactions.filter(
      (i) => i.properties.productName || i.properties.productId,
    );
    const productCounts = new Map<string, number>();
    for (const i of productInteractions) {
      const name = (i.properties.productName as string) || `Product #${i.properties.productId}`;
      productCounts.set(name, (productCounts.get(name) || 0) + 1);
    }
    const _topProducts = [...productCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Time on page averages
    const timeEvents = interactions.filter((i) => i.event === 'time_on_page' && i.properties.durationSec);
    const pageTimeMap = new Map<string, number[]>();
    for (const t of timeEvents) {
      const page = (t.properties.pageName as string) || 'Unknown';
      if (!pageTimeMap.has(page)) pageTimeMap.set(page, []);
      pageTimeMap.get(page)!.push(t.properties.durationSec as number);
    }
    const _avgPageTimes = [...pageTimeMap.entries()]
      .map(([page, times]) => ({
        page,
        avg: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
        visits: times.length,
      }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 10);

    return {
      last24h: _last24h,
      last7d: _last7d,
      topPages: _topPages,
      topEvents: _topEvents,
      topProducts: _topProducts,
      avgPageTimes: _avgPageTimes,
    };
  }, [interactions, snapshotTime]);

  if (loading) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-500 text-center py-20">Loading analytics...</p>
      </main>
    );
  }

  const maxBarValue = (entries: [string, number][]) =>
    Math.max(...entries.map(([, v]) => v), 1);

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO title="Analytics Dashboard" description="Site activity and analytics overview." canonical="/admin/analytics" />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Analytics Dashboard</h1>
          <p className="text-gray-500 text-sm">Site activity tracked locally in IndexedDB.</p>
        </div>
        <Link to={ROUTES.ADMIN_DASHBOARD} className="text-sm text-blueprint-blue hover:underline">
          &larr; Admin Portal
        </Link>
      </div>

      {/* ─── Summary Cards ──────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard label="Total Users" value={users.length} icon="users" />
        <SummaryCard label="Total Orders" value={orders.length} icon="orders" />
        <SummaryCard label="Assessments" value={assessments.length} icon="assessments" />
        <SummaryCard label="Events (24h)" value={last24h.length} icon="events" sub={`${last7d.length} in 7d`} />
      </div>

      {/* ─── Tabs ───────────────────────────────────── */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {(['feed', 'pages', 'events', 'products'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-bold capitalize transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-blueprint-blue text-blueprint-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'feed' ? 'Activity Feed' : tab === 'pages' ? 'Top Pages' : tab === 'events' ? 'Event Breakdown' : 'Top Products'}
          </button>
        ))}
      </div>

      {/* ─── Tab Content ────────────────────────────── */}

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

      {activeTab === 'pages' && (
        <div className="space-y-6">
          {/* Visit counts */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Most Visited Pages</h3>
            {topPages.length === 0 ? (
              <p className="text-gray-400 text-sm">No page views recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {topPages.map(([page, count]) => (
                  <BarRow key={page} label={page} value={count} max={maxBarValue(topPages)} suffix="views" />
                ))}
              </div>
            )}
          </div>

          {/* Avg time on page */}
          {avgPageTimes.length > 0 && (
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Average Time on Page</h3>
              <div className="space-y-3">
                {avgPageTimes.map((entry) => (
                  <BarRow
                    key={entry.page}
                    label={entry.page}
                    value={entry.avg}
                    max={Math.max(...avgPageTimes.map((e) => e.avg), 1)}
                    suffix={`sec (${entry.visits} visits)`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'events' && (
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Event Breakdown</h3>
          {topEvents.length === 0 ? (
            <p className="text-gray-400 text-sm">No events recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {topEvents.map(([event, count]) => (
                <BarRow key={event} label={friendlyEvent(event)} value={count} max={maxBarValue(topEvents)} suffix="events" />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Top Products by Interactions</h3>
          {topProducts.length === 0 ? (
            <p className="text-gray-400 text-sm">No product interactions recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map(([name, count]) => (
                <BarRow key={name} label={name} value={count} max={maxBarValue(topProducts)} suffix="interactions" />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

/* ─── Sub-components ──────────────────────────────────── */

function SummaryCard({ label, value, icon, sub }: { label: string; value: number; icon: string; sub?: string }) {
  const icons: Record<string, JSX.Element> = {
    users: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    orders: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    assessments: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    events: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  };

  return (
    <div className="bg-white border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-2 text-blueprint-blue">
        {icons[icon]}
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</span>
      </div>
      <p className="text-3xl font-black text-gray-900">{value.toLocaleString()}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function BarRow({ label, value, max, suffix }: { label: string; value: number; max: number; suffix: string }) {
  const pct = Math.max(2, (value / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-700 font-medium truncate mr-4">{label}</span>
        <span className="text-gray-500 text-xs whitespace-nowrap">
          {value.toLocaleString()} {suffix}
        </span>
      </div>
      <div className="w-full bg-gray-100 h-2">
        <div className="bg-blueprint-blue h-2 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
