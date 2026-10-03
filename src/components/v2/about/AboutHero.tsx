'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { m, useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { PHOTO, halftone } from './about-content'

// Hero + manifesto: one pinned screen.
// 1. Portrait hero on cream: name, value line, lead (entrance on load).
// 2. The portrait's arch becomes a window: a dark, warm room opens out of it to fill the screen (her photo's own
//    dark background melts into it), while the hero text lifts away.
// 3. Her belief is written word by word with the scroll, where the hero text was.
// The room's colour is exactly the story section's top colour, so the pin releases into it with no seam.
export const ROOM = '#1b0e08'

const HERO_VH = 400 // pinned length (vh); the scroll range is HERO_VH - 100
const RANGE = HERO_VH - 100
// Timeline, in vh of scroll
const T = {
  hintOut: 25,
  textOut: [28, 78],
  open: [40, 145],
  vignette: [60, 130],
  words: [140, 255],
}

const VALUE_LINE = 'חינוך מיני ואינטימיות לזוגות ויחידים'
const BELIEF_ACCENT = ['שער', 'לשינוי', 'עמוק']

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const span = (v: number, [a, b]: number[]) => clamp01((v - a) / (b - a))
const cubicInOut = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2)
const sineInOut = (v: number) => (1 - Math.cos(Math.PI * v)) / 2

interface Props {
  lead: string
  belief: string
}

