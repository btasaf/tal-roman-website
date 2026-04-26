'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants'
import SocialIconLink from '@/components/ui/SocialIconLink'

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-night/90 backdrop-blur-md border-b border-gold/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="טל רומן" width={38} height={38} className="rounded-full" priority />
          <span className="text-xl font-extrabold text-gold tracking-wide">טל רומן</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-white/80 hover:text-gold transition-colors text-sm font-medium"
            >
              {l.label}
            </Link>
          ))}

          {/* Social icons */}
          <div className="flex items-center gap-3 border-r border-gold/20 pr-5">
            {SOCIAL_LINKS.map((s) => (
              <SocialIconLink key={s.icon} href={s.href} label={s.label} icon={s.icon} size={18} />
            ))}
          </div>

          <Link
            href="/contact"
            className="bg-brand text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-brand-dark transition-colors shadow-md shadow-brand/20"
          >
            דברו איתי
          </Link>
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

          {/* Social icons row */}
          <div className="flex items-center gap-4 pt-1 border-t border-gold/10">
            {SOCIAL_LINKS.map((s) => (
              <SocialIconLink key={s.icon} href={s.href} label={s.label} icon={s.icon} size={22} />
            ))}
          </div>

          <Link
            href="/contact"
            className="bg-brand text-white font-bold px-5 py-3 rounded-full text-center hover:bg-brand-dark transition-colors"
            onClick={() => setOpen(false)}
          >
            דברו איתי
          </Link>
        </div>
      )}
    </header>
  )
}
