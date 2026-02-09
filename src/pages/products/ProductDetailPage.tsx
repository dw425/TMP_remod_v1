import { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { products } from '@/data/products';
import { PricingSidebar } from '@/components/composed/PricingSidebar';
import { ReadinessChecklist } from '@/components/composed/ReadinessChecklist';
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed';
import { ImageLightbox } from '@/components/modals/ImageLightbox';
import { Badge } from '@/components/ui/Badge';
import { SEO } from '@/components/SEO';
import { ROUTES } from '@/config/routes';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (!product) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <SEO
        title={product.title}
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
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600">
        <Link to={ROUTES.HOME} className="hover:text-blueprint-blue">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{product.subtitle}</p>
            <div className="flex gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="prose max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed">
              {product.longDescription || product.description}
            </p>
          </div>

          {/* Video */}
          {product.videoUrl && (
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">Product Overview</h2>
              <YouTubeEmbed url={product.videoUrl} title={`${product.title} Overview`} />
            </div>
          )}

          {/* Architecture Diagram */}
          {product.architectureImage && (
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">Architecture</h2>
              <button
                onClick={() => setLightboxImage(product.architectureImage!)}
                className="w-full group cursor-pointer"
              >
                <img
                  src={product.architectureImage}
                  alt={`${product.title} Architecture`}
                  className="w-full h-auto border border-gray-300 group-hover:border-blueprint-blue transition-colors"
                />
                <p className="text-sm text-gray-500 text-center mt-2 group-hover:text-blueprint-blue">
                  Click to enlarge
                </p>
              </button>
            </div>
          )}

          {/* Features */}
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-900">Key Features</h2>
            <ul className="space-y-3">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-blueprint-blue flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar (1 col) */}
        <div className="space-y-6">
          <PricingSidebar product={product} />
          <ReadinessChecklist product={product} />
        </div>
      </div>

      {/* Image Lightbox */}
      {lightboxImage && (
        <ImageLightbox
          imageUrl={lightboxImage}
          alt={`${product.title} Architecture`}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
}
