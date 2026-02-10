import { useState, useEffect } from 'react';
import { SEO } from '@/components/SEO';
import { dbGetAllOrders, type DBOrder } from '@/lib/db';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  submitted: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  approved: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  rejected: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function getLocalStorageOrders(): DBOrder[] {
  try {
    const raw = localStorage.getItem('blueprint_orders');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default function OrderReports() {
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const dbOrders = await dbGetAllOrders();
        if (dbOrders.length > 0) {
          setOrders(dbOrders.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)));
        } else {
          setOrders(getLocalStorageOrders().sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || '')));
        }
      } catch {
        setOrders(getLocalStorageOrders());
      }
    }
    loadOrders();
  }, []);

  const filtered = statusFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  const totalRevenue = orders
    .filter((o) => o.status === 'approved')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO title="Order Reports" description="View PO submissions and order reports." canonical="/admin/orders" />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Order Reports</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Track PO submissions, status, and revenue.</p>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="sharp-card bg-white dark:bg-slate-800 p-6">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{orders.length}</p>
        </div>
        <div className="sharp-card bg-white dark:bg-slate-800 p-6">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {orders.filter((o) => o.status === 'pending' || o.status === 'submitted').length}
          </p>
        </div>
        <div className="sharp-card bg-white dark:bg-slate-800 p-6">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Approved Revenue</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'submitted', 'approved', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-xs font-bold uppercase px-3 py-1.5 border ${
              statusFilter === s
                ? 'border-blueprint-blue text-blueprint-blue bg-blue-50 dark:bg-blue-900/30'
                : 'border-gray-300 dark:border-slate-600 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-slate-500'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="sharp-card bg-white dark:bg-slate-800 overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Items</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const isExpanded = expandedOrder === order.id;
                  return (
                    <tr key={order.id} className="border-t border-gray-100 dark:border-slate-700">
                      <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-gray-100">
                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                          className="hover:text-blueprint-blue"
                        >
                          {order.poNumber || order.id.slice(0, 8)}
                          <span className="text-[10px] text-gray-400 ml-1">{isExpanded ? '\u25B2' : '\u25BC'}</span>
                        </button>
                        {isExpanded && (
                          <div className="mt-3 p-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-xs space-y-1 font-sans">
                            <p className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Line Items</p>
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-600 last:border-0">
                                <span className="text-gray-700 dark:text-gray-300">{item.title}</span>
                                <span className="text-gray-500 dark:text-gray-400">{formatCurrency(item.price)}</span>
                              </div>
                            ))}
                            <div className="flex justify-between pt-2 font-bold text-gray-900 dark:text-gray-100">
                              <span>Total</span>
                              <span>{formatCurrency(order.total)}</span>
                            </div>
                            {order.email && <p className="pt-2"><span className="text-gray-500 dark:text-gray-400">Contact:</span> {order.email}</p>}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{order.company}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{formatCurrency(order.total)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 ${STATUS_STYLES[order.status] || 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No orders to display.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Orders will appear here when customers submit purchase orders.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
