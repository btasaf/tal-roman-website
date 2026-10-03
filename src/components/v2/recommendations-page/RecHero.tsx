'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { m, useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { ArrowIcon, Kicker, Rise, halftone } from './motion'
import type { RecShot } from './rec-data'

// Hero on cream: the promise on one side, a fan of real message screenshots on the other (decorative: every
// message is reachable, with its text, in the wall below). The fan opens on load and its cards drift apart at
// different speeds as the page scrolls; the giant halftone word slides gently sideways.

// Fan layout: [x %, rotate deg, scroll drift px] per card, back to front
const FAN = [
  { x: '-46%', r: -9, drift: -40 },
  { x: '46%', r: 8, drift: -110 },
  { x: '0%', r: -1.5, drift: -70 },
]

export default function RecHero({ count, shots }: { count: number; shots: RecShot[] }) {
  const reduce = useHydratedReducedMotion()
  const reduceMv = useMotionValue(false)
  useEffect(() => reduceMv.set(reduce), [reduce, reduceMv])

  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const wordX = useTransform(() => (reduceMv.get() ? '0%' : `${scrollYProgress.get() * -9}%`))

  return (
    <section ref={ref} aria-labelledby="rec-title" className="relative bg-cream overflow-hidden">
      <AuroraBackground palette="cream" />
      <GrainOverlay />

      {/* Giant halftone word along the bottom edge (like the homepage testimonials title) */}
      <m.p
        aria-hidden
        className="absolute inset-x-0 bottom-[-0.14em] text-center font-sans font-black leading-none tracking-[-0.02em] select-none pointer-events-none text-transparent bg-clip-text [-webkit-background-clip:text] text-[30vw] md:text-[19vw] whitespace-nowrap"
        style={{ ...halftone(0.42), x: wordX }}
      >
        המלצות
      </m.p>

      <div className="relative max-w-6xl mx-auto px-6 pt-28 md:pt-36 pb-[34vw] md:pb-[15vw] grid md:grid-cols-[1.05fr_1fr] items-center gap-14 md:gap-10">
        <div className="text-right">
          <Rise delay={0.05}>
            <Kicker>קולות אמיתיים</Kicker>
          </Rise>
          <m.h1
            id="rec-title"
            className="mt-6 font-sans font-black tracking-[-0.01em] leading-[1.02] text-[#2d1a0e] text-[3.25rem] sm:text-6xl lg:text-[5.5rem]"
            initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)', y: 32 }}
            animate={{ clipPath: 'inset(0 0 -14% 0)', y: 0 }}
            transition={reduce ? { duration: 0 } : { ...enterSpring, delay: 0.12 }}
          >
            כמה מילים <span className="font-garamond font-bold text-brand">שכתבתם לי</span>
          </m.h1>
          <Rise delay={0.28}>
            <p className="mt-6 max-w-[34rem] text-[#48443f] text-lg md:text-xl leading-relaxed">
              הודעות אמיתיות ממשתתפות ומשתתפים בסדנאות, בקורסים ובליווי האישי. ליד כל המלצה מחכה ההודעה המקורית, כפי שנשלחה.
            </p>
          </Rise>
          <Rise delay={0.4} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href="#wall"
              className="group inline-flex items-center gap-3 rounded-full bg-[#2d1a0e] text-cream font-bold px-7 py-3.5 shadow-xl shadow-[#2d1a0e]/20 transition-[background-color,scale] duration-300 hover:bg-[#3d2814] hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
            >
              לכל ההמלצות
              <ArrowIcon className="w-5 h-5 -rotate-90 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
            <p className="text-[#5e5955] font-medium">
              <span className="font-garamond font-bold text-3xl text-brand-dark align-[-0.12em] me-1.5">{count}</span>
              הודעות, אחת אחת
            </p>
          </Rise>
        </div>

        <Fan shots={shots} progress={scrollYProgress} reduce={reduce} reduceMv={reduceMv} />
      </div>
    </section>
  )
}

function Fan({ shots, progress, reduce, reduceMv }: { shots: RecShot[]; progress: MotionValue<number>; reduce: boolean; reduceMv: MotionValue<boolean> }) {
  if (!shots.length) return null
  return (
    <div aria-hidden className="relative mx-auto w-[min(44vw,200px)] md:w-[190px] lg:w-[250px] xl:w-[280px] aspect-[1414/2000] mt-2 md:mt-0">
      {shots.map((s, i) => (
        <FanCard key={s.src} shot={s} i={i} progress={progress} reduce={reduce} reduceMv={reduceMv} />
      ))}
    </div>
  )
}

function FanCard({ shot, i, progress, reduce, reduceMv }: { shot: RecShot; i: number; progress: MotionValue<number>; reduce: boolean; reduceMv: MotionValue<boolean> }) {
  const f = FAN[i] ?? FAN[2]
  const y = useTransform(() => (reduceMv.get() ? 0 : progress.get() * f.drift * 2.4))
  return (
    <m.div
      className="absolute inset-0"
      initial={reduce ? false : { x: '0%', rotate: 0, opacity: 0, y: 40 }}
      animate={{ x: f.x, rotate: f.r, opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0, visualDuration: 1.1, delay: 0.35 + i * 0.12 }}
    >
      <m.div className="relative w-full h-full rounded-[26px] bg-white p-2 shadow-[0_30px_60px_-24px_rgba(61,40,20,0.45),0_6px_16px_-6px_rgba(61,40,20,0.18)]" style={{ y }}>
        <div className="relative w-full h-full rounded-[20px] overflow-hidden bg-[#f6efe4]">
          <Image src={shot.src} alt="" fill sizes="280px" className="object-cover object-top" priority />
        </div>
      </m.div>
    </m.div>
  )
}
