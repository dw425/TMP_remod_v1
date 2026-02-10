import { useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { Button } from '@/components/ui';
import * as authService from '@/features/auth/authService';
import { useAuthStore } from '@/features/auth/authStore';
import { useAlerts } from '@/features/notifications/useAlerts';

export default function SettingsPage() {
  const { user } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);
  const token = useAuthStore((s) => s.token);
  const { showSuccess, showError } = useAlerts();

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    company: user?.company || '',
  });
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await authService.updateProfile(user.id, form);
      setUser(updated, token);
      showSuccess('Profile updated successfully');
    } catch {
      showError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full border border-gray-300 dark:border-slate-600 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800 focus:outline-none focus:border-blueprint-blue focus:ring-1 focus:ring-blueprint-blue';

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Account Settings</h1>

      <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 border-t-4 border-t-blueprint-blue p-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Profile Information</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="settings-firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
              <input id="settings-firstName" type="text" name="firstName" value={form.firstName} onChange={handleChange} required autoComplete="given-name" className={inputClass} />
            </div>
            <div>
              <label htmlFor="settings-lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
              <input id="settings-lastName" type="text" name="lastName" value={form.lastName} onChange={handleChange} required autoComplete="family-name" className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="settings-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input id="settings-email" type="email" value={user.email} disabled className={`${inputClass} bg-gray-50 dark:bg-slate-700 text-gray-400 dark:text-gray-400 cursor-not-allowed`} />
            <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label htmlFor="settings-company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
            <input id="settings-company" type="text" name="company" value={form.company} onChange={handleChange} autoComplete="organization" className={inputClass} />
          </div>
          <div className="pt-4">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 p-8 mt-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Account Details</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <p>Role: <span className="capitalize font-medium text-gray-700 dark:text-gray-300">{user.role}</span></p>
          <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
          <p>Last login: {new Date(user.lastLogin).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
