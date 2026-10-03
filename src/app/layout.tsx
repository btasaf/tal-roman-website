import type { Metadata } from 'next'
import { Heebo, EB_Garamond, Frank_Ruhl_Libre } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { MotionProvider } from '@/components/MotionProvider'
import { fetchSiteSettings } from '@/lib/queries'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SiteFooterGate from '@/components/SiteFooterGate'
import WhatsAppFAB from '@/components/ui/WhatsAppFAB'
import ScrollProgressBar from '@/components/ui/ScrollProgressBar'
import GrainOverlay from '@/components/ui/GrainOverlay'
import MagicalRibbon from '@/components/ui/MagicalRibbon'
import PageViewTracker from '@/components/PageViewTracker'
import AgentationWrapper from '@/components/AgentationWrapper'
import './globals.css'

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-heebo',
  display: 'swap',
})

// True Hebrew serif for display text (variable font, 300-900)
const frankRuhl = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  variable: '--font-frank',
  display: 'swap',
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-eb-garamond',
  // No generated Times-based fallback: it contains Hebrew glyphs and would win over Frank Ruhl Libre for Hebrew text
  adjustFontFallback: false,
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSiteSettings().catch(() => null)
  return {
    metadataBase: new URL('https://www.talroman.com'),
    title: { default: settings?.seoTitle ?? 'טל רומן — חינוך מיני ואינטימיות', template: '%s | טל רומן' },
    description: settings?.seoDescription ?? 'קורסים, סדנאות וליווי אישי בנושא מיניות ואינטימיות לזוגות ויחידים.',
    openGraph: {
      locale: 'he_IL',
      type: 'website',
      siteName: 'טל רומן',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', images: ['/og-image.jpg'] },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await fetchSiteSettings().catch(() => null)

  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${ebGaramond.variable} ${frankRuhl.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0d0804] font-heebo">
        <MotionProvider>
          <PageViewTracker />
          <ScrollProgressBar />
          <GrainOverlay />
          {/* <MagicalRibbon /> */}
          <Nav />
          <main className="flex-1 pt-20">{children}</main>
          <SiteFooterGate>
            <Footer settings={settings} />
          </SiteFooterGate>
          <WhatsAppFAB />
          <AgentationWrapper />
        </MotionProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}
