'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, m, type PanInfo } from 'framer-motion'
import { useCrmTracking } from '@/hooks/useCrmTracking'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import type { RecItem } from './rec-data'

// The original message, full size, in a native modal <dialog>: the page behind is inert, focus stays inside,
// Esc / the close button / a click on the backdrop close it, and focus returns to the thumbnail that opened it.
// Arrow keys (and a swipe on touch screens) step through the messages of the current filter.
interface Props {
  items: RecItem[] // messages with a screenshot, in wall order
  openId: string | null
  onChange: (id: string | null) => void
}

const spring = { type: 'spring', bounce: 0, visualDuration: 0.45 } as const
const SIZES = '(max-width: 768px) 90vw, 480px'

export default function RecLightbox({ items, openId, onChange }: Props) {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLDialogElement>(null)
  const returnTo = useRef<HTMLElement | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [dir, setDir] = useState(1)
  const { track } = useCrmTracking()

  const index = openId ? items.findIndex((t) => t.id === openId) : -1
  const item = index >= 0 ? items[index] : null
  const open = !!item

  // Open the dialog (and lock the page scroll) as soon as there is something to show
  useEffect(() => {
    const d = ref.current
    if (!d || !open || d.open) return
    returnTo.current = document.activeElement as HTMLElement | null
    d.showModal()
    closeRef.current?.focus()
    const html = document.documentElement
    const gap = window.innerWidth - html.clientWidth
    html.style.overflow = 'hidden'
    if (gap > 0) html.style.paddingRight = `${gap}px`
  }, [open])

  const finishClose = () => {
    ref.current?.close()
    const html = document.documentElement
    html.style.overflow = ''
    html.style.paddingRight = ''
    returnTo.current?.focus({ preventScroll: true })
  }

  // Safety net: never leave the page locked if this unmounts mid-way
  useEffect(() => () => {
    document.documentElement.style.overflow = ''
    document.documentElement.style.paddingRight = ''
  }, [])

  const step = (delta: number, via: 'button' | 'key' | 'swipe' = 'button') => {
    if (!items.length || index < 0) return
    setDir(delta)
    const next = (index + delta + items.length) % items.length
    track('rec_lightbox_nav', { direction: delta > 0 ? 'next' : 'prev', index: next + 1, via })
    onChange(items[next].id)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    // RTL: the next message is to the left
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(1, 'key') }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(-1, 'key') }
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -400) step(1, 'swipe')
    else if (info.offset.x > 70 || info.velocity.x > 400) step(-1, 'swipe')
  }

  const labelId = 'lightbox-title'

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelId}
      onCancel={(e) => { e.preventDefault(); onChange(null) }}
      onKeyDown={onKeyDown}
      className="fixed inset-0 m-0 p-0 w-full h-full max-w-none max-h-none bg-transparent backdrop:bg-transparent overflow-hidden text-right"
    >
      <AnimatePresence onExitComplete={finishClose}>
        {item && (
          <m.div
            key="lightbox"
            className="absolute inset-0 flex items-center justify-center p-3 sm:p-6"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: reduce ? { duration: 0 } : { duration: 0.22 } }}
            transition={reduce ? { duration: 0 } : { duration: 0.25 }}
          >
            {/* Backdrop */}
            <div aria-hidden className="absolute inset-0 bg-[#1b0e08]/85 backdrop-blur-sm" onClick={() => onChange(null)} />

            <m.div
              className="relative w-full max-w-5xl max-h-full overflow-y-auto rounded-[28px] bg-cream shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
              initial={reduce ? false : { opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 10, transition: { duration: 0.2 } }}
              transition={reduce ? { duration: 0 } : spring}
            >
              <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
                {/* The screenshot */}
                <div className="relative bg-[#efe3cd] overflow-hidden flex items-center justify-center px-6 pt-16 pb-6 md:p-8 min-h-[44vh] md:min-h-[78vh]">
                  <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                    <m.div
                      key={item.id}
                      custom={dir}
                      className="relative touch-pan-y"
                      variants={{
                        enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : -d * 56 }),
                        center: { opacity: 1, x: 0 },
                        exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 56 }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={reduce ? { duration: 0 } : spring}
                      drag={items.length > 1 && !reduce ? 'x' : false}
                      dragSnapToOrigin
                      dragElastic={0.2}
                      onDragEnd={onDragEnd}
                    >
                      {item.shot && (
                        <Image
                          src={item.shot.src}
                          alt={`צילום ההודעה המקורית של ${item.name}`}
                          width={item.shot.w}
                          height={item.shot.h}
                          sizes={SIZES}
                          loading="eager"
                          draggable={false}
                          className="block w-auto h-auto max-w-full max-h-[52vh] md:max-h-[70vh] rounded-[18px] shadow-[0_20px_50px_-20px_rgba(61,40,20,0.5)] select-none"
                        />
                      )}
                    </m.div>
                  </AnimatePresence>
                  {/* Warm the neighbours, so stepping through never waits for an image */}
                  <div aria-hidden className="hidden">
                    {[items[(index + 1) % items.length], items[(index - 1 + items.length) % items.length]].map((n) =>
                      n?.shot && n.id !== item.id ? <Image key={n.id} src={n.shot.src} alt="" width={n.shot.w} height={n.shot.h} sizes={SIZES} loading="eager" /> : null
                    )}
                  </div>
                </div>

                {/* The words, who wrote them, and the controls */}
                <div className="flex flex-col p-6 sm:p-8 md:p-10">
                  <p className="text-sm font-bold text-[#8a7d72]" aria-live="polite">
                    {index + 1} / {items.length}
                  </p>
                  <h2 id={labelId} className="mt-3 font-sans font-black tracking-[-0.01em] text-2xl md:text-3xl text-[#2d1a0e]">
                    ההודעה המקורית של {item.name}
                  </h2>
                  {item.course && <p className="mt-1 text-[#6f5546] font-medium">{item.course}</p>}
                  <blockquote className="mt-6 relative pr-5 border-r-2 border-brand/40">
                    <p className="text-[#3d2814] text-lg md:text-xl leading-relaxed whitespace-pre-line">{item.body}</p>
                  </blockquote>

                  {items.length > 1 && (
                    <div className="mt-auto pt-10 flex items-center justify-between gap-3">
                      <button type="button" onClick={() => step(-1)} className={NAV_BTN}>
                        <Chevron dir="right" />
                        הקודמת
                      </button>
                      <button type="button" onClick={() => step(1)} className={NAV_BTN}>
                        הבאה
                        <Chevron dir="left" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                ref={closeRef}
                type="button"
                onClick={() => onChange(null)}
                aria-label="סגירה"
                className="absolute top-3 left-3 md:top-4 md:left-4 w-11 h-11 rounded-full bg-white/90 text-[#2d1a0e] shadow flex items-center justify-center hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </dialog>
  )
}

const NAV_BTN =
  'inline-flex items-center gap-2 rounded-full border-2 border-[#2d1a0e]/15 px-5 py-2.5 font-bold text-[#2d1a0e] hover:border-[#2d1a0e]/40 hover:bg-white/60 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40'

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg className={`w-4 h-4 ${dir === 'right' ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}
