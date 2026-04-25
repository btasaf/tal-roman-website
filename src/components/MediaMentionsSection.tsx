'use client'

import { useRef, type CSSProperties } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/client'

interface MediaMention {
  title: string
  source: string
  mediaType?: string
  externalUrl: string
  excerpt?: string
  thumbnail?: object
  logo?: object
}

const sourceLabel: Record<string, string> = {
  ynet: 'ynet',
  mako: 'מאקו',
  walla: 'וואלה',
  channel12: 'ערוץ 12',
  sexapil: 'סקסאפיל',
  et: 'מגזין את',
  other: '',
}

const mediaTypeLabel: Record<string, string> = {
  article: 'לקריאה',
  video: 'לצפייה',
  podcast: 'להאזנה',
  interview: 'לצפייה',
}

const MAX_GRID = 15
const SEE_ALL_THRESHOLD = MAX_GRID

function GridCard({ item }: { item: MediaMention }) {
  const thumbUrl = item.thumbnail
    ? urlFor(item.thumbnail).width(400).height(260).url()
    : null
  const logoUrl = item.logo
    ? urlFor(item.logo).width(120).height(60).url()
    : null
  const ctaText = mediaTypeLabel[item.mediaType ?? ''] ?? 'לחצו כאן'

  return (
    <a
      href={item.externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="h-full flex flex-col overflow-hidden rounded-xl shadow-md bg-white border border-[#e6c060]/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:z-10"
      style={{ position: 'relative', transformOrigin: 'center center' }}
    >
      {/* Thumbnail — fills remaining height */}
      <div className="relative w-full flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {thumbUrl ? (
          <Image
            src={thumbUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="20vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#1a0f08] flex items-center justify-center">
            <span className="text-[#e6c060]/30 text-3xl">📰</span>
          </div>
        )}

        {/* Logo badge — top-left of image */}
        {logoUrl && (
          <div className="absolute top-1.5 left-1.5 bg-white/90 rounded px-1.5 py-1 shadow-sm">
            <Image
              src={logoUrl}
              alt={sourceLabel[item.source] ?? item.source}
              width={50}
              height={24}
              className="object-contain h-4 w-auto"
            />
          </div>
        )}
      </div>

      {/* Text + CTA — always visible */}
      <div className="flex-shrink-0 px-2.5 pt-2 pb-2 text-right">
        <p className="font-bold text-[#303030] text-[11px] leading-snug line-clamp-2 mb-1">
          {item.title}
        </p>
        {item.excerpt && (
          <p className="text-[#6b6b6b] text-[9px] leading-snug line-clamp-2 mb-1.5">
            {item.excerpt}
          </p>
        )}
        <span className="inline-block text-[9px] font-bold text-white bg-[#cd2c2c] px-2 py-0.5 rounded-full">
          {ctaText} ←
        </span>
      </div>
    </a>
  )
}

const GAP = 'clamp(5px, 0.7vw, 10px)'

const layerBase: CSSProperties = {
  gridColumn: '1 / -1',
  gridRow: '1 / -1',
  display: 'grid',
  gridTemplateColumns: 'subgrid',
  gridTemplateRows: 'subgrid',
}

const L1_CELLS = [
  { col: 1, row: 1, idx: 0 },
  { col: 5, row: 1, idx: 1 },
  { col: 1, row: 2, idx: 2 },
  { col: 5, row: 2, idx: 3 },
  { col: 1, row: 3, idx: 4 },
  { col: 5, row: 3, idx: 5 },
]
const L2_CELLS = [
  { col: 2, row: 1, idx: 0 },
  { col: 4, row: 1, idx: 1 },
  { col: 2, row: 2, idx: 2 },
  { col: 4, row: 2, idx: 3 },
  { col: 2, row: 3, idx: 4 },
  { col: 4, row: 3, idx: 5 },
]

