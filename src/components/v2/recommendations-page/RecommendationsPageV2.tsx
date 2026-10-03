'use client'

import { useMemo, useState } from 'react'
import { LazyMotion, domMax } from 'framer-motion'
import RecHero from './RecHero'
import RecFeatured from './RecFeatured'
import RecWall from './RecWall'
import RecLightbox from './RecLightbox'
import RecClosing from './RecClosing'
import type { RecFilter, RecItem, RecShot } from './rec-data'

// /v2/recommendations: hero -> one featured voice -> the filterable wall -> closing invitation.
// The lightbox steps through the messages of whatever the wall currently shows.
interface Props {
  items: RecItem[]
  filters: RecFilter[]
  featured: RecItem | null
  heroShots: RecShot[]
}

export default function RecommendationsPageV2({ items, filters, featured, heroShots }: Props) {
  const [active, setActive] = useState('')
  const [open, setOpen] = useState<{ id: string; all: boolean } | null>(null)

  const shown = useMemo(() => (active ? items.filter((t) => t.course === active) : items), [items, active])
  // The lightbox browses the wall as it is shown; the featured message (maybe filtered out) browses everything
  const browse = useMemo(() => (open?.all ? items : shown).filter((t) => t.shot), [items, shown, open?.all])
  const openFromWall = (id: string) => setOpen({ id, all: false })
  const openFeatured = (id: string) => setOpen({ id, all: !shown.some((t) => t.id === id) })

  return (
    // domMax: the filter's gliding pill uses a shared layoutId
    <LazyMotion features={domMax}>
      <RecHero count={items.length} shots={heroShots} />
      {featured && <RecFeatured item={featured} onOpen={openFeatured} />}
      <RecWall items={shown} filters={filters} active={active} onFilter={setActive} onOpen={openFromWall} />
      <RecClosing />
      <RecLightbox items={browse} openId={open?.id ?? null} onChange={(id) => setOpen((o) => (id && o ? { ...o, id } : null))} />
    </LazyMotion>
  )
}
