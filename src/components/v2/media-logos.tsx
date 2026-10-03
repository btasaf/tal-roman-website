import Image from 'next/image'

// Cream monochrome versions of the outlets' logos (derived from the media mentions' CMS logos).
// On light backgrounds, tint them with `tone="dark"` (brightness-0 turns the cream shape black).
export const MEDIA_LOGOS = [
  { src: '/media-logos/ynet.png', alt: 'ynet', w: 266 },
  { src: '/media-logos/mako.png', alt: 'mako', w: 316 },
  { src: '/media-logos/kan11.png', alt: 'כאן 11', w: 286 },
  { src: '/media-logos/ch12.png', alt: 'ערוץ 12', w: 122 },
]
const LOGO_H = 112 // source height

// Logos drifting sideways on a slow loop (transform-only marquee from globals.css, two identical halves)
export function LogoMarquee({ tone = 'light', className = '', logoClassName = 'h-7 md:h-8', duration = 28 }: { tone?: 'light' | 'dark'; className?: string; logoClassName?: string; duration?: number }) {
  return (
    <div
      className={`marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] ${className}`}
      style={{ ['--marquee-duration' as string]: `${duration}s` }}
    >
      <div className="marquee-track flex w-max items-center" aria-label="ynet, mako, כאן 11, ערוץ 12">
        {[0, 1].map((copy) =>
          MEDIA_LOGOS.map((l) => (
            <div key={`${copy}-${l.src}`} className="ps-10" aria-hidden={copy === 1 || undefined}>
              <Image
                src={l.src}
                alt={copy === 0 ? l.alt : ''}
                width={l.w}
                height={LOGO_H}
                className={`${logoClassName} w-auto ${tone === 'dark' ? 'brightness-0 opacity-55' : 'opacity-90'}`}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
