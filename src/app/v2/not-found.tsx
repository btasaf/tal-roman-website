import type { Metadata } from 'next'
import NotFoundV2 from '@/components/v2/not-found/NotFoundV2'

export const metadata: Metadata = {
  title: { absolute: 'הדף לא נמצא — טל רומן' },
  robots: { index: false },
}

// Shown for notFound() anywhere under /v2 and, via [...missing], for unknown /v2 URLs (root not-found.tsx keeps the rest)
export default function V2NotFound() {
  return (
    <>
      {/* Same overrides as the other v2 pages: no root top padding, no WhatsApp FAB */}
      <style>{`
        main.pt-20 { padding-top: 0 !important; }
        .fixed.bottom-6.left-6 { display: none !important; }
      `}</style>
      <NotFoundV2 />
    </>
  )
}
