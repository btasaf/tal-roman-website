import type { ReactNode } from 'react'
import Link from 'next/link'

// Small server-safe building blocks shared by the v2 articles pages

export const QUIZ_HREF = '/v2/quiz'

export function Kicker({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark'
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold ${dark ? 'bg-cream/10 text-gold' : 'bg-brand/10 text-brand-dark'}`}>
      <span aria-hidden className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-gold' : 'bg-brand'}`} />
      {children}
    </span>
  )
}

// RTL "forward" arrow (points left)
export function ArrowIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={`rotate-180 shrink-0 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

// "date · N minutes": dates come pre-formatted from the server
export function Meta({ date, minutes, className = '' }: { date?: string | null; minutes?: string | null; className?: string }) {
  if (!date && !minutes) return null
  return (
    <p className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 ${className}`}>
      {date && <span>{date}</span>}
      {date && minutes && <span aria-hidden className="w-1 h-1 rounded-full bg-current opacity-50" />}
      {minutes && <span>{minutes}</span>}
    </p>
  )
}

// The site's gift invitation (same wording as the other v2 pages): leads to the 3-question quiz
export function QuizButton({ tone = 'rose', className = '' }: { tone?: 'rose' | 'gold'; className?: string }) {
  const gold = tone === 'gold'
  return (
    <Link
      href={QUIZ_HREF}
      className={`group inline-flex items-center gap-3 rounded-full font-bold px-7 py-3 transition-[box-shadow,scale,background-color] duration-300 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 ${
        gold
          ? 'bg-gold text-[#2d1a0e] hover:bg-cream shadow-xl shadow-black/25 focus-visible:ring-gold/40'
          : 'bg-brand text-white shadow-xl shadow-brand/30 hover:shadow-brand/50 focus-visible:ring-brand/40'
      } ${className}`}
    >
      <span className="flex flex-col items-start leading-tight">
        <span className="text-lg">לקבלת הדרכה במתנה</span>
        <span className={`text-sm font-medium ${gold ? 'text-[#2d1a0e]/75' : 'text-white/85'}`}>3 שאלות קצרות</span>
      </span>
      <ArrowIcon className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
    </Link>
  )
}
