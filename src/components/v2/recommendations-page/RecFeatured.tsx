'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { m, useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { GrainOverlay } from '../backgrounds'
import { clamp01, FadeUp, Kicker } from './motion'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import type { RecItem } from './rec-data'
import { EyeIcon } from './RecCard'

// One voice, large, on warm dark brown: the words light up one by one as the section scrolls through the
// screen, and the original message sits beside it in a frame that drifts a little slower than the page.
export default function RecFeatured({ item, onOpen }: { item: RecItem; onOpen: (id: string) => void }) {
  const reduce = useHydratedReducedMotion()
  const reduceMv = useMotionValue(false)
  useEffect(() => reduceMv.set(reduce), [reduce, reduceMv])

  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: lit } = useScroll({ target: ref, offset: ['start 0.75', 'center 0.5'] })
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const frameY = useTransform(() => (reduceMv.get() ? 0 : (pass.get() - 0.5) * -70))
  const markY = useTransform(() => (reduceMv.get() ? 0 : (pass.get() - 0.5) * 120))

  const words = item.body.replace(/\s+/g, ' ').split(' ')

  return (
    <section ref={ref} aria-labelledby="featured-title" className="relative overflow-hidden bg-gradient-to-b from-[#2d1a0e] to-[#3d2814] text-cream">
      <GrainOverlay opacity={0.18} blend="soft-light" />
      {/* Giant serif quote mark, drifting against the scroll */}
      <m.span
        aria-hidden
        className="absolute top-6 md:top-2 right-[-2vw] font-garamond font-bold leading-none text-[48vw] md:text-[26vw] text-gold/[0.07] select-none pointer-events-none"
        style={{ y: markY }}
      >
        ”
      </m.span>

      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-36 grid md:grid-cols-[1.35fr_1fr] gap-14 md:gap-16 items-center">
        <div className="text-right">
          <FadeUp y={12}>
            <Kicker tone="dark">קול אחד מתוך רבים</Kicker>
          </FadeUp>
          <h2 id="featured-title" className="sr-only">
            המלצה נבחרת: {item.name}
          </h2>
          <blockquote className="mt-8">
            <p className="font-sans font-black tracking-[-0.01em] leading-[1.18] text-[2.1rem] sm:text-5xl lg:text-[3.6rem]">
              {words.map((w, i) => (
                <Word key={i} progress={lit} i={i} n={words.length} reduceMv={reduceMv}>
                  {w}
                </Word>
              ))}
            </p>
            <footer className="mt-10 flex items-center gap-4">
              <span aria-hidden className="w-12 h-12 rounded-full bg-gold/15 text-gold font-garamond font-extrabold text-2xl flex items-center justify-center">
                {item.name.charAt(0)}
              </span>
              <span>
                <cite className="not-italic block font-bold text-lg">{item.name}</cite>
                {item.course && <span className="block text-cream/80">{item.course}</span>}
              </span>
            </footer>
          </blockquote>
        </div>

        {item.shot && (
          <FadeUp delay={0.1} className="justify-self-center">
            <m.div style={{ y: frameY }}>
              <button
                type="button"
                onClick={() => onOpen(item.id)}
                data-track="rec_lightbox_open"
                data-track-name={item.name}
                data-track-placement="featured"
                aria-label={`הצגת ההודעה המקורית של ${item.name}`}
                className="group relative block w-[min(70vw,300px)] rounded-[30px] bg-cream/95 p-2.5 rotate-[2.5deg] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] transition-[rotate,scale] duration-500 hover:rotate-0 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/60"
              >
                <span className="relative block w-full overflow-hidden rounded-[22px]" style={{ aspectRatio: `${item.shot.w} / ${item.shot.h}`, maxHeight: '62vh' }}>
                  <Image src={item.shot.src} alt="" fill sizes="300px" className="object-cover object-top" />
                </span>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gold text-[#2d1a0e] text-sm font-bold px-4 py-2 shadow-lg transition-transform duration-300 group-hover:-translate-y-0.5">
                  <EyeIcon className="w-4 h-4" />
                  להודעה המקורית
                </span>
              </button>
            </m.div>
          </FadeUp>
        )}
      </div>
    </section>
  )
}

function Word({ children, progress, i, n, reduceMv }: { children: string; progress: MotionValue<number>; i: number; n: number; reduceMv: MotionValue<boolean> }) {
  // Each word fades from dim to full across its own small slice of the scroll
  const opacity = useTransform(() => {
    const p = progress.get()
    if (reduceMv.get()) return 1
    return 0.2 + 0.8 * clamp01(p * (n + 2) - i)
  })
  return (
    <>
      <m.span style={{ opacity }}>{children}</m.span>{' '}
    </>
  )
}
