import { useNavigate } from 'react-router-dom';
import { platforms } from '@/data/platforms';
import { PlatformTile } from '@/components/composed/PlatformTile';
import { SEO } from '@/components/SEO';

export default function MigrationLandingPage() {
  const navigate = useNavigate();

  const handlePlatformClick = (slug: string) => {
    navigate(`/migration/${slug}`);
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title="Migration Assessments | Blueprint"
        description="Assess your data platform migration to Databricks. Covers 11 source platforms with automated complexity scoring and ROM estimates."
        canonical="/migration"
      />

      <div className="mb-12 border-b border-gray-200 dark:border-slate-700 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-4">
          Migration Assessments
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          Select your current platform to access specific migration assessments,
          questionnaires, and accelerator tools designed to speed up your move to
          the Lakehouse.
        </p>
      </div>

      <div className="button-grid">
        {platforms.map((platform) => (
          <PlatformTile
            key={platform.id}
            platform={platform}
            onClick={handlePlatformClick}
          />
        ))}

        {/* Coming Soon placeholder tile */}
        <div className="tile-card placeholder">
          <h3 className="card-title" style={{ color: '#9ca3af', fontWeight: 500 }}>
            (Coming Soon)
          </h3>
        </div>
      </div>

    </main>
  );
}
