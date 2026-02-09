import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { getPlatformBySlug } from '@/data/platforms';
import { formatCurrency } from '@/lib/formatCurrency';
import { Button } from '@/components/ui';
import { submitForm } from '@/features/integrations/formspree/formService';
import { useAlerts } from '@/features/notifications/useAlerts';
import type { ROMResult } from '@/types/migration';

interface StoredReport {
  platform: string;
  formData: Record<string, unknown>;
  rom: ROMResult;
  timestamp: string;
}

export default function ROMCalculatorPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useAlerts();
  const [submitting, setSubmitting] = useState(false);

  const report = useMemo<StoredReport | null>(() => {
    const raw = sessionStorage.getItem('lastAssessmentReport');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredReport;
    } catch {
      return null;
    }
  }, []);

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">No Assessment Data</h1>
        <p className="text-gray-600 mb-8">
          Complete a migration assessment first to generate a ROM estimate.
        </p>
        <Button onClick={() => navigate('/migration')}>Go to Migration Suite</Button>
      </div>
    );
  }

  const platform = getPlatformBySlug(report.platform);
  const { rom } = report;
  const total = rom.totalObjects || 1;
  const pctSimple = Math.round((rom.breakdown.simple / total) * 100);
  const pctMedium = Math.round((rom.breakdown.medium / total) * 100);
  const pctComplex = Math.round((rom.breakdown.complex / total) * 100);
  const pctVeryComplex = Math.round((rom.breakdown.veryComplex / total) * 100);

  async function handleSubmitToBlueprint() {
    setSubmitting(true);
    try {
      await submitForm('romCalculator', {
        platform: report!.platform,
        totalObjects: rom.totalObjects,
        breakdown: JSON.stringify(rom.breakdown),
        estimatedHours: rom.estimatedHours,
        estimatedCostLow: rom.estimatedCost.low,
        estimatedCostHigh: rom.estimatedCost.high,
        contactEmail: report!.formData.contactEmail ?? '',
        projectName: report!.formData.projectName ?? '',
        timestamp: report!.timestamp,
      });
      showSuccess('Submitted', 'Your ROM report has been sent to the Blueprint team.');
    } catch {
      showError('Submission Failed', 'Could not send the report. Please try again.');
    } finally {
      setSubmitting(false);
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
        <h1
          className="text-3xl font-bold"
          style={{ color: platform?.brandColor ?? '#1d4ed8' }}
        >
          ROM Estimate — {platform?.name ?? report.platform}
        </h1>
        <p className="text-gray-500 mt-1">
          Generated {new Date(report.timestamp).toLocaleString()}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-300 border-t-4 border-t-blueprint-blue p-6">
          <p className="text-sm text-gray-500 mb-1">Total Objects</p>
          <p className="text-3xl font-bold text-gray-900">
            {rom.totalObjects.toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-gray-300 border-t-4 border-t-blueprint-blue p-6">
          <p className="text-sm text-gray-500 mb-1">Estimated Hours</p>
          <p className="text-3xl font-bold text-gray-900">
            {rom.estimatedHours.toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-gray-300 border-t-4 border-t-blueprint-blue p-6">
          <p className="text-sm text-gray-500 mb-1">Cost Range</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(rom.estimatedCost.low)} – {formatCurrency(rom.estimatedCost.high)}
          </p>
        </div>
      </div>

      {/* Complexity Breakdown */}
      <div className="bg-white border border-gray-300 border-t-4 border-t-blueprint-blue p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Complexity Breakdown</h2>
        <div className="space-y-4">
          <BreakdownBar
            label="Simple"
            count={rom.breakdown.simple}
            percent={pctSimple}
            color="#22c55e"
          />
          <BreakdownBar
            label="Medium"
            count={rom.breakdown.medium}
            percent={pctMedium}
            color="#eab308"
          />
          <BreakdownBar
            label="Complex"
            count={rom.breakdown.complex}
            percent={pctComplex}
            color="#f97316"
          />
          <BreakdownBar
            label="Very Complex"
            count={rom.breakdown.veryComplex}
            percent={pctVeryComplex}
            color="#ef4444"
          />
        </div>
      </div>

      {/* Hours Breakdown Table */}
      <div className="bg-white border border-gray-300 border-t-4 border-t-blueprint-blue p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hours Estimate Detail</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="pb-2 font-medium text-gray-500">Complexity</th>
              <th className="pb-2 font-medium text-gray-500">Objects</th>
              <th className="pb-2 font-medium text-gray-500">Hrs/Object</th>
              <th className="pb-2 font-medium text-gray-500 text-right">Total Hours</th>
            </tr>
          </thead>
          <tbody className="text-gray-900">
            <HoursRow label="Simple" count={rom.breakdown.simple} rate={2} />
            <HoursRow label="Medium" count={rom.breakdown.medium} rate={8} />
            <HoursRow label="Complex" count={rom.breakdown.complex} rate={24} />
            <HoursRow label="Very Complex" count={rom.breakdown.veryComplex} rate={60} />
            <tr className="border-t border-gray-300 font-bold">
              <td className="pt-2">Total</td>
              <td className="pt-2">{rom.totalObjects.toLocaleString()}</td>
              <td className="pt-2"></td>
              <td className="pt-2 text-right">{rom.estimatedHours.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={handleSubmitToBlueprint} disabled={submitting}>
          {submitting ? 'Sending...' : 'Send Report to Blueprint'}
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(`/migration/${report.platform}`)}
        >
          Edit Assessment
        </Button>
        <Button variant="secondary" onClick={() => navigate('/migration')}>
          New Assessment
        </Button>
      </div>
    </div>
  );
}

function BreakdownBar({
  label,
  count,
  percent,
  color,
}: {
  label: string;
  count: number;
  percent: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="text-gray-500">
          {count.toLocaleString()} ({percent}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 h-3">
        <div className="h-3" style={{ width: `${percent}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function HoursRow({
  label,
  count,
  rate,
}: {
  label: string;
  count: number;
  rate: number;
}) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-2">{label}</td>
      <td className="py-2">{count.toLocaleString()}</td>
      <td className="py-2">{rate}</td>
      <td className="py-2 text-right">{(count * rate).toLocaleString()}</td>
    </tr>
  );
}
