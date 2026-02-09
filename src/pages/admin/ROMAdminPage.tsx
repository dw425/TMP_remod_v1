import { useState } from 'react';
import { platforms } from '@/data/platforms';
import { migrationSchemas } from '@/data/migration-schemas';
import {
  getAllOverrides,
  saveOverride,
  removeOverride,
  clearAllOverrides,
  type ROMConfigOverride,
} from '@/lib/romConfigStore';
import { Button } from '@/components/ui';
import { useAlerts } from '@/features/notifications/useAlerts';
import type { ComplexityBreakdown } from '@/types/migration';

const DEFAULT_WEIGHTS: Record<number, [number, number, number, number]> = {
  1: [0.8, 0.2, 0, 0],
  2: [0.6, 0.3, 0.1, 0],
  3: [0.4, 0.4, 0.2, 0],
  4: [0.2, 0.4, 0.3, 0.1],
  5: [0.1, 0.2, 0.4, 0.3],
};

export default function ROMAdminPage() {
  const { showSuccess } = useAlerts();
  const [overrides, setOverrides] = useState(getAllOverrides);
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

  function handleSave(platformSlug: string, override: ROMConfigOverride) {
    saveOverride(platformSlug, override);
    setOverrides(getAllOverrides());
    showSuccess('Saved', `ROM config for ${platformSlug} updated.`);
  }

  function handleReset(platformSlug: string) {
    removeOverride(platformSlug);
    setOverrides(getAllOverrides());
    showSuccess('Reset', `${platformSlug} reverted to schema defaults.`);
  }

  function handleClearAll() {
    clearAllOverrides();
    setOverrides({});
    showSuccess('Cleared', 'All ROM overrides removed.');
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ROM Calculator Admin</h1>
          <p className="text-gray-500 mt-2">
            Adjust hours-per-object, hourly rates, and complexity distribution weights
            per platform. Changes are saved to your browser and apply immediately to
            all new assessments.
          </p>
        </div>
        <Button variant="secondary" onClick={handleClearAll}>
          Reset All to Defaults
        </Button>
      </div>

      <div className="space-y-4">
        {platforms.map((platform) => {
          const schema = migrationSchemas[platform.slug];
          if (!schema) return null;
          const defaults = schema.romConfig;
          const override = overrides[platform.slug];
          const isExpanded = expandedPlatform === platform.slug;
          const hasOverride = !!override;

          return (
            <div
              key={platform.slug}
              className="bg-white border border-gray-300 border-t-4"
              style={{ borderTopColor: platform.brandColor }}
            >
              <button
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() =>
                  setExpandedPlatform(isExpanded ? null : platform.slug)
                }
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-gray-900">
                    {platform.name}
                  </h2>
                  {hasOverride && (
                    <span className="text-xs bg-blue-100 text-blueprint-blue px-2 py-0.5 font-medium">
                      CUSTOMIZED
                    </span>
                  )}
                </div>
                <span className="text-gray-400 text-xl">
                  {isExpanded ? '\u2212' : '+'}
                </span>
              </button>

              {isExpanded && (
                <PlatformEditor
                  platformSlug={platform.slug}
                  defaults={defaults.hoursPerObject}
                  defaultRate={defaults.hourlyRate}
                  defaultWeights={defaults.distributionWeights}
                  current={override}
                  onSave={(o) => handleSave(platform.slug, o)}
                  onReset={() => handleReset(platform.slug)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlatformEditor({
  platformSlug,
  defaults,
  defaultRate,
  defaultWeights,
  current,
  onSave,
  onReset,
}: {
  platformSlug: string;
  defaults: ComplexityBreakdown;
  defaultRate: { low: number; high: number };
  defaultWeights?: Record<number, [number, number, number, number]>;
  current?: ROMConfigOverride;
  onSave: (override: ROMConfigOverride) => void;
  onReset: () => void;
}) {
  const [hours, setHours] = useState<ComplexityBreakdown>(
    current?.hoursPerObject ?? { ...defaults },
  );
  const [rate, setRate] = useState(current?.hourlyRate ?? { ...defaultRate });
  const [weights, setWeights] = useState<Record<number, [number, number, number, number]>>(
    current?.distributionWeights ?? defaultWeights ?? { ...DEFAULT_WEIGHTS },
  );

  function handleSave() {
    onSave({ hoursPerObject: hours, hourlyRate: rate, distributionWeights: weights });
  }

  return (
    <div className="px-4 pb-6 space-y-6 border-t border-gray-200 pt-4">
      {/* Hours Per Object */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
          Hours Per Object
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['simple', 'medium', 'complex', 'veryComplex'] as const).map((level) => (
            <div key={level}>
              <label className="block text-xs text-gray-500 mb-1 capitalize">
                {level === 'veryComplex' ? 'Very Complex' : level}
              </label>
              <input
                type="number"
                min={0}
                value={hours[level]}
                onChange={(e) =>
                  setHours((h) => ({ ...h, [level]: Number(e.target.value) || 0 }))
                }
                className="w-full border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:border-blueprint-blue focus:ring-1 focus:ring-blueprint-blue"
              />
              <span className="text-xs text-gray-400">
                default: {defaults[level]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Rate */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
          Hourly Rate ($/hr)
        </h3>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Low</label>
            <input
              type="number"
              min={0}
              value={rate.low}
              onChange={(e) =>
                setRate((r) => ({ ...r, low: Number(e.target.value) || 0 }))
              }
              className="w-full border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:border-blueprint-blue focus:ring-1 focus:ring-blueprint-blue"
            />
            <span className="text-xs text-gray-400">default: ${defaultRate.low}</span>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">High</label>
            <input
              type="number"
              min={0}
              value={rate.high}
              onChange={(e) =>
                setRate((r) => ({ ...r, high: Number(e.target.value) || 0 }))
              }
              className="w-full border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:border-blueprint-blue focus:ring-1 focus:ring-blueprint-blue"
            />
            <span className="text-xs text-gray-400">default: ${defaultRate.high}</span>
          </div>
        </div>
      </div>

      {/* Distribution Weights */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
          Complexity Distribution Weights
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          For each complexity slider level (1-5), set the percentage allocated to
          Simple / Medium / Complex / Very Complex. Values should sum to 1.0.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-2 font-medium text-gray-500 w-20">Level</th>
                <th className="pb-2 font-medium text-gray-500">Simple</th>
                <th className="pb-2 font-medium text-gray-500">Medium</th>
                <th className="pb-2 font-medium text-gray-500">Complex</th>
                <th className="pb-2 font-medium text-gray-500">V. Complex</th>
                <th className="pb-2 font-medium text-gray-500 w-16">Sum</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((level) => {
                const w = weights[level] ?? DEFAULT_WEIGHTS[level] ?? [0.4, 0.4, 0.2, 0];
                const sum = w[0] + w[1] + w[2] + w[3];
                const isValid = Math.abs(sum - 1) < 0.01;
                return (
                  <tr key={level} className="border-b border-gray-100">
                    <td className="py-2 font-medium text-gray-700">{level}</td>
                    {[0, 1, 2, 3].map((i) => (
                      <td key={i} className="py-2 pr-2">
                        <input
                          type="number"
                          step={0.05}
                          min={0}
                          max={1}
                          value={w[i]}
                          onChange={(e) => {
                            const newW: [number, number, number, number] = [...w];
                            newW[i] = Number(e.target.value) || 0;
                            setWeights((prev) => ({ ...prev, [level]: newW }));
                          }}
                          className="w-20 border border-gray-300 px-2 py-1 text-gray-900 bg-white focus:outline-none focus:border-blueprint-blue"
                        />
                      </td>
                    ))}
                    <td className={`py-2 font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                      {sum.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave}>Save {platformSlug}</Button>
        <Button variant="secondary" onClick={onReset}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
