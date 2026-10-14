// Responsive photo backed by the variants scripts/optimize-images.sh writes to
// public/images/. AVIF first, JPEG fallback, explicit dimensions so layout is
// reserved before the image arrives.

const PHOTOS = {
  hero: { widths: [480, 960, 1440], ratio: 1 },
  'chocolate-chip': { widths: [400, 800, 1200], ratio: 4080 / 3072 },
  snickerdoodle: { widths: [400, 800, 1200], ratio: 4080 / 3072 },
  artisan: { widths: [400, 800, 1200], ratio: 4080 / 3072 },
  oven: { widths: [400, 800, 1200], ratio: 4080 / 3072 },
} as const;

export type PhotoName = keyof typeof PHOTOS;

interface PhotoProps {
  name: PhotoName;
  alt: string;
  sizes: string;
  className?: string;
  // The LCP image: fetched eagerly at high priority. Everything else is lazy.
  priority?: boolean;
}

export default function Photo({ name, alt, sizes, className, priority = false }: PhotoProps) {
  const { widths, ratio } = PHOTOS[name];
  const srcSet = (ext: string) => widths.map((w) => `/images/${name}-${w}.${ext} ${w}w`).join(', ');
  const fallback = widths[1];

  return (
    <picture className="contents">
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <img
        src={`/images/${name}-${fallback}.jpg`}
        srcSet={srcSet('jpg')}
        sizes={sizes}
        width={fallback}
        height={Math.round(fallback * ratio)}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        // React 18 has no fetchPriority prop; pass the HTML attribute through as-is.
        {...{ fetchpriority: priority ? 'high' : 'auto' }}
      />
    </picture>
  );
}
