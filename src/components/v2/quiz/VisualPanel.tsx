'use client'

import Image from 'next/image'
import { m, AnimatePresence } from 'framer-motion'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { SENDING_VISUAL, STEP_VISUALS, springSoft } from './quiz-config'

type Props = {
  step: number
  sending: boolean
  variant: 'panel' | 'band'
  className?: string
}

/**
 * The illustration side of the quiz. `panel` = the large desktop card,
 * `band` = the compact strip above the question on mobile.
 * Illustrations cross-fade per step and float slowly; transform/opacity only.
 */
export default function VisualPanel({ step, sending, variant, className = '' }: Props) {
  const reduce = useHydratedReducedMotion()
  const visual = STEP_VISUALS[step]
  const key = sending ? 'sending' : `step-${step}`
  const img = sending ? SENDING_VISUAL : visual
  const isGift = step === STEP_VISUALS.length - 1

  const art = (
    <AnimatePresence initial={false}>
      <m.div
        key={key}
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.03, y: -10 }}
        transition={springSoft}
      >
        <m.div
          className={`relative ${sending ? 'h-[62%] w-[62%]' : 'h-full w-full'}`}
          animate={reduce ? undefined : sending ? { y: [0, -14, 0] } : { y: [0, -7, 0] }}
          transition={{ duration: sending ? 2.4 : 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Image
            src={img.src}
            alt=""
            fill
            unoptimized
            priority={step === 0}
            sizes={variant === 'panel' ? '40vw' : '60vw'}
            className="object-contain"
          />
        </m.div>
      </m.div>
    </AnimatePresence>
  )

  if (variant === 'band') {
    return (
      <div aria-hidden className={`relative mx-auto h-[clamp(120px,20svh,180px)] w-full max-w-[300px] ${className}`}>
        <div className="absolute inset-x-[12%] inset-y-[6%] rounded-full bg-[radial-gradient(closest-side,rgba(201,120,112,0.22),rgba(230,192,96,0.12)_60%,transparent)]" />
        <div className="absolute inset-0">{art}</div>
        {isGift && !sending && <Sparkles reduce={reduce} />}
      </div>
    )
  }

  return (
    <div
      aria-hidden
      className={`relative h-full w-full overflow-hidden rounded-[36px] bg-[linear-gradient(155deg,#f9e2cf_0%,#f4cfbd_48%,#f0dcb2_100%)] ${className}`}
    >
      {/* soft light + slow orbit ring */}
      <div className="absolute -right-[20%] -top-[18%] h-[70%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(255,242,212,0.9),transparent)]" />
      <div className="absolute -bottom-[25%] -left-[15%] h-[65%] w-[65%] rounded-full bg-[radial-gradient(closest-side,rgba(201,120,112,0.28),transparent)]" />
      <m.div
        className="absolute left-[-10%] right-[-10%] top-[44%] mx-auto aspect-square w-[min(92%,74vh)] -translate-y-1/2"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
          <circle cx="100" cy="100" r="98" stroke="#a85a54" strokeOpacity="0.16" strokeDasharray="1.5 7" strokeLinecap="round" />
          <circle cx="100" cy="2" r="2.6" fill="#e6c060" />
          <circle cx="2" cy="100" r="1.8" fill="#c97870" fillOpacity="0.6" />
        </svg>
      </m.div>

      {/* Big step numeral */}
      <div className="absolute right-9 top-8 h-[88px] w-[140px]">
        <AnimatePresence initial={false}>
          <m.span
            key={step}
            className="absolute right-0 top-0 font-garamond text-[88px] italic leading-none text-[#a85a54]/25"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={springSoft}
          >
            {isGift ? '✦' : `0${step + 1}`}
          </m.span>
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-[11%] bottom-[24%] top-[14%]">{art}</div>
      {isGift && !sending && <Sparkles reduce={reduce} />}

      {/* Caption */}
      <div className="absolute inset-x-10 bottom-10 h-[64px]">
        <AnimatePresence initial={false}>
          <m.p
            key={step}
            className="absolute inset-x-0 bottom-0 text-center text-[22px] font-extrabold leading-tight tracking-[-0.03em] text-[#3d2814] xl:text-[26px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { ...springSoft, delay: 0.12 } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
          >
            <span className="mb-2 block text-[13px] text-[#c97870]">✦</span>
            {visual.caption}
          </m.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

const SPARKS = [
  { x: '14%', y: '22%', s: 18, d: 0.25 },
  { x: '82%', y: '18%', s: 14, d: 0.4 },
  { x: '88%', y: '58%', s: 20, d: 0.55 },
  { x: '8%', y: '62%', s: 12, d: 0.7 },
  { x: '50%', y: '6%', s: 10, d: 0.85 },
]

/** One-off burst of four-point stars when the gift is revealed, then a slow twinkle. */
function Sparkles({ reduce }: { reduce: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {SPARKS.map((p, i) => (
        <m.svg
          key={i}
          viewBox="0 0 24 24"
          className="absolute"
          style={{ left: p.x, top: p.y, width: p.s, height: p.s }}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={reduce ? { opacity: 1 } : { opacity: [0, 1, 0.55, 1], scale: [0.2, 1.15, 0.9, 1] }}
          transition={reduce ? { duration: 0.3 } : { duration: 1.6, delay: p.d, ease: 'easeOut' }}
        >
          <path d="M12 0c.9 6.4 5.6 11.1 12 12-6.4.9-11.1 5.6-12 12-.9-6.4-5.6-11.1-12-12C6.4 11.1 11.1 6.4 12 0Z" fill={i % 2 ? '#c97870' : '#e6c060'} />
        </m.svg>
      ))}
    </div>
  )
}
