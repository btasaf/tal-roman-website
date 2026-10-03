'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { animate, m, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { getImageUrl } from '@/lib/image-utils'
import { SectionTitle } from './motion-kit'
import { LogoMarquee } from './media-logos'
import { useHydratedReducedMotion } from './useHydratedReducedMotion'
import { ABOUT_WINDOW_VH } from './seam-config'
import { followerList, type SiteStats } from './site-stats'
import SocialIcon from './SocialIcon'
import { AuroraBackground, GrainOverlay } from './backgrounds'

const TOP_COLOR = '#5e5955'
const BOTTOM_COLOR = '#48443f'
const FALLBACK_IMAGE = '/wix-assets/images/tal-photos/IMG_4913_2048px_.JPG'
const CHAPTER_VH = 85 // scroll per chapter while the section stays pinned on one screen
// Last stretch: the portrait frame becomes a hole that opens onto the contact section, which sits behind this
// section's last screen and rises into place through it. Must equal the contact section's overlap (-mt-[100vh]).
const TAIL_VH = ABOUT_WINDOW_VH
const STAGE_1 = 0.4 // share of the tail spent staging (text out, portrait to centre) before the window opens
const FOCUS_SCALE = 1.08 // portrait scale once centred
const VIGNETTE = 0.5 // darkness of the vignette around the centred portrait
const GHOST_FADE = 0.4 // share of stage 2 over which the photo inside the window dissolves

// Explicit rest pose for reduced motion (undefined would leave whatever the motion values last wrote)
const STILL = { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const sineInOut = (v: number) => (1 - Math.cos(Math.PI * v)) / 2
const cubicInOut = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2)

// Community reach (Facebook + WhatsApp groups) and follower counts come from Sanity; empty follower counts are hidden.

interface Props {
  aboutImage: object | null
  aboutBio: string
  aboutQuote: string
  stats?: SiteStats
}

// Bio arrives as loose lines from the CMS: lead line, belief, body, then a "רקע והכשרות" label
function parseBio(bio: string) {
  const lines = bio
    .split('\n')
    .map((l) => l.replace(/​/g, '').replace(/^[.\s]+|[\s]+$/g, '').trim())
    .filter(Boolean)
  const cut = lines.findIndex((l) => l.includes('רקע והכשרות'))
  const content = cut === -1 ? lines : lines.slice(0, cut)
  return {
    lead: content[0] ?? '',
    belief: content.slice(1, 3).join(' '),
    body: content.slice(3),
  }
}

