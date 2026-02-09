import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getPlatformBySlug } from '@/data/platforms';
import { getSchemaByPlatform } from '@/data/migration-schemas';
import { AssessmentSection } from '@/components/composed/AssessmentSection';
import { calculateROM } from '@/lib/romCalculator';
import { getEffectiveConfig } from '@/lib/romConfigStore';
import { Button } from '@/components/ui';
import { useAlerts } from '@/features/notifications/useAlerts';

export default function MigrationAssessmentPage() {
  const { platform } = useParams<{ platform: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useAlerts();

  const platformConfig = platform ? getPlatformBySlug(platform) : undefined;
  const schema = platform ? getSchemaByPlatform(platform) : undefined;

  const form = useForm<Record<string, unknown>>({ mode: 'onBlur' });

  if (!platformConfig || !schema) {
    return <Navigate to="/migration" replace />;
  }

  function onSubmit(data: Record<string, unknown>) {
    try {
      const effectiveConfig = getEffectiveConfig(schema!.platform, schema!.romConfig);
      const rom = calculateROM(data, effectiveConfig);

      const report = {
        platform: schema!.platform,
        formData: data,
        rom,
        timestamp: new Date().toISOString(),
      };

      sessionStorage.setItem('lastAssessmentReport', JSON.stringify(report));
      showSuccess('Assessment Saved', 'Fine tune your estimate now on the ROM Calculator.');
      navigate('/migration/calculator');
    } catch {
      showError('Submission Failed', 'There was an error processing your assessment.');
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate('/migration')}
        className="text-sm text-blueprint-blue hover:underline mb-6 inline-block"
      >
        &larr; Back to Migration Suite
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: schema.brandColor }}>
          {schema.title}
        </h1>
        <p className="text-gray-500 mt-2">{schema.subtitle}</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {schema.sections.map((section) => (
          <AssessmentSection key={section.id} section={section} form={form} />
        ))}

        <div className="flex gap-4">
          <Button type="submit">Generate ROM Estimate</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => form.reset()}
          >
            Reset Form
          </Button>
        </div>
      </form>
    </div>
  );
}
