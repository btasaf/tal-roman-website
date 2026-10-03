'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import LogoMark from './LogoMark'
import V2Tracking from './V2Tracking'

// Presale pages run in focus mode: no menu and no footer, only the logo, so nothing pulls visitors away from the offer.
// usePathname is available during SSR, so server and client agree.

// Keyboard / screen-reader users: a "skip to content" link that only appears when focused with Tab
function SkipLink() {
  return (
    <a
      href="#content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-20 focus:z-[200] focus:rounded-full focus:bg-[#2d1a0e] focus:text-cream focus:px-5 focus:py-3 focus:font-bold focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-gold/60"
    >
      דילוג לתוכן
    </a>
  )
}
export default function V2Chrome({ header, footer, children }: { header: ReactNode; footer: ReactNode; children: ReactNode }) {
  const pathname = usePathname()
  const focus = pathname?.startsWith('/v2/presale') ?? false

  if (focus) {
    return (
      <>
        <SkipLink />
        <V2Tracking />
        <div className="absolute top-6 right-6 z-[90] pointer-events-none">
          <LogoMark className="h-11 md:h-12 text-[#C34832]" label="טל רומן" />
        </div>
        <div id="content" tabIndex={-1} className="flex-1 outline-none">{children}</div>
      </>
    )
  }

  return (
    <>
      <SkipLink />
      <V2Tracking />
      {header}
      <div id="content" tabIndex={-1} className="flex-1 outline-none">{children}</div>
      {footer}
    </>
  )
}
