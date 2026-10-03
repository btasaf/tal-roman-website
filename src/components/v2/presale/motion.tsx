'use client'

import type { ReactNode } from 'react'
import { m } from 'framer-motion'
import { enterSpring } from '../motion-kit'

// Entrances for the presale page. One tree for every visitor (no reduced-motion branch, so no hydration
// mismatch): the page root sets <MotionConfig reducedMotion="user">, which drops the transforms and keeps
// only the opacity fade for reduced-motion visitors.
export const inView = { once: true, margin: '0px 0px -12% 0px' } as const

export function FadeUp({ children, className, delay = 0, y = 28 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return (
    <m.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={{ ...enterSpring, delay }}>
      {children}
    </m.div>
  )
}

// Unclips upward (like a card being drawn out of a sleeve). The clip ends 48px outside the box so shadows survive.
export function Unclip({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, clipPath: 'inset(120px -48px -48px -48px round 28px)', y: 24 }}
      whileInView={{ opacity: 1, clipPath: 'inset(-48px -48px -48px -48px round 28px)', y: 0 }}
      viewport={inView}
      transition={{ ...enterSpring, delay }}
    >
      {children}
    </m.div>
  )
}
