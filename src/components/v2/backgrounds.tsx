'use client'

import { m } from 'framer-motion'
import { useHydratedReducedMotion } from './useHydratedReducedMotion'

// Section backgrounds for the v2 homepage. All decorative (aria-hidden, pointer-events-none),
// motion is transform-only on long, calm loops, and everything goes still for reduced motion.

// ─── Grain ───────────────────────────────────────────────────────────────────
// Static film-grain texture: takes the flat "digital" edge off solid colours and feels tactile/premium.
// One tiny SVG noise tile, repeated; no animation (animated grain costs paint every frame).
const GRAIN_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

export function GrainOverlay({ opacity = 0.12, blend = 'multiply' }: { opacity?: number; blend?: 'multiply' | 'soft-light' | 'overlay' }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{ backgroundImage: GRAIN_SVG, backgroundSize: '160px 160px', opacity, mixBlendMode: blend }}
    />
  )
}

// ─── Aurora ──────────────────────────────────────────────────────────────────
// Soft colour fields (rose / gold / blush) that slowly wander and breathe. Pre-softened radial
// gradients moved with transform only (no CSS blur filter), so it's cheap even full-screen.
const AURORA_PALETTES = {
  cream: ['rgba(201,120,112,0.42)', 'rgba(230,192,96,0.45)', 'rgba(232,160,140,0.5)'],
  blush: ['rgba(201,120,112,0.36)', 'rgba(255,242,212,0.7)', 'rgba(230,192,96,0.34)'],
  gray: ['rgba(230,192,96,0.26)', 'rgba(201,120,112,0.3)', 'rgba(255,242,212,0.14)'],
}

const BLOBS = [
  { cls: 'left-[-15%] top-[-10%] w-[65vw] h-[65vw]', path: ['translate(0%,0%) scale(1)', 'translate(18%,12%) scale(1.18)', 'translate(6%,24%) scale(0.92)', 'translate(0%,0%) scale(1)'], dur: 26 },
  { cls: 'right-[-20%] top-[15%] w-[55vw] h-[55vw]', path: ['translate(0%,0%) scale(1)', 'translate(-20%,10%) scale(0.88)', 'translate(-8%,-14%) scale(1.16)', 'translate(0%,0%) scale(1)'], dur: 32 },
  { cls: 'left-[20%] bottom-[-25%] w-[60vw] h-[60vw]', path: ['translate(0%,0%) scale(1)', 'translate(10%,-12%) scale(1.08)', 'translate(-8%,-4%) scale(0.96)', 'translate(0%,0%) scale(1)'], dur: 38 },
]

export function AuroraBackground({ palette = 'cream' }: { palette?: keyof typeof AURORA_PALETTES }) {
  const reduce = useHydratedReducedMotion()
  const colors = AURORA_PALETTES[palette]
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      {BLOBS.map((b, i) => (
        <m.div
          key={i}
          className={`absolute rounded-full ${b.cls}`}
          style={{ background: `radial-gradient(circle, ${colors[i]} 0%, transparent 65%)` }}
          animate={reduce ? undefined : { transform: b.path }}
          transition={{ duration: b.dur, ease: 'easeInOut', repeat: Infinity }}
        />
      ))}
    </div>
  )
}

// ─── Flowing lines ───────────────────────────────────────────────────────────
// Thin, hand-drawn-feeling wave lines drifting sideways — two strands that keep meeting and parting
// (a quiet "connection" motif). The SVG tiles seamlessly, so the drift loops forever.
function wavePath(offsetY: number, amp: number, phase: number) {
  // One 1440-wide period, start/end at the same height so tiles join
  const y = (x: number) => offsetY + amp * Math.sin((x / 1440) * Math.PI * 2 + phase)
  let d = `M0,${y(0).toFixed(1)}`
  for (let x = 60; x <= 1440; x += 60) d += ` L${x},${y(x).toFixed(1)}`
  return d
}

const FLOW_LINES = [
  { y: 120, amp: 40, phase: 0, w: 1.4, o: 0.5 },
  { y: 140, amp: 46, phase: Math.PI * 0.9, w: 1.4, o: 0.5 },
  { y: 420, amp: 34, phase: Math.PI * 0.4, w: 1, o: 0.35 },
  { y: 440, amp: 40, phase: Math.PI * 1.3, w: 1, o: 0.35 },
  { y: 700, amp: 30, phase: Math.PI * 0.2, w: 1.2, o: 0.4 },
  { y: 722, amp: 36, phase: Math.PI * 1.1, w: 1.2, o: 0.4 },
]

export function FlowLines({ color = '#c97870', opacity = 0.5, duration = 60 }: { color?: string; opacity?: number; duration?: number }) {
  const reduce = useHydratedReducedMotion()
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
      <m.div
        className="absolute inset-y-0 left-0 w-[200%] flex"
        animate={reduce ? undefined : { transform: ['translateX(0%)', 'translateX(-50%)'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {[0, 1].map((k) => (
          <svg key={k} className="w-1/2 h-full shrink-0" viewBox="0 0 1440 840" preserveAspectRatio="none" fill="none">
            {FLOW_LINES.map((l, i) => (
              <path key={i} d={wavePath(l.y, l.amp, l.phase)} stroke={color} strokeWidth={l.w} strokeOpacity={l.o} vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
        ))}
      </m.div>
    </div>
  )
}

// ─── Ripple rings ────────────────────────────────────────────────────────────
// Soft rings that slowly pulse outward from behind a focal element (the hero photo) — draws the eye
// to Tal without adding clutter. Place inside a `relative` wrapper around the element.
export function RippleRings({ color = 'rgba(201,120,112,0.5)', count = 3, duration = 7 }: { color?: string; count?: number; duration?: number }) {
  const reduce = useHydratedReducedMotion()
  if (reduce) return null
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {Array.from({ length: count }, (_, i) => (
        <m.span
          key={i}
          className="absolute w-full h-full rounded-[48px] border"
          style={{ borderColor: color }}
          initial={{ transform: 'scale(1)', opacity: 0 }}
          animate={{ transform: ['scale(1)', 'scale(1.3)'], opacity: [0.9, 0] }}
          transition={{ duration, ease: 'easeOut', repeat: Infinity, delay: (duration / count) * i }}
        />
      ))}
    </div>
  )
}
