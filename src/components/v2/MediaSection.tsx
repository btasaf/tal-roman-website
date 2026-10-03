'use client'

import { useLayoutEffect, useRef } from 'react'
import { m, useMotionValue, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/client'
import type { MediaMention } from '@/lib/types'
import { AngledCap } from './motion-kit'
import BackgroundReel from './BackgroundReel'
import { useHydratedReducedMotion } from './useHydratedReducedMotion'

// Background reel streams from Vimeo. Set it in Sanity (דף הבית → בתקשורת); this is the fallback until then.
const DEFAULT_REEL = 'https://vimeo.com/1232565131'
const VIDEO_POSTER = '/videos/authority-reel-poster.jpg'

// Vertical offsets for staggered layout
const yOffsets = [0, 50, -20, 30, -40]

interface Props {
  mediaMentions: MediaMention[]
  /** Vimeo URL (or direct video file URL) for the background reel */
  videoUrl?: string | null
}

export default function MediaSection({ mediaMentions, videoUrl }: Props) {
  const reduce = useHydratedReducedMotion()
  if (!mediaMentions || mediaMentions.length === 0) return null
  // Reduced motion: no pin and no scroll-driven travel - a plain section with a swipeable row
  return reduce ? <StaticMedia mediaMentions={mediaMentions} /> : <PinnedMedia mediaMentions={mediaMentions} videoUrl={videoUrl} />
}

function PinnedMedia({ mediaMentions, videoUrl }: Props) {
  const prefersReducedMotion = useHydratedReducedMotion() // matches the server HTML while hydrating
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end']
  })

  // From the moment the section peeks in at the bottom until it ends -
  // so the cards are already moving while the section slides over the hero
  const { scrollYProgress: travelProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end']
  })

  // Card travel is computed in px from the real layout, so the timing is the same on every screen width:
  // - when the section is fully in view, the first card is already ~30% of the way across
  // - the "view all" card lands centered at ~0.84, before the next section starts covering
  // - then they keep drifting slowly while it covers (they never stop)
  const rowRef = useRef<HTMLDivElement>(null)
  // screen: one viewport as a fraction of the travel (the reveal takes one screen of scroll after the pin)
  const geo = useMotionValue({ vw: 0, fullAt: 0.3, screen: 0.15, firstLeft: 0, lastLeft: 0, cardW: 340 })

  useLayoutEffect(() => {
    const measure = () => {
      const row = rowRef.current
      const section = sectionRef.current
      if (!row || !section || !row.firstElementChild || !row.lastElementChild) return
      const first = row.lastElementChild as HTMLElement // RTL: last in DOM is the first card on screen
      const last = row.firstElementChild as HTMLElement // "view all" ends the journey
      geo.set({
        vw: window.innerWidth,
        // fully revealed = pinned (one screen) + the reveal (one more screen)
        fullAt: (2 * window.innerHeight) / section.offsetHeight,
        screen: window.innerHeight / section.offsetHeight,
        firstLeft: row.offsetLeft + first.offsetLeft,
        lastLeft: row.offsetLeft + last.offsetLeft,
        cardW: first.offsetWidth,
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (rowRef.current) ro.observe(rowRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [geo])

  const LAND_AT = 0.84
  const cardsX = useTransform(() => {
    const g = geo.get()
    const t = travelProgress.get()
    // Two anchor points on one straight line
    const x1 = g.vw * 0.7 - g.cardW / 2 - g.firstLeft // first card centered 30% across, at fullAt
    const x2 = g.vw / 2 - g.cardW / 2 - g.lastLeft // "view all" centered, at LAND_AT
    if (t <= LAND_AT) return x1 + ((x2 - x1) * (t - g.fullAt)) / (LAND_AT - g.fullAt)
    // Slow drift while covered
    // Then keep sliding left (gently accelerating) until the whole row has left the screen
    const k = (t - LAND_AT) / (1 - LAND_AT)
    return x2 - g.vw * 0.95 * k * k * (3 - 2 * k)
  })

  // Card-stack hand-off: while the next section slides over (last screen of travel), this one recedes
  // (The old card-stack recede is off: the next section's cream now fades in over this one.)
  const stack = useMotionValue(0)
  const stackScale = useTransform(stack, [0, 1], [1, 0.92])
  const stackRadius = useTransform(stack, [0, 1], [0, 36])
  const stackShade = useTransform(stack, [0, 1], [0, 0.45])

  // Seam in: the section is already pinned in place (over the hero's last screen); an angled edge sweeps up
  // and reveals it. The angle softens as it rises. Nothing moves except the edge.
  const revealClip = useTransform(() => {
    const g = geo.get()
    const e = Math.min(1, Math.max(0, (travelProgress.get() - g.screen) / g.screen))
    if (e >= 1) return 'none'
    const A = 22 * (1 - 0.7 * e) // edge slope, in % of the screen height
    const right = 100 - e * (100 + A) // RTL: right side leads
    const left = right + A
    return `polygon(0% ${left.toFixed(2)}%, 100% ${right.toFixed(2)}%, 100% 100%, 0% 100%)`
  })

  // Lines move at 10% of card speed (subtle parallax)
  const linesX = useTransform(travelProgress, [0, 1], ['0vw', '-24vw'])

  // While the next section's question arrives: the video, lines, progress bar and hint fade away,
  // leaving the plain warm gray (the cards keep moving and exit on their own)
  const decorFade = useTransform(() => {
    const t = travelProgress.get()
    const x = Math.min(1, Math.max(0, (t - 0.86) / 0.1))
    return 1 - x * x * (3 - 2 * x)
  })


  return (
    <section
      ref={sectionRef}
      // -mt-[200vh]: starts a screen earlier than the hero's last screen, so it's already pinned in place
      // when the angled edge starts revealing it (+100vh height keeps the rest of the timing unchanged)
      className="relative h-[750vh] -mt-[200vh] z-10"
    >
      {/* Cream behind the card as it recedes (below the reveal stretch, so the hero stays visible during it) */}
      <div aria-hidden className="absolute inset-x-0 top-[200vh] bottom-0 -z-10 bg-cream" />

      {/* Sticky container - locks to viewport; recedes like a card when the next section stacks on top */}
      <m.div
        className="sticky top-0 h-screen overflow-hidden"
        style={prefersReducedMotion ? undefined : { scale: stackScale, borderRadius: stackRadius, clipPath: revealClip }}
      >
        <m.div aria-hidden className="absolute inset-0 z-20 bg-black pointer-events-none" style={{ opacity: prefersReducedMotion ? 0 : stackShade }} />

        {/* Dark section - fully visible as it covers the hero */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#5e5955] to-[#48443f]">
          {/* Background video loop: muted, grayscale and faint over warm gray so it reads as texture */}
          <m.div className="absolute inset-0" style={{ opacity: prefersReducedMotion ? 1 : decorFade }}>
            <BackgroundReel url={videoUrl || DEFAULT_REEL} poster={VIDEO_POSTER} />
          </m.div>

          {/* Moving vertical lines - at 10% card speed */}
          <m.div
            className="absolute inset-0 pointer-events-none"
            style={{ x: prefersReducedMotion ? 0 : linesX, opacity: prefersReducedMotion ? 1 : decorFade }}
          >
            {[10, 25, 40, 55, 70, 85, 100, 115, 130].map((pos) => (
              <div
                key={pos}
                className="absolute top-0 bottom-0 w-px bg-white/[0.04]"
                style={{ left: `${pos}%` }}
              />
            ))}
            {/* Horizontal hash mark */}
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/[0.03]" />
          </m.div>

          {/* The video carries the visual; keep the heading for screen readers */}
          <h2 className="sr-only">בתקשורת - ראיונות, כתבות והופעות</h2>

          {/* Horizontal cards row - lower position, much more gap for max 2-3 visible */}
          <m.div
            ref={rowRef}
            className="absolute top-[55%] flex items-center gap-16 md:gap-72"
            style={{
              x: prefersReducedMotion ? 0 : cardsX,
              y: '-50%',
            }}
          >
            {/* View All Button - at the END of scroll journey (left side) */}
            <ViewAllCard outlets={outletNames(mediaMentions)} />

            {mediaMentions.map((mention, i) => (
              <div
                key={mention.externalUrl}
                style={{ transform: `translateY(${yOffsets[i] || 0}px)` }}
              >
                <MediaCard mention={mention} index={i} />
              </div>
            ))}
          </m.div>

          {/* Progress bar */}
          <m.div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-0.5 bg-white/10 rounded-full overflow-hidden" style={{ opacity: prefersReducedMotion ? 1 : decorFade }}>
            <m.div
              className="h-full bg-gradient-to-r from-gold to-brand rounded-full"
              style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
            />
          </m.div>

          {/* Scroll hint */}
          <m.div
            className="absolute bottom-12 right-12 hidden md:flex items-center gap-2 text-cream/75 text-sm"
            animate={{ x: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ opacity: prefersReducedMotion ? 1 : decorFade }}
          >
            <span>המשיכו לגלול</span>
            <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </m.div>
        </div>
      </m.div>
    </section>
  )
}

// Source display names
const sourceNames: Record<string, string> = {
  ynet: 'ynet',
  mako: 'מאקו',
  walla: 'וואלה',
  channel12: 'ערוץ 12',
  sexapil: 'סקסאפיל',
  et: 'מגזין את',
  other: '',
}

// ─── Card appearance: press clipping ─────────────────────────────────────────
// Each card reads like a cut-out from the paper it appeared in: warm newsprint with a faint grain, the
// outlet as a serif masthead over a double rule, a framed photo in one shared warm tone, and a serif headline.
// The tilt the cards already have makes sense for paper clippings laid on a table.
// Only the inner surface is styled here; the element carrying the scroll movement / resting rotation is untouched.
const CARD_SIZE = 'w-[72vw] h-[96vw] sm:w-[300px] sm:h-[400px] md:w-[340px] md:h-[450px]'
const CARD_SURFACE =
  'bg-[#F4EDE1] rounded-[3px] shadow-[0_20px_44px_-14px_rgba(20,12,6,0.6),0_4px_10px_rgba(20,12,6,0.18)] transition-shadow duration-300 group-hover:shadow-[0_28px_56px_-14px_rgba(20,12,6,0.7),0_0_0_1px_rgba(168,90,84,0.45)] group-focus-visible:ring-2 group-focus-visible:ring-[#e6c060] group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-[#48443f]'
const INK = '#2d1a0e'

// Static paper: one tiny SVG grain tile (no animation) + a soft aged edge
const PAPER_GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.31  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

function Paper() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none shadow-[inset_0_0_48px_rgba(120,88,48,0.13)]"
      style={{ backgroundImage: PAPER_GRAIN, backgroundSize: '180px 180px' }}
    />
  )
}

// One static warm tone for every photo: unifies the very mixed CMS screenshots (red studio, purple podcast
// cover, orange skin) into the same print family, and keeps the sensual photos calm
const IMG_TONE = 'sepia-[.45] saturate-[.6] contrast-[1.05]'

const MEDIA_TYPE_LABEL: Record<string, string> = { video: 'וידאו', podcast: 'פודקאסט', article: 'כתבה' }
const ACTION_LABEL: Record<string, string> = { video: 'לצפייה', podcast: 'להאזנה', article: 'לקריאה' }

// Publication name: prefer the verified CMS logo alt text ("הלוגו של 102 FM" -> "102 FM"), then the source key
function publicationName(mention: MediaMention) {
  const fromAlt = mention.logoAlt?.replace(/^(ה?לוגו של)\s*/, '').trim()
  const tidy: Record<string, string> = { 'Y NET': 'ynet', MAKO: 'mako' }
  if (fromAlt && !/^(פודקאסט|CHECKLIST)$/i.test(fromAlt)) return tidy[fromAlt] ?? fromAlt
  return Object.hasOwn(sourceNames, mention.source) ? sourceNames[mention.source] : mention.source
}

// Per-image framing for the cards' photo (existing CMS screenshots). Keys are the asset ids.
// cx/cy = focal point and w = crop width, as fractions of the original image; the crop keeps the photo's
// ratio. 'contain' keeps artwork intact (podcast covers with people + titles).
type Framing =
  | { cx: number; cy: number; w: number }
  // area = the artwork inside the screenshot (l, t, w, h fractions), shown whole
  | { contain: true; bg: string; area: [number, number, number, number] }
const IMAGE_FRAMING: Record<string, Framing> = {
  // mako / N12 NEXT report - the video still of Tal (not the article header)
  'f11183e35c23620a13eaf0388546f7fa9e2881b8': { cx: 0.38, cy: 0.75, w: 0.62 },
  // 102FM podcast cover - keep whole
  '14070612b1530a475dddbc92ed3a6834e4d74502': { contain: true, bg: '#5d43a3', area: [0.1, 0.04, 0.765, 0.915] },
  // ynet "שניים לעונג" - the video still
  'ea0a2133cc7f47abba16aaa376a945491e7a4db2': { cx: 0.5, cy: 0.77, w: 0.5 },
  // mako article photo
  'f6e58089f28ac6c42b359176ab2f8c24fb2ae6ee': { cx: 0.5, cy: 0.665, w: 0.72 },
  // את magazine article photo
  '7f7eec2ec1291e214b6ac15827f8cd2a3cbb927f': { cx: 0.5, cy: 0.68, w: 0.68 },
}
const IMAGE_RATIO = 4 / 3 // the photo frame (292x225 on desktop, a little wider on small cards; object-cover absorbs it)

function cardImage(mention: MediaMention): { src: string; contain?: boolean; bg?: string } | null {
  const ref = (mention.thumbnail as { asset?: { _ref?: string } } | null)?.asset?._ref
  if (!ref) return null
  const m = ref.match(/^image-([a-f0-9]+)-(\d+)x(\d+)-/)
  const framing = m ? IMAGE_FRAMING[m[1]] : undefined
  if (m && framing && 'contain' in framing) {
    const W = +m[2], H = +m[3]
    const [l, t, w, h] = framing.area
    const src = urlFor(mention.thumbnail)
      .rect(Math.round(l * W), Math.round(t * H), Math.round(w * W), Math.round(h * H))
      .width(720)
      .url()
    return { src, contain: true, bg: framing.bg }
  }
  if (m && framing && !('contain' in framing)) {
    const W = +m[2], H = +m[3]
    const w = Math.round(framing.w * W)
    const h = Math.min(H, Math.round(w / IMAGE_RATIO))
    const left = Math.max(0, Math.min(W - w, Math.round(framing.cx * W - w / 2)))
    const top = Math.max(0, Math.min(H - h, Math.round(framing.cy * H - h / 2)))
    return { src: urlFor(mention.thumbnail).rect(left, top, w, h).width(720).height(Math.round(720 / IMAGE_RATIO)).url() }
  }
  return { src: urlFor(mention.thumbnail).width(720).height(Math.round(720 / IMAGE_RATIO)).url() }
}

function Arrow({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={`${className} rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

// Card component - links directly to external URL (the whole card is the link)
function MediaCard({
  mention,
  index,
}: {
  mention: MediaMention
  index: number
}) {
  const rotation = [2, -3, 4, -2, 3][index] || 0
  const img = cardImage(mention)
  const publication = publicationName(mention)
  const type = mention.mediaType && MEDIA_TYPE_LABEL[mention.mediaType] ? mention.mediaType : 'article'
  const excerpt = mention.excerpt?.trim()

  return (
    <a
      href={mention.externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-track="media_card_click"
      data-track-outlet={mention.source}
      data-track-type={type}
      data-track-position={index + 1}
      className="flex-none cursor-pointer group block focus-visible:outline-none"
    >
      <m.div className={`relative ${CARD_SIZE} overflow-hidden flex flex-col ${CARD_SURFACE}`} style={{ rotate: rotation }}>
        <Paper />
        <div className="relative flex-1 min-h-0 flex flex-col px-5 pt-4 pb-3.5 md:px-6 md:pt-5 md:pb-4 text-right" style={{ color: INK }}>
          {/* Masthead: the outlet, like the paper's nameplate */}
          <div className="flex items-end justify-between gap-3 pb-2 border-b-[3px] border-double border-[#2d1a0e]/75">
            <span className="font-frank font-bold text-[21px] sm:text-[22px] md:text-[25px] leading-none truncate">
              <bdi dir="auto">{publication}</bdi>
            </span>
            <span className="shrink-0 pb-0.5 text-[11px] font-medium tracking-[0.12em] text-[#7a6a5c]">{MEDIA_TYPE_LABEL[type]}</span>
          </div>

          {/* Photo: inset with a thin frame, one warm tone for all */}
          <div className={`relative mt-3 md:mt-3.5 h-[46%] md:h-[50%] shrink-0 overflow-hidden ${IMG_TONE}`} style={img?.bg ? { background: img.bg } : undefined}>
            {img ? (
              <Image
                src={img.src}
                alt={mention.title}
                fill
                className={img.contain ? 'object-contain' : 'object-cover'}
                sizes="(max-width: 640px) 72vw, 300px"
              />
            ) : (
              <div className="absolute inset-0 bg-[#e6dccb]" />
            )}
            <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-[#2d1a0e]/20" />
          </div>

          <h3 className="mt-3 md:mt-3.5 font-frank font-bold text-[19px] sm:text-[20px] md:text-[23px] leading-[1.18] line-clamp-2">{mention.title}</h3>
          {excerpt && <p className="mt-1.5 text-[13px] md:text-[13.5px] leading-[1.6] text-[#6e5f52] line-clamp-2">{excerpt}</p>}

          <div className="mt-auto pt-2.5 flex justify-end border-t border-[#2d1a0e]/15">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#a85a54]">
              {ACTION_LABEL[type]}
              <Arrow />
            </span>
          </div>
        </div>
      </m.div>
    </a>
  )
}

// "View all" card - ends the journey (and the static row): the same paper, set like a front page:
// "בתקשורת" nameplate, the headline, and the outlets she appeared in
function ViewAllCard({ outlets }: { outlets: string[] }) {
  const reduce = useReducedMotion()

  return (
    <Link href="/v2/media" data-track="media_view_all_click" className="flex-none group block focus-visible:outline-none">
      <m.div
        className={`relative ${CARD_SIZE} overflow-hidden flex flex-col ${CARD_SURFACE}`}
        style={{ rotate: reduce ? 0 : -2 }}
      >
        <Paper />
        <div className="relative flex-1 flex flex-col items-center text-center px-6 pt-5 pb-5 md:px-7 md:pt-6 md:pb-6" style={{ color: INK }}>
          <div className="w-full border-y-[3px] border-double border-[#2d1a0e]/75 py-2">
            <p className="font-frank font-bold text-[26px] md:text-[30px] leading-none">בתקשורת</p>
          </div>
          <p className="mt-1.5 text-[11px] font-medium tracking-[0.12em] text-[#7a6a5c]">ראיונות · כתבות · הופעות</p>

          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="font-frank font-bold text-[40px] md:text-[48px] leading-[1.02]">לכל<br />הכתבות</p>
            <span aria-hidden className="mt-5 block w-10 h-px bg-[#a85a54]" />
            {outlets.length > 0 && (
              <p className="mt-5 max-w-[16rem] text-[13px] leading-[1.9] text-[#6e5f52]">
                {outlets.map((o, i) => (
                  <span key={o}>
                    {i > 0 && <span aria-hidden className="mx-1.5 text-[#a85a54]/70">·</span>}
                    <bdi dir="auto" className="whitespace-nowrap">{o}</bdi>
                  </span>
                ))}
              </p>
            )}
          </div>

          <div className="w-full pt-3 flex justify-center border-t border-[#2d1a0e]/15">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#a85a54]">
              לכל ההופעות בתקשורת
              <Arrow />
            </span>
          </div>
        </div>
      </m.div>
    </Link>
  )
}

function outletNames(mentions: MediaMention[]) {
  return [...new Set(mentions.map(publicationName).filter(Boolean))]
}


// Reduced motion: same content, no pin, no scroll-linked travel; the cards scroll sideways by swipe / shift+wheel
function StaticMedia({ mediaMentions }: Props) {
  return (
    <section className="relative -mt-[100vh] z-10 bg-gradient-to-b from-[#5e5955] to-[#48443f] py-24 overflow-x-clip">
      <AngledCap color="#5e5955" height="min(22vh, 18vw)" rise="right" />
      {/* Poster only: no autoplaying video for reduced motion */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center grayscale opacity-10 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_25%)]"
        style={{ backgroundImage: `url(${VIDEO_POSTER})` }}
      />
      <h2 className="relative text-center font-garamond font-extrabold text-cream text-3xl md:text-5xl mb-12 px-6">בתקשורת</h2>
      <div className="relative overflow-x-auto snap-x snap-mandatory pb-6">
        <div className="flex gap-8 w-max px-6 md:px-12">
          {mediaMentions.map((mention, i) => (
            <div key={mention.externalUrl} className="snap-center py-4">
              <MediaCard mention={mention} index={i} />
            </div>
          ))}
          <div className="snap-center py-4">
            <ViewAllCard outlets={outletNames(mediaMentions)} />
          </div>
        </div>
      </div>
    </section>
  )
}
