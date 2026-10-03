'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { m, useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useHydratedReducedMotion } from './useHydratedReducedMotion'
import { GrainOverlay } from './backgrounds'

// A "beat" is one message; segments carry the bold (strong) marks
type Segment = { text: string; strong?: boolean }
type Beat = Segment[]

type Block = { _type: string; children?: { text?: string; marks?: string[] }[] }

const FALLBACK_BEATS: Beat[] = [
  [{ text: 'רוצה כבר עכשיו להתחיל ליצור שינוי באינטימיות ובמיניות שלך?' }],
  [{ text: 'אני מאמינה ששינוי משמעותי לא חייב להיות מסובך, בטח לא בתחום המיני, ושיש לך הרבה יותר יכולת ליצור את האינטימיות והחיים שבא לך ממה שנדמה לך.', strong: true }],
  [{ text: 'מה שחסר להרבה אנשים הוא פשוט שילוב של ידע שלא מספיק מלמדים אותנו, יחד עם כלים פרקטיים ואפקטיביים, ואשמח לפתוח לך את הדלת לשם :)' }],
  [{ text: 'הכנתי כמה הדרכות קצרות במתנה, ואני רוצה לעזור לך לקבל דווקא את זו שהכי מתאימה לך ולמה שמעסיק אותך עכשיו.' }],
  [
    { text: 'בין אם בא לך לשפר משהו שפחות עובד בתחום המיני, ובין אם פשוט להעמיק את העונג והחיבור שכבר קיימים, תמיד יש עוד מה ללמוד ולגלות, ' },
    { text: 'במיוחד שהרבה מהתהליכים הכי משמעותיים יכולים לקרות דרך עונג, חיבור וכיף.', strong: true },
  ],
  [{ text: 'ההדרכות קצרות וקלילות, ובו זמנית יש בהן לא מעט ידע וכלים שאפשר להתחיל להתנסות בהם כבר בסיום הצפייה ולראות איזה הבדל זה יכול לעשות לך בחיים ובמיטה.', strong: true }],
  [{ text: 'כדי שאדע איזו הדרכה הכי מתאימה לך, אשאל אותך רק 3 שאלות קצרות :)' }],
]

// Portable Text blocks from Sanity -> beats (one block per beat, strong marks kept)
function toBeats(message?: Block[] | string | null): Beat[] {
  if (Array.isArray(message)) {
    const beats = message
      .filter((b) => b._type === 'block' && b.children?.length)
      .map((b) => b.children!.map((c) => ({ text: c.text ?? '', strong: c.marks?.includes('strong') })))
      .filter((beat) => beat.some((s) => s.text.trim()))
    if (beats.length) return beats
  }
  if (typeof message === 'string' && message.trim()) {
    return message.split(/\n\s*\n/).filter((p) => p.trim()).map((p) => [{ text: p.trim() }])
  }
  return FALLBACK_BEATS
}

// Highlight only real key phrases: when a whole paragraph is marked bold in the CMS, treat it as plain text
function keyPhrases(beat: Beat): Beat {
  const allStrong = beat.every((s) => s.strong || !s.text.trim())
  return allStrong ? beat.map((s) => ({ text: s.text })) : beat
}

const plainText = (beat: Beat) => beat.map((s) => s.text).join('')

interface Props {
  message?: Block[] | string | null
  /** Rendered after the story, on the same pinned background (one continuous space, no seam) */
  children?: React.ReactNode
}

export default function MessageStory({ message, children }: Props) {
  const beats = toBeats(message)
  const reduce = useHydratedReducedMotion()
  const [question, ...paragraphs] = beats

  return (
    <StickyStory question={question} paragraphs={paragraphs.map(keyPhrases)} reduce={reduce}>
      {children}
    </StickyStory>
  )
}

// Scrollytelling: the question + CTA stay pinned on one side, the paragraphs scroll past at reading pace
// on the other, and the one in the middle of the screen lights up. Only as tall as the text itself.
// Seam in + layout (desktop):
// 1. While section 2 is still pinned behind (its cards finishing their run), the cream fades in over it.
// 2. The question arrives from the viewer: huge, filled with rose dots, it shrinks down onto the page,
//    centred, while the dots fill in to solid letters.
// 3. It steps aside to its pinned place on the right; the CTA appears and the paragraphs scroll in on the left.
// Phones keep a simple stacked flow (no intro pin).
const INTRO_VH = 260 // scroll length of the intro (long = calm, unhurried)