// Credentials arrive as one run-on string; split into sentences (also where a number runs into the next word)
function parseCredentials(quote: string) {
  return quote
    .replace(/[“”"]/g, (c) => (c === '"' ? '"' : ''))
    .split(/\.\s*|(?<=\d)(?=[֐-׿])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3)
}

// Strongest credentials lead (and get a little more weight): therapy training, the ynet video blog, TV
const KEY_CREDENTIALS = [/פסיכותרפיה|האקומי|הקומי/, /שניים לעונג/, /טל[וי]+זיה|כאן 11|ערוץ 12/]
const credentialRank = (c: string) => {
  const i = KEY_CREDENTIALS.findIndex((re) => re.test(c))
  return i === -1 ? KEY_CREDENTIALS.length : i
}
function orderCredentials(list: string[]) {
  return list
    .map((c, i) => ({ c, i, r: credentialRank(c) }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map(({ c, r }) => ({ text: c, key: r < KEY_CREDENTIALS.length }))
}

export default function AboutV2({ aboutImage, aboutBio, aboutQuote, stats }: Props) {
  // Numbers come from Sanity (site settings); defaults in site-stats.ts
  const community = stats?.community ?? 22000
  const followers = followerList(stats)
  const years = stats?.years ?? 10
  const reduce = useHydratedReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const imageUrl = getImageUrl(aboutImage, 'about') ?? FALLBACK_IMAGE
  const { lead, belief } = parseBio(aboutBio)
  const credentials = orderCredentials(parseCredentials(aboutQuote))

  const chapters = 3

  // Pinned stretch = chapters, then a tail where the portrait opens into the contact section.
  // progress: 0 -> 1 across the chapters (holds at 1); tail: 0 -> 1 across the tail. Function form = per frame.
  const chapterSpan = (chapters * CHAPTER_VH) / (chapters * CHAPTER_VH + TAIL_VH)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const progress = useTransform(() => Math.min(1, scrollYProgress.get() / chapterSpan))
  const tail = useTransform(() => Math.min(1, Math.max(0, (scrollYProgress.get() - chapterSpan) / (1 - chapterSpan))))

  // Which chapter is active (drives the count-up and the progress dots)
  const [active, setActive] = useState(0)
  useMotionValueEvent(progress, 'change', (p) => setActive(Math.min(chapters - 1, Math.floor(p * chapters))))

  // Portrait: settles in as the section arrives, then shifts gently between chapters
  const { scrollYProgress: enterRaw } = useScroll({ target: sectionRef, offset: ['start end', 'start start'] })
  const enter = useTransform(() => enterRaw.get())
  // Rounded top shoulders while the section rises over the testimonials (no hard straight edge); flat once it pins
  const shoulder = useTransform(() => `${Math.round(56 * Math.min(1, (1 - enterRaw.get()) * 4))}px`)
  const innerY = useTransform(progress, [0, 1], ['-6%', '6%'])

  // ---- Seam out: two stages across the tail ----
  // Stage 1 (staging, t 0 -> STAGE_1): text drifts up and fades, the portrait glides to the centre of the screen
  // and grows a little, a vignette darkens the room around her.
  // Stage 2 (opening, t STAGE_1 -> 1): the centred portrait frame becomes a hole in this pinned layer that grows
  // past the screen edges, opening onto the real contact section pinned behind it. A copy of the photo sits in
  // the hole at first and dissolves into the contact section.
  const reduceMv = useMotionValue(false)
  useEffect(() => reduceMv.set(reduce), [reduce, reduceMv])
  // Plain readers of the source values (not chained motion values, so nothing reads a value a frame stale)
  const stage1 = { get: () => (reduceMv.get() ? 0 : sineInOut(clamp01(tail.get() / STAGE_1))) }
  const stage2 = { get: () => clamp01((tail.get() - STAGE_1) / (1 - STAGE_1)) }

  // Chapter tilt/scale blends into a straight, full-size pose while the portrait travels
  const photoRotate = useTransform(
    () => (-5 * (1 - enter.get()) + 2 * Math.sin(progress.get() * Math.PI)) * (1 - stage1.get()),
  )
  const photoScale = useTransform(() => {
    const s = 0.9 + 0.1 * enter.get() - 0.04 * progress.get()
    return s + (1 - s) * stage1.get()
  })
  const goldOpacity = useTransform(() => 1 - stage1.get())
  const vignetteOpacity = useTransform(() => VIGNETTE * stage1.get())
  const textFade = { get: () => (reduceMv.get() ? 0 : sineInOut(clamp01(tail.get() / (STAGE_1 * 0.75)))) }
  const textOpacity = useTransform(() => 1 - textFade.get())
  const textY = useTransform(() => -60 * textFade.get())

  // Geometry, measured from untransformed boxes: the pinned screen and the portrait's anchor (= frame's layout box)
  const stickyRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const geo = useMotionValue<{ w: number; h: number; ax: number; ay: number; aw: number; ah: number; r: number } | null>(null)
  const measure = () => {
    const box = stickyRef.current?.getBoundingClientRect()
    const a = anchorRef.current?.getBoundingClientRect()
    if (!box || !a || !a.width) return
    geo.set({
      w: box.width,
      h: box.height,
      ax: a.left - box.left,
      ay: a.top - box.top,
      aw: a.width,
      ah: a.height,
      r: (frameRef.current && parseFloat(getComputedStyle(frameRef.current).borderTopLeftRadius)) || 44,
    })
  }
  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Portrait travel: from its place to the screen centre, scale 1 -> FOCUS_SCALE
  const travelX = useTransform(() => {
    const g = geo.get()
    return g ? (g.w / 2 - (g.ax + g.aw / 2)) * stage1.get() : 0
  })
  const travelY = useTransform(() => {
    const g = geo.get()
    return g ? (g.h / 2 - (g.ay + g.ah / 2)) * stage1.get() : 0
  })
  const travelScale = useTransform(() => 1 + (FOCUS_SCALE - 1) * stage1.get())

  // Re-measure the moment the tail begins (however fast we got there). The anchor carries no transforms, so the
  // reading is the same whatever pose the portrait is in. Hide the text and, at the end, the whole layer from
  // pointer/keyboard/AT.
  const prevTail = useRef(0)
  const [textGone, setTextGone] = useState(false)
  const [holeDone, setHoleDone] = useState(false)
  useMotionValueEvent(tail, 'change', (t) => {
    if (t > 0 && (prevTail.current <= 0 || !geo.get())) measure()
    prevTail.current = t
    setTextGone(textFade.get() > 0.6)
    setHoleDone(t >= 0.985)
  })

  // The window rect: starts exactly on the centred, scaled frame (end of stage 1), grows past the screen edges
  const windowRect = { get: () => {
    const g = geo.get()
    const s2 = stage2.get()
    if (!g || s2 <= 0) return null
    const reduced = reduceMv.get()
    const k = reduced ? 1 : FOCUS_SCALE
    const sw = g.aw * k
    const sh = g.ah * k
    const sx = reduced ? g.ax : g.w / 2 - sw / 2
    const sy = reduced ? g.ay : g.h / 2 - sh / 2
    const e = cubicInOut(s2)
    // Aim well past the edges: the eased approach then crosses them early instead of leaving a thin strip of
    // this layer creeping out at the sides
    const pad = 48
    const w = sw + (g.w + pad * 2 - sw) * e
    const h = sh + (g.h + pad * 2 - sh) * e
    const x = sx + (-pad - sx) * e
    const y = sy + (-pad - sy) * e
    const r = Math.min(g.r * k * (1 - e), w / 2, h / 2)
    return { x, y, w, h, r }
  } }

  // Screen with a rounded-rect hole (evenodd)
  const holeClip = useTransform(() => {
    const g = geo.get()
    const t = tail.get()
    const win = windowRect.get()
    // Fully open: hide the layer completely so no sub-pixel edge of it can remain on screen
    if (g && t >= 0.985) return 'inset(0 0 100% 0)'
    if (!g || !win) return 'none'
    const { x, y, w, h, r } = win
    const n = (v: number) => v.toFixed(2)
    const hole =
      `M${n(x + r)},${n(y)} H${n(x + w - r)} A${n(r)},${n(r)} 0 0 1 ${n(x + w)},${n(y + r)} V${n(y + h - r)} ` +
      `A${n(r)},${n(r)} 0 0 1 ${n(x + w - r)},${n(y + h)} H${n(x + r)} A${n(r)},${n(r)} 0 0 1 ${n(x)},${n(y + h - r)} ` +
      `V${n(y + r)} A${n(r)},${n(r)} 0 0 1 ${n(x + r)},${n(y)} Z`
    return `path(evenodd, "M0,0 H${n(g.w)} V${n(g.h)} H0 Z ${hole}")`
  })

  // Photo copy inside the window: identical to the frame at the hand-off, then zooms with the window (covering
  // it, centred) while it dissolves. Clipped 1px outside the hole so the hole's anti-aliased edge never shows.
  const ghostAlpha = () => {
    const s2 = stage2.get()
    return s2 <= 0 ? 0 : 1 - sineInOut(clamp01((s2 - 0.04) / (GHOST_FADE - 0.04)))
  }
  const ghostOpacity = useTransform(ghostAlpha)
  const ghostClip = useTransform(() => {
    const g = geo.get()
    const win = windowRect.get()
    if (!g || !win) return 'inset(50%)'
    const o = 1
    const n = (v: number) => v.toFixed(2)
    return `inset(${n(win.y - o)}px ${n(g.w - win.x - win.w - o)}px ${n(g.h - win.y - win.h - o)}px ${n(win.x - o)}px round ${n(win.r + o)}px)`
  })
  const ghostLeft = useTransform(() => {
    const g = geo.get()
    return g ? g.w / 2 - g.aw / 2 : 0
  })
  const ghostTop = useTransform(() => {
    const g = geo.get()
    return g ? g.h / 2 - g.ah / 2 : 0
  })
  const ghostW = useTransform(() => geo.get()?.aw ?? 0)
  const ghostH = useTransform(() => geo.get()?.ah ?? 0)
  const ghostScale = useTransform(() => {
    const g = geo.get()
    const win = windowRect.get()
    if (!g || !win) return FOCUS_SCALE
    return Math.max(win.w / g.aw, win.h / g.ah)
  })
  const ghostVisibility = useTransform(() => (ghostAlpha() > 0 ? 'visible' : 'hidden'))

  return (
    <div className="relative z-[65]">
      <m.section
        ref={sectionRef}
        id="about"
        className="relative text-cream"
        style={{
          height: `${chapters * CHAPTER_VH + TAIL_VH + 100}svh`,
        }}
      >
        <div ref={stickyRef} inert={holeDone} className="sticky top-0 h-svh overflow-hidden pointer-events-none">
        <m.div
          className="absolute inset-0 flex items-center pointer-events-auto overflow-hidden"
          style={{ background: `linear-gradient(to bottom, ${TOP_COLOR}, ${BOTTOM_COLOR})`, clipPath: holeClip, borderTopLeftRadius: shoulder, borderTopRightRadius: shoulder }}
        >
          <AuroraBackground palette="gray" />
          <GrainOverlay opacity={0.2} blend="soft-light" />
          {/* Vignette that focuses the room on the centred portrait (stage 1) */}
          {!reduce && (
            <m.div
              aria-hidden
              className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_75%_70%_at_50%_50%,transparent_30%,#14100c_100%)]"
              style={{ opacity: vignetteOpacity }}
            />
          )}
          <div className="relative w-full max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] gap-8 md:gap-12 lg:gap-20 items-center">
            {/* Text column (right, RTL): title stays, chapters swap underneath */}
            <m.div className="order-2 lg:order-1" inert={textGone} style={reduce ? STILL : { opacity: textOpacity, y: textY }}>
              <SectionTitle kicker="נעים להכיר" title="טל רומן" accent="רומן" tone="dark" align="start" className="mb-6 md:mb-10" />

              <div className="relative h-[46svh] md:h-[min(48vh,440px)]">
                <Chapter index={0} count={chapters} progress={progress}>
                  {lead && <p className="text-cream text-lg md:text-2xl leading-relaxed mb-6 md:mb-8">{lead}</p>}
                  {belief && (
                    <blockquote className="font-garamond text-xl md:text-[2rem] leading-snug text-cream/95">
                      <span className="[box-decoration-break:clone] [-webkit-box-decoration-break:clone] bg-[linear-gradient(transparent_65%,rgba(230,192,96,0.35)_65%)]">
                        {belief}
                      </span>
                    </blockquote>
                  )}
                </Chapter>

                <Chapter index={1} count={chapters} progress={progress}>
                  <div className={`grid gap-x-6 gap-y-6 md:gap-y-8 grid-cols-2 lg:grid-cols-3`}>
                    <div>
                      <p className="font-sans font-black tracking-[-0.01em] text-gold text-4xl md:text-6xl leading-none">
                        <CountUp to={years} suffix="+" start={active >= 1} />
                      </p>
                      <p className="mt-2 text-sm md:text-base text-cream/90">שנות ניסיון בליווי</p>
                    </div>
                    <div>
                      <p className="font-sans font-black tracking-[-0.01em] text-gold text-4xl md:text-6xl leading-none">אלפי</p>
                      <p className="mt-2 text-sm md:text-base text-cream/90">אנשים וזוגות בארץ ובחו״ל</p>
                    </div>
                    <div>
                      <p className="font-sans font-black tracking-[-0.01em] text-gold text-4xl md:text-6xl leading-none">
                        <CountUp to={community} suffix="+" start={active >= 1} />
                      </p>
                      <Link href="/v2/communities" data-track="home_about_click" data-track-target="communities" className="-mt-0.5 -mb-2.5 py-2.5 inline-flex flex-wrap items-center gap-2 text-sm md:text-base text-cream/90 hover:text-cream transition-colors">
                        בקהילות שלי
                        <span className="inline-flex items-center gap-1.5" aria-label="פייסבוק וואטסאפ">
                          <FacebookIcon />
                          <WhatsAppIcon />
                        </span>
                      </Link>
                    </div>
                    {followers.length > 0 && (
                      // Social reach: a lighter row under the main figures
                      <ul className="col-span-full flex flex-wrap gap-x-8 gap-y-4 md:flex-nowrap md:justify-between md:gap-x-5 lg:max-w-[min(100%,40rem)]">
                        {followers.map((f) => (
                          <li key={f.key}>
                            <a href={f.url} target="_blank" rel="noopener noreferrer" data-track="social_click" data-track-network={f.key} data-track-placement="home_about" className="group inline-flex items-center gap-3 text-cream/90 hover:text-cream transition-colors">
                              <span className="w-9 h-9 md:w-10 md:h-10 rounded-full ring-1 ring-cream/20 group-hover:ring-gold/50 flex items-center justify-center text-gold transition-colors">
                                <SocialIcon name={f.key} />
                              </span>
                              <span className="leading-tight">
                                <span className="block whitespace-nowrap font-sans font-black tracking-[-0.01em] text-gold text-2xl xl:text-3xl">
                                  <CountUp to={f.count} suffix="+" start={active >= 1} />
                                </span>
                                <span className="block whitespace-nowrap text-xs md:text-sm">{f.label}</span>
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="col-span-full pt-6 border-t border-cream/15">
                      <p className="text-cream/90 mb-4">בתקשורת</p>
                      <LogoMarquee />
                    </div>
                  </div>
                </Chapter>

                <Chapter index={2} count={chapters} progress={progress}>
                  <h3 className="font-sans font-black text-2xl md:text-3xl text-cream mb-4">הדרך שלי ורקע מקצועי</h3>
                  <ul className="space-y-3">
                    {credentials.slice(0, 3).map((c, i) => (
                      <li key={i} className="flex items-start gap-3 rounded-2xl p-3.5 md:p-4 bg-cream/[0.07] ring-1 ring-cream/10">
                        <span aria-hidden className="mt-2 w-2 h-2 rounded-full bg-gold shrink-0 shadow-[0_0_12px_rgba(230,192,96,0.6)]" />
                        <span className="text-cream/95 text-sm md:text-base leading-relaxed line-clamp-2">{c.text}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/v2/about"
                    data-track="home_about_click"
                    data-track-target="about"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold text-[#2d1a0e] font-bold px-6 py-3 hover:bg-cream transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40"
                  >
                    קראו עוד עליי
                    <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </Chapter>
              </div>

              <ChapterDots count={chapters} active={active} />
            </m.div>

            {/* Portrait (left). The anchor keeps the untransformed layout box (measured); the stage wrapper carries
                the glide to the centre, the inner one the chapter tilt. */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div ref={anchorRef} className="relative w-[38vw] max-w-[180px] md:max-w-[220px] lg:w-full lg:max-w-[380px]">
                <m.div style={reduce ? STILL : { x: travelX, y: travelY, scale: travelScale }}>
                  <m.div style={reduce ? STILL : { rotate: photoRotate, scale: photoScale }}>
                    <m.div
                      aria-hidden
                      className="absolute inset-0 translate-x-3 translate-y-3 md:translate-x-4 md:translate-y-4 rounded-[28px] md:rounded-[44px] border border-gold/50"
                      style={reduce ? STILL : { opacity: goldOpacity }}
                    />
                    <div ref={frameRef} className="relative aspect-[4/5] rounded-[28px] md:rounded-[44px] overflow-hidden shadow-2xl shadow-black/40">
                      <m.div className="absolute inset-[-8%]" style={reduce ? STILL : { y: innerY }}>
                        <Image src={imageUrl} alt="טל רומן" fill sizes="(max-width: 768px) 40vw, 380px" className="object-cover object-top" />
                      </m.div>
                    </div>
                  </m.div>
                </m.div>
              </div>
            </div>
          </div>
        </m.div>

        {/* The photo inside the opening window (stage 2): same crop as the frame at the hand-off, dissolving into
            the contact section. Sits outside the clipped layer, clipped to the window itself. */}
        {!reduce && (
          <m.div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ clipPath: ghostClip, opacity: ghostOpacity, visibility: ghostVisibility }}
          >
            <m.div className="absolute" style={{ left: ghostLeft, top: ghostTop, width: ghostW, height: ghostH, scale: ghostScale }}>
              <m.div className="absolute inset-[-8%]" style={{ y: innerY }}>
                <Image src={imageUrl} alt="" fill sizes="(max-width: 768px) 40vw, 380px" className="object-cover object-top" />
              </m.div>
            </m.div>
          </m.div>
        )}
        </div>
      </m.section>

    </div>
  )
}

// One chapter of the pinned section: fades + rises in, fades + lifts out (first is in place, last holds)
function Chapter({ index, count, progress, children }: { index: number; count: number; progress: MotionValue<number>; children: React.ReactNode }) {
  const seg = 1 / count
  const start = index * seg
  const end = start + seg
  const isFirst = index === 0
  const isLast = index === count - 1
  const input: number[] = []
  const opacityOut: number[] = []
  const yOut: number[] = []
  if (!isFirst) {
    input.push(start - seg * 0.05, start + seg * 0.2)
    opacityOut.push(0, 1)
    yOut.push(36, 0)
  }
  if (!isLast) {
    input.push(end - seg * 0.2, end)
    opacityOut.push(1, 0)
    yOut.push(0, -36)
  }
  const opacity = useTransform(progress, input, opacityOut)
  const y = useTransform(progress, input, yOut)
  const pointerEvents = useTransform(() => (opacity.get() > 0.5 ? 'auto' : 'none'))

  return (
    <m.div className="absolute inset-0 text-right" style={{ opacity, y, pointerEvents }}>
      {children}
    </m.div>
  )
}

function ChapterDots({ count, active }: { count: number; active: number }) {
  return (
    <div aria-hidden className="mt-4 flex items-center gap-2">
      {Array.from({ length: count }, (_, i) => (
        <m.span
          key={i}
          className="h-1.5 rounded-full bg-gold"
          animate={{ width: i === active ? 28 : 8, opacity: i === active ? 1 : 0.35 }}
          transition={{ type: 'spring', bounce: 0, visualDuration: 0.4 }}
        />
      ))}
    </div>
  )
}

// Counts up once, when its chapter becomes active
function CountUp({ to, suffix = '', start }: { to: number; suffix?: string; start: boolean }) {
  const reduce = useHydratedReducedMotion()
  const value = useMotionValue(0)
  const display = useTransform(() => `${Math.round(value.get()).toLocaleString('en-US')}${suffix}`)
  const done = useRef(false)

  useEffect(() => {
    if (!start || done.current) return
    done.current = true
    if (reduce) {
      value.set(to)
      return
    }
    const controls = animate(value, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [start, reduce, to, value])

  return <m.span>{display}</m.span>
}

function FacebookIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.2z" />
    </svg>
  )
}

