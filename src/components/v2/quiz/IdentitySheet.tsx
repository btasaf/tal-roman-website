'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { m, AnimatePresence } from 'framer-motion'
import quizContent from '@/lib/quiz-content.json'
import { UI, WELCOME_VISUAL, spring, springSnappy } from './quiz-config'

type Props = {
  open: boolean
  onClose: () => void
  onChoice: (action: string) => void
}

/** "Another identity" note — a bottom sheet on mobile, a centered card on desktop. Focus-trapped, Esc closes. */
export default function IdentitySheet({ open, onClose, onChoice }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const firstBtnRef = useRef<HTMLButtonElement>(null)
  const { body, buttons } = quizContent.lgbtqModal

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const raf = requestAnimationFrame(() => firstBtnRef.current?.focus())
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const items = panelRef.current.querySelectorAll<HTMLElement>('button')
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey, true)
      document.body.style.overflow = prevOverflow
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <m.div
          key="identity"
          className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-[#2d1a0e]/50" onClick={onClose} />
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="identity-title"
            dir="rtl"
            className="relative max-h-[90svh] w-full overflow-y-auto rounded-t-[32px] bg-[#fff2d4] px-6 pb-[max(28px,env(safe-area-inset-bottom))] pt-6 shadow-2xl sm:max-w-[480px] sm:rounded-[32px] sm:p-8"
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 48 }}
            transition={spring}
          >
            <div aria-hidden className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#3d2814]/15 sm:hidden" />
            <button
              type="button"
              onClick={onClose}
              aria-label={UI.close}
              className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full text-[#5e5955] outline-none transition-colors hover:bg-[#3d2814]/[0.06] focus-visible:ring-2 focus-visible:ring-brand"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <m.div
              aria-hidden
              className="relative mx-auto h-[120px] w-[110px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: 0.1 }}
            >
              <Image src={WELCOME_VISUAL.src} alt="" fill unoptimized sizes="110px" className="object-contain" />
            </m.div>

            <h2 id="identity-title" className="mt-4 text-center text-[26px] font-extrabold tracking-[-0.03em] text-[#2d1a0e]">
              {body[0]}
            </h2>
            <div className="mt-4 space-y-3 text-[15.5px] leading-relaxed text-[#5e5955]">
              {body.slice(1).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3">
              {buttons.map((b, i) => (
                <m.button
                  key={b.action}
                  ref={i === 0 ? firstBtnRef : undefined}
                  type="button"
                  onClick={() => onChoice(b.action)}
                  whileTap={{ scale: 0.98 }}
                  transition={springSnappy}
                  className={`min-h-[56px] w-full rounded-2xl px-5 py-3 text-[16px] font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff2d4] ${
                    i === 0
                      ? 'bg-[#2d1a0e] text-[#fff2d4] hover:bg-[#3d2814]'
                      : 'bg-white/70 text-[#2d1a0e] ring-1 ring-[#3d2814]/10 hover:bg-white'
                  }`}
                >
                  {b.label}
                </m.button>
              ))}
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
