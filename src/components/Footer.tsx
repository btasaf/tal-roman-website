import Link from 'next/link'

interface FooterProps {
  settings: { phone?: string; whatsapp?: string; instagram?: string } | null
}

export default function Footer({ settings }: FooterProps) {
  const whatsapp = settings?.whatsapp?.replace(/\D/g, '')

  return (
    <footer className="bg-[#0d0804] text-white pt-14 pb-6 mt-auto border-t border-[#e6c060]/15">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <h3 className="text-[#e6c060] font-extrabold text-xl mb-3">טל רומן</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              חינוך מיני ואינטימיות לזוגות ויחידים. כי בריאות מינית היא בריאות.
            </p>
          </div>
          <div>
            <h4 className="text-white/80 font-semibold mb-4 text-sm uppercase tracking-widest">ניווט</h4>
            <nav className="flex flex-col gap-2.5 text-sm text-white/50">
              <Link href="/courses"  className="hover:text-[#e6c060] transition-colors">קורסים</Link>
              <Link href="/about"    className="hover:text-[#e6c060] transition-colors">אודות</Link>
              <Link href="/articles" className="hover:text-[#e6c060] transition-colors">מאמרים</Link>
              <Link href="/media"    className="hover:text-[#e6c060] transition-colors">תקשורת</Link>
              <Link href="/contact"  className="hover:text-[#e6c060] transition-colors">צור קשר</Link>
            </nav>
          </div>
          <div>
            <h4 className="text-white/80 font-semibold mb-4 text-sm uppercase tracking-widest">יצירת קשר</h4>
            <div className="flex flex-col gap-2.5 text-sm text-white/50">
              {settings?.phone && <span>{settings.phone}</span>}
              {whatsapp && (
                <a href={`https://wa.me/${whatsapp}`} className="hover:text-[#e6c060] transition-colors" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              )}
              {settings?.instagram && (
                <a href={settings.instagram} className="hover:text-[#e6c060] transition-colors" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-[#e6c060]/10 pt-6 text-center text-xs text-white/30">
          © {new Date().getFullYear()} טל רומן. כל הזכויות שמורות.
        </div>
      </div>
    </footer>
  )
}
