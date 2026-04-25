'use client'

import Link from 'next/link'
import { useState } from 'react'

interface NavProps {
  settings: { phone?: string; whatsapp?: string } | null
}

const links = [
  { href: '/', label: 'בית' },
  { href: '/about', label: 'אודות' },
  { href: '/courses', label: 'קורסים' },
  { href: '/articles', label: 'מאמרים' },
  { href: '/media', label: 'תקשורת' },
  { href: '/contact', label: 'צור קשר' },
]

export default function Nav({ settings }: NavProps) {
  const [open, setOpen] = useState(false)
  const whatsapp = settings?.whatsapp?.replace(/\D/g, '')

  return (
    <header className="sticky top-0 z-50 bg-[#0d0804]/90 backdrop-blur-md border-b border-[#e6c060]/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold text-[#e6c060] tracking-wide">
          טל רומן
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-white/80 hover:text-[#e6c060] transition-colors text-sm font-medium"
            >
              {l.label}
            </Link>
          ))}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              className="bg-[#cd2c2c] text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-[#a82424] transition-colors shadow-md shadow-[#cd2c2c]/20"
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
        <div className="md:hidden bg-[#0d0804] border-t border-[#e6c060]/10 px-6 py-5 flex flex-col gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-white/80 hover:text-[#e6c060] font-medium text-base transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              className="bg-[#cd2c2c] text-white font-bold px-5 py-3 rounded-full text-center hover:bg-[#a82424] transition-colors"
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
