import { useState } from 'react';
import { Button } from '@/components/ui';
import { submitForm } from '@/features/integrations/formspree/formService';
import { useAlerts } from '@/features/notifications/useAlerts';

const ENGAGEMENTS = [
  {
    title: '1-Day Workshop',
    subtitle: 'AI Readiness Assessment',
    description:
      'Evaluate your data estate, identify high-impact GenAI use cases, and leave with a prioritized 90-day roadmap.',
    features: [
      'Data readiness assessment',
      'Use case identification & prioritization',
      'Architecture review',
      '90-day implementation roadmap',
    ],
  },
  {
    title: '6-Week Sprint',
    subtitle: 'Proof of Concept',
    description:
      'Build a production-quality RAG pipeline or agentic workflow on your data in Databricks, from design through deployment.',
    features: [
      'End-to-end RAG or Agent build',
      'Vector search + embedding pipeline',
      'Model evaluation framework',
      'Production-ready notebook suite',
    ],
  },
  {
    title: '12-Week Program',
    subtitle: 'Full AI Factory Deployment',
    description:
      'Stand up a complete AI Factory with governance, monitoring, CI/CD, and multiple production models.',
    features: [
      'Multi-model deployment',
      'MLflow governance & monitoring',
      'CI/CD for model lifecycle',
      'Team enablement & training',
    ],
  },
];

const FRAMEWORK_STEPS = [
  { phase: 'Discovery', weeks: '1-2', description: 'Assess data, define use cases, architect solution.' },
  { phase: 'Build', weeks: '3-8', description: 'Develop RAG pipelines, agents, and evaluation frameworks.' },
  { phase: 'Harden', weeks: '9-11', description: 'Production hardening, security review, load testing.' },
  { phase: 'Launch', weeks: '12', description: 'Go-live, monitoring setup, team handoff & training.' },
];

export default function AIFactoryPage() {
  const { showSuccess, showError } = useAlerts();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', interest: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitForm('aiFactory', { ...form, source: 'ai-factory-page' });
      showSuccess('Request Submitted', 'Our team will reach out within 24 hours.');
      setForm({ name: '', email: '', company: '', interest: '', message: '' });
    } catch {
      showError('Submission Failed', 'Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full border border-gray-300 px-3 py-2 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-blueprint-blue focus:ring-1 focus:ring-blueprint-blue';

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blueprint's AI Factory</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          The assembly line for business-ready AI. A structured framework for implementing
          RAG, agentic workflows, and production GenAI solutions on Databricks.
        </p>
      </div>

      {/* Engagement Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {ENGAGEMENTS.map((eng) => (
          <div
            key={eng.title}
            className="bg-white border border-gray-300 border-t-4 border-t-blueprint-blue p-6 flex flex-col"
          >
            <h3 className="text-xl font-bold text-gray-900">{eng.title}</h3>
            <p className="text-sm text-blueprint-blue font-medium mb-3">{eng.subtitle}</p>
            <p className="text-sm text-gray-600 mb-4 flex-grow">{eng.description}</p>
            <ul className="space-y-2">
              {eng.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blueprint-blue mt-0.5 font-bold">+</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 90-Day Framework */}
      <div className="bg-white border border-gray-300 border-t-4 border-t-blueprint-blue p-8 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">The 90-Day Framework</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {FRAMEWORK_STEPS.map((step, i) => (
            <div key={step.phase}>
              <div className="text-3xl font-bold text-blueprint-blue mb-2">{i + 1}</div>
              <h3 className="font-bold text-gray-900">{step.phase}</h3>
              <p className="text-xs text-gray-400 mb-1">Weeks {step.weeks}</p>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-gray-300 border-t-4 border-t-blueprint-blue p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h2>
          <p className="text-gray-500 mb-6">
            Tell us about your AI goals and we'll recommend the right engagement.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest</label>
              <select name="interest" value={form.interest} onChange={handleChange} className={inputClass}>
                <option value="">Select engagement type...</option>
                <option value="workshop">1-Day Workshop</option>
                <option value="sprint">6-Week Sprint</option>
                <option value="program">12-Week Program</option>
                <option value="unsure">Not sure yet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className={inputClass}
                placeholder="Tell us about your AI goals..."
              />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Request Consultation'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
