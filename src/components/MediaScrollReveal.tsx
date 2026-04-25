'use client'

import { useRef, type CSSProperties } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { urlFor } from '@/sanity/client'
import { SOURCE_LABELS } from '@/lib/constants'
import type { MediaMention } from '@/lib/types'

type MediaItem = Pick<MediaMention, 'title' | 'source' | 'mediaType' | 'externalUrl' | 'thumbnail' | 'logo'>

function GridCard({ item }: { item: MediaItem }) {
  const thumbUrl = item.thumbnail
    ? urlFor(item.thumbnail).width(400).height(500).url()
    : null

  return (
    <a
      href={item.externalUrl ?? '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full overflow-hidden rounded-xl shadow-lg"
      style={{ aspectRatio: '4/5' }}
    >
      {thumbUrl ? (
        <Image
          src={thumbUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 600px) 33vw, 20vw"
        />
      ) : (
        <div className="absolute inset-0 bg-[#1a0f08] flex items-center justify-center">
          <span className="text-[#e6c060]/30 text-5xl">📰</span>
        </div>
      )}

      {/* Source badge */}
      <span className="absolute top-2 right-2 bg-white/90 text-[#cd2c2c] text-xs font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
        {SOURCE_LABELS[item.source] ?? item.source}
      </span>

      {/* Title slides up on hover */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-white text-xs font-bold leading-snug line-clamp-3 text-right">
          {item.title}
        </p>
      </div>
    </a>
  )
}

const GAP = 'clamp(8px, 1.2vw, 16px)'

const layerBase: CSSProperties = {
  gridColumn: '1 / -1',
  gridRow: '1 / -1',
  display: 'grid',
  gridTemplateColumns: 'subgrid',
  gridTemplateRows: 'subgrid',
}

export default function MediaScrollReveal({ mentions }: { mentions: MediaItem[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Scaler: center card shrinks from ~5× to natural size
  const scalerScale = useTransform(scrollYProgress, [0.05, 0.45], [5, 1])

  // Layers reveal outward with staggered timing
  const l1Opacity = useTransform(scrollYProgress, [0.25, 0.5],  [0, 1])
  const l1Scale   = useTransform(scrollYProgress, [0.2,  0.45], [0, 1])

  const l2Opacity = useTransform(scrollYProgress, [0.3,  0.55], [0, 1])
  const l2Scale   = useTransform(scrollYProgress, [0.25, 0.5],  [0, 1])

  const l3Opacity = useTransform(scrollYProgress, [0.35, 0.6],  [0, 1])
  const l3Scale   = useTransform(scrollYProgress, [0.3,  0.55], [0, 1])

  // Grid positions:
  //   Scaler  → row 2, col 3  (center)
  //   Layer 1 → cols 1+5, all 3 rows  (6 slots, indices 1–6)
  //   Layer 2 → cols 2+4, all 3 rows  (6 slots, indices 7–12)
  //   Layer 3 → col 3, rows 1+3       (2 slots, indices 13–14)
  //   Overflow → indices 15+
  const scaler   = mentions[0]  ?? null
  const l1Cards  = mentions.slice(1,  7)
  const l2Cards  = mentions.slice(7,  13)
  const l3Cards  = mentions.slice(13, 15)
  const overflow = mentions.slice(15)

  // Build layer 1 cells: [col1 row1, col5 row1, col1 row2, col5 row2, col1 row3, col5 row3]
  const l1Cells = [
    { col: 1, row: 1, idx: 0 },
    { col: 5, row: 1, idx: 1 },
    { col: 1, row: 2, idx: 2 },
    { col: 5, row: 2, idx: 3 },
    { col: 1, row: 3, idx: 4 },
    { col: 5, row: 3, idx: 5 },
  ]

  // Build layer 2 cells: [col2 row1, col4 row1, col2 row2, col4 row2, col2 row3, col4 row3]
  const l2Cells = [
    { col: 2, row: 1, idx: 0 },
    { col: 4, row: 1, idx: 1 },
    { col: 2, row: 2, idx: 2 },
    { col: 4, row: 2, idx: 3 },
    { col: 2, row: 3, idx: 4 },
    { col: 4, row: 3, idx: 5 },
  ]

  return (
    <>
      <section ref={sectionRef} style={{ minHeight: '240vh' }} className="relative">
        {/* Sticky viewport — clips overflow from scaled-up scaler */}
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="relative w-full h-full">
            {/* 5-column × 3-row grid, absolutely centered */}
            <div
              style={{
                width: '1600px',
                maxWidth: 'calc(100% - 4rem)',
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gridTemplateRows: 'repeat(3, auto)',
                gap: GAP,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Layer 1 — outermost cols 1 + 5 */}
              <m.div style={{ ...layerBase, opacity: l1Opacity, scale: l1Scale }}>
                {l1Cells.map(({ col, row, idx }) =>
                  l1Cards[idx] ? (
                    <div key={`l1-${idx}`} style={{ gridColumn: col, gridRow: row }}>
                      <GridCard item={l1Cards[idx]!} />
                    </div>
                  ) : null
                )}
              </m.div>

              {/* Layer 2 — middle cols 2 + 4 */}
              <m.div style={{ ...layerBase, opacity: l2Opacity, scale: l2Scale }}>
                {l2Cells.map(({ col, row, idx }) =>
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

              {/* Scaler — center cell, starts viewport-filling and shrinks */}
              {scaler && (
                <m.div style={{ gridArea: '2 / 3', scale: scalerScale, zIndex: 2 }}>
                  <GridCard item={scaler} />
                </m.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Overflow cards in a regular grid below the effect */}
      {overflow.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {overflow.map((item, i) => (
              <GridCard key={i} item={item} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
