'use client'

import { useCrmTracking } from '@/hooks/useCrmTracking'
import { CONTACT_ID, CONTACT_LABEL, DEFAULT_BUY_LABEL } from './course-data'
import { ArrowIcon } from './ui'

// The course's call to action, same behaviour as the live page: the Sanity purchase/landing link in a new tab,
// tracked as `click_buy_course/<slug>`; without a link it jumps to the contact form instead.
export default function CourseCta({
  href,
  label,
  slug,
  tone = 'rose',
  size = 'lg',
  className = '',
  shortLabel,
  placement,
}: {
  href?: string
  label?: string
  slug: string
  tone?: 'rose' | 'gold'
  size?: 'lg' | 'sm'
  className?: string
  // shown instead of the label below `sm` (the docked bar on phones)
  shortLabel?: string
  // which button on the page (hero / story / offer / closing / dock), for course_cta_click
  placement?: string
}) {
  const { track } = useCrmTracking()
  const gold = tone === 'gold'
  const text = href ? label || DEFAULT_BUY_LABEL : CONTACT_LABEL
  const cls = `group inline-flex items-center justify-center gap-3 rounded-full font-bold text-center transition-[background-color,box-shadow,scale] duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 ${
    size === 'lg' ? 'text-base sm:text-lg px-7 sm:px-9 py-4 min-h-[60px]' : 'text-sm sm:text-base px-5 py-2.5 min-h-[44px] whitespace-nowrap'
  } ${
    gold
      ? 'bg-gold text-[#2d1a0e] hover:bg-cream shadow-xl shadow-black/25 focus-visible:ring-gold/40'
      : 'bg-brand text-white hover:bg-brand-dark shadow-xl shadow-brand/30 hover:shadow-brand/50 focus-visible:ring-brand/40'
  } ${className}`

  const content = (
    <>
      {shortLabel ? (
        <>
          <span className="sm:hidden">{shortLabel}</span>
          <span className="hidden sm:inline">{text}</span>
        </>
      ) : (
        <span className="text-balance">{text}</span>
      )}
      <ArrowIcon className="transition-transform duration-300 group-hover:-translate-x-1" />
    </>
  )

  if (!href) {
    return (
      <a href={`#${CONTACT_ID}`} data-track="course_cta_click" data-track-slug={slug} data-track-placement={placement} data-track-action="contact" className={cls}>
        {content}
      </a>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={() => track(`click_buy_course/${slug}`)} data-track="course_cta_click" data-track-slug={slug} data-track-placement={placement} data-track-action="buy" className={cls}>
      {content}
    </a>
  )
}
