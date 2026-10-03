'use client'

import { useRef } from 'react'
import { m } from 'framer-motion'
import ChoiceOption from './ChoiceOption'
import { spring } from './quiz-config'

type Option = { value: string; label: string }

type Props = {
  qid: string
  title: string
  options: Option[]
  selected: string | null
  headingRef: React.RefObject<HTMLHeadingElement | null>
  onSelect: (value: string) => void
}

const item = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0, transition: spring },
}

/** Splits the title so the last Hebrew word can carry the serif-italic accent (text itself unchanged). */
export function splitAccent(title: string): [string, string, string] {
  const matches = [...title.matchAll(/[֐-׿"׳״']+\??/g)]
  const last = matches[matches.length - 1]
  if (!last || last.index === undefined) return [title, '', '']
  return [title.slice(0, last.index), last[0], title.slice(last.index + last[0].length)]
}

export default function QuestionStep({ qid, title, options, selected, headingRef, onSelect }: Props) {
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const titleId = `quiz-${qid}-title`
  const [before, accent, after] = splitAccent(title)
  const selectedIndex = options.findIndex((o) => o.value === selected)

  // Roving focus inside the radiogroup (RTL: ← is "next", → is "previous").
  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowLeft: 1, ArrowUp: -1, ArrowRight: -1 }
    const delta = keys[e.key]
    if (!delta && e.key !== 'Home' && e.key !== 'End') return
    e.preventDefault()
    const current = optionRefs.current.findIndex((el) => el === document.activeElement)
    let next = e.key === 'Home' ? 0 : e.key === 'End' ? options.length - 1 : current + delta
    next = (next + options.length) % options.length
    optionRefs.current[next]?.focus()
  }

  return (
    <m.div variants={{ center: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } } }}>
      <m.h1
        ref={headingRef}
        id={titleId}
        tabIndex={-1}
        variants={item}
        className="text-balance font-sans text-[32px] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#2d1a0e] outline-none sm:text-[44px] lg:text-[54px]"
      >
        {before}
        <span className="font-garamond font-bold italic text-[#c97870]">{accent}</span>
        {after}
      </m.h1>

      <div
        role="radiogroup"
        aria-labelledby={titleId}
        onKeyDown={onKeyDown}
        className="mt-7 flex flex-col gap-3 sm:mt-9"
      >
        {options.map((opt, i) => (
          <m.div key={opt.value} variants={item}>
            <ChoiceOption
              ref={(el) => {
                optionRefs.current[i] = el
              }}
              qid={qid}
              value={opt.value}
              label={opt.label}
              index={i}
              selected={selected === opt.value}
              tabbable={selectedIndex === -1 ? i === 0 : i === selectedIndex}
              onSelect={() => onSelect(opt.value)}
            />
          </m.div>
        ))}
      </div>
    </m.div>
  )
}
