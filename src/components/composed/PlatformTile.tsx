import type { Platform } from '@/types/migration';

interface PlatformTileProps {
  platform: Platform;
  onClick: (slug: string) => void;
}

export function PlatformTile({ platform, onClick }: PlatformTileProps) {
  return (
    <button
      onClick={() => onClick(platform.slug)}
      className="tile-card"
      data-brand={platform.id === 'unity-catalog' ? 'databricks' : platform.id === 'synapse' ? 'azure' : platform.id === 'sql-server' ? 'microsoft' : platform.id === 'redshift' ? 'aws' : platform.slug}
    >
      <div className="logo-container">
        {platform.logoType === 'svg-text' ? (
          <svg viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg">
            <text
              x="0"
              y="24"
              fontFamily="Arial, sans-serif"
              fontWeight="800"
              fontSize="28"
              fill={platform.brandColor}
            >
              talend
            </text>
          </svg>
        ) : platform.logo ? (
          <img src={platform.logo} alt={platform.name} />
        ) : null}
      </div>
      <div>
        <h3 className="card-title">{platform.name}</h3>
        <div className="card-tag">{platform.tag}</div>
      </div>
    </button>
  );
}
