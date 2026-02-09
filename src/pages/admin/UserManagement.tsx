import { useState, useEffect } from 'react';
import { SEO } from '@/components/SEO';
import { dbGetAllUsers, type DBUser } from '@/lib/db';
import { getAllUsers, deleteUser, setUserRole } from '@/features/auth/authService';
import type { User } from '@/types/auth';

function getStoredUsersFromLocalStorage(): DBUser[] {
  try {
    const users = getAllUsers();
    return users.map((u) => ({
      ...u,
      loginCount: 1,
    }));
  } catch {
    return [];
  }
}

function getOrdersForUser(email: string) {
  try {
    const raw = localStorage.getItem('blueprint_orders');
    if (!raw) return [];
    const orders = JSON.parse(raw) as { contactEmail: string; items: { title: string; price: number }[]; total: number; createdAt: string; status: string }[];
    return orders.filter((o) => o.contactEmail === email);
  } catch {
    return [];
  }
}

export default function UserManagement() {
  const [users, setUsers] = useState<DBUser[]>([]);
  const [sortField, setSortField] = useState<'lastLogin' | 'createdAt' | 'email'>('lastLogin');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const dbUsers = await dbGetAllUsers();
        if (dbUsers.length > 0) {
          setUsers(dbUsers);
        } else {
          setUsers(getStoredUsersFromLocalStorage());
        }
      } catch {
        setUsers(getStoredUsersFromLocalStorage());
      }
    }
    loadUsers();
  }, []);

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const reloadUsers = async () => {
    try {
      const dbUsers = await dbGetAllUsers();
      if (dbUsers.length > 0) {
        setUsers(dbUsers);
      } else {
        setUsers(getStoredUsersFromLocalStorage());
      }
    } catch {
      setUsers(getStoredUsersFromLocalStorage());
    }
  };

  const handleDelete = (userId: string) => {
    deleteUser(userId);
    setConfirmDelete(null);
    void reloadUsers();
  };

  const handleRoleChange = (userId: string, role: User['role']) => {
    setUserRole(userId, role);
    void reloadUsers();
  };

  const sorted = [...users].sort((a, b) => {
    const aVal = a[sortField] || '';
    const bVal = b[sortField] || '';
    const cmp = aVal.localeCompare(bVal);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const sortIcon = (field: typeof sortField) =>
    sortField === field ? (sortDir === 'asc' ? ' \u25B2' : ' \u25BC') : '';

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO title="User Management" description="Manage registered users." canonical="/admin/users" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
      <p className="text-gray-500 mb-8">{sorted.length} registered user{sorted.length !== 1 ? 's' : ''}</p>

      <div className="sharp-card bg-white overflow-hidden">
        {sorted.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                  <th
                    className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blueprint-blue"
                    onClick={() => handleSort('email')}
                  >
                    Email{sortIcon('email')}
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                  <th
                    className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blueprint-blue"
                    onClick={() => handleSort('createdAt')}
                  >
                    Signed Up{sortIcon('createdAt')}
                  </th>
                  <th
                    className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blueprint-blue"
                    onClick={() => handleSort('lastLogin')}
                  >
                    Last Login{sortIcon('lastLogin')}
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((user) => {
                  const orders = getOrdersForUser(user.email);
                  const isExpanded = expandedUser === user.id;
                  return (
                    <tr key={user.id} className="border-t border-gray-100">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <button
                          onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                          className="text-left hover:text-blueprint-blue"
                        >
                          {user.firstName} {user.lastName}
                          <span className="text-[10px] text-gray-400 ml-1">{isExpanded ? '\u25B2' : '\u25BC'}</span>
                        </button>
                        {isExpanded && (
                          <div className="mt-3 p-4 bg-gray-50 border border-gray-200 text-xs space-y-2">
                            <p className="font-bold text-gray-700 uppercase tracking-wider mb-2">Activity</p>
                            <p><span className="text-gray-500">User ID:</span> {user.id}</p>
                            <p><span className="text-gray-500">Login count:</span> {user.loginCount || 1}</p>
                            <p><span className="text-gray-500">Orders:</span> {orders.length}</p>
                            {orders.length > 0 && (
                              <div className="mt-2">
                                <p className="font-bold text-gray-700 uppercase tracking-wider mb-1">Purchase History</p>
                                {orders.map((order, i) => (
                                  <div key={i} className="py-1 border-b border-gray-100 last:border-0">
                                    <p className="text-gray-600">
                                      {new Date(order.createdAt).toLocaleDateString()} — ${order.total.toLocaleString()} — <span className={order.status === 'approved' ? 'text-green-600' : order.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}>{order.status}</span>
                                    </p>
                                    <p className="text-gray-400">{order.items.map((it) => it.title).join(', ')}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.company || '\u2014'}</td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                          className="text-[10px] font-bold uppercase px-2 py-1 border border-gray-200 bg-white cursor-pointer"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="partner">Partner</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {confirmDelete === user.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-[10px] font-bold uppercase px-3 py-1 bg-red-600 text-white hover:bg-red-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="text-[10px] font-bold uppercase px-3 py-1 bg-gray-200 text-gray-600 hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(user.id)}
                            className="text-[10px] font-bold uppercase px-3 py-1 text-red-600 hover:bg-red-50 border border-red-200"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg mb-2">No registered users yet.</p>
            <p className="text-sm text-gray-400">Users will appear here after they create accounts.</p>
          </div>
        )}
      </div>

      <div className="mt-8 p-6 bg-gray-50 border border-gray-200">
        <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-3">Admin Setup</h3>
        <p className="text-sm text-gray-600 mb-2">
          To configure admin emails, set the <code className="bg-gray-200 px-1 py-0.5 text-xs">VITE_ADMIN_EMAILS</code> environment variable with a comma-separated list of email addresses.
        </p>
        <p className="text-sm text-gray-500">
          Example: <code className="bg-gray-200 px-1 py-0.5 text-xs">VITE_ADMIN_EMAILS=admin@company.com,manager@company.com</code>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          You can also promote any existing user to admin using the Role dropdown above.
        </p>
      </div>
    </main>
  );
}
