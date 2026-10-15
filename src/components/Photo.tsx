// Responsive photo backed by the variants scripts/optimize-images.sh writes to
// public/images/. AVIF first, JPEG fallback, explicit dimensions so layout is
// reserved before the image arrives.

const PHOTOS = {
  // Exported at 6:7 to match the hero arch, so the rendered width is the frame width.
  // 720 serves most phones (about 360px wide at 2x), the LCP on mobile.
  hero: { widths: [480, 720, 960, 1440], ratio: 7 / 6 },
} as const;

// The hero arch's rendered width: about 500px from 1100px up, about 44vw from 900px,
// and in the single-column layout 92vw until .hero__art's 460px cap (446px of photo)
// takes over at about 500px. index.html preloads the hero with this exact string as
// imagesizes; change both together or the preload is wasted.
export const HERO_SIZES = '(min-width: 1100px) 500px, (min-width: 900px) 44vw, (min-width: 500px) 446px, 92vw';

type PhotoName = keyof typeof PHOTOS;

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
