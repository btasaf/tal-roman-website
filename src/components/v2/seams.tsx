'use client'

import { useEffect, useRef, type RefObject } from 'react'
import { m, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useHydratedReducedMotion } from './useHydratedReducedMotion'

// Section seams that are real motion (not just edge shapes)
// Circle "portal" reveal: the section opens through a dome that rises from the bottom-centre of the
// screen and grows until it fills the view (like a sun coming up). Returns a clip-path for the section.
export function useCircleReveal(ref: RefObject<HTMLElement | null>) {
  const reduce = useHydratedReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const progress = useTransform(() => scrollYProgress.get())
  // Unclipped until mounted, so the first client render matches the server HTML (no window there)
  const mounted = useMotionValue(0)
  useEffect(() => mounted.set(1), [mounted])
  return useTransform(() => {
    if (reduce || !mounted.get() || typeof window === 'undefined') return 'none'
    const t = Math.min(1, Math.max(0, progress.get()))
    if (t >= 1) return 'none'
    // Centre sits at the bottom-centre of the screen (section-local y = how much of it is visible),
    // so it rises as a dome that grows until it covers the whole viewport
    const vh = window.innerHeight
    const vw = window.innerWidth
    const e = t * t * (3 - 2 * t) // smoothstep
    const full = Math.hypot(vw / 2, vh) * 1.05
    return `circle(${(e * full).toFixed(1)}px at 50% ${(t * vh).toFixed(1)}px)`
  })
}

// Rising columns: rounded pillars of the next section's colour grow up from its top edge,
// staggered from the centre outwards, until they merge into a solid edge.
function Column({ index, count, progress, color }: { index: number; count: number; progress: MotionValue<number>; color: string }) {
  const reduce = useReducedMotion()
  // distance from the centre decides when each pillar starts (centre first)
  const fromCentre = Math.abs(index - (count - 1) / 2) / ((count - 1) / 2)
  const start = fromCentre * 0.35
  const scaleY = useTransform(progress, [start, start + 0.55], [0.08, 1])
  return (
    <m.div
      className="flex-1 h-full rounded-t-full origin-bottom -mx-px"
      style={{ background: color, scaleY: reduce ? 1 : scaleY }}
    />
  )
}

export function RisingColumns({ color, height = '30vh', count = 9 }: { color: string; height?: string; count?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end 60%'] })
  const progress = useTransform(() => scrollYProgress.get())
  return (
    <div ref={ref} aria-hidden className="absolute left-0 right-0 pointer-events-none flex items-end" style={{ height, bottom: 'calc(100% - 2px)' }}>
      {Array.from({ length: count }, (_, i) => (
        <Column key={i} index={i} count={count} progress={progress} color={color} />
      ))}
    </div>
  )
}
