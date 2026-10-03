'use client'

import type { ReactNode } from 'react'
import { m } from 'framer-motion'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'

// Entrance helpers for the recommendations and media pages. The markup is identical on server and client
// (reduced motion only switches the starting state off after hydration), so a visitor with reduced motion
// gets no hydration mismatch and no movement. Transform / opacity / clip only, no bounce, once per element.
export const viewport = { once: true, margin: '0px 0px -12% 0px' } as const

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export function FadeUp({ children, className, delay = 0, y = 28 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const reduce = useHydratedReducedMotion()
  return (
    <m.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={reduce ? { duration: 0 } : { ...enterSpring, delay }}
    >
      {children}
    </m.div>
  )
}

// Fade + rise on page load (above the fold)
export function Rise({ children, className, delay = 0, y = 20 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const reduce = useHydratedReducedMotion()
  return (
    <m.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { ...enterSpring, delay }}
    >
      {children}
    </m.div>
  )
}

export function Kicker({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark'
  return (
    <p className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold ${dark ? 'bg-cream/10 text-gold' : 'bg-brand/10 text-brand-dark'}`}>
      <span aria-hidden className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-gold' : 'bg-brand'}`} />
      {children}
    </p>
  )
}

// Big tight sans title with one upright serif accent phrase; wipes up out of a clip when scrolled into view
export function SectionTitle({
  id,
  kicker,
  title,
  accent,
  tone = 'light',
  align = 'center',
  as = 'h2',
  className = 'text-4xl md:text-6xl lg:text-7xl',
}: {
  id?: string
  kicker?: string
  title: string
  accent?: string
  tone?: 'light' | 'dark'
  align?: 'center' | 'start'
  as?: 'h1' | 'h2'
  className?: string
}) {
  const reduce = useHydratedReducedMotion()
  const parts = accent && title.includes(accent) ? title.split(accent) : [title]
  const dark = tone === 'dark'
  const Tag = as === 'h1' ? m.h1 : m.h2
  return (
    <div className={align === 'center' ? 'text-center' : 'text-right'}>
      {kicker && (
        <m.div
          className="mb-5"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={reduce ? { duration: 0 } : enterSpring}
        >
          <Kicker tone={tone}>{kicker}</Kicker>
        </m.div>
      )}
      <Tag
        id={id}
        className={`font-sans font-black tracking-[-0.01em] leading-[1.08] ${className} ${dark ? 'text-cream' : 'text-[#2d1a0e]'}`}
        initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)', y: 28 }}
        whileInView={{ clipPath: 'inset(0 0 -14% 0)', y: 0 }}
        viewport={viewport}
        transition={reduce ? { duration: 0 } : { ...enterSpring, delay: 0.08 }}
      >
        {parts.length === 2 ? (
          <>
            {parts[0]}
            <span className={`font-garamond font-bold ${dark ? 'text-gold' : 'text-brand'}`}>{accent}</span>
            {parts[1]}
          </>
        ) : (
          title
        )}
      </Tag>
    </div>
  )
}

export function ArrowIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={`rotate-180 shrink-0 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

export function ExternalIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" />
    </svg>
  )
}

// Halftone fill for giant decorative letters (same dot screen as the homepage testimonials title)
export const halftone = (alpha = 0.45, rgb = '168,90,84') => ({
  backgroundImage: `radial-gradient(circle, rgba(${rgb},${alpha}) 0.9px, transparent 1.3px), linear-gradient(to bottom, rgba(${rgb},0.16), rgba(${rgb},0.05))`,
  backgroundSize: '3.5px 3.5px, 100% 100%',
})
