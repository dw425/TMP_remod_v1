import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { getPlatformBySlug } from '@/data/platforms';
import { getSchemaByPlatform } from '@/data/migration-schemas';
import { submitForm } from '@/features/integrations/formspree/formService';
import { useAlerts } from '@/features/notifications/useAlerts';

interface StoredReport {
  platform: string;
  formData: Record<string, unknown>;
  rom: { totalObjects: number; breakdown: { simple: number; medium: number; complex: number; veryComplex: number }; estimatedHours: number; estimatedCost: { low: number; high: number } };
  timestamp: string;
}

/** Benchmarks: hours per object at each complexity level, by object type */
const BENCHMARKS: Record<string, { s: number; m: number; c: number; v: number }> = {
  table:  { s: 2,  m: 6,  c: 16, v: 40 },
  view:   { s: 2,  m: 8,  c: 24, v: 40 },
  proc:   { s: 4,  m: 12, c: 32, v: 60 },
  func:   { s: 4,  m: 12, c: 32, v: 60 },
  etl:    { s: 6,  m: 20, c: 50, v: 100 },
  script: { s: 4,  m: 16, c: 40, v: 80 },
  orch:   { s: 2,  m: 6,  c: 16, v: 32 },
  bi:     { s: 4,  m: 16, c: 40, v: 80 },
  excel:  { s: 2,  m: 8,  c: 24, v: 60 },
  report: { s: 4,  m: 12, c: 32, v: 80 },
};

const PLATFORM_FACTORS: Record<string, number> = {
  snowflake: 0.8, databricks: 0.8, synapse: 0.85, 'sql-server': 0.9,
  oracle: 1.0, netezza: 1.1, teradata: 1.15, sap: 1.2, hadoop: 1.25,
  gcp: 1.0, informatica: 1.0, redshift: 0.9, 'unity-catalog': 0.8, talend: 1.0,
};

const DB_ROWS = [
  { key: 'table', label: 'Tables' },
  { key: 'view',  label: 'Views' },
  { key: 'proc',  label: 'Stored Procs' },
  { key: 'func',  label: 'Functions' },
];

const CODE_ROWS = [
  { key: 'etl',    label: 'ETL Pipelines' },
  { key: 'script', label: 'Scripts' },
  { key: 'orch',   label: 'Orchestration' },
];

const PRES_ROWS = [
  { key: 'bi',     label: 'BI Dashboards' },
  { key: 'excel',  label: 'Excel Sheets' },
  { key: 'report', label: 'Reports' },
];

type MatrixData = Record<string, { simple: number; medium: number; complex: number; veryComplex: number }>;

/** Default complexity distribution weights (slider value 1-5). */
const DIST_WEIGHTS: Record<number, [number, number, number, number]> = {
  1: [0.8, 0.2, 0, 0],
  2: [0.6, 0.3, 0.1, 0],
  3: [0.4, 0.4, 0.2, 0],
  4: [0.2, 0.4, 0.3, 0.1],
  5: [0.1, 0.2, 0.4, 0.3],
};

function distribute(total: number, complexity: number): { simple: number; medium: number; complex: number; veryComplex: number } {
  const key = Math.min(5, Math.max(1, Math.round(complexity || 3)));
  const w = DIST_WEIGHTS[key] ?? [0.4, 0.4, 0.2, 0];
  return {
    simple: Math.round(total * (w[0] ?? 0)),
    medium: Math.round(total * (w[1] ?? 0)),
    complex: Math.round(total * (w[2] ?? 0)),
    veryComplex: Math.round(total * (w[3] ?? 0)),
  };
}

/**
 * Maps assessment form field names to ROM calculator matrix rows.
 * Each entry: assessmentCountField → { matrixRow, complexityField? }
 * Covers all 11 platforms' varying naming conventions.
 */
