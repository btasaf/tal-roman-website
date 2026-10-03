import type { ReactNode } from 'react'
import { SHEKEL, splitAccent, type PriceLine } from './course-data'

// Small, server-safe building blocks for the v2 courses pages (no hooks)

export function Kicker({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark'
  return (
    <p className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold ${dark ? 'bg-cream/10 text-gold' : 'bg-brand/10 text-brand-dark'}`}>
      <span aria-hidden className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-gold' : 'bg-brand'}`} />
      {children}
    </p>
  )
}

// Course title with its accent run in the serif (the CMS marks emphasis with *stars*)
export function AccentTitle({ title, tone = 'light' }: { title: string; tone?: 'light' | 'dark' }) {
  const [before, accent, after] = splitAccent(title)
  // A leading Latin name (e.g. "TALK ME INTO IT …") gets its own line instead of wrapping into the Hebrew
  const ownLine = !before.trim() && /^[A-Za-z]/.test(accent)
  return (
    <>
      {before}
      <span dir={ownLine ? 'ltr' : undefined} className={`font-garamond font-bold ${ownLine ? 'block' : ''} ${tone === 'dark' ? 'text-gold' : 'text-brand'}`}>
        {accent}
      </span>
      {ownLine ? after.trim() : after}
    </>
  )
}

// Body text with the CMS's *starred* words set in bold rose (stars removed)
export function Emph({ text }: { text: string }) {
  const parts = text.split(/\*(.+?)\*/g)
  if (parts.length === 1) return <>{text}</>
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <strong key={i} className="font-bold text-brand-dark">
            {p}
          </strong>
        ) : (
          p
        )
      )}
    </>
  )
}

export function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 shrink-0 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 12H6M11 7l-5 5 5 5" />
    </svg>
  )
}

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24', 'aria-hidden': true } as const

const ICONS = {
  pin: (
    <>
      <path d="M12 21s-7-5.6-7-11.2A7 7 0 0112 3a7 7 0 017 6.8C19 15.4 12 21 12 21z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  play: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10.2 8.8v6.4l5.2-3.2z" fill="currentColor" stroke="none" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </>
  ),
  spark: <path d="M12 3.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5zM18.5 15.5c.25 1.6.9 2.25 2.5 2.5-1.6.25-2.25.9-2.5 2.5-.25-1.6-.9-2.25-2.5-2.5 1.6-.25 2.25-.9 2.5-2.5z" />,
}

export type IconName = keyof typeof ICONS

export function Icon({ name, className = 'w-6 h-6' }: { name: IconName; className?: string }) {
  return (
    <svg className={className} {...stroke}>
      {ICONS[name]}
    </svg>
  )
}

// Amount in shekels, LTR so the sign sits right of the digits' reading order
export function Amount({ value, className = '' }: { value: string; className?: string }) {
  return (
    <span dir="ltr" className={`tabular-nums ${className}`}>
      <span className="text-[0.6em] align-[0.32em] me-[0.08em]">{SHEKEL}</span>
      {value}
    </span>
  )
}

// One price line from Sanity: label above, the price large, the old price struck through, the note after
export function PriceRow({ line, tone = 'light', size = 'lg' }: { line: PriceLine; tone?: 'light' | 'dark'; size?: 'lg' | 'md' }) {
  const dark = tone === 'dark'
  if (!line.now) return <p className={`text-lg md:text-xl font-bold leading-snug ${dark ? 'text-cream' : 'text-[#2d1a0e]'}`}>{line.raw}</p>
  return (
    <div>
      {line.label && <p className={`text-base md:text-lg font-bold mb-1.5 ${dark ? 'text-cream/80' : 'text-[#3d2814]/80'}`}>{line.label}</p>}
      <p className="flex items-baseline flex-wrap gap-x-3 gap-y-1">
        <Amount
          value={line.now}
          className={`font-sans font-black leading-none tracking-[-0.02em] ${size === 'lg' ? 'text-6xl md:text-7xl' : 'text-4xl md:text-5xl'} ${dark ? 'text-gold' : 'text-[#2d1a0e]'}`}
        />
        {line.was && (
          <span className={`font-bold text-lg md:text-xl ${dark ? 'text-cream/60' : 'text-[#5e5955]'}`}>
            במקום <s className={`decoration-2 ${dark ? 'decoration-brand' : 'decoration-brand-dark'}`}><Amount value={line.was} /></s>
          </span>
        )}
        {line.note && <span className={`text-base md:text-lg font-bold ${dark ? 'text-cream/75' : 'text-[#3d2814]/75'}`}>{line.note}</span>}
      </p>
    </div>
  )
}
