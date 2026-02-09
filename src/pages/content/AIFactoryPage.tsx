import { useState, useEffect } from 'react';
import { useScrollLock } from '@/hooks/useScrollLock';
import { SEO } from '@/components/SEO';

// ─── Am I Ready Modal (6-item, amber accent) ────────────────────────────
function AmIReadyModal({
  onClose,
  onProceed,
}: {
  onClose: () => void;
  onProceed: () => void;
}) {
  useScrollLock(true);
  const [checks, setChecks] = useState<boolean[]>(Array(6).fill(false));
  const allChecked = checks.every(Boolean);

  const items = [
    'Do you have access to a Databricks workspace?',
    'Have high-value business use cases been identified?',
    'Are your key data sources validated and accessible?',
    'Is there an existing governance framework in place?',
    'Do you have executive sponsorship for AI initiatives?',
    'Are you prepared to engage in a 12-week build cycle?',
  ];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(2px)' }} onClick={onClose} aria-hidden="true" />
      <div
        className="relative bg-white shadow-xl w-full max-w-3xl max-h-[95vh] flex flex-col border-t-8 border-amber-500"
      >
        <header className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Are You Ready for the AI Factory?</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 text-3xl">&times;</button>
        </header>
        <div className="p-6 overflow-y-auto text-sm space-y-3">
          <p className="text-gray-500 mb-4">
            To maximize the value of the AI Factory, please confirm the following readiness indicators:
          </p>
          <div className="grid grid-cols-1 gap-y-4 text-gray-800">
            {items.map((label, i) => (
              <div key={i} className="flex items-start bg-gray-50 p-3 border border-gray-100">
                <input
                  type="checkbox"
                  checked={checks[i]}
                  onChange={() =>
                    setChecks((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                  }
                  className="mr-3 h-4 w-4 mt-1 flex-shrink-0 accent-amber-500"
                />
                <label>{label}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2 text-xs font-bold uppercase text-gray-500 hover:text-gray-800"
          >
            Close
          </button>
          <button
            onClick={onProceed}
            disabled={!allChecked}
            className="px-8 py-3 bg-amber-500 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Sales
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Contact Sales Modal (Formspree xjkavwle) ──────────────────────────
function ContactSalesModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  useScrollLock(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xjkavwle', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        form.reset();
        onClose();
        onSuccess();
      } else {
        alert('Oops! There was a problem submitting your form.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(2px)' }} onClick={onClose} aria-hidden="true" />
      <div
        className="relative bg-white shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col border-t-8 border-black"
      >
        <header className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Contact Sales</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 text-2xl">&times;</button>
        </header>
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <input type="hidden" name="form_subject" value="New Sales Inquiry from AI Factory Page" />
          <div>
            <label htmlFor="af-fullName" className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
            <input id="af-fullName" type="text" name="fullName" required className="w-full border border-gray-300 p-3 focus:border-blueprint-blue focus:outline-none" />
          </div>
          <div>
            <label htmlFor="af-email" className="block text-xs font-bold text-gray-500 uppercase mb-1">Business Email</label>
            <input id="af-email" type="email" name="email" required className="w-full border border-gray-300 p-3 focus:border-blueprint-blue focus:outline-none" />
          </div>
          <div>
            <label htmlFor="af-message" className="block text-xs font-bold text-gray-500 uppercase mb-1">Message</label>
            <textarea id="af-message" name="message" rows={4} required className="w-full border border-gray-300 p-3 focus:border-blueprint-blue focus:outline-none" />
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-bold uppercase text-gray-400 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Message Sent Modal ─────────────────────────────────────────────────
function MessageSentModal({ onClose }: { onClose: () => void }) {
  useScrollLock(true);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(2px)' }} onClick={onClose} aria-hidden="true" />
      <div
        className="relative bg-white shadow-xl w-full max-w-md text-center p-8 border-t-8 border-green-500"
      >
        <div className="mx-auto flex items-center justify-center h-16 w-16 bg-green-100 mb-4" style={{ borderRadius: '9999px' }}>
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h2>
        <p className="text-gray-500 mb-6 text-sm">Our AI specialists will get back to you shortly.</p>
        <button onClick={onClose} className="mt-4 text-xs font-bold uppercase text-blueprint-blue hover:underline">
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Tech Arch Modal ────────────────────────────────────────────────────
function TechArchModal({ onClose }: { onClose: () => void }) {
  useScrollLock(true);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(2px)' }} onClick={onClose} aria-hidden="true" />
      <div className="relative bg-white p-2 border border-gray-200 shadow-xl w-1/2">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 text-white bg-black hover:bg-gray-800 w-8 h-8 flex items-center justify-center text-xl z-10"
          style={{ borderRadius: '9999px' }}
        >
          &times;
        </button>
        <div className="bg-gray-100 w-full h-96 flex items-center justify-center text-gray-500 font-mono text-xs border border-dashed border-gray-300">
          [AI Factory Architecture Diagram]
        </div>
      </div>
    </div>
  );
}

// ─── Check Icon ─────────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-blueprint-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────
export default function AIFactoryPage() {
  const [showAmIReady, setShowAmIReady] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showMessageSent, setShowMessageSent] = useState(false);
  const [showTechArch, setShowTechArch] = useState(false);

  const useCases = [
    'Predictive Maintenance',
    'Digital Twins',
    'Process Optimization',
    'Financial Services',
    'Retail',
    'Health & Life Sciences',
  ];

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO
        title="AI Factory | Blueprint Marketplace"
        description="Bring AI to life with a structured model that delivers production-ready solutions in 12 weeks."
        canonical="/ai-factory"
      />

      {/* Page Header */}
      <header className="mb-10">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-blueprint-blue tracking-tight">AI Factory</h1>
        </div>
        <p className="text-lg text-blueprint-blue font-medium w-full">
          Bring AI to life with a structured model that delivers production-ready solutions in 12 weeks.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-7 space-y-10">
          {/* Video + Why section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="sharp-card p-1 border-t-0 border-l border-r border-b shadow-sm flex flex-col justify-center bg-black">
              <div className="aspect-video w-full">
                <iframe
                  src="https://www.youtube.com/embed/48gEgOcCaKo"
                  title="AI Factory Overview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </section>

            <section className="bg-white p-6 border border-gray-200 flex flex-col justify-center">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">
                Why the AI Factory?
              </h2>
              <h3 className="text-xs font-bold text-blueprint-blue uppercase tracking-wider mb-2">
                The assembly line for business-ready AI
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                AI factories are essential because they shift enterprises from experimentation to
                industrialized delivery — reducing risk, aligning teams, and accelerating value. By
                starting with use case identification, organizations avoid wasted investment and ensure AI
                efforts solve real business problems. Our five-phase factory model moves from ideation to
                implementation with the repeatability, scalability, and governance that enterprise-grade AI
                demands.
              </p>
            </section>
          </div>

          {/* Gartner Quote */}
          <section className="w-full">
            <div className="bg-gray-50 border-l-4 border-blueprint-blue p-6 shadow-sm">
              <blockquote className="text-lg font-medium text-gray-800 italic mb-2">
                &quot;By 2029,{' '}
                <span className="text-blueprint-blue font-bold">70%</span> of large enterprises
                failing to effectively utilize AI factories will cease to exist.&quot;
              </blockquote>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                — Gartner, 2025
              </p>
            </div>
          </section>

          {/* Modular Engagements */}
          <section className="bg-white p-8 border border-gray-200">
            <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-gray-900">Modular Engagements</h2>
              <span className="text-xs text-gray-500 font-medium">Modular by design. Built for speed.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 border border-gray-200 p-5 flex flex-col h-full hover:border-blueprint-blue transition-colors">
                <div className="mb-3">
                  <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">Step 1</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">1-Day Readiness Workshop</h3>
                <p className="text-xs text-gray-600 leading-relaxed flex-grow">
                  This session is designed to identify high-value use cases and quickly assess your
                  organization&apos;s readiness to begin leveraging Databricks for AI. It includes enabling
                  access, validating data sources, reviewing current governance and skills. You&apos;ll
                  leave with a prioritized list of opportunities, a snapshot of your current environment,
                  familiarity with Databricks AI tools, and a recommended path forward.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-5 flex flex-col h-full hover:border-blueprint-blue transition-colors">
                <div className="mb-3">
                  <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">Step 2</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">6-Week Foundations Engagement</h3>
                <p className="text-xs text-gray-600 leading-relaxed flex-grow">
                  This engagement builds the groundwork for successful AI delivery by evaluating your
                  environment, refining governance, and designing a user experience tailored to your use
                  case. It includes defining success criteria, reviewing Center of Excellence maturity, and
                  selecting the appropriate delivery path whether through Genie, AI/BI, or Databricks apps.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-5 flex flex-col h-full hover:border-blueprint-blue transition-colors">
                <div className="mb-3">
                  <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">Step 3</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">12-Week Build & Deploy</h3>
                <p className="text-xs text-gray-600 leading-relaxed flex-grow">
                  This engagement takes your AI use cases into production with governance, orchestration,
                  and user experience fully implemented. It includes building models or agents, deploying
                  them using Databricks tools, and integrating them into automated workflows and
                  user-facing interfaces. The result is AI solutions in production, governed and
                  cost-optimized, ready to deliver measurable business value on Databricks apps.
                </p>
              </div>
            </div>
          </section>

          {/* 90-Day Delivery Framework */}
          <section className="bg-white p-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6">
              90-Day Delivery Framework
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              {[
                { num: '1', title: 'Alignment', desc: 'Identify business priorities & high-value use cases.' },
                { num: '2', title: 'POC', desc: 'Validate feasibility using your data.' },
                { num: '3', title: 'MVP', desc: 'Deploy working solution to test ROI.' },
                { num: '4', title: 'Pre-Prod', desc: 'Operationalize governance & observability.' },
              ].map((step) => (
                <div key={step.num} className="bg-gray-50 border border-gray-200 p-3 text-center relative">
                  <div className="text-2xl font-bold text-gray-200 absolute top-1 right-2">{step.num}</div>
                  <h4 className="text-xs font-bold text-blueprint-blue uppercase mb-1 relative z-10">
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-gray-600 leading-tight relative z-10">{step.desc}</p>
                </div>
              ))}
              <div className="bg-gray-50 border-l-4 border-l-blueprint-blue border-t border-r border-b border-gray-200 p-3 text-center relative shadow-sm">
                <div className="text-2xl font-bold text-gray-200 absolute top-1 right-2">5</div>
                <h4 className="text-xs font-bold text-blueprint-blue uppercase mb-1 relative z-10">
                  Production
                </h4>
                <p className="text-[10px] text-gray-600 leading-tight relative z-10">
                  Launch KPI-tied AI with measurable value.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 p-6 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Why we deliver in 90 days</h3>
              <p className="text-xs text-gray-600 mb-4">
                Blueprint&apos;s AI Factory doesn&apos;t just promise speed. It&apos;s purpose built for it.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {[
                  'Pre-built frameworks and accelerators',
                  'Industry specific models and use cases',
                  'Modular delivery',
                  'Cross functional teams deliver with governance, cost control, and user centric design',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckIcon />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Built to Scale */}
          <section className="bg-white p-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">
              Built to scale with the right tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'LangChain-powered orchestration',
                  desc: "Blueprint uses LangChain to build modular, agent-based GenAI applications that integrate memory, retrieval, and reasoning across structured and unstructured data.",
                },
                {
                  title: 'GraphRAG-ready',
                  desc: "The Blueprint AI Factory is GraphRAG-ready for enterprises with structured data and domain-specific knowledge needs — combining semantic context with performance and cost efficiency.",
                },
                {
                  title: 'RLHF principles built in',
                  desc: 'The Factory incorporates RLHF (Reinforcement Learning from Human Feedback) principles when evaluating, tuning, and validating GenAI use cases through human-in-the-loop feedback and stakeholder input.',
                },
                {
                  title: 'ModelOps by default',
                  desc: 'Lifecycle governance, observability, versioning, and cost control are embedded in every production deployment.',
                },
              ].map((tool) => (
                <div key={tool.title} className="p-5 bg-gray-50 border-l-4 border-black">
                  <p className="font-bold text-sm text-gray-900 mb-2">{tool.title}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{tool.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="sticky top-28 space-y-8">
            {/* Engagement Pricing */}
            <div className="sharp-card p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-blueprint-blue mb-6">
                Engagement Pricing
              </h3>
              <div className="space-y-6">
                <div className="pb-6 border-b border-gray-100">
                  <h4 className="text-md font-bold text-gray-900">Enterprise AI Factory</h4>
                  <p className="text-sm text-gray-500 mt-2">
                    Custom scoped engagements based on maturity and use cases.
                  </p>
                  <button
                    onClick={() => setShowContact(true)}
                    className="w-full mt-4 bg-blueprint-blue text-white font-bold py-3 uppercase tracking-widest text-[10px] hover:bg-blue-800 transition-colors"
                  >
                    Contact Sales
                  </button>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={() => setShowAmIReady(true)}
                    className="w-full bg-amber-500 text-white font-bold py-3 uppercase tracking-widest text-[10px] hover:bg-amber-600 transition-colors"
                  >
                    Am I Ready?
                  </button>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white p-6 border border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Resources
              </h3>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => setShowTechArch(true)}
                    className="text-sm font-bold text-blueprint-blue hover:underline"
                  >
                    View AI Factory Architecture
                  </button>
                </li>
                <li>
                  <a
                    href="https://bpcs.com/case-studies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-blueprint-blue hover:underline"
                  >
                    Case Studies
                  </a>
                </li>
              </ul>
            </div>

            {/* Sample Use Cases */}
            <div className="sharp-card p-6 border-t-4 border-gray-400">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Sample Use Cases
              </h3>
              <div className="flex flex-wrap gap-2">
                {useCases.map((uc) => (
                  <span
                    key={uc}
                    className="px-2 py-1 bg-gray-100 text-[10px] text-gray-600 border border-gray-200"
                  >
                    {uc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Modals */}
      {showAmIReady && (
        <AmIReadyModal
          onClose={() => setShowAmIReady(false)}
          onProceed={() => {
            setShowAmIReady(false);
            setShowContact(true);
          }}
        />
      )}
      {showContact && (
        <ContactSalesModal
          onClose={() => setShowContact(false)}
          onSuccess={() => setShowMessageSent(true)}
        />
      )}
      {showMessageSent && <MessageSentModal onClose={() => setShowMessageSent(false)} />}
      {showTechArch && <TechArchModal onClose={() => setShowTechArch(false)} />}
    </main>
  );
}