const FIELD_TO_MATRIX: Record<string, { row: string; complexityField?: string }> = {
  // Tables
  tableCount: { row: 'table', complexityField: 'tableComplexity' },
  // Views
  viewCount: { row: 'view', complexityField: 'viewComplexity' },
  // Stored Procedures
  spCount: { row: 'proc', complexityField: 'spComplexity' },
  totalProcs: { row: 'proc', complexityField: 'procComplexity' },
  plsqlObjectCount: { row: 'proc', complexityField: 'procComplexity' },
  macroCount: { row: 'proc' },
  // Functions
  udfCount: { row: 'func', complexityField: 'udfComplexity' },
  udfTotalCount: { row: 'func', complexityField: 'udfComplexity' },
  funcCount: { row: 'func', complexityField: 'funcComplexity' },
  functionCount: { row: 'func' },
  abapCount: { row: 'func', complexityField: 'abapComplexity' },
  // ETL / Pipelines
  pipelineCount: { row: 'etl', complexityField: 'ingestComplexity' },
  dataflowJobCount: { row: 'etl' },
  etlCount: { row: 'etl', complexityField: 'etlComplexity' },
  mappingCount: { row: 'etl', complexityField: 'mappingComplexity' },
  jobCount: { row: 'etl' },
  dataFlowCount: { row: 'etl', complexityField: 'dataFlowComplexity' },
  bwObjectCount: { row: 'etl', complexityField: 'bwComplexity' },
  // Scripts
  scriptCount: { row: 'script', complexityField: 'scriptComplexity' },
  totalScripts: { row: 'script', complexityField: 'scriptComplexity' },
  notebookCount: { row: 'script', complexityField: 'notebookComplexity' },
  bteqCount: { row: 'script', complexityField: 'scriptComplexity' },
  fastloadCount: { row: 'script' },
  tptCount: { row: 'script' },
  routineCount: { row: 'script', complexityField: 'routineComplexity' },
  sessionCount: { row: 'script' },
  // Orchestration
  taskCount: { row: 'orch', complexityField: 'orchComplexity' },
  composerDagCount: { row: 'orch' },
  orchCount: { row: 'orch', complexityField: 'orchComplexity' },
  dagCount: { row: 'orch', complexityField: 'orchComplexity' },
  triggerCount: { row: 'orch', complexityField: 'triggerComplexity' },
  workflowCount: { row: 'orch', complexityField: 'workflowComplexity' },
};

function initMatrixFromAssessment(formData?: Record<string, unknown>): MatrixData {
  const m: MatrixData = {};
  [...DB_ROWS, ...CODE_ROWS, ...PRES_ROWS].forEach((r) => {
    m[r.key] = { simple: 0, medium: 0, complex: 0, veryComplex: 0 };
  });

  if (!formData) return m;

  // Accumulate counts per matrix row (some platforms have multiple fields mapping to same row)
  const accumulated: Record<string, { total: number; complexity: number; complexityCount: number }> = {};

  for (const [fieldName, mapping] of Object.entries(FIELD_TO_MATRIX)) {
    const count = Number(formData[fieldName]) || 0;
    if (count <= 0) continue;

    if (!accumulated[mapping.row]) {
      accumulated[mapping.row] = { total: 0, complexity: 0, complexityCount: 0 };
    }
    const acc = accumulated[mapping.row]!;
    acc.total += count;

    if (mapping.complexityField) {
      const cVal = Number(formData[mapping.complexityField]);
      if (cVal > 0) {
        acc.complexity += cVal;
        acc.complexityCount += 1;
      }
    }
  }

  // Distribute accumulated totals across complexity levels
  for (const [rowKey, acc] of Object.entries(accumulated)) {
    if (!m[rowKey]) continue;
    const avgComplexity = acc.complexityCount > 0 ? acc.complexity / acc.complexityCount : 3;
    m[rowKey] = distribute(acc.total, avgComplexity);
  }

  return m;
}

