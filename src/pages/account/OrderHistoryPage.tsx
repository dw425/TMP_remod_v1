import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import type { Order } from '@/types/auth';

const ORDERS_KEY = 'blueprint_orders';

function getOrders(email: string): Order[] {
  try {
    const all: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    return all.filter((o) => o.contactEmail === email);
  } catch {
    return [];
  }
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  submitted: 'bg-blue-50 text-blue-700 border-blue-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) setOrders(getOrders(user.email));
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-300 p-12 text-center">
          <p className="text-gray-500 text-lg mb-2">No orders yet</p>
          <p className="text-gray-400 text-sm">
            Your PO requests and order history will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-300 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-gray-900">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} &middot; {order.companyName}
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium border capitalize ${statusColors[order.status] || ''}`}>
                  {order.status}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1">
                    <span className="text-gray-700">{item.title}</span>
                    <span className="text-gray-500">${item.price.toLocaleString()}/{item.billing}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                  <span>Total</span>
                  <span>${order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