export default function AboutHero({ lead, belief }: Props) {
  const reduce = useHydratedReducedMotion()
  // As a motion value, so the scroll-linked transforms below recompute the moment it changes
  const reduceMv = useMotionValue(false)
  useEffect(() => reduceMv.set(reduce), [reduce, reduceMv])

  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  // Scroll position in vh along the pinned stretch (function form: computed per frame)
  const v = useTransform(() => scrollYProgress.get() * RANGE)

  // Geometry of the screen and of the portrait frame (untransformed anchor), measured on resize
  const geo = useMotionValue<{ w: number; h: number; x: number; y: number; fw: number; fh: number } | null>(null)
  useEffect(() => {
    const measure = () => {
      const box = stickyRef.current?.getBoundingClientRect()
      const a = anchorRef.current?.getBoundingClientRect()
      if (!box || !a?.width) return
      geo.set({ w: box.width, h: box.height, x: a.left - box.left, y: a.top - box.top, fw: a.width, fh: a.height })
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (stickyRef.current) ro.observe(stickyRef.current)
    if (anchorRef.current) ro.observe(anchorRef.current)
    return () => ro.disconnect()
  }, [geo])

  const open = useTransform(() => cubicInOut(span(v.get(), T.open)))

  // The room: clipped to the portrait's arch, growing past the screen edges
  const roomClip = useTransform(() => {
    const g = geo.get()
    const e = open.get()
    if (reduceMv.get()) return 'none'
    if (!g || e <= 0) return 'inset(50% 50% 50% 50%)'
    const pad = 40
    const n = (x: number) => x.toFixed(2)
    const top = g.y + (-pad - g.y) * e
    const left = g.x + (-pad - g.x) * e
    const right = g.w - g.x - g.fw + (-pad - (g.w - g.x - g.fw)) * e
    const bottom = g.h - g.y - g.fh + (-pad - (g.h - g.y - g.fh)) * e
    const arch = (g.fw / 2) * (1 - e)
    const foot = 28 * (1 - e)
    return `inset(${n(top)}px ${n(right)}px ${n(bottom)}px ${n(left)}px round ${n(arch)}px ${n(arch)}px ${n(foot)}px ${n(foot)}px)`
  })
  // Reduced motion: the room simply fades in
  const roomOpacity = useTransform(() => {
    const e = open.get() // read first: function-form transforms track the values they read
    return reduceMv.get() ? e : 1
  })

  // Hero text lifts away before the room reaches it
  const textOut = useTransform(() => sineInOut(span(v.get(), T.textOut)))
  const heroTextOpacity = useTransform(() => 1 - textOut.get())
  const heroTextY = useTransform(() => (reduceMv.get() ? 0 : -48 * textOut.get()))
  const heroTextHidden = useTransform(() => (textOut.get() > 0.98 ? 'hidden' : 'visible'))
  const hintOpacity = useTransform(() => clamp01(1 - v.get() / T.hintOut))

  // Portrait: the frame's edge melts into the room (vignette in, shadow out)
  const vignette = useTransform(() => sineInOut(span(v.get(), T.vignette)))
  const shadowOpacity = useTransform(() => 1 - open.get())
  const imageY = useTransform(() => (reduceMv.get() ? '0%' : `${-4 + 8 * scrollYProgress.get()}%`))

  // Belief, written with the scroll
  const words = useTransform(() => span(v.get(), T.words))
  const beliefOpacity = useTransform(() => clamp01((v.get() - (T.words[0] - 20)) / 20))
  const beliefHidden = useTransform(() => (beliefOpacity.get() < 0.02 ? 'hidden' : 'visible'))

  const tokens = belief.split(' ').filter(Boolean)
  const accentStart = findPhrase(tokens, BELIEF_ACCENT)

  return (
    <section
      ref={sectionRef}
      className="relative bg-cream"
      style={{ height: `${HERO_VH}svh` }}
      aria-label="נעים להכיר"
    >
      <div ref={stickyRef} className="sticky top-0 h-svh overflow-hidden">
        {/* Cream backdrop: warm aurora, grain, and a giant halftone word bleeding off the bottom */}
        <AuroraBackground palette="cream" />
        <GrainOverlay />
        <p
          aria-hidden
          className="absolute inset-x-0 -bottom-[0.18em] text-center font-sans font-black leading-none tracking-[-0.03em] whitespace-nowrap select-none pointer-events-none text-transparent bg-clip-text [-webkit-background-clip:text] text-[17vw] lg:text-[19vw]"
          style={halftone('rgba(168,90,84,0.4)', 'rgba(168,90,84,0.12)', 'rgba(201,120,112,0.04)')}
        >
          קצת עליי
        </p>

        {/* The room */}
        <m.div
          aria-hidden
          className="absolute inset-0"
          style={{ clipPath: roomClip, opacity: roomOpacity, background: ROOM }}
        >
          <div className="absolute inset-0" style={{ background: 'radial-gradient(60% 55% at 70% 45%, rgba(201,120,112,0.16), transparent 70%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(45% 45% at 25% 85%, rgba(230,192,96,0.08), transparent 70%)' }} />
          <GrainOverlay opacity={0.18} blend="soft-light" />
        </m.div>

        {/* Layout: text (right, RTL) + portrait (left); stacked on phones and tablets */}
        <div className="relative h-full w-full max-w-6xl mx-auto px-6 md:px-10 pt-[92px] pb-10 md:pt-[84px] md:pb-[12svh] lg:py-0 flex flex-col lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 items-center justify-start md:justify-center">
          {/* Portrait */}
          <div className="lg:order-2 flex justify-center lg:justify-start shrink-0">
            <div ref={anchorRef} className="relative h-[min(40svh,420px)] md:h-[min(42svh,500px)] lg:h-[min(68svh,600px)] aspect-[4/5]">
              <m.div
                className="absolute inset-0"
                initial={{ clipPath: 'inset(100% 0% 0% 0% round 999px 999px 28px 28px)' }}
                animate={{ clipPath: 'inset(0% 0% 0% 0% round 999px 999px 28px 28px)' }}
                transition={reduce ? { duration: 0 } : { ...enterSpring, visualDuration: 1.2, delay: 0.15 }}
              >
                <m.div
                  aria-hidden
                  className="absolute inset-0 rounded-t-full rounded-b-[28px] shadow-[0_40px_80px_-30px_rgba(61,40,20,0.55)]"
                  style={{ opacity: shadowOpacity }}
                />
                <div className="absolute inset-0 rounded-t-full rounded-b-[28px] overflow-hidden bg-[#1a0c06]">
                  <m.div
                    className="absolute inset-[-6%]"
                    initial={{ scale: reduce ? 1 : 1.15 }}
                    animate={{ scale: 1 }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0, visualDuration: 1.8, delay: 0.15 }}
                  >
                    <m.div className="absolute inset-0" style={{ y: imageY }}>
                      <Image src={PHOTO.hero} alt="טל רומן" fill priority sizes="(max-width: 1024px) 60vw, 480px" className="object-cover object-[50%_18%]" />
                    </m.div>
                  </m.div>
                  {/* Edge melt into the room */}
                  <m.div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      opacity: vignette,
                      background: `linear-gradient(to top, ${ROOM} 0%, ${ROOM} 6%, transparent 34%), radial-gradient(ellipse 64% 60% at 50% 40%, transparent 46%, ${ROOM} 94%)`,
                    }}
                  />
                </div>
              </m.div>
            </div>
          </div>

          {/* Text: the hero copy and the belief share one cell, so the cell is as tall as the taller of the two */}
          <div className="lg:order-1 grid w-full mt-7 md:mt-10 lg:mt-0 text-center lg:text-right">
            <m.div className="[grid-area:1/1]" style={{ opacity: heroTextOpacity, y: heroTextY, visibility: heroTextHidden }}>
              <m.p
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold bg-brand/10 text-brand-dark mb-4 md:mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { ...enterSpring, delay: 0.35 }}
              >
                <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-brand" />
                נעים להכיר
              </m.p>
              <h1 className="font-sans font-black tracking-[-0.01em] leading-[0.95] text-[#2d1a0e] text-[3.5rem] md:text-8xl lg:text-[7.5rem]">
                <MaskWord delay={0.45} reduce={reduce}>טל</MaskWord>{' '}
                <MaskWord delay={0.55} reduce={reduce} className="font-garamond font-bold text-brand">רומן</MaskWord>
              </h1>
              <m.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { ...enterSpring, delay: 0.75 }}
              >
                <p className="mt-3 md:mt-5 text-brand-dark font-bold text-base md:text-2xl">{VALUE_LINE}</p>
                {lead && (
                  <p className="mt-3 md:mt-5 text-[#48443f] text-base md:text-[1.4rem] leading-relaxed max-w-[34rem] mx-auto lg:mx-0">{lead}</p>
                )}
              </m.div>
            </m.div>

            {/* Belief */}
            <m.div className="[grid-area:1/1] self-center" style={{ opacity: beliefOpacity, visibility: beliefHidden }}>
              <p className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold bg-cream/10 text-gold mb-4 md:mb-6">
                <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-gold" />
                הגישה שלי
              </p>
              <p className="font-sans font-bold tracking-[-0.005em] text-cream text-[1.6rem] leading-[1.35] md:text-[2.5rem] lg:text-[2.6rem] md:leading-[1.3]">
                <span className="sr-only">{belief}</span>
                <span aria-hidden>
                  {tokens.map((w, i) => {
                    const accent = accentStart !== -1 && i >= accentStart && i < accentStart + BELIEF_ACCENT.length
                    return (
                      <Word key={i} index={i} count={tokens.length} progress={words} reduce={reduce} accent={accent}>
                        {w}
                      </Word>
                    )
                  })}
                </span>
              </p>
            </m.div>
          </div>
        </div>

        {/* Scroll hint */}
        <m.div aria-hidden className="absolute bottom-6 md:bottom-10 inset-x-0 flex flex-col items-center gap-1 text-[#48443f]/60 text-xs md:text-sm" style={{ opacity: hintOpacity }}>
          <span>גללו למטה</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </m.div>
      </div>
    </section>
  )
}

