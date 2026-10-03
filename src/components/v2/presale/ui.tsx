import type { ReactNode } from 'react'

// Small, server-safe building blocks for the v2 presale page (no hooks)

export const SHEKEL = '₪'

export function Kicker({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark'
  return (
    <p className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold ${dark ? 'bg-cream/10 text-gold' : 'bg-brand/10 text-brand-dark'}`}>
      <span aria-hidden className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-gold' : 'bg-brand'}`} />
      {children}
    </p>
  )
}

// The purchase button: always the checkout link from Sanity (same tab, like the live page)
export function BuyButton({
  href,
  label,
  tone = 'rose',
  size = 'lg',
  className = '',
  placement,
}: {
  href: string
  label: string
  tone?: 'rose' | 'gold'
  size?: 'lg' | 'sm'
  className?: string
  // hero / offer / dock, for presale_buy_click
  placement?: string
}) {
  const gold = tone === 'gold'
  return (
    <a
      href={href}
      data-track="presale_buy_click"
      data-track-placement={placement}
      className={`group inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full font-bold transition-[background-color,box-shadow,scale] duration-300 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 ${
        size === 'lg' ? 'text-lg px-8 py-4' : 'text-base px-5 py-2.5'
      } ${
        gold
          ? 'bg-gold text-[#2d1a0e] hover:bg-cream shadow-xl shadow-black/25 focus-visible:ring-gold/40'
          : 'bg-brand text-white hover:bg-brand-dark shadow-xl shadow-brand/30 hover:shadow-brand/50 focus-visible:ring-brand/40'
      } ${className}`}
    >
      {label}
      <ArrowIcon className="transition-transform duration-300 group-hover:-translate-x-1" />
    </a>
  )
}

export function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 shrink-0 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 12H6M11 7l-5 5 5 5" />
    </svg>
  )
}

// Price pair: the new price large, the original struck through beside it
export function Price({ now, was, tone = 'light', size = 'lg' }: { now?: number; was?: number; tone?: 'light' | 'dark'; size?: 'lg' | 'xl' | 'sm' }) {
  if (now == null && was == null) return null
  const dark = tone === 'dark'
  const big = size === 'xl' ? 'text-7xl md:text-8xl' : size === 'lg' ? 'text-5xl md:text-6xl' : 'text-2xl'
  return (
    <p className="flex items-baseline gap-3 flex-wrap">
      {now != null && (
        <span className={`font-sans font-black leading-none tabular-nums tracking-[-0.02em] ${big} ${dark ? 'text-gold' : 'text-[#2d1a0e]'}`} dir="ltr">
          <span className="text-[0.55em] align-[0.35em] me-0.5">{SHEKEL}</span>
          {now}
        </span>
      )}
      {was != null && (
        <span className={`font-bold ${size === 'sm' ? 'text-sm' : 'text-lg md:text-xl'} ${dark ? 'text-cream/60' : 'text-[#5e5955]'}`}>
          במקום{' '}
          <s className={`tabular-nums ${dark ? 'decoration-brand' : 'decoration-brand-dark'} decoration-2`} dir="ltr">
            {SHEKEL}
            {was}
          </s>
        </span>
      )}
    </p>
  )
}

// ─── Icons (the same icon keys the Sanity schema offers) ─────────────────────

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24', 'aria-hidden': true } as const

const ICONS: Record<string, ReactNode> = {
  // trust
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  heart: <path d="M12 20s-7.5-4.6-7.5-10.1A4.4 4.4 0 0 1 12 7.2a4.4 4.4 0 0 1 7.5 2.7C19.5 15.4 12 20 12 20z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  // benefits
  infinity: <path d="M8.2 8.2c-2.2 0-3.7 1.6-3.7 3.8s1.5 3.8 3.7 3.8c1.7 0 2.6-1.2 3.8-3.8 1.2-2.6 2.1-3.8 3.8-3.8 2.2 0 3.7 1.6 3.7 3.8s-1.5 3.8-3.7 3.8c-1.7 0-2.6-1.2-3.8-3.8-1.2-2.6-2.1-3.8-3.8-3.8z" />,
  chat: (
    <>
      <path d="M4.5 6.8A2.3 2.3 0 0 1 6.8 4.5h6.4a2.3 2.3 0 0 1 2.3 2.3v3.4a2.3 2.3 0 0 1-2.3 2.3H9.2L6.5 14.7v-2.3a2.3 2.3 0 0 1-2-2.2V6.8z" />
      <path d="M15.5 9h1.7a2.3 2.3 0 0 1 2.3 2.3v3.4a2.3 2.3 0 0 1-2 2.2v2.3l-2.7-2.2h-2.4a2.3 2.3 0 0 1-2.1-1.4" />
    </>
  ),
  video: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10.2 8.8v6.4l5.2-3.2z" fill="currentColor" stroke="none" />
    </>
  ),
  folder: <path d="M3.5 8.2A1.7 1.7 0 0 1 5.2 6.5H9l1.6 1.6h7.7A1.7 1.7 0 0 1 20 9.8v7.2a1.7 1.7 0 0 1-1.7 1.7H5.2a1.7 1.7 0 0 1-1.7-1.7V8.2z" />,
  book: (
    <>
      <path d="M4.5 19.5A2.5 2.5 0 0 1 7 17h12.5" />
      <path d="M7 3h12.5v18H7a2.5 2.5 0 0 1-2.5-2.5v-13A2.5 2.5 0 0 1 7 3z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />,
}

export function Icon({ name, fallback = 'check', className = 'w-6 h-6' }: { name?: string; fallback?: string; className?: string }) {
  return (
    <svg className={className} {...stroke}>
      {ICONS[name ?? ''] ?? ICONS[fallback]}
    </svg>
  )
}

// Course title with its highlighted word set in the serif accent
export function splitHighlight(title: string, highlight?: string): [string, string | null, string] {
  if (!highlight || !title.includes(highlight)) return [title, null, '']
  const i = title.indexOf(highlight)
  return [title.slice(0, i), highlight, title.slice(i + highlight.length)]
}
