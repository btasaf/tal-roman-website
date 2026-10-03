import type { ReactNode } from 'react'
import { CONTACT_ID, CTA_LABEL } from './coaching-content'

// Small building blocks shared by the coaching sections (server-safe: no hooks)

export function Kicker({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark'
  return (
    <p className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold ${dark ? 'bg-cream/10 text-gold' : 'bg-brand/10 text-brand-dark'}`}>
      <span aria-hidden className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-gold' : 'bg-brand'}`} />
      {children}
    </p>
  )
}

// The page's one call to action: jumps to the contact form
export function CtaLink({ tone = 'rose', className = '', label = CTA_LABEL }: { tone?: 'rose' | 'gold'; className?: string; label?: string }) {
  const gold = tone === 'gold'
  return (
    <a
      href={`#${CONTACT_ID}`}
      data-track="coaching_cta_click"
      data-track-label={label}
      className={`group inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full font-bold text-base sm:text-lg px-6 sm:px-8 py-4 transition-[background-color,box-shadow,scale] duration-300 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 ${
        gold
          ? 'bg-gold text-[#2d1a0e] hover:bg-cream shadow-xl shadow-black/20 focus-visible:ring-gold/40'
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
    <svg className={`w-5 h-5 rotate-180 shrink-0 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

export function DetailIcon({ name, className = 'w-5 h-5' }: { name: 'pin' | 'calendar' | 'lock'; className?: string }) {
  const common = { className, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.8, 'aria-hidden': true } as const
  switch (name) {
    case 'pin':
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-5.6-7-11.2A7 7 0 0112 3a7 7 0 017 6.8C19 15.4 12 21 12 21z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      )
    case 'calendar':
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
          <path strokeLinecap="round" d="M8 3v4M16 3v4M3.5 10h17" />
        </svg>
      )
    case 'lock':
      return (
        <svg {...common}>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V8a4 4 0 118 0v3" />
        </svg>
      )
  }
}
