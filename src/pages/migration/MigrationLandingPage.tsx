import { useNavigate } from 'react-router-dom';
import { platforms } from '@/data/platforms';
import { PlatformTile } from '@/components/composed/PlatformTile';

export default function MigrationLandingPage() {
  const navigate = useNavigate();

  const handlePlatformClick = (slug: string) => {
    navigate(`/migration/${slug}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Data Migration Assessment Suite
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Select your source platform to begin a comprehensive migration assessment.
          Our assessments generate a Rough Order of Magnitude (ROM) estimate for
          migrating to Databricks Lakehouse.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => (
          <PlatformTile
            key={platform.id}
            platform={platform}
            onClick={handlePlatformClick}
          />
        ))}
      </div>

      <div className="mt-16 bg-white border border-gray-300 border-t-4 border-t-blueprint-blue p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-3xl font-bold text-blueprint-blue mb-2">1</div>
            <h3 className="font-bold text-gray-900 mb-1">Select Platform</h3>
            <p className="text-sm text-gray-600">
              Choose your source platform from the tiles above to load the
              platform-specific assessment form.
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blueprint-blue mb-2">2</div>
            <h3 className="font-bold text-gray-900 mb-1">Complete Assessment</h3>
            <p className="text-sm text-gray-600">
              Fill in your environment details — table counts, pipeline inventory,
              complexity ratings, and budget information.
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blueprint-blue mb-2">3</div>
            <h3 className="font-bold text-gray-900 mb-1">Get ROM Estimate</h3>
            <p className="text-sm text-gray-600">
              Receive an instant Rough Order of Magnitude estimate with complexity
              breakdown, hours, and cost range.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
