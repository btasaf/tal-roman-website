'use client'

import type { ReactNode } from 'react'
import { m } from 'framer-motion'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'

// Entrance helpers for the articles pages. Same markup on server and client (reduced motion only switches
// the starting state off after hydration), transform + opacity only, no bounce, once per element.
const viewport = { once: true, margin: '0px 0px -10% 0px' } as const

// Fade + rise when scrolled into view
export function FadeUp({ children, className, delay = 0, y = 24 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
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
export function Rise({ children, className, delay = 0, y = 18, fade = true }: { children: ReactNode; className?: string; delay?: number; y?: number; fade?: boolean }) {
  const reduce = useHydratedReducedMotion()
  return (
    <m.div
      className={className}
      initial={reduce ? false : fade ? { opacity: 0, y } : { y }}
      animate={fade ? { opacity: 1, y: 0 } : { y: 0 }}
      transition={reduce ? { duration: 0 } : { ...enterSpring, delay }}
    >
      {children}
    </m.div>
  )
}
