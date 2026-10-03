'use client'

import MediaHero, { type ChapterLink } from './MediaHero'
import MediaLead from './MediaLead'
import MediaChapter from './MediaChapter'
import MediaClosing from './MediaClosing'
import { outletsOf, type MediaItem } from './media-data'

// /v2/media, an editorial press room: hero with counts per type -> the lead story as a front page ->
// three chapters (on screen, in print, on air) of press clippings -> closing invitation.
export default function MediaPageV2({ items, reelUrl }: { items: MediaItem[]; reelUrl: string }) {
  const lead = items.find((i) => i.image && i.kind !== 'podcast') ?? items[0]
  const rest = items.filter((i) => i !== lead)
  const videos = rest.filter((i) => i.kind === 'video')
  const articles = rest.filter((i) => i.kind === 'article')
  const podcasts = rest.filter((i) => i.kind === 'podcast')

  const chapters: ChapterLink[] = [
    { kind: 'video', label: 'וידאו', count: items.filter((i) => i.kind === 'video').length },
    { kind: 'article', label: 'כתבות', count: items.filter((i) => i.kind === 'article').length },
    { kind: 'podcast', label: 'פודקאסטים', count: items.filter((i) => i.kind === 'podcast').length },
  ]
  // Photos for the hero's scattered clippings: one per outlet, never the lead
  const scatter = rest.filter((i, n, arr) => i.image && !i.image.contain && arr.findIndex((x) => x.outlet === i.outlet && x.image) === n).slice(0, 3)

  if (!items.length) {
    return <MediaHero reelUrl={reelUrl} scatter={[]} chapters={chapters} />
  }

  return (
    <>
      <MediaHero reelUrl={reelUrl} scatter={scatter} chapters={chapters} />
      {lead && <MediaLead item={lead} />}
      <MediaChapter kind="video" number="01" title="על המסך" accent="המסך" word="מסך" items={videos} tone="gray" />
      <MediaChapter kind="article" number="02" title="בעיתונות" accent="בעיתונות" word="עיתון" items={articles} tone="paper" />
      <MediaChapter kind="podcast" number="03" title="באוזניים" accent="באוזניים" word="שמע" items={podcasts} tone="brown" />
      <MediaClosing outlets={outletsOf(items)} />
    </>
  )
}
