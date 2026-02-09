import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { ROUTES } from '@/config/routes';
import { dbGetAssessmentsByUser, type DBAssessment } from '@/lib/db';

export default function DashboardPage() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<DBAssessment[]>([]);
  const [showAssessments, setShowAssessments] = useState(false);

  useEffect(() => {
    if (!user) return;
    dbGetAssessmentsByUser(user.id).then((results) => {
      setAssessments(results.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)));
    });
  }, [user]);

  if (!user) return null;

  const quickLinks = [
    { label: 'Downloads', to: ROUTES.DOWNLOADS, desc: 'Access your purchased content and downloads' },
    { label: 'Deployments', to: ROUTES.DEPLOYMENTS, desc: 'Deploy products to your Databricks workspace' },
    { label: 'Order History', to: ROUTES.ORDERS, desc: 'View your PO requests and order status' },
    { label: 'Account Settings', to: ROUTES.SETTINGS, desc: 'Update your profile and password' },
    { label: 'AI Factory', to: ROUTES.AI_FACTORY, desc: 'Explore AI engagement tiers' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white border border-gray-300 border-t-4 border-t-blueprint-blue p-8 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Welcome back, {user.firstName}
        </h1>
        <p className="text-gray-500 text-sm">
          {user.email} &middot; {user.company || 'No company'} &middot;{' '}
          <span className="capitalize">{user.role}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="bg-white border border-gray-300 p-6 hover:border-blueprint-blue transition-colors group"
          >
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-blueprint-blue mb-1">
              {link.label}
            </h2>
            <p className="text-sm text-gray-500">{link.desc}</p>
          </Link>
        ))}

        {/* Migration Suite card — expandable with saved assessments */}
        <div className="bg-white border border-gray-300 hover:border-blueprint-blue transition-colors">
          <Link
            to={ROUTES.MIGRATION_HOME}
            className="block p-6 group"
          >
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-blueprint-blue mb-1">
              Migration Suite
            </h2>
            <p className="text-sm text-gray-500">Start a platform migration assessment</p>
          </Link>

          {assessments.length > 0 && (
            <div className="border-t border-gray-200 px-6 pb-4">
              <button
                onClick={() => setShowAssessments(!showAssessments)}
                className="flex items-center justify-between w-full py-3 text-sm font-bold text-blueprint-blue hover:underline"
              >
                <span>{assessments.length} Saved Assessment{assessments.length !== 1 ? 's' : ''}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${showAssessments ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showAssessments && (
                <div className="space-y-3 mt-1">
                  {assessments.map((a) => (
                    <div
                      key={a.id}
                      className="bg-gray-50 border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-gray-900">{a.platformName}</h3>
                        <span className="text-xs text-gray-400">
                          {new Date(a.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>
                          <span className="text-gray-400">Manual:</span>{' '}
                          <span className="font-bold">{a.rom.totalHours.toLocaleString()} hrs</span>
                          <span className="text-gray-400"> ({a.rom.totalWeeks} wks)</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Accelerated:</span>{' '}
                          <span className="font-bold text-blueprint-blue">{a.rom.acceleratedHours.toLocaleString()} hrs</span>
                          <span className="text-gray-400"> ({a.rom.acceleratedWeeks} wks)</span>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-3">
                        <Link
                          to={`/migration/${a.platform}`}
                          className="text-xs text-blueprint-blue hover:underline font-bold"
                        >
                          Re-assess
                        </Link>
                        <Link
                          to="/migration/calculator"
                          onClick={() => {
                            sessionStorage.setItem('lastAssessmentReport', JSON.stringify({
                              platform: a.platform,
                              formData: a.formData,
                              rom: a.rom,
                              timestamp: a.submittedAt,
                            }));
                          }}
                          className="text-xs text-blueprint-blue hover:underline font-bold"
                        >
                          Open in Calculator
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
