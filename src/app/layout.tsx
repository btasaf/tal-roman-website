import type { Metadata } from 'next'
import { Heebo, EB_Garamond } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { MotionProvider } from '@/components/MotionProvider'
import { fetchSiteSettings } from '@/lib/queries'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import WhatsAppFAB from '@/components/ui/WhatsAppFAB'
import ScrollProgressBar from '@/components/ui/ScrollProgressBar'
import GrainOverlay from '@/components/ui/GrainOverlay'
import MagicalRibbon from '@/components/ui/MagicalRibbon'
import PageViewTracker from '@/components/PageViewTracker'
import './globals.css'

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '700', '800'],
  variable: '--font-heebo',
  display: 'swap',
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-garamond',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSiteSettings().catch(() => null)
  return {
    title: { default: settings?.seoTitle ?? 'טל רומן — חינוך מיני ואינטימיות', template: '%s | טל רומן' },
    description: settings?.seoDescription ?? 'קורסים, סדנאות וליווי אישי בנושא מיניות ואינטימיות לזוגות ויחידים.',
    openGraph: { locale: 'he_IL', type: 'website' },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await fetchSiteSettings().catch(() => null)

  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${ebGaramond.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0d0804] font-heebo">
        <MotionProvider>
          <PageViewTracker />
          <ScrollProgressBar />
          <GrainOverlay />
          {/* <MagicalRibbon /> */}
          <Nav />
          <main className="flex-1 pt-20">{children}</main>
          <Footer settings={settings} />
          <WhatsAppFAB />
        </MotionProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}
