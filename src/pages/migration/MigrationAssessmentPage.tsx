import { useState } from 'react';
import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getPlatformBySlug } from '@/data/platforms';
import { getSchemaByPlatform } from '@/data/migration-schemas';
import { AssessmentSection } from '@/components/composed/AssessmentSection';
import { calculateROM } from '@/lib/romCalculator';
import { getEffectiveConfig } from '@/lib/romConfigStore';
import { Button } from '@/components/ui';
import { useAlerts } from '@/features/notifications/useAlerts';
import { useTrack } from '@/features/analytics/useTrack';
import { EVENTS } from '@/features/analytics/events';
import { useAuth } from '@/features/auth/useAuth';
import { dbPutAssessment } from '@/lib/db';
import { ROUTES } from '@/config/routes';
import { useScrollLock } from '@/hooks/useScrollLock';

function SignupPromptModal({ onClose }: { onClose: () => void }) {
  useScrollLock(true);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }} role="button" tabIndex={-1} aria-label="Close modal" />
      <div className="relative bg-white dark:bg-slate-800 w-full max-w-md border-t-4 border-blueprint-blue p-8 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Close">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center mb-6">
          <svg className="w-14 h-14 mx-auto text-blueprint-blue mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Assessment Saved!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Your ROM estimate has been generated and saved to the calculator.
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 p-4 mb-6">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Create a free account</strong> to save your assessments to your dashboard, track multiple migrations, and access your results anytime.
          </p>
        </div>
        <div className="space-y-3">
          <Link
            to={ROUTES.SIGNUP}
            className="block w-full bg-blueprint-blue text-white font-bold py-3 text-center uppercase tracking-widest text-xs hover:bg-blue-800 transition-colors"
          >
            Create Account
          </Link>
          <Link
            to={ROUTES.LOGIN}
            className="block w-full text-center text-sm text-blueprint-blue hover:underline"
          >
            Already have an account? Sign in
          </Link>
          <Link
            to="/migration/calculator"
            className="block w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Continue to Calculator &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MigrationAssessmentPage() {
  const { platform } = useParams<{ platform: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useAlerts();
  const track = useTrack();
  const { user, isAuthenticated } = useAuth();
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  const platformConfig = platform ? getPlatformBySlug(platform) : undefined;
  const schema = platform ? getSchemaByPlatform(platform) : undefined;

  const form = useForm<Record<string, unknown>>({ mode: 'onBlur' });

  if (!platformConfig || !schema) {
    return <Navigate to="/migration" replace />;
  }

  const sectionCount = schema.sections.length;

  async function onSubmit(data: Record<string, unknown>) {
    try {
      const effectiveConfig = getEffectiveConfig(schema!.platform, schema!.romConfig);
      const rom = calculateROM(data, effectiveConfig);

      const report = {
        platform: schema!.platform,
        formData: data,
        rom,
        timestamp: new Date().toISOString(),
      };

      // Always save to sessionStorage for the calculator page
      sessionStorage.setItem('lastAssessmentReport', JSON.stringify(report));

      // Derive dashboard-friendly totals from ROMResult
      const WEEKLY_VELOCITY = 160;
      const ACCELERATOR_FACTOR = 0.4; // 60% reduction with Blueprint accelerators
      const totalHours = rom.estimatedHours;
      const totalWeeks = Math.ceil(totalHours / WEEKLY_VELOCITY);
      const acceleratedHours = Math.ceil(totalHours * ACCELERATOR_FACTOR);
      const acceleratedWeeks = Math.ceil(acceleratedHours / WEEKLY_VELOCITY);

      track(EVENTS.MIGRATION_ROM_GENERATED, { platform: schema!.platform, totalHours });

      if (isAuthenticated && user) {
        // Save to IndexedDB for the user's dashboard
        await dbPutAssessment({
          id: crypto.randomUUID(),
          userId: user.id,
          platform: schema!.platform,
          platformName: platformConfig!.name,
          formData: data,
          rom: {
            totalHours,
            totalWeeks,
            acceleratedHours,
            acceleratedWeeks,
          },
          submittedAt: new Date().toISOString(),
        });

        showSuccess('Assessment Saved', 'Redirecting to your dashboard...');
        setTimeout(() => navigate(ROUTES.DASHBOARD), 1000);
      } else {
        // Not logged in — show signup prompt modal
        setShowSignupPrompt(true);
      }
    } catch {
      showError('Submission Failed', 'There was an error processing your assessment.');
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex items-center gap-1.5">
          <li><Link to={ROUTES.HOME} className="hover:text-blueprint-blue transition-colors">Home</Link></li>
          <li><span className="mx-1">/</span></li>
          <li><Link to="/migration" className="hover:text-blueprint-blue transition-colors">Migration Suite</Link></li>
          <li><span className="mx-1">/</span></li>
          <li className="font-medium" style={{ color: schema.brandColor }}>{platformConfig.name}</li>
        </ol>
      </nav>

      {/* Header with brand accent */}
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-4 mb-3">
          <div
            className="w-2 h-12 shrink-0"
            style={{ backgroundColor: schema.brandColor }}
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {schema.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{schema.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <span className="font-bold uppercase tracking-wider">{sectionCount} Sections</span>
          <span>|</span>
          <span>Estimated 15-25 minutes</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="sticky top-20 z-30 bg-bg-primary dark:bg-[#0f172a] py-3 mb-6 -mx-4 px-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider shrink-0">Progress</span>
          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                backgroundColor: schema.brandColor,
                width: '0%', // Visual only — no JS tracking needed
              }}
            />
          </div>
        </div>
        {/* Section jump nav */}
        <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
          {schema.sections.map((s, i) => (
            <a
              key={s.id}
              href={`#section-${s.id}`}
              className="text-[10px] font-bold text-gray-400 hover:text-blueprint-blue uppercase tracking-wider whitespace-nowrap px-2 py-1 border border-gray-200 dark:border-slate-700 hover:border-blueprint-blue transition-colors bg-white dark:bg-slate-800 dark:text-gray-400 dark:hover:text-blue-400 shrink-0"
            >
              {i + 1}. {s.title}
            </a>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {schema.sections.map((section, i) => (
          <div key={section.id} id={`section-${section.id}`}>
            <AssessmentSection
              section={section}
              form={form}
              index={i}
              total={sectionCount}
              brandColor={schema.brandColor}
            />
          </div>
        ))}

        {/* Submit area */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-slate-700">
          <Button type="submit">Generate ROM Estimate</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => form.reset()}
          >
            Reset Form
          </Button>
          <button
            type="button"
            onClick={() => navigate('/migration')}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 ml-auto"
          >
            Cancel
          </button>
        </div>
      </form>

      {showSignupPrompt && (
        <SignupPromptModal onClose={() => setShowSignupPrompt(false)} />
      )}
    </div>
  );
}
