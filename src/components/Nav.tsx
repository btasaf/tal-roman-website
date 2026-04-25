'use client'

import Link from 'next/link'
import { useState } from 'react'
import { NAV_LINKS } from '@/lib/constants'
import { cleanWhatsApp } from '@/lib/utils'
import type { SiteSettings } from '@/lib/types'

interface NavProps {
  settings: SiteSettings | null
}

export default function Nav({ settings }: NavProps) {
  const [open, setOpen] = useState(false)
  const whatsapp = cleanWhatsApp(settings?.whatsapp)

  return (
    <header className="sticky top-0 z-50 bg-night/90 backdrop-blur-md border-b border-gold/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold text-gold tracking-wide">
          טל רומן
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-white/80 hover:text-gold transition-colors text-sm font-medium"
            >
              {l.label}
            </Link>
          ))}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              className="bg-brand text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-brand-dark transition-colors shadow-md shadow-brand/20"
              target="_blank"
              rel="noopener noreferrer"
            >
              דברו איתי
            </a>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white/80 p-2"
          onClick={() => setOpen(!open)}
          aria-label="תפריט"
        >
          <span className="block w-5 h-0.5 bg-current mb-1.5" />
          <span className="block w-5 h-0.5 bg-current mb-1.5" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-night border-t border-gold/10 px-6 py-5 flex flex-col gap-5">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-white/80 hover:text-gold font-medium text-base transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              className="bg-brand text-white font-bold px-5 py-3 rounded-full text-center hover:bg-brand-dark transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              דברו איתי
            </a>
          )}
        </div>
      )}
    </header>
  )
}