export default function MediaMentionsSection({ mentions }: { mentions: MediaMention[] }) {
  if (!mentions?.length) return null

  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Inside the scaler: logos show first, then cross-fade to the actual card
  const logosOpacity = useTransform(scrollYProgress, [0.18, 0.42], [1, 0])
  const cardOpacity  = useTransform(scrollYProgress, [0.32, 0.48], [0, 1])

  // Scaler shrinks while logos are fading
  const scalerScale = useTransform(scrollYProgress, [0.1, 0.45], [5, 1])

  // Surrounding layers stagger in after logos are gone
  const l1Opacity = useTransform(scrollYProgress, [0.3,  0.55], [0, 1])
  const l1Scale   = useTransform(scrollYProgress, [0.25, 0.5],  [0, 1])

  const l2Opacity = useTransform(scrollYProgress, [0.35, 0.6],  [0, 1])
  const l2Scale   = useTransform(scrollYProgress, [0.3,  0.55], [0, 1])

  const l3Opacity = useTransform(scrollYProgress, [0.4,  0.65], [0, 1])
  const l3Scale   = useTransform(scrollYProgress, [0.35, 0.6],  [0, 1])

  const grid    = mentions.slice(0, MAX_GRID)
  const hasMore = mentions.length > SEE_ALL_THRESHOLD

  const scaler  = grid[0]  ?? null
  const l1Cards = grid.slice(1,  7)
  const l2Cards = grid.slice(7,  13)
  const l3Cards = grid.slice(13, 15)

  // Collect logos for the wall
  const allLogos = mentions
    .filter(item => item.logo)
    .map(item => ({
      url: urlFor(item.logo!).width(160).height(80).url(),
      label: sourceLabel[item.source] ?? item.source,
    }))

  // Grid sized to fit all 3 rows within the viewport
  const gridStyle: CSSProperties = {
    width: '1400px',
    maxWidth: 'calc(100% - 3rem)',
    height: 'calc(100vh - 80px)',
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: GAP,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }

  return (
    <>
      {/* Section heading */}
      <div className="bg-[#fff2d4] text-center pt-20 pb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#303030] mb-4">מהתקשורת</h2>
        <div className="w-16 h-1 bg-[#e6c060] mx-auto rounded-full" />
      </div>

      {/* Scroll-reveal section */}
      <section
        ref={sectionRef}
        style={{ minHeight: '220vh' }}
        className="relative bg-[#fff2d4]"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="relative w-full h-full">

            {/* ── Grid ─────────────────────────────────────── */}
            <div style={gridStyle}>

              {/* Layer 1 — cols 1 + 5 */}
              <m.div style={{ ...layerBase, opacity: l1Opacity, scale: l1Scale }}>
                {L1_CELLS.map(({ col, row, idx }) =>
                  l1Cards[idx] ? (
                    <div key={`l1-${idx}`} style={{ gridColumn: col, gridRow: row }}>
                      <GridCard item={l1Cards[idx]!} />
                    </div>
                  ) : null
                )}
              </m.div>

              {/* Layer 2 — cols 2 + 4 */}
              <m.div style={{ ...layerBase, opacity: l2Opacity, scale: l2Scale }}>
                {L2_CELLS.map(({ col, row, idx }) =>
                  l2Cards[idx] ? (
                    <div key={`l2-${idx}`} style={{ gridColumn: col, gridRow: row }}>
                      <GridCard item={l2Cards[idx]!} />
                    </div>
                  ) : null
                )}
              </m.div>

              {/* Layer 3 — col 3, rows 1 + 3 */}
              <m.div style={{ ...layerBase, opacity: l3Opacity, scale: l3Scale }}>
                {l3Cards[0] && (
                  <div style={{ gridColumn: 3, gridRow: 1 }}>
                    <GridCard item={l3Cards[0]} />
                  </div>
                )}
                {l3Cards[1] && (
                  <div style={{ gridColumn: 3, gridRow: 3 }}>
                    <GridCard item={l3Cards[1]} />
                  </div>
                )}
              </m.div>

              {/* Scaler — center cell. Its content cross-fades: logos → real card */}
              {scaler && (
                <m.div
                  style={{ gridArea: '2 / 3', scale: scalerScale, zIndex: 2, position: 'relative' }}
                >
                  {/* Logos face — visible while large, shrinks with the card */}
                  <m.div
                    style={{ opacity: logosOpacity }}
                    className="absolute inset-0 rounded-xl overflow-hidden bg-[#0d0804] flex flex-col items-center justify-center p-4 pointer-events-none"
                  >
                    <p className="text-[#e6c060] font-bold mb-3" style={{ fontSize: 14 }}>
                      בתקשורת
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {allLogos.map((logo, i) => (
                        <div key={i} className="bg-white/10 rounded-lg px-2 py-1.5">
                          <Image
                            src={logo.url}
                            alt={logo.label}
                            width={70}
                            height={35}
                            className="object-contain h-7 w-auto"
                          />
                        </div>
                      ))}
                    </div>
                  </m.div>

                  {/* Real card — fades in as logos fade out */}
                  <m.div style={{ opacity: cardOpacity }} className="absolute inset-0">
                    <GridCard item={scaler} />
                  </m.div>
                </m.div>
              )}

            </div>{/* end grid */}
          </div>
        </div>
      </section>

      {/* "See all" button — outside the section, never overlaps cards */}
      {hasMore && (
        <div className="bg-[#fff2d4] text-center py-10">
          <Link
            href="/media"
            className="inline-block border-2 border-[#cd2c2c] text-[#cd2c2c] font-semibold px-8 py-4 rounded-full hover:bg-[#cd2c2c] hover:text-white transition-colors"
          >
            לכל הכתבות
          </Link>
        </div>
      )}
    </>
  )
}
