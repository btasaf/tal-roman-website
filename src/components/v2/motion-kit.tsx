'use client'

import { useRef, type ReactNode } from 'react'
import { m, useReducedMotion, useScroll, useTransform, type Transition } from 'framer-motion'

// Shared entrance motion for the v2 sections: transform + opacity only, runs once per element.
// Non-physical values use a duration-based spring with no bounce (calm, not playful).
export const enterSpring: Transition = { type: 'spring', bounce: 0, visualDuration: 0.8 }
const viewport = { once: true, margin: '0px 0px -15% 0px' } as const

// Heading that rises word by word out of a mask (clean editorial reveal)
export function RevealHeading({ text, className, as = 'h2', delay = 0 }: { text: string; className?: string; as?: 'h1' | 'h2' | 'h3'; delay?: number }) {
  const reduce = useReducedMotion()
  const Tag = as
  if (reduce) return <Tag className={className}>{text}</Tag>

  // The heading itself is observed: the words start clipped by their masks, and a fully clipped
  // element never counts as "in view", so it can't trigger its own reveal
  const MTag = m[Tag]
  const words = text.split(' ')
  return (
    <MTag className={className} aria-label={text} initial="hidden" whileInView="shown" viewport={viewport}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <m.span
            className="inline-block"
            variants={{ hidden: { y: '110%' }, shown: { y: '0%' } }}
            transition={{ ...enterSpring, delay: delay + i * 0.06 }}
          >
            {w}
          </m.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </MTag>
  )
}

// Fade + rise on enter
export function FadeUp({ children, className, delay = 0, y = 32 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ ...enterSpring, delay }}
    >
      {children}
    </m.div>
  )
}

// Angled cap that rides above a section's top edge, so it covers the previous section at an angle.
// The angle eases ~30% shallower as the section rises (scaleY from the bottom: transform only),
// and the cap is off-screen by the time the section reaches the top. `rise` = which side is higher.
export function AngledCap({ color, height = '18vh', rise = 'left' }: { color: string; height?: string; rise?: 'left' | 'right' }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const progress = useTransform(() => scrollYProgress.get())
  // The angle visibly softens while the section covers the previous one (steep at first, gentle by the time it lands)
  const scaleY = useTransform(progress, [0, 0.15, 1], [1, 1, 0.3])

  return (
    <m.div
      ref={ref}
      aria-hidden
      className="absolute left-0 right-0 pointer-events-none origin-bottom"
      style={{
        // 2px overlap into the section so no hairline gap shows between cap and section
        bottom: 'calc(100% - 2px)',
        height,
        background: color,
        clipPath: rise === 'left' ? 'polygon(0 0, 100% 100%, 0 100%)' : 'polygon(0 100%, 100% 0, 100% 100%)',
        scaleY: reduce ? 1 : scaleY,
      }}
    />
  )
}

// ─── Section seams: each seam on the page uses a different one ───────────────

// Hand-painted brush edge riding above a section (on-brand with the old site's paint strokes).
// The stroke tiles seamlessly (both ends at the same height) and drifts sideways on its own slow loop,
// independent of scroll. Two layers: a translucent under-stroke drifting the other way, and the solid stroke.
const BRUSH_PATH =
  'M0,80 L1440,80 L1440,36 C1370,24 1315,18 1240,36 C1160,56 1090,28 1010,38 C910,50 850,16 760,32 ' +
  'C660,50 585,22 500,34 C390,50 320,16 225,32 C135,46 70,26 0,36 Z'

function BrushStrip({ color, opacity = 1, duration, reverse, lift = 0 }: { color: string; opacity?: number; duration: number; reverse?: boolean; lift?: number }) {
  const reduce = useReducedMotion()
  return (
    <m.div
      className="absolute inset-y-0 left-0 w-[200%] flex"
      style={{ opacity, translateY: lift }}
      animate={reduce ? undefined : { transform: reverse ? ['translateX(-50%)', 'translateX(0%)'] : ['translateX(0%)', 'translateX(-50%)'] }}
      transition={{ duration, ease: 'linear', repeat: Infinity }}
    >
      {[0, 1].map((k) => (
        <svg key={k} className="w-1/2 h-full shrink-0" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d={BRUSH_PATH} fill={color} />
        </svg>
      ))}
    </m.div>
  )
}

export function BrushCap({ color, height = '12vh' }: { color: string; height?: string }) {
  return (
    // Sits 2px lower than the section's top edge so there's never a hairline gap between them
    <div aria-hidden className="absolute left-0 right-0 pointer-events-none overflow-hidden" style={{ height, bottom: 'calc(100% - 2px)' }}>
      <BrushStrip color={color} opacity={0.45} duration={48} reverse lift={-10} />
      <BrushStrip color={color} duration={36} />
    </div>
  )
}

// Soft dome edge that flattens as the section rises (path morph on scroll)
export function WaveCap({ color, height = '14vh' }: { color: string; height?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const progress = useTransform(() => scrollYProgress.get())
  // Centre of the dome: high (y=4) as it arrives, easing down to a gentle curve (y=60)
  const d = useTransform(() => {
    const crest = reduce ? 40 : 4 + 56 * Math.min(1, Math.max(0, progress.get()))
    return `M0,120 L0,100 C360,${crest} 1080,${crest} 1440,100 L1440,120 Z`
  })

  return (
    <div ref={ref} aria-hidden className="absolute left-0 right-0 bottom-full pointer-events-none" style={{ height }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <m.path d={d} fill={color} />
      </svg>
    </div>
  )
}


// ─── Section titles ──────────────────────────────────────────────────────────
// Modern editorial title: a small pill label, then a big bold sans title with one serif accent phrase
// (upright: Hebrew has no true italic; tracking kept near zero since Hebrew letterforms are dense).
// Enters as one line wiping up from a clip (not word by word). Same markup for reduced motion (no hydration mismatch).
export function SectionTitle({
  kicker,
  title,
  accent,
  tone = 'light',
  align = 'center',
  className = '',
}: {
  kicker?: string
  title: string
  accent?: string // substring of `title` to render in the serif accent
  tone?: 'light' | 'dark' // light = on cream/blush, dark = on warm gray
  align?: 'center' | 'start'
  className?: string
}) {
  const parts = accent && title.includes(accent) ? title.split(accent) : [title]
  const dark = tone === 'dark'

  return (
    <div className={`${align === 'center' ? 'text-center' : 'text-right'} ${className}`}>
      {kicker && (
        <m.p
          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold mb-5 ${dark ? 'bg-cream/10 text-gold' : 'bg-brand/10 text-brand-dark'}`}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={enterSpring}
        >
          <span aria-hidden className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-gold' : 'bg-brand'}`} />
          {kicker}
        </m.p>
      )}
      <m.h2
        className={`font-sans font-black tracking-[-0.01em] leading-[1.1] text-4xl md:text-6xl lg:text-7xl ${dark ? 'text-cream' : 'text-[#2d1a0e]'}`}
        initial={{ clipPath: 'inset(0 0 100% 0)', y: 28 }}
        whileInView={{ clipPath: 'inset(0 0 -10% 0)', y: 0 }}
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
