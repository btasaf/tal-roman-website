'use client'

import { usePathname } from 'next/navigation'

// The v2 pages render their own footer (src/app/v2/layout.tsx), so the site footer steps aside there.
// usePathname is available during SSR, so server and client agree (no hydration mismatch).
export default function SiteFooterGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/v2')) return null
  return <>{children}</>
}