export default function ROMCalculatorPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useAlerts();
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const report = useMemo<StoredReport | null>(() => {
    const raw = sessionStorage.getItem('lastAssessmentReport');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredReport;
    } catch {
      return null;
    }
  }, []);

  const platform = report ? getPlatformBySlug(report.platform) : undefined;

  // Editable state — pre-filled from assessment data
  const [projectName, setProjectName] = useState(String(report?.formData?.projectName ?? ''));
  const [stakeholder, setStakeholder] = useState(String(report?.formData?.stakeholder ?? ''));
  const [email, setEmail] = useState(String(report?.formData?.contactEmail ?? ''));
  const [matrix, setMatrix] = useState<MatrixData>(() => initMatrixFromAssessment(report?.formData));
  const overallC = Number(report?.formData?.overallComplexity) || 3;
  const [teamMaturity, setTeamMaturity] = useState(overallC);
  const [toolFamiliarity, setToolFamiliarity] = useState(3);
  const [infraConfig, setInfraConfig] = useState(3);
  const [envComplexity, setEnvComplexity] = useState(overallC);

  // Calculation results
  const [manualHours, setManualHours] = useState(0);
  const [aiHours, setAiHours] = useState(0);
  const [ratingText, setRatingText] = useState('');
  const [ratingColor, setRatingColor] = useState('text-green-700');
  const [barColor, setBarColor] = useState('bg-green-600');
  const [barWidth, setBarWidth] = useState('25%');

  function updateCell(key: string, level: keyof MatrixData[string], val: number) {
    setMatrix((prev) => {
      const row = prev[key] ?? { simple: 0, medium: 0, complex: 0, veryComplex: 0 };
      const updated: MatrixData = { ...prev };
      updated[key] = { ...row, [level]: val };
      return updated;
    });
  }

  function calculate() {
    let rawHours = 0;
    let totalCount = 0;
    let complexCount = 0;

    for (const [cat, weights] of Object.entries(BENCHMARKS)) {
      const row = matrix[cat];
      if (!row) continue;
      const { simple: s, medium: m, complex: c, veryComplex: v } = row;
      rawHours += s * weights.s + m * weights.m + c * weights.c + v * weights.v;
      totalCount += s + m + c + v;
      complexCount += c + v;
    }

    const platformMult = PLATFORM_FACTORS[report?.platform ?? ''] ?? 1.0;
    const avgMat = (teamMaturity + toolFamiliarity + infraConfig) / 3;
    const maturityMult = 1.25 - (avgMat - 1) * 0.1125;
    const envMult = 0.8 + (envComplexity - 1) * 0.1125;

    const manual = Math.ceil(rawHours * platformMult * maturityMult * envMult);
    const ai = Math.ceil(manual * 0.4);

    setManualHours(manual);
    setAiHours(ai);

    const scoreMetric = manual * (1 + (totalCount > 0 ? complexCount / totalCount : 0));
    if (scoreMetric > 25000) {
      setRatingText('TRANSFORMATIONAL'); setRatingColor('text-red-900'); setBarColor('bg-red-900'); setBarWidth('100%');
    } else if (scoreMetric > 10000) {
      setRatingText('HIGH COMPLEXITY'); setRatingColor('text-red-600'); setBarColor('bg-red-600'); setBarWidth('75%');
    } else if (scoreMetric > 2500) {
      setRatingText('MODERATE'); setRatingColor('text-yellow-600'); setBarColor('bg-yellow-500'); setBarWidth('50%');
    } else {
      setRatingText('LOW'); setRatingColor('text-green-700'); setBarColor('bg-green-600'); setBarWidth('25%');
    }

    setShowModal(true);
  }

  const schema = report ? getSchemaByPlatform(report.platform) : undefined;

  /** Format a single assessment field value for display/email */
  function formatFieldValue(value: unknown): string {
    if (value === null || value === undefined || value === '') return '(not provided)';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  }

  /** Build labeled assessment answers grouped by section */
  function getAssessmentSections(): { title: string; fields: { label: string; value: string }[] }[] {
    if (!schema || !report?.formData) return [];
    return schema.sections.map((section) => ({
      title: section.title,
      fields: section.fields
        .map((field) => ({
          label: field.label,
          value: formatFieldValue(report.formData[field.name]),
        }))
        .filter((f) => f.value !== '(not provided)' && f.value !== '0' && f.value !== ''),
    })).filter((s) => s.fields.length > 0);
  }

  const assessmentSections = useMemo(getAssessmentSections, [schema, report]);

  function formatMatrixForEmail(): string {
    const allRows = [...DB_ROWS, ...CODE_ROWS, ...PRES_ROWS];
    const matrixSections = [
      { title: 'DATABASE LAYER', rows: DB_ROWS },
      { title: 'INTEGRATION & CODE', rows: CODE_ROWS },
      { title: 'PRESENTATION LAYER', rows: PRES_ROWS },
    ];

    const lines: string[] = [];
    for (const section of matrixSections) {
      lines.push(`\n--- ${section.title} ---`);
      for (const row of section.rows) {
        const r = matrix[row.key];
        if (!r) continue;
        const total = r.simple + r.medium + r.complex + r.veryComplex;
        if (total > 0) {
          lines.push(`${row.label}: ${r.simple} Simple, ${r.medium} Medium, ${r.complex} Complex, ${r.veryComplex} V.Complex (Total: ${total})`);
        }
      }
    }

    let grandTotal = 0;
    for (const row of allRows) {
      const r = matrix[row.key];
      if (r) grandTotal += r.simple + r.medium + r.complex + r.veryComplex;
    }
    lines.push(`\nTOTAL OBJECTS: ${grandTotal}`);
    return lines.join('\n');
  }

  function formatAssessmentForEmail(): string {
    const lines: string[] = [];
    for (const section of assessmentSections) {
      lines.push(`\n=== ${section.title} ===`);
      for (const field of section.fields) {
        lines.push(`${field.label}: ${field.value}`);
      }
    }
    return lines.join('\n');
  }

  async function handleRequestProposal() {
    setSubmitting(true);
    try {
      const inventorySummary = formatMatrixForEmail();
      const assessmentDetails = formatAssessmentForEmail();
      await submitForm('romCalculator', {
        'Source Platform': platform?.name ?? report?.platform ?? 'Unknown',
        'Project Name': projectName || '(not provided)',
        'Primary Stakeholder': stakeholder || '(not provided)',
        'Contact Email': email || '(not provided)',
        'Team Expertise (1-5)': teamMaturity,
        'Tool Familiarity (1-5)': toolFamiliarity,
        'Infrastructure Config (1-5)': infraConfig,
        'Env Complexity (1-5)': envComplexity,
        'ROM Object Inventory': inventorySummary,
        'Complexity Rating': ratingText,
        'Manual Effort (Hours)': manualHours.toLocaleString(),
        'Manual Effort (Weeks)': Math.ceil(manualHours / weeklyVelocity),
        'Blueprint Accelerated (Hours)': aiHours.toLocaleString(),
        'Blueprint Accelerated (Weeks)': Math.ceil(aiHours / weeklyVelocity),
        'Full Assessment Details': assessmentDetails,
        'Submitted At': new Date().toLocaleString(),
      });
      setShowModal(false);
      showSuccess('Details Sent!', 'Our team has received your migration inventory and ROM estimate.');
    } catch {
      showError('Submission Failed', 'Could not send the report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const weeklyVelocity = 160;

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate('/migration')}
        className="text-sm text-blueprint-blue hover:underline mb-6 inline-block"
      >
        &larr; Back to Migration Suite
      </button>

      <div className="mb-10 border-b border-gray-200 dark:border-slate-700 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-3">
          Comprehensive Migration ROM Calculator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
          Inventory your environment and assess maturity to generate a Rough Order of Magnitude (ROM) estimate.
        </p>
        {platform && (
          <p className="text-sm font-bold mt-2" style={{ color: platform.brandColor }}>
            Source: {platform.name}
          </p>
        )}
      </div>

      {/* Assessment Details (persisted from previous page) */}
      {assessmentSections.length > 0 && (
        <AssessmentSummary sections={assessmentSections} platformColor={platform?.brandColor} />
      )}

      {/* Section 1: Organization & Tech Stack */}
      <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 shadow-sm mb-8">
        <div className="bg-blueprint-blue text-white px-6 py-3 font-bold text-sm uppercase tracking-wide">
          1. Organization &amp; Tech Stack
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="block">
              <span className="block mb-1 font-bold text-gray-900 dark:text-gray-100 text-sm">Project Name</span>
              <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full px-3 py-2 border border-gray-400 dark:border-slate-600 text-sm focus:border-blueprint-blue focus:ring-1 focus:ring-blueprint-blue outline-none bg-white dark:bg-slate-700 dark:text-gray-100" />
            </label>
            <label className="block">
              <span className="block mb-1 font-bold text-gray-900 dark:text-gray-100 text-sm">Primary Stakeholder</span>
              <input type="text" value={stakeholder} onChange={(e) => setStakeholder(e.target.value)} className="w-full px-3 py-2 border border-gray-400 dark:border-slate-600 text-sm focus:border-blueprint-blue focus:ring-1 focus:ring-blueprint-blue outline-none bg-white dark:bg-slate-700 dark:text-gray-100" />
            </label>
            <label className="block">
              <span className="block mb-1 font-bold text-gray-900 dark:text-gray-100 text-sm">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-400 dark:border-slate-600 text-sm focus:border-blueprint-blue focus:ring-1 focus:ring-blueprint-blue outline-none bg-white dark:bg-slate-700 dark:text-gray-100" />
            </label>
          </div>
        </div>
      </div>

      {/* Section 2: Database Layer */}
      <MatrixTable title="2. Database Layer" rows={DB_ROWS} matrix={matrix} onUpdate={updateCell} />

      {/* Section 3: Integration & Code */}
      <MatrixTable title="3. Integration &amp; Code" rows={CODE_ROWS} matrix={matrix} onUpdate={updateCell} />

      {/* Section 4: Presentation Layer */}
      <MatrixTable title="4. Presentation Layer" rows={PRES_ROWS} matrix={matrix} onUpdate={updateCell} />

      {/* Section 5: Maturity & Complexity */}
      <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 shadow-sm mb-8">
        <div className="bg-blueprint-blue text-white px-6 py-3 font-bold text-sm uppercase tracking-wide">
          5. Maturity &amp; Complexity
        </div>
        <div className="p-6">
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-8 uppercase tracking-wide">
            Rate your environment (1=Low/Novice, 5=High/Expert)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <SliderField label="Team Expertise" value={teamMaturity} onChange={setTeamMaturity} lowLabel="1 (Novice)" highLabel="5 (Expert)" />
            <SliderField label="Tool Familiarity" value={toolFamiliarity} onChange={setToolFamiliarity} lowLabel="1 (Low)" highLabel="5 (High)" />
            <SliderField label="Infrastructure Config" value={infraConfig} onChange={setInfraConfig} lowLabel="1 (Manual)" highLabel="5 (IaC)" />
            <SliderField label="Env. Complexity" value={envComplexity} onChange={setEnvComplexity} lowLabel="1 (Simple)" highLabel="5 (Chaotic)" />
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="text-center pb-12">
        <button
          type="button"
          onClick={calculate}
          className="bg-blueprint-blue text-white px-10 py-4 font-extrabold uppercase tracking-wide hover:bg-blue-800 transition-all hover:-translate-y-0.5 shadow-md"
        >
          Calculate Migration ROM
        </button>
      </div>

      {/* Result Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto pt-20 pb-12">
          <div className="bg-white dark:bg-slate-800 w-[90%] max-w-[900px] p-10 shadow-2xl border-t-8 border-blueprint-blue relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-3xl font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">ROM Assessment Results</h2>
            <div className="w-full bg-gray-200 dark:bg-slate-700 h-1 mb-8" />

            {/* Complexity Rating */}
            <div className="mb-8 text-center">
              <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Overall Complexity Rating</div>
              <div className={`text-2xl font-black my-2 ${ratingColor}`}>{ratingText}</div>
              <div className="w-1/2 mx-auto bg-gray-200 dark:bg-slate-700 h-3 overflow-hidden">
                <div className={`h-full ${barColor}`} style={{ width: barWidth }} />
              </div>
            </div>

            {/* Hours Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="p-8 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-center">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Standard Manual Effort</p>
                <p className="text-4xl font-black text-gray-800 dark:text-gray-100">{manualHours.toLocaleString()}</p>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Total Man-Hours</p>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
                  <span className="text-xl font-bold text-gray-800 dark:text-gray-100">{Math.ceil(manualHours / weeklyVelocity)}</span>{' '}
                  <span className="text-gray-600 dark:text-gray-400">Weeks</span>
                </div>
              </div>
              <div className="p-8 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 text-center relative shadow-sm">
                <div className="absolute -top-3 right-0 left-0 mx-auto w-max bg-green-600 text-white text-[10px] px-3 py-1 font-bold uppercase">
                  60% Acceleration
                </div>
                <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">Blueprint Accelerated</p>
                <p className="text-4xl font-black text-green-700">{aiHours.toLocaleString()}</p>
                <p className="text-sm font-bold text-green-600">Total Man-Hours</p>
                <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
                  <span className="text-xl font-bold text-green-800">{Math.ceil(aiHours / weeklyVelocity)}</span>{' '}
                  <span className="text-green-700">Weeks</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 border border-gray-300 dark:border-slate-600 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                Adjust Inputs
              </button>
              <button
                onClick={handleRequestProposal}
                disabled={submitting}
                className="bg-blueprint-blue text-white px-8 py-3 font-bold hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Request Detailed Proposal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Editable complexity matrix table */
function MatrixTable({
  title,
  rows,
  matrix,
  onUpdate,
}: {
  title: string;
  rows: { key: string; label: string }[];
  matrix: MatrixData;
  onUpdate: (key: string, level: keyof MatrixData[string], val: number) => void;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 shadow-sm mb-8">
      <div className="bg-blueprint-blue text-white px-6 py-3 font-bold text-sm uppercase tracking-wide">
        {title}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-700 border-b-2 border-gray-200 dark:border-slate-600">
              <th className="p-4 w-1/4 text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase">Object Type</th>
              <th className="p-4 text-center text-xs font-extrabold text-green-700 uppercase">Simple</th>
              <th className="p-4 text-center text-xs font-extrabold text-yellow-700 uppercase">Medium</th>
              <th className="p-4 text-center text-xs font-extrabold text-red-700 uppercase">Complex</th>
              <th className="p-4 text-center text-xs font-extrabold text-red-900 uppercase">V. Complex</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-gray-100 dark:border-slate-700">
                <td className="p-4 font-bold text-sm text-gray-900 dark:text-gray-100">{row.label}</td>
                {(['simple', 'medium', 'complex', 'veryComplex'] as const).map((level) => (
                  <td key={level} className="p-4">
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={matrix[row.key]?.[level] || ''}
                      onChange={(e) => onUpdate(row.key, level, parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-2 border border-gray-400 dark:border-slate-600 text-center font-semibold text-sm focus:border-blueprint-blue focus:ring-1 focus:ring-blueprint-blue outline-none bg-white dark:bg-slate-700 dark:text-gray-100"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Collapsible assessment summary showing all persisted data from the assessment form */
function AssessmentSummary({
  sections,
  platformColor,
}: {
  sections: { title: string; fields: { label: string; value: string }[] }[];
  platformColor?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 shadow-sm mb-8">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-6 py-3 font-bold text-sm uppercase tracking-wide text-white"
        style={{ backgroundColor: platformColor ?? '#1d4ed8' }}
      >
        <span>Assessment Details (from questionnaire)</span>
        <span className="text-lg">{expanded ? '\u25B2' : '\u25BC'}</span>
      </button>
      {expanded && (
        <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-slate-700 pb-2 mb-3">
                {section.title}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {section.fields.map((field) => (
                  <div key={field.label} className="flex gap-2 text-sm py-1">
                    <span className="font-bold text-gray-700 dark:text-gray-300 shrink-0">{field.label}:</span>
                    <span className="text-gray-600 dark:text-gray-400 break-words">{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Slider input for maturity scores */
function SliderField({
  label,
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  lowLabel: string;
  highLabel: string;
}) {
  return (
    <label className="block">
      <span className="block mb-2 font-bold text-gray-900 dark:text-gray-100 text-sm">{label}</span>
      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-blueprint-blue cursor-pointer"
      />
      <div className="flex justify-between text-xs font-extrabold text-gray-500 dark:text-gray-400 mt-1">
        <span>{lowLabel}</span>
        <span>{value}</span>
        <span>{highLabel}</span>
      </div>
    </label>
  );
}
