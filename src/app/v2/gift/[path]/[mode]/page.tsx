import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import GiftResultV2 from '@/components/v2/gift/GiftResultV2'
import { VALID_MODES, VALID_PATHS, getGiftData, isMode, isPath } from '@/components/v2/gift/gift-copy'

type Params = Promise<{ path: string; mode: string }>

// Every quiz outcome (5 paths × 2 modes) is prebuilt; anything else is a 404
export const dynamicParams = false
export function generateStaticParams() {
  return VALID_PATHS.flatMap((path) => VALID_MODES.map((mode) => ({ path, mode })))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { path, mode } = await params
  if (!isPath(path) || !isMode(mode)) return {}
  const data = getGiftData(path, mode)
  return {
    title: { absolute: `${data.gift.title} | טל רומן` },
    description: data.playerCaption,
    // A personal result page: keep it out of search
    robots: { index: false, follow: false },
  }
}

export default async function GiftV2Page({ params }: { params: Params }) {
  const { path, mode } = await params
  if (!isPath(path) || !isMode(mode)) notFound()

  return (
    <>
      {/* Same overrides as the other v2 pages: no root top padding, no WhatsApp FAB */}
      <style>{`
        main.pt-20 { padding-top: 0 !important; }
        .fixed.bottom-6.left-6 { display: none !important; }
      `}</style>
      <GiftResultV2 data={getGiftData(path, mode)} />
    </>
  )
}
