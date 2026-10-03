'use client'

import type { ReactNode } from 'react'
import { m } from 'framer-motion'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { Kicker } from './ui'

// Entrance helpers for the coaching page. Same look as motion-kit's FadeUp / SectionTitle, but the markup is
// identical on server and client (reduced motion only switches `initial` off after hydration), so a
// visitor with reduced motion gets no hydration mismatch and no movement.
const viewport = { once: true, margin: '0px 0px -15% 0px' } as const

export function FadeUp({ children, className, delay = 0, y = 32 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const reduce = useHydratedReducedMotion()
  return (
    <m.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ ...enterSpring, delay }}
    >
      {children}
    </m.div>
  )
}

// Pill label, then a big tight sans title with one upright serif accent phrase; wipes up out of a clip
export function SectionTitle({
  kicker,
  title,
  accent,
  tone = 'light',
  align = 'center',
}: {
  kicker?: string
  title: string
  accent?: string
  tone?: 'light' | 'dark'
  align?: 'center' | 'start'
}) {
  const reduce = useHydratedReducedMotion()
  const parts = accent && title.includes(accent) ? title.split(accent) : [title]
  const dark = tone === 'dark'
  return (
    <div className={align === 'center' ? 'text-center' : 'text-right'}>
      {kicker && (
        <m.div
          className="mb-5"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={enterSpring}
        >
          <Kicker tone={tone}>{kicker}</Kicker>
        </m.div>
      )}
      <m.h2
        className={`font-sans font-black tracking-[-0.01em] leading-[1.1] text-4xl md:text-6xl lg:text-7xl ${dark ? 'text-cream' : 'text-[#2d1a0e]'}`}
        initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)', y: 28 }}
        whileInView={{ clipPath: 'inset(0 0 -12% 0)', y: 0 }}
        viewport={viewport}
        transition={{ ...enterSpring, delay: 0.08 }}
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
      </m.h2>
    </div>
  )
}
