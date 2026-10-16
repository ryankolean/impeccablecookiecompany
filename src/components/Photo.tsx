// Responsive photo backed by the variants scripts/optimize-images.sh writes to
// public/images/. AVIF first, WebP fallback (both keep a cutout's transparency; JPEG
// has none), explicit dimensions so layout is reserved before the image arrives.

const PHOTOS = {
  // The cookie lifted off its plate and cropped to the cookie (2508x1922 master), so
  // the rendered width is the cookie's width. 720 serves the Lighthouse phone (412px at
  // 1.75x) and keeps the mobile LCP image under 30 KB; 2x phones take 960.
  hero: { widths: [480, 720, 960, 1440], ratio: 1922 / 2508 },
} as const;

// The hero cookie's rendered width (hero.css). Below 900px: the content width plus half
// the gutter (100vw - 20px on phones), capped at 640px from 660px. From 900px: the art
// column plus its bleed, which is 62vw - 100px until the container stops growing at
// 1336px (a little generous below 1045px, where the H1 sits at its 46px floor), about
// 730px while the H1 still grows, and 37.5vw + 98px once it stops at 74px (1680px).
// index.html preloads the hero with this exact string as imagesizes; change both
// together or the preload is wasted.
export const HERO_SIZES =
  '(min-width: 1680px) calc(37.5vw + 98px), (min-width: 1336px) 730px, (min-width: 900px) calc(62vw - 100px), (min-width: 660px) 640px, calc(100vw - 20px)';

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
        src={`/images/${name}-${fallback}.webp`}
        srcSet={srcSet('webp')}
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
