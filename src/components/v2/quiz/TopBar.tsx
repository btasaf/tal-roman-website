'use client'

import Link from 'next/link'
import { m, AnimatePresence } from 'framer-motion'
import quizContent from '@/lib/quiz-content.json'
import { GIFT_STEP, QUESTION_COUNT, UI, spring, springSnappy } from './quiz-config'

type Props = {
  step: number
  /** current question already has an answer (fills its segment) */
  answered: boolean
  onBack: () => void
}

/** Sticky top bar: back / home on the start side, segmented progress, step count on the end side. */
export default function TopBar({ step, answered, onBack }: Props) {
  const isGift = step === GIFT_STEP
  const countText = isGift
    ? UI.giftProgress
    : quizContent.quiz.progressLabel.replace('{current}', String(step + 1)).replace('{total}', String(QUESTION_COUNT))

  return (
    <header className="border-b border-[#3d2814]/[0.06] bg-[#fff2d4]/85 pb-3 backdrop-blur-md pt-[max(14px,env(safe-area-inset-top))]">
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-10">
        {/* Start side: back (or home link on the first question) — fixed width so nothing shifts */}
        <div className="relative h-10 w-[84px] shrink-0">
          <AnimatePresence initial={false} mode="popLayout">
            {step === 0 ? (
              <m.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <Link
                  href="/v2"
                  aria-label={UI.homeLabel}
                  className="flex h-10 items-center rounded-full px-1 text-[17px] font-extrabold tracking-[-0.03em] text-[#2d1a0e] outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {UI.home}
                  <span aria-hidden className="mr-0.5 text-[#c97870]">.</span>
                </Link>
              </m.div>
            ) : (
              <m.button
                key="back"
                type="button"
                onClick={onBack}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                whileTap={{ scale: 0.94 }}
                className="flex h-10 items-center gap-1.5 rounded-full bg-white/60 pe-3.5 ps-2.5 text-[14.5px] font-medium text-[#3d2814] ring-1 ring-[#3d2814]/10 outline-none
                  transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-brand"
              >
                <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
                {quizContent.quiz.backLabel}
              </m.button>
            )}
          </AnimatePresence>
        </div>

        <SegmentedProgress step={step} answered={answered} />

        <p className="hidden w-[120px] shrink-0 text-left text-[13px] font-medium tabular-nums text-[#5e5955] sm:block" aria-hidden>
          {countText}
        </p>
      </div>
    </header>
  )
}

function SegmentedProgress({ step, answered }: { step: number; answered: boolean }) {
  const segments = QUESTION_COUNT + 1
  const label = step === GIFT_STEP ? UI.giftProgress : quizContent.quiz.progressLabel.replace('{current}', String(step + 1)).replace('{total}', String(QUESTION_COUNT))

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={1}
      aria-valuemax={segments}
      aria-valuenow={step + 1}
      className="flex min-w-0 flex-1 gap-1.5"
    >
      {Array.from({ length: segments }, (_, i) => {
        const isGiftSeg = i === GIFT_STEP
        const fill = i < step ? 1 : i === step ? (answered || isGiftSeg ? 1 : 0.3) : 0
        const active = i === step
        return (
          <div key={i} className="min-w-0 flex-1">
            <div className="relative h-[5px] overflow-hidden rounded-full bg-[#3d2814]/[0.09]">
              <m.div
                className={`absolute inset-0 origin-right rounded-full ${isGiftSeg ? 'bg-gradient-to-l from-[#e6c060] to-[#c97870]' : 'bg-[#c97870]'}`}
                initial={false}
                animate={{ scaleX: fill }}
                transition={spring}
              />
            </div>
            <m.span
              aria-hidden
              className={`mt-1.5 block truncate text-[11px] leading-none sm:text-[12px] ${active ? 'font-bold text-[#2d1a0e]' : 'font-medium text-[#5e5955]/70'}`}
              initial={false}
              animate={{ opacity: i <= step ? 1 : 0.55 }}
              transition={springSnappy}
            >
              {isGiftSeg && <span className="ml-0.5">✦</span>}
              {UI.segmentLabels[i]}
            </m.span>
          </div>
        )
      })}
    </div>
  )
}
