'use client'

import { useRef, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useCrmTracking } from '@/hooks/useCrmTracking'
import { LazyMotion, domMax, m, useMotionValueEvent, useScroll } from 'framer-motion'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import type { TocItem } from './article-content'

// The reading area. Nothing in the text moves: the only motion is a thin progress line at the top of the
// screen (scroll-linked, transform only) and the marker in the table of contents.
// Desktop: text column on the right, sticky table of contents on the left. Tablet/phone: a collapsible
// table of contents above the text.
export default function ArticleBody({ toc, minutes, children }: { toc: TocItem[]; minutes: number; children: ReactNode }) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | null>(null)
  const [left, setLeft] = useState(minutes)
  const { track } = useCrmTracking()
  const slug = usePathname().split('/').filter(Boolean).at(-1)
  // article_read_progress: 25 / 50 / 75 / 100% of the text, each once per page view
  const milestones = useRef(new Set<number>())

  // 0 when the text reaches the upper third of the screen, 1 when its end reaches the bottom
  const { scrollYProgress } = useScroll({ target: bodyRef, offset: ['start 0.35', 'end end'] })

  // Current section: the last heading that has passed the top quarter of the screen
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    let current: string | null = null
    for (let i = 0; i < toc.length; i++) {
      const el = document.getElementById(toc[i].id)
      if (el && el.getBoundingClientRect().top < window.innerHeight * 0.25) current = toc[i].id
      else break
    }
    setActive(current)
    setLeft(Math.max(0, Math.ceil(minutes * (1 - p))))
    for (const percent of [25, 50, 75, 100]) {
      if (p * 100 < percent - 0.5 || milestones.current.has(percent)) continue
      milestones.current.add(percent)
      track('article_read_progress', { slug, percent })
    }
  })

  return (
    <>
      <m.div
        aria-hidden
        className="fixed top-0 inset-x-0 z-[80] h-[3px] bg-brand origin-right pointer-events-none"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="relative max-w-[1180px] mx-auto px-6 md:px-10 lg:grid lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-16 xl:gap-24">
        {/* ~70 Hebrew characters per line at the body size */}
        <div ref={bodyRef} className="relative min-w-0 max-w-[44rem]">
          {toc.length > 2 && <MobileToc toc={toc} />}
          {children}
        </div>

        {toc.length > 2 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24 pt-1 max-h-[calc(100svh-7rem)] overflow-y-auto overscroll-contain pb-6 [scrollbar-width:thin]">
              <DesktopToc toc={toc} active={active} left={left} />
            </div>
          </aside>
        )}
      </div>
    </>
  )
}

function DesktopToc({ toc, active, left }: { toc: TocItem[]; active: string | null; left: number }) {
  const reduce = useHydratedReducedMotion()
  return (
    <nav aria-label="תוכן המאמר">
      <p className="text-xs font-black tracking-wide text-[#5e5955]">בתוך המאמר</p>
      <LazyMotion features={domMax}>
        <ol className="mt-4 border-r border-[#2d1a0e]/12">
          {toc.map((t) => {
            const on = t.id === active
            return (
              <li key={t.id} className="relative">
                {on && (
                  <m.span
                    layoutId="toc-marker"
                    aria-hidden
                    className="absolute -right-px inset-y-1 w-[2px] rounded-full bg-brand"
                    transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0, visualDuration: 0.35 }}
                  />
                )}
                <a
                  href={`#${t.id}`}
                  data-track="article_toc_click"
                  data-track-index={toc.indexOf(t) + 1}
                  data-track-placement="desktop"
                  aria-current={on ? 'location' : undefined}
                  className={`block pr-4 py-1.5 text-[0.86rem] leading-snug line-clamp-2 transition-colors duration-200 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
                    on ? 'text-[#2d1a0e] font-bold' : 'text-[#5e5955] hover:text-[#2d1a0e]'
                  }`}
                >
                  {t.text}
                </a>
              </li>
            )
          })}
        </ol>
      </LazyMotion>
      <p className="mt-4 pr-4 text-xs text-[#5e5955] tabular-nums" aria-live="off">
        {left > 0 ? `עוד כ-${left} דק׳ קריאה` : 'הגעת לסוף'}
      </p>
    </nav>
  )
}

// Native disclosure: works without JS; closes after a jump
function MobileToc({ toc }: { toc: TocItem[] }) {
  const ref = useRef<HTMLDetailsElement>(null)
  return (
    <details ref={ref} className="lg:hidden group/toc mb-10 rounded-[22px] bg-white/55 ring-1 ring-[#c97870]/20 open:bg-white/70">
      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden px-5 py-4 rounded-[22px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30">
        <span className="font-bold text-[#2d1a0e]">
          בתוך המאמר <span className="font-medium text-[#5e5955]">· {toc.length} חלקים</span>
        </span>
        <svg className="w-5 h-5 text-brand-dark transition-transform duration-300 group-open/toc:rotate-180 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <nav aria-label="תוכן המאמר">
        <ol className="px-5 pb-5 space-y-1 text-[0.95rem]">
          {toc.map((t, i) => (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                onClick={() => ref.current?.removeAttribute('open')}
                data-track="article_toc_click"
                data-track-index={i + 1}
                data-track-placement="mobile"
                className="flex gap-3 py-2.5 leading-snug text-[#48443f] hover:text-brand-dark rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                <span aria-hidden className="w-6 shrink-0 font-bold text-brand/70 tabular-nums">{i + 1}</span>
                <span className="min-w-0">{t.text}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  )
}