function StickyStory({ question, paragraphs, reduce, children }: { question: Beat; paragraphs: Beat[]; reduce: boolean; children?: React.ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const columnRef = useRef<HTMLDivElement>(null)

  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  const intro = isDesktop && !reduce

  // 0 -> 1 across the intro stretch (spacer at the top of the paragraph column)
  const { scrollYProgress: introRaw } = useScroll({ target: introRef, offset: ['start start', 'end start'] })
  const t = useTransform(() => (intro ? Math.min(1, Math.max(0, introRaw.get())) : 1))

  // How far the pinned column's centre is from the screen centre (so the question can land centred first)
  const shift = useMotionValue(0)
  useEffect(() => {
    const measure = () => {
      const c = columnRef.current
      if (!c) return
      const r = c.getBoundingClientRect()
      shift.set(window.innerWidth / 2 - (r.left + r.width / 2))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [shift, isDesktop])

  const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
  const clamp = (x: number) => Math.min(1, Math.max(0, x))

  // Section 2's own warm gray covers its lines/video/cards first (no colour change yet);
  // the cream only arrives after the question has landed, while it steps aside
  const smooth = (x: number) => x * x * (3 - 2 * x) // smoothstep: soft start and end
  const grayIn = useTransform(() => smooth(clamp((t.get() - 0.3) / 0.07)))
  const creamIn = useTransform(() => smooth(clamp((t.get() - 0.55) / 0.45)))
  // Question letters: cream on the gray, warming to dark brown as the cream arrives
  // Switch early in the change, while the background is still mid-tone, so the letters never blend in
  const qColor = useTransform(creamIn, [0.12, 0.38], ['#fff2d4', '#2d1a0e'])
  const qOpacity = useTransform(() => smooth(clamp((t.get() - 0.1) / 0.18)))
  // Gentle, even descent (sine in-out) instead of a fast drop
  const qScale = useTransform(() => 4.2 - 3.2 * (0.5 - Math.cos(Math.PI * clamp((t.get() - 0.1) / 0.55)) / 2)) // from the viewer down onto the page
  const dots = useTransform(() => 1 - smooth(clamp((t.get() - 0.35) / 0.3))) // dotted fill -> solid
  const solid = useTransform(() => 1 - dots.get())
  const qX = useTransform(() => shift.get() * (1 - easeInOut(clamp((t.get() - 0.66) / 0.3)))) // centred -> its place
  const ctaIn = useTransform(() => clamp((t.get() - 0.86) / 0.14))
  const ctaY = useTransform(() => 16 * (1 - clamp((t.get() - 0.86) / 0.14)))
  // While the intro plays over section 2, clicks go through to its cards (e.g. "לכל הכתבות")
  const passThrough = useTransform(() => (t.get() < 0.86 ? 'none' : 'auto'))

  return (
    <m.section
      ref={sectionRef}
      style={intro ? { pointerEvents: passThrough } : undefined}
      // Desktop overlaps section 2 by two screens (it's still pinned behind during the intro's first screen);
      // phones overlap one screen like before
      className="relative -mt-[100vh] md:-mt-[200vh] z-20 overflow-x-clip"
    >
      {/* Pinned backdrop: section 2's gray first (covering its lines/video/cards), then the cream + glows */}
      <m.div
        aria-hidden
        className="sticky top-0 h-svh -mb-[100svh] overflow-hidden pointer-events-none"
        style={{ opacity: intro ? grayIn : 1 }}
      >
        {intro && <div className="absolute inset-0 bg-gradient-to-b from-[#5e5955] to-[#48443f]" />}
        <m.div className="absolute inset-0 bg-cream" style={{ opacity: intro ? creamIn : 1 }}>
          <div className="absolute -right-[10%] top-[10%] w-[50vw] h-[50vw] rounded-full" style={{ background: 'radial-gradient(circle, rgba(201,120,112,0.16) 0%, transparent 62%)' }} />
          <div className="absolute -left-[10%] bottom-[5%] w-[45vw] h-[45vw] rounded-full" style={{ background: 'radial-gradient(circle, rgba(230,192,96,0.18) 0%, transparent 62%)' }} />
          <GrainOverlay />
        </m.div>
      </m.div>

      <div className="relative max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-10 md:gap-20">
        {/* Pinned side (right, RTL): the question + the gift CTA */}
        <div ref={columnRef} className="md:sticky md:top-0 md:h-svh flex flex-col justify-center pt-24 md:pt-0 text-center md:text-right">
          <m.div className="relative will-change-transform" style={intro ? { x: qX, scale: qScale, opacity: qOpacity } : undefined}>
            <m.h2
              className="font-garamond font-extrabold text-[#2d1a0e] text-4xl md:text-5xl lg:text-6xl md:[@media(max-height:500px)]:text-3xl leading-tight text-balance"
              style={intro ? { opacity: solid, color: qColor } : undefined}
            >
              {plainText(question)}
            </m.h2>
            {/* Dotted twin on top (rose halftone), fading as the letters fill in */}
            {intro && (
              <m.p
                aria-hidden
                className="absolute inset-0 font-garamond font-extrabold text-4xl md:text-5xl lg:text-6xl md:[@media(max-height:500px)]:text-3xl leading-tight text-balance text-transparent bg-clip-text [-webkit-background-clip:text] select-none"
                style={{
                  opacity: dots,
                  backgroundImage: 'radial-gradient(circle, rgba(222,150,140,0.95) 0.4px, transparent 0.65px), linear-gradient(rgba(222,150,140,0.28), rgba(222,150,140,0.28))',
                  backgroundSize: '1.6px 1.6px, 100% 100%',
                }}
              >
                {plainText(question)}
              </m.p>
            )}
          </m.div>
          <m.div
            data-hide-dock
            data-track="quiz_cta_click"
            data-track-placement="story"
            className="mt-8 md:mt-10 md:[@media(max-height:500px)]:mt-5 flex justify-center md:justify-start"
            style={intro ? { opacity: ctaIn, y: ctaY } : undefined}
          >
            <GiftCta className="hover:shadow-brand/50 hover:scale-105 transition-[box-shadow,scale]" />
          </m.div>
        </div>

        {/* Scrolling side (left): the intro stretch, then paragraphs at reading pace, the active one lit */}
        <div className="relative pb-16 md:pb-[38vh]">
          <div ref={introRef} aria-hidden className="hidden md:block" style={{ height: intro ? `${INTRO_VH}vh` : 0 }} />
          <div className="space-y-10 md:space-y-[16vh] md:pt-[58vh]">
            {paragraphs.map((beat, i) => (
              <StoryParagraph key={i} beat={beat} reduce={reduce} />
            ))}
          </div>
        </div>
      </div>

      {/* Following section(s) share this pinned background */}
      {children}
    </m.section>
  )
}

// One paragraph: full strength while it's in the middle of the screen, dimmed above/below.
// Its key phrases get the highlighter stroke as it becomes active.
function StoryParagraph({ beat, reduce }: { beat: Beat; reduce: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // Function form: computed per frame (not handed to a native scroll timeline)
  const p = useTransform(() => scrollYProgress.get())
  const opacity = useTransform(p, [0.15, 0.4, 0.6, 0.85], [0.22, 1, 1, 0.22])
  const highlight = useTransform(p, [0.3, 0.48], ['0% 100%', '100% 100%'])

  return (
    <m.p
      ref={ref}
      className="text-[#3d2814] text-xl md:text-2xl lg:text-[1.75rem] leading-relaxed font-medium text-right text-pretty"
      style={reduce ? undefined : { opacity }}
    >
      {beat.map((s, k) =>
        s.strong ? (
          <Highlight key={k} size={reduce ? undefined : highlight}>
            {s.text}
          </Highlight>
        ) : (
          <span key={k}>{s.text}</span>
        )
      )}
    </m.p>
  )
}

function Highlight({ children, size }: { children: React.ReactNode; size?: MotionValue<string> }) {
  return (
    <m.span
      className="font-bold text-brand-dark bg-no-repeat [background-position:right_bottom] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
      style={{ backgroundImage: 'linear-gradient(transparent 62%, #f4dac0 62%)', backgroundSize: size ?? '100% 100%' }}
    >
      {children}
    </m.span>
  )
}

// Quiz CTA: the gift, plus how little it asks (3 short questions)
function GiftCta({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/v2/quiz"
      className={`inline-flex flex-col items-center bg-brand text-white rounded-full px-10 py-3 shadow-xl shadow-brand/30 ${className}`}
    >
      <span className="font-bold text-lg md:text-xl leading-tight">לקבלת הדרכה במתנה</span>
      <span className="text-sm font-medium text-white leading-tight mt-0.5">3 שאלות קצרות</span>
    </Link>
  )
}
