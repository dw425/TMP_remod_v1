import { useState, useEffect } from 'react';
import { SEO } from '@/components/SEO';
import { dbGetAllUsers, type DBUser } from '@/lib/db';

function getStoredUsersFromLocalStorage(): DBUser[] {
  try {
    const raw = localStorage.getItem('blueprint_users');
    if (!raw) return [];
    const parsed: Record<string, { user: { id: string; email: string; firstName: string; lastName: string; company?: string; role: string; createdAt: string; lastLogin: string } }> = JSON.parse(raw);
    return Object.values(parsed).map((entry) => ({
      ...entry.user,
      loginCount: 1,
    }));
  } catch {
    return [];
  }
}

export default function UserManagement() {
  const [users, setUsers] = useState<DBUser[]>([]);
  const [sortField, setSortField] = useState<'lastLogin' | 'createdAt' | 'email'>('lastLogin');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    async function loadUsers() {
      try {
        const dbUsers = await dbGetAllUsers();
        if (dbUsers.length > 0) {
          setUsers(dbUsers);
        } else {
          // Fallback to localStorage
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
                </tr>
              </thead>
              <tbody>
                {sorted.map((user) => (
                  <tr key={user.id} className="border-t border-gray-100">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.company || '\u2014'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-1 ${
                          user.role === 'admin'
                            ? 'bg-blueprint-blue text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
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
    </main>
  );
}
