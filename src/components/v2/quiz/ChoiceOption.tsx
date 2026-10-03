'use client'

import { forwardRef } from 'react'
import { m } from 'framer-motion'
import OptionIcon from './OptionIcon'
import { spring, springSnappy } from './quiz-config'

type Props = {
  qid: string
  value: string
  label: string
  index: number
  selected: boolean
  tabbable: boolean
  onSelect: () => void
}

const RADIUS = 22

/**
 * One answer: a large tactile row. The dark "selected" surface carries a shared
 * layoutId, so it glides between options on change, and morphs into the
 * "you picked" chip at the top of the next step.
 */
const ChoiceOption = forwardRef<HTMLButtonElement, Props>(function ChoiceOption(
  { qid, value, label, index, selected, tabbable, onSelect },
  ref,
) {
  return (
    <m.button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={tabbable ? 0 : -1}
      onClick={onSelect}
      whileTap={{ scale: 0.982 }}
      transition={springSnappy}
      className="group relative flex min-h-[74px] w-full items-center gap-4 px-4 py-3.5 text-right outline-none sm:min-h-[80px] sm:px-5
        focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      style={{ borderRadius: RADIUS }}
    >
      {/* Resting surface */}
      <span
        aria-hidden
        className="absolute inset-0 bg-white/65 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_10px_30px_-18px_rgba(61,40,20,0.35)] ring-1 ring-[#3d2814]/[0.07]
          transition-[background-color,box-shadow] duration-300 group-hover:bg-white group-hover:ring-[#c97870]/30"
        style={{ borderRadius: RADIUS }}
      />
      {/* Selected surface (shared element) */}
      {selected && (
        <m.span
          aria-hidden
          layoutId={`picked-${qid}`}
          className="absolute inset-0 bg-[#2d1a0e] shadow-[0_18px_40px_-20px_rgba(45,26,14,0.7)]"
          style={{ borderRadius: RADIUS }}
          transition={spring}
        />
      )}

      {/* Icon tile */}
      <span
        aria-hidden
        className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-[14px] transition-colors duration-300 sm:h-12 sm:w-12 ${
          selected ? 'bg-[#c97870] text-[#fff2d4]' : 'bg-[#fbe3d2] text-[#a85a54] group-hover:bg-[#f8d6c0]'
        }`}
      >
        <OptionIcon value={value} />
      </span>

      <span
        className={`relative flex-1 text-[16.5px] font-medium leading-snug transition-colors duration-300 sm:text-[17.5px] ${
          selected ? 'text-[#fff2d4]' : 'text-[#2d1a0e]'
        }`}
      >
        {label}
      </span>

      {/* Trailing indicator: key hint (pointer devices) → drawn check when selected */}
      <span aria-hidden className="relative grid h-7 w-7 shrink-0 place-items-center">
        {selected ? (
          <m.svg
            viewBox="0 0 28 28"
            className="h-7 w-7"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={springSnappy}
          >
            <circle cx="14" cy="14" r="14" fill="#e6c060" />
            <m.path
              d="M8.5 14.5l3.6 3.4 7.4-7.8"
              fill="none"
              stroke="#2d1a0e"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut', delay: 0.08 }}
            />
          </m.svg>
        ) : (
          <>
            <span className="hidden h-7 w-7 place-items-center rounded-lg border border-[#3d2814]/15 text-[12px] font-bold text-[#5e5955] [@media(hover:hover)]:grid">
              {index + 1}
            </span>
            <span className="h-5 w-5 rounded-full border-2 border-[#3d2814]/20 [@media(hover:hover)]:hidden" />
          </>
        )}
      </span>
    </m.button>
  )
})

export default ChoiceOption
