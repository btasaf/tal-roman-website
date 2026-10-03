'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { SectionTitle } from './motion'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { FOR_WHOM } from './coaching-content'

const GRAY = 'linear-gradient(to bottom, #5e5955, #48443f)'

// Who it's for, on the warm gray. The gray arrives as an inset rounded panel that opens to full bleed
// as it scrolls in, and gathers back into a panel as it leaves (clip-path only), so it meets the cream
// above and below with soft rounded shoulders instead of a hard line.
export default function CoachingFit() {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const clipPath = useTransform(() => {
    if (reduce) return 'inset(0px 0px 0px 0px round 40px)'
    const p = scrollYProgress.get()
    // 0 → 0.3: opening, 0.3 → 0.75: full bleed, 0.75 → 1: gathering back
    const open = p < 0.3 ? p / 0.3 : p > 0.75 ? 1 - (p - 0.75) / 0.25 : 1
    const e = open * open * (3 - 2 * open)
    const side = (1 - e) * 5 // vw
    const radius = 12 + (1 - e) * 36 // px; a little rounding always stays
    return `inset(0px ${side.toFixed(2)}vw 0px ${side.toFixed(2)}vw round ${radius.toFixed(1)}px)`
  })

  return (
    <section id="for-whom" ref={ref} className="relative bg-cream px-5 md:px-8 py-24 md:py-36 text-cream">
      <GrainOverlay />
      <m.div aria-hidden className="absolute inset-0 overflow-hidden" style={{ background: GRAY, clipPath }}>
        <AuroraBackground palette="gray" />
        <GrainOverlay opacity={0.2} blend="soft-light" />
      </m.div>

      <div className="relative max-w-5xl mx-auto">
        <SectionTitle tone="dark" kicker="האם זה בשבילך?" title="למי זה מתאים?" accent="מתאים?" />

        <ol className="mt-14 md:mt-20">
          {FOR_WHOM.map((text, i) => (
            <m.li
              key={i}
              className="relative grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-5 md:gap-10 py-7 md:py-9 text-right"
              // Wipes in from the right (RTL reading start); the clip box overhangs so glyphs are never shaved
              initial={reduce ? false : { clipPath: 'inset(-10% -4% -10% 104%)', opacity: 0.4 }}
              whileInView={{ clipPath: 'inset(-10% -4% -10% -4%)', opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -12% 0px' }}
              transition={{ ...enterSpring, visualDuration: 1, delay: 0.05 }}
            >
              <span aria-hidden className="font-garamond font-bold text-gold text-4xl md:text-6xl leading-none tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-xl md:text-3xl leading-snug md:leading-snug font-bold text-cream text-pretty">{text}</p>
              {i < FOR_WHOM.length - 1 && (
                <span aria-hidden className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-l from-cream/25 via-cream/15 to-transparent" />
              )}
            </m.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
