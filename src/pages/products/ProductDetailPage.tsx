import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { products } from '@/data/products';
import { SEO } from '@/components/SEO';
import { useCart } from '@/features/cart/useCart';
import { useAlerts } from '@/features/notifications/useAlerts';
import { TechArchModal } from '@/components/composed/TechArchModal';
import { AmIReadyModal } from '@/components/composed/AmIReadyModal';
import { ContactSalesModal } from '@/components/composed/ContactSalesModal';
import { MessageSentModal } from '@/components/composed/MessageSentModal';
import { formatCurrency } from '@/lib/formatCurrency';

/* SVG placeholder icons for products without video */
function PlaceholderIcon({ type }: { type?: string }) {
  const iconMap: Record<string, JSX.Element> = {
    'bar-chart': (
      <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    users: (
      <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    microphone: (
      <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    'dollar-circle': (
      <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className="text-gray-400 text-center">
      {type && iconMap[type] ? iconMap[type] : iconMap['bar-chart']}
      <span className="font-bold text-sm">Product Demo</span>
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);
  const { add } = useCart();
  const { showSuccess } = useAlerts();

  const [showTechArch, setShowTechArch] = useState(false);
  const [showAmIReady, setShowAmIReady] = useState(false);
  const [showContactSales, setShowContactSales] = useState(false);
  const [showMessageSent, setShowMessageSent] = useState(false);

  if (!product) {
    return <Navigate to="/404" replace />;
  }

  // Non-tool products redirect to their detail page
  if (product.detailPage) {
    return <Navigate to={product.detailPage} replace />;
  }

  const handleAddToCart = () => {
    add({
      id: product.id,
      title: `${product.title} - Single User`,
      type: product.type,
      billing: 'monthly',
      price: product.priceMonthly,
    });
    showSuccess(`${product.title} added to cart`);
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO
        title={`${product.title} | Blueprint Marketplace`}
        description={product.description}
        canonical={`/products/${product.slug}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.title,
          description: product.description,
          offers: {
            '@type': 'Offer',
            price: product.priceMonthly,
            priceCurrency: 'USD',
          },
        }}
      />

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          {product.title}
        </h1>
        <p className="text-lg text-blueprint-blue font-medium">{product.subtitle}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-12">
        {/* ── Main Content (7 cols) ── */}
        <div className="lg:col-span-7 space-y-10">
          {/* Video / Placeholder + Summary row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="sharp-card p-1 border-t-0 border-l border-r border-b shadow-sm flex flex-col justify-center" style={{ backgroundColor: product.videoUrl ? '#000' : '#f3f4f6' }}>
              <div className="aspect-video w-full flex items-center justify-center">
                {product.videoUrl ? (
                  <iframe
                    src={product.videoUrl}
                    title={`${product.title} Demo`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <PlaceholderIcon type={product.placeholderIcon} />
                )}
              </div>
            </section>

            <section className="bg-white p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                Summary
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.longDescription || product.description}
              </p>
            </section>
          </div>

          {/* What It Does section */}
          {product.whatItDoes && product.whatItDoes.length > 0 && (
            <section className="bg-white p-8 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">
                What It Does
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-sm md:text-base">
                {product.whatItDoes.map((section, i) => (
                  <div key={i}>
                    <h3 className="text-lg font-bold text-blueprint-blue">{section.heading}</h3>
                    {section.paragraphs.map((p, j) => (
                      <p key={j} className="mt-2">{p}</p>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Benefits section */}
          {product.benefits && product.benefits.length > 0 && (
            <section className="bg-white p-8 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">
                Benefits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {product.benefits.map((benefit, i) => (
                  <div key={i} className="p-4 bg-gray-50 border-l-4 border-blueprint-blue">
                    <p className="font-bold text-sm text-gray-900">{benefit.title}</p>
                    {benefit.description && (
                      <p className="text-xs text-gray-500 mt-1">{benefit.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── Sidebar (3 cols) ── */}
        <aside className="lg:col-span-3">
          <div className="sticky top-28 space-y-8">
            {/* Pricing Card */}
            <div className="sharp-card p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-blueprint-blue mb-6">
                Launch Pricing
              </h3>
              <div className="space-y-6">
                {/* Single User tier */}
                <div className="pb-6 border-b border-gray-100">
                  <h4 className="text-md font-bold text-gray-900">Single User</h4>
                  <p className="text-2xl font-bold text-blueprint-blue mt-1">
                    {formatCurrency(product.priceMonthly)}
                    <span className="text-xs text-gray-500 font-normal"> / mo</span>
                  </p>
                  <button
                    onClick={handleAddToCart}
                    className="w-full mt-4 bg-blueprint-blue text-white font-bold py-3 uppercase tracking-widest text-[10px] hover:bg-blue-800 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>

                {/* Team / Contact Sales */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-bold text-gray-900">Team Account</h4>
                    <p className="text-sm text-gray-500 mt-1">Starting at $5,000.00/mo</p>
                    <button
                      onClick={() => setShowContactSales(true)}
                      className="w-full mt-3 bg-black text-white font-bold py-3 uppercase tracking-widest text-[10px] hover:bg-gray-800 transition-colors"
                    >
                      Contact Sales
                    </button>
                  </div>

                  <button
                    onClick={() => setShowAmIReady(true)}
                    className="w-full bg-gray-200 text-gray-800 font-bold py-3 uppercase tracking-widest text-[10px] hover:bg-gray-300 transition-colors"
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
                {product.architectureImage && (
                  <li>
                    <button
                      onClick={() => setShowTechArch(true)}
                      className="text-sm font-bold text-blueprint-blue hover:underline"
                    >
                      View Technical Architecture
                    </button>
                  </li>
                )}
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
          </div>
        </aside>
      </div>

      {/* ── Modals ── */}
      {showTechArch && product.architectureImage && (
        <TechArchModal
          src={product.architectureImage}
          onClose={() => setShowTechArch(false)}
        />
      )}
      {showAmIReady && (
        <AmIReadyModal
          product={product}
          onClose={() => setShowAmIReady(false)}
        />
      )}
      {showContactSales && (
        <ContactSalesModal
          productTitle={product.title}
          onClose={() => setShowContactSales(false)}
          onSuccess={() => setShowMessageSent(true)}
        />
      )}
      {showMessageSent && (
        <MessageSentModal onClose={() => setShowMessageSent(false)} />
      )}
    </main>
  );
}
