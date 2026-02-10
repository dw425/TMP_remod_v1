import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollLock } from '@/hooks/useScrollLock';
import { formatCurrency } from '@/lib/formatCurrency';
import { useTrack } from '@/features/analytics/useTrack';
import type { Product } from '@/types/product';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabId = 'overview' | 'video-demo' | 'pricing' | 'prerequisites';

const TOOL_TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'video-demo', label: 'Video Demo' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'prerequisites', label: 'Prerequisites' },
];

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const navigate = useNavigate();
  const track = useTrack();
  useScrollLock(isOpen);

  // React-recommended pattern: adjust state during render when props change
  const [prevProductId, setPrevProductId] = useState(product?.id);
  if (prevProductId !== product?.id) {
    setPrevProductId(product?.id);
    if (activeTab !== 'overview') {
      setActiveTab('overview');
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!product || !isOpen) return null;

  const isTool = product.type === 'tool';
  const hasPricing = product.priceMonthly > 0;
  const tabs = isTool ? TOOL_TABS : [{ id: 'overview' as TabId, label: 'Overview' }];

  // Determine modal title
  const modalTitle = product.id === 7
    ? 'Stop guessing: Why AI forecasting is your new marketing strategy'
    : product.title;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={product.title}
    >
      <div className="fixed inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose} aria-hidden="true" />
      <div
        className="relative bg-white dark:bg-slate-900 w-full max-w-[53rem] h-[560px] overflow-hidden flex flex-col modal-enter shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-slate-700 shrink-0">
          <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{modalTitle}</h4>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow overflow-hidden">
          <div className="flex flex-col md:flex-row h-full">
            {/* Left Sidebar with Tabs */}
            <div className="w-full md:w-1/4 bg-gray-50 dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 p-6 flex flex-col shrink-0">
              <nav className="flex flex-col space-y-1 mb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); track('product_modal_tab_changed', { tab: tab.id, productName: product.title }); }}
                    className={`w-full text-left px-4 py-3 font-bold text-sm transition-colors border-l-4 ${
                      activeTab === tab.id
                        ? 'bg-white border-blueprint-blue text-blueprint-blue shadow-sm'
                        : 'border-transparent text-gray-500 hover:bg-white hover:text-gray-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
              <div>
                <button
                  onClick={() => {
                    onClose();
                    const target = product.detailPage || `/products/${product.slug}`;
                    navigate(target);
                  }}
                  className="w-full px-4 py-3 bg-blueprint-blue text-white text-sm font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors shadow-sm btn-rounded"
                >
                  View Full Details
                </button>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="w-full md:w-3/4 p-4 bg-white dark:bg-slate-900 overflow-y-auto">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300">
                  {product.id === 7 ? (
                    /* Special overview for Top Trending Insight */
                    <>
                      <h5 className="font-bold text-gray-900 text-lg mb-2">The Challenge</h5>
                      <p className="mb-4">The pressure on marketing leaders to prove ROI has never been greater. Yet, disconnected data sources and manual spreadsheets force critical budget decisions based on incomplete information. This reactive approach leads to wasted spend and missed opportunities.</p>
                      <h5 className="font-bold text-gray-900 text-lg mb-2">The Solution: A Factory for Intelligence</h5>
                      <p className="mb-4">Winning demands a shift from hindsight to foresight. The &quot;AI Factory&quot; model unifies your data using Unity Catalog and predicts outcomes with precision. By embedding AI-driven forecasting into your planning, marketing transforms from a cost center into a predictable revenue engine.</p>
                      <h5 className="font-bold text-gray-900 text-lg mb-2">Key Takeaways</h5>
                      <ul className="list-disc pl-5 space-y-1 mb-6">
                        <li><strong>Unify Data:</strong> Connect siloed campaign data for a single source of truth.</li>
                        <li><strong>Predict ROAS:</strong> Use AI agents to generate 7- and 14-day revenue projections.</li>
                        <li><strong>Simulate Strategy:</strong> Answer &quot;what-if&quot; questions to optimize budget before spending.</li>
                      </ul>
                    </>
                  ) : (
                    <>
                      {/* Solution Overview */}
                      <h5 className="font-bold text-xs uppercase tracking-wide text-gray-900 mb-3">
                        Solution Overview
                      </h5>
                      <p className="mb-3 leading-relaxed">{product.description}</p>
                      {product.longDescription && (
                        <p className="mb-4 leading-relaxed">{product.longDescription}</p>
                      )}

                      {/* What It Does */}
                      {product.whatItDoes?.[0] && (
                        <div className="mb-4">
                          <h5 className="font-bold text-xs uppercase tracking-wide text-gray-900 mb-3 mt-5">
                            {product.whatItDoes[0].heading}
                          </h5>
                          {product.whatItDoes[0].paragraphs.map((p, i) => (
                            <p key={i} className="mb-2 leading-relaxed">{p}</p>
                          ))}
                        </div>
                      )}

                      {/* Key Features */}
                      {product.features.length > 0 && (
                        <div className="mb-4">
                          <h5 className="font-bold text-xs uppercase tracking-wide text-gray-900 mb-3 mt-5">
                            Key Capabilities
                          </h5>
                          <ul className="list-disc pl-5 space-y-1">
                            {product.features.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Benefits */}
                      {product.benefits && product.benefits.length > 0 && (
                        <div className="mb-4">
                          <h5 className="font-bold text-xs uppercase tracking-wide text-gray-900 mb-3 mt-5">
                            Business Impact
                          </h5>
                          <ul className="space-y-2">
                            {product.benefits.map((b, i) => (
                              <li key={i}>
                                <strong className="text-gray-900">{b.title}</strong>
                                {b.description && <span> — {b.description}</span>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Video Demo Tab */}
              {activeTab === 'video-demo' && (
                <div className="h-full w-full">
                  {product.videoUrl ? (
                    <div className="w-full h-full bg-black shadow-lg">
                      <iframe
                        src={product.videoUrl}
                        title={`${product.title} Demo`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center border border-gray-200 shadow-inner">
                      <p className="text-gray-500 font-medium">Video Preview Unavailable</p>
                    </div>
                  )}
                </div>
              )}

              {/* Pricing Tab */}
              {activeTab === 'pricing' && (
                <div>
                  {hasPricing ? (
                    <>
                      <h5 className="font-bold text-sm uppercase tracking-wide mb-6">Pricing Models</h5>
                      <div className="grid gap-4">
                        <div className="p-6 border border-gray-200 bg-gray-50">
                          <h6 className="font-bold text-gray-900">Single User</h6>
                          <p className="text-gray-600 text-sm mt-1">{formatCurrency(product.priceMonthly)}/mo</p>
                        </div>
                        <div className="p-6 border border-gray-200 bg-gray-50">
                          <h6 className="font-bold text-gray-900">Team Account</h6>
                          <p className="text-gray-600 text-sm mt-1">Starting at $5,000.00/mo</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 border border-gray-200 text-center bg-gray-50">
                      <h6 className="font-bold text-gray-900 mb-2">Enterprise Pricing</h6>
                      <p className="text-gray-600 text-sm mb-4">Contact us for a custom quote based on your environment and requirements.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Prerequisites Tab */}
              {activeTab === 'prerequisites' && (
                <div>
                  <h5 className="font-bold text-sm uppercase tracking-wide mb-4">System Requirements</h5>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 border-l-2 border-yellow-400 pl-4 bg-yellow-50 p-4">
                    {product.readinessChecklist && product.readinessChecklist.length > 0 ? (
                      product.readinessChecklist.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))
                    ) : (
                      <>
                        <li>Databricks Workspace</li>
                        <li>Unity Catalog</li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
