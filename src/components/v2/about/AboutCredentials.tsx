'use client'

import { m } from 'framer-motion'
import { SectionTitle, enterSpring } from '../motion-kit'
import { GrainOverlay } from '../backgrounds'
import type { Credential } from './about-content'

// "רקע והכשרות": the title stays pinned on the right while the list passes on the left (desktop).
// Each entry is drawn in: its hairline runs in from the right, the serif numeral and text rise after it.
const viewport = { once: true, margin: '0px 0px -18% 0px' } as const

export default function AboutCredentials({ items }: { items: Credential[] }) {
  if (!items.length) return null
  return (
    <section aria-labelledby="credentials-title" className="relative bg-cream overflow-x-clip">
      <GrainOverlay />
      {/* Soft blush glow that carries the cream into the testimonials below */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(50% 40% at 85% 30%, rgba(201,120,112,0.10), transparent 70%)' }} />
      <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-24 md:pb-36 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20">
        <div>
          <div className="lg:sticky lg:top-[22svh]">
            <div id="credentials-title">
              <SectionTitle kicker="רקע והכשרות" title="הדרך המקצועית שלי" accent="המקצועית" align="start" className="lg:[&_h2]:text-6xl" />
            </div>
          </div>
        </div>

        <ol className="relative">
          {items.map((c, i) => (
            <li key={i} className="relative pt-8 pb-10 md:pt-10 md:pb-12">
              {/* Hairline, drawn in from the right */}
              <m.span
                aria-hidden
                className="absolute top-0 inset-x-0 h-px bg-[#a85a54]/25 origin-right"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={viewport}
                transition={{ type: 'spring', bounce: 0, visualDuration: 1.1 }}
              />
              <div className="grid grid-cols-[auto_1fr] gap-5 md:gap-8 items-start">
                <m.span
                  aria-hidden
                  className="font-garamond font-bold text-brand text-5xl md:text-6xl leading-none tabular-nums"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewport}
                  transition={{ ...enterSpring, delay: 0.15 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </m.span>
                <m.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewport}
                  transition={{ ...enterSpring, delay: 0.25 }}
                >
                  <p className="text-sm font-bold text-brand-dark mb-2">{c.label}</p>
                  <p className="text-[#3d2814] text-lg md:text-[1.35rem] leading-relaxed">{c.text}</p>
                </m.div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