function findPhrase(tokens: string[], phrase: string[]) {
  const strip = (s: string) => s.replace(/[.,!?״"׳'—-]/g, '')
  for (let i = 0; i <= tokens.length - phrase.length; i++) {
    if (phrase.every((p, k) => strip(tokens[i + k]) === p)) return i
  }
  return -1
}

// One word of the heading rising out of its mask on load
function MaskWord({ children, delay, reduce, className = '' }: { children: string; delay: number; reduce: boolean; className?: string }) {
  return (
    <span className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
      <m.span
        className={`inline-block ${className}`}
        initial={{ y: '105%' }}
        animate={{ y: '0%' }}
        transition={reduce ? { duration: 0 } : { ...enterSpring, visualDuration: 1, delay }}
      >
        {children}
      </m.span>
    </span>
  )
}

// One word of the belief: dim until the scroll reaches it, then fully lit (soft 2-word front)
function Word({ children, index, count, progress, reduce, accent }: { children: string; index: number; count: number; progress: MotionValue<number>; reduce: boolean; accent: boolean }) {
  const opacity = useTransform(() => (reduce ? 1 : 0.16 + 0.84 * clamp01((progress.get() * (count + 2) - index) / 2)))
  return (
    <>
      <m.span className={accent ? 'font-garamond text-gold' : undefined} style={{ opacity }}>
        {children}
      </m.span>{' '}
    </>
  )
}
