import type { Metadata } from 'next'
import { Heebo, EB_Garamond } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { MotionProvider } from '@/components/MotionProvider'
import PageViewTracker from '@/components/PageViewTracker'
import '../globals.css'

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

export const metadata: Metadata = {
  title: 'טל רומן',
}

export default function HtmlPagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${ebGaramond.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-heebo">
        <MotionProvider>
          <PageViewTracker />
          {children}
        </MotionProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}
