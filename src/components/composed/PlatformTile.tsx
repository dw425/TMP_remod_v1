import type { Platform } from '@/types/migration';

interface PlatformTileProps {
  platform: Platform;
  onClick: (slug: string) => void;
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#111827' : '#ffffff';
}

export function PlatformTile({ platform, onClick }: PlatformTileProps) {
  const textColor = getContrastColor(platform.brandColor);

  return (
    <button
      onClick={() => onClick(platform.slug)}
      className="w-full text-left p-6 border border-gray-300 hover:shadow-md transition-shadow"
      style={{ backgroundColor: platform.brandColor }}
    >
      <h3 className="text-xl font-bold mb-2" style={{ color: textColor }}>
        {platform.name}
      </h3>
      <p className="text-sm opacity-90" style={{ color: textColor }}>
        {platform.description}
      </p>
    </button>
  );
}
