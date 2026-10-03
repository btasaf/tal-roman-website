'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { m, AnimatePresence, LazyMotion, domMax, useScroll, useTransform, useMotionValue, useMotionValueEvent, cubicBezier } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl } from '@/lib/image-utils'
import { LogoMarquee } from './media-logos'
import { AuroraBackground, GrainOverlay, RippleRings } from './backgrounds'

const FALLBACK_IMAGE = '/wix-assets/images/tal-photos/VV9A8369%20copy_edited.jpg'

// Fast start, long glide, soft landing
const easeOutGlide = cubicBezier(0.22, 1, 0.36, 1)
// Gentle start, fast middle, soft landing
const easeInOutGlide = cubicBezier(0.65, 0, 0.35, 1)
const linear = (t: number) => t

// Hero timeline, in vh of scroll. Section is HERO_VH tall; at() converts to scroll progress.
const HERO_VH = 600
const at = (vh: number) => vh / HERO_VH
const T = {
  imageRight: at(40), // image reaches the right, name erased
  headlineIn: at(45), // headline words start fading in
  headlineDone: at(70),
  sweepStart: at(160), // reading pause ends, image heads left
  ctaIn: at(230),
  sweepEnd: at(260),
  // ~100vh hold to read + see the CTA, then the next section's cap arrives (~365vh)
  dock: at(360),
}

// Phone hero: two simple steps instead of the sideways sweep. Section is MOBILE_VH tall.
const MOBILE_VH = 340
const atM = (vh: number) => vh / MOBILE_VH
const TM = {
  swapStart: atM(40), // photo shrinks up, name step fades out
  swapEnd: atM(75), // headline step fully in; holds until the next section covers (~140vh)
}

const VALUE_LINE = 'חינוך מיני ואינטימיות לזוגות ויחידים'

const HERO_SUBTITLE = 'אלווה אותך מתוך ניסיון רב, רגישות והקשבה, ובדרך פשוטה ופרקטית, שהופכת את מה שנראה מסובך לפשוט וברור'

interface Props {
  heroImage: object | null
  heroHeadline?: string
  heroSubheadline?: string
  heroCtaText?: string
}

// One CTA: docked bottom-left from the first second; on desktop it fades out of the corner and fades in
// under the subtitle while that's on screen, then back. Says exactly what you get: a free guide, 3 short questions.
const ctaFade = { type: 'spring', bounce: 0, visualDuration: 0.45 } as const

function HeroCta() {
  return (
    <div>
      <Link
        href="/v2/quiz"
        className="inline-flex items-center gap-3 bg-brand text-white font-bold rounded-full shadow-xl shadow-brand/30 hover:shadow-brand/50 hover:scale-105 transition-[box-shadow,scale] px-5 py-2.5 md:px-7 md:py-3"
      >
        <span className="flex flex-col items-start leading-tight">
          <span className="text-base md:text-lg">לקבלת הדרכה במתנה</span>
          <span className="text-xs md:text-sm font-medium text-white/85">3 שאלות קצרות</span>
        </span>
        <svg className="w-5 h-5 rotate-180 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  )
}

// Word-by-word fade reveal component
function WordReveal({
  text,
  visibleWords,
  className
}: {
  text: string
  visibleWords: number
  className?: string
}) {
  const words = text.split(' ')

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block transition-opacity duration-300"
          style={{
            opacity: i < visibleWords ? 1 : 0,
          }}
        >
          {word}
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  )
}

export default function HeroV2({
  heroImage,
  heroHeadline = 'הזוגיות שלך יכולה להיות אחרת',
  heroSubheadline = 'ליווי מקצועי לזוגות ויחידים בדרך לאינטימיות עמוקה ומספקת',
}: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const imageUrl = getImageUrl(heroImage, 'hero') ?? FALLBACK_IMAGE

  const imageRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)

  const headlineWords = heroHeadline.split(' ').length

  const [visibleHeadlineWords, setVisibleHeadlineWords] = useState(0)
  const [showCta, setShowCta] = useState(false)
  // Docked from the start so the offer is visible immediately
  const [ctaDocked, setCtaDocked] = useState(true)
  const [isDesktop, setIsDesktop] = useState(true)
  // Hide the docked CTA whenever another call-to-action is on screen (marked with data-hide-dock)
  const [otherCtaVisible, setOtherCtaVisible] = useState(false)
  // Only the very first appearance of the docked CTA gets the delayed entrance
  const [ctaEntered, setCtaEntered] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const targets = document.querySelectorAll('[data-hide-dock]')
    if (!targets.length) return
    const onScreen = new Set<Element>()

    // Some CTAs sit in pinned sections where they're "on screen" but faded out (e.g. the story's last
    // message), so also require their effective opacity to be up
    const effectiveOpacity = (el: Element | null) => {
      let o = 1
      for (let n = el, i = 0; n && i < 8; n = n.parentElement, i++) o *= parseFloat(getComputedStyle(n).opacity)
      return o
    }
    const recompute = () => {
      let any = false
      onScreen.forEach((el) => {
        if (effectiveOpacity(el) > 0.5) any = true
      })
      setOtherCtaVisible(any)
    }

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) onScreen.add(e.target)
        else onScreen.delete(e.target)
      }
      recompute()
    })
    targets.forEach((t) => io.observe(t))

    // Opacity changes with scroll inside pinned sections; re-check (throttled to a frame) while any are on screen
    let raf = 0
    const onScroll = () => {
      if (!onScreen.size || raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        recompute()
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    // Entrance fades can finish after scrolling stops, so also re-check a few times a second while any are on screen
    const poll = window.setInterval(() => {
      if (onScreen.size) recompute()
    }, 300)
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      window.clearInterval(poll)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  })

  // Phone two-step: photo shrinks up while the name step hands over to the headline step
  const mobileP = useTransform(() => scrollYProgress.get())
  const mPhotoScale = useTransform(mobileP, [TM.swapStart, TM.swapEnd], [1, 0.55])
  const mStep1Opacity = useTransform(mobileP, [TM.swapStart, (TM.swapStart + TM.swapEnd) / 2], [1, 0])
  const mStep1Y = useTransform(mobileP, [TM.swapStart, TM.swapEnd], [0, -30])
  const mStep2Opacity = useTransform(mobileP, [(TM.swapStart + TM.swapEnd) / 2, TM.swapEnd], [0, 1])
  const mStep2Y = useTransform(mobileP, [TM.swapStart, TM.swapEnd], [40, 0])
  // Credibility strip stays through the whole hero animation, fading only just before the next section arrives
  const credOpacity = useTransform(() => Math.min(1, Math.max(0, (T.dock - scrollYProgress.get()) / at(30))))

  // Image movement: starts 10vw left of center (name on its right), sweeps to 20vw right
  // erasing the name, then 20vw left (symmetric around center)
  // Kept as a fraction of viewport width so the text clips can use it in px
  const imageShift = useTransform(
    scrollYProgress,
    [0, T.imageRight, T.sweepStart, T.sweepEnd],
    [-0.1, 0.2, 0.2, -0.2],
    { ease: [easeOutGlide, linear, easeInOutGlide] }
  )
  const imageX = useTransform(() => `${imageShift.get() * 100}vw`)

  // Untransformed geometry (px, relative to the shared container), measured on resize
  const layout = useMotionValue({ vw: 0, imgLeft: 0, imgRight: 0, nameLeft: 0, nameRight: 0, headLeft: 0, headRight: 0, subLeft: 0, subRight: 0 })

  useLayoutEffect(() => {
    const measure = () => {
      const img = imageRef.current
      const name = nameRef.current
      const head = headlineRef.current
      const sub = subtitleRef.current
      if (!img || !name || !head || !sub) return
      // Desktop sweep is display:none on phones - nothing to measure there
      if (!sub.offsetParent) return
      // Subtitle sits inside its own absolute wrapper, so add the wrapper's offset
      const subLeft = (sub.offsetParent as HTMLElement).offsetLeft + sub.offsetLeft
      layout.set({
        vw: window.innerWidth,
        imgLeft: img.offsetLeft,
        imgRight: img.offsetLeft + img.offsetWidth,
        nameLeft: name.offsetLeft,
        nameRight: name.offsetLeft + name.offsetWidth,
        headLeft: head.offsetLeft,
        headRight: head.offsetLeft + head.offsetWidth,
        subLeft,
        subRight: subLeft + sub.offsetWidth,
      })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [layout])

  // Name is erased by the image's leading (right) edge as it moves right,
  // and stays erased once the image has reached the right (it doesn't come back as the image returns left)
  const nameClip = useTransform(() => {
    if (scrollYProgress.get() >= T.imageRight) return 'inset(0 0 0 100%)'
    const l = layout.get()
    const edge = l.imgRight + imageShift.get() * l.vw
    const hidden = Math.min(Math.max(edge - l.nameLeft, 0), l.nameRight - l.nameLeft)
    return `inset(0 0 0 ${hidden}px)`
  })

  // Headline is erased by the image's leading (left) edge as it moves left
  const headlineClip = useTransform(() => {
    if (scrollYProgress.get() < T.sweepStart) return 'none'
    // Stays erased after the sweep ends
    if (scrollYProgress.get() >= T.sweepEnd) return 'inset(0 100% 0 0)'
    const l = layout.get()
    const edge = l.imgLeft + imageShift.get() * l.vw
    const hidden = Math.min(Math.max(l.headRight - edge, 0), l.headRight - l.headLeft)
    return `inset(0 ${hidden}px 0 0)`
  })

  // Subtitle is revealed behind the image's trailing (right) edge, only once it heads left
  const subtitleClip = useTransform(() => {
    if (scrollYProgress.get() < T.sweepStart) return 'inset(0 0 0 100%)'
    const l = layout.get()
    const edge = l.imgRight + imageShift.get() * l.vw
    const hidden = Math.min(Math.max(edge - l.subLeft, 0), l.subRight - l.subLeft)
    return `inset(0 0 0 ${hidden}px)`
  })

  // Scroll hint fades out over the first 25vh (function form: computed per frame, not a native scroll timeline)
  const scrollHintOpacity = useTransform(() => Math.max(0, 1 - scrollYProgress.get() / at(25)))

  // Word-by-word reveal based on scroll
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    // Image goes right, then reveal headline word by word, then a long hold for reading
    if (latest < T.headlineIn) {
      setVisibleHeadlineWords(0)
    } else if (latest <= T.headlineDone) {
      const progress = (latest - T.headlineIn) / (T.headlineDone - T.headlineIn)
      const wordsToShow = Math.floor(progress * (headlineWords + 1))
      setVisibleHeadlineWords(wordsToShow)
    } else {
      setVisibleHeadlineWords(headlineWords)
    }

    // Desktop: the CTA joins the subtitle once it's revealed, then returns to the corner
    // as the next section starts sliding over. Phones: always docked.
    setShowCta(latest > T.ctaIn)
    setCtaDocked(!isDesktop || latest < T.ctaIn || latest >= T.dock)
  })

  return (
    <LazyMotion features={domMax}>
      {/* Hero section */}
      <section
        ref={sectionRef}
        className="relative bg-cream z-0 h-[var(--hero-h-m)] lg:h-[var(--hero-h)]"
        style={{ ['--hero-h' as string]: `${HERO_VH}vh`, ['--hero-h-m' as string]: `${MOBILE_VH}vh` }}
      >
        {/* ── Phone & tablet hero (below 1024px): two calm steps ── */}
        <div className="lg:hidden sticky top-0 h-svh overflow-hidden [--ph:min(77vw,333px)] [@media(max-height:500px)]:[--ph:min(77vw,333px,36svh)]">
          <AuroraBackground palette="cream" />
          <GrainOverlay />
          <m.div
            className="absolute left-1/2 top-[9svh] -translate-x-1/2 w-[calc(var(--ph)*0.75)] aspect-[3/4] rounded-[32px] overflow-hidden shadow-2xl origin-top"
            style={{ scale: mPhotoScale }}
          >
            <Image src={imageUrl} alt="טל רומן" fill className="object-cover object-top" priority sizes="60vw" />
          </m.div>

          {/* Step 1: who + what */}
          <m.div
            className="absolute inset-x-6 md:inset-x-[18%] top-[calc(9svh+var(--ph)+28px)] text-center"
            style={{ opacity: mStep1Opacity, y: mStep1Y }}
          >
            <p className="font-garamond font-extrabold text-[#2d1a0e] text-5xl leading-none">טל רומן</p>
            <p className="mt-3 text-brand-dark font-bold text-lg">{VALUE_LINE}</p>
            <p className="mt-5 text-sm text-night/80">כפי שהופיעה ב</p>
            <LogoMarquee tone="dark" logoClassName="h-7" className="mt-2" duration={24} />
          </m.div>

          <m.div
            aria-hidden
            className="absolute bottom-28 inset-x-0 flex flex-col items-center gap-1 text-night/45 text-xs [@media(max-height:500px)]:hidden"
            style={{ opacity: mStep1Opacity }}
          >
            <span>גללו למטה</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </m.div>

          {/* Step 2: the promise */}
          <m.div
            className="absolute inset-x-6 md:inset-x-[18%] top-[calc(9svh+var(--ph)*0.55+28px)] text-center"
            style={{ opacity: mStep2Opacity, y: mStep2Y }}
          >
            <p className="font-garamond font-extrabold text-[#2d1a0e] text-3xl leading-tight">{heroHeadline}</p>
            <p className="mt-4 text-base text-night/80 leading-relaxed">{HERO_SUBTITLE}</p>
            <p className="mt-3 text-sm font-bold text-brand">{heroSubheadline}</p>
          </m.div>
        </div>

        {/* ── Desktop hero: the image sweep ──────────────────────── */}
        {/* Sticky container */}
        <div className="hidden lg:block sticky top-0 h-screen overflow-hidden">
          {/* Background: slow warm aurora + film grain (replaces the dot grid) */}
          <AuroraBackground palette="cream" />
          <GrainOverlay />

          {/* Background initials */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[50vw] font-black text-brand/[0.02] leading-none">
              ט״ר
            </span>
          </div>

          {/* Main content */}
          <div className="relative z-10 h-full flex items-center justify-center">

            {/* Name - right of the image on load (image half-width + 56px gap past the rings), erased as the image moves right */}
            <m.div
              ref={nameRef}
              className="absolute left-[calc(50%-10vw+196px)] md:left-[calc(50%-10vw+226px)] lg:left-[calc(50%-10vw+256px)] z-10"
              style={{ clipPath: nameClip }}
            >
              <p className="whitespace-nowrap text-6xl md:text-7xl lg:text-8xl font-extrabold font-garamond text-[#2d1a0e] leading-none">
                טל רומן
              </p>
              {/* Value line: what this is, in the first second */}
              <p className="mt-4 whitespace-nowrap text-lg lg:text-xl font-bold text-brand-dark">{VALUE_LINE}</p>
            </m.div>

            {/* Headline - LEFT side, close to center so image covers it */}
            <m.div
              ref={headlineRef}
              className="absolute left-[22%] md:left-[24%] lg:left-[21%] max-w-xs md:max-w-sm lg:max-w-md z-10 text-right"
              style={{ clipPath: headlineClip }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold font-garamond text-[#2d1a0e] leading-tight">
                <WordReveal
                  text={heroHeadline}
                  visibleWords={visibleHeadlineWords}
                />
              </h1>
            </m.div>

            {/* Image - covers text when passing */}
            <m.div
              ref={imageRef}
              className="relative z-30"
              style={{ x: imageX }}
            >

              <div className="relative">
                <div className="relative w-[280px] h-[380px] md:w-[340px] md:h-[460px] lg:w-[400px] lg:h-[540px] rounded-[40px] overflow-hidden shadow-2xl bg-cream">
                  <Image
                    src={imageUrl}
                    alt="טל רומן"
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="400px"
                  />
                </div>
                {/* Soft rings pulsing outward from behind the photo */}
                <div className="absolute inset-0 -z-10">
                  <RippleRings count={2} color="rgba(201,120,112,0.32)" duration={8} />
                </div>
              </div>
            </m.div>

            {/* Subtitle + CTA - starts just right of the image's final edge (center - 20vw + image half-width + 80px),
                so the sweep reveals it right from the image edge */}
            <div className="absolute left-[calc(50%-20vw+220px)] md:left-[calc(50%-20vw+250px)] lg:left-[calc(50%-20vw+280px)] w-[20rem] md:w-[24rem] lg:w-[28rem] lg:max-w-[calc(70vw-304px)] z-10 text-right">
              <m.div
                ref={subtitleRef}
                className="mb-6"
                style={{ clipPath: subtitleClip }}
              >
                <p className="text-lg md:text-xl lg:text-2xl text-night/80 leading-relaxed mb-4">
                  {HERO_SUBTITLE}
                </p>
                {/* Tagline - single line */}
                <p className="flex items-center gap-3 whitespace-nowrap text-sm font-bold text-brand tracking-wide">
                  <span className="h-px w-6 bg-brand/50 shrink-0" />
                  {heroSubheadline}
                </p>
              </m.div>

              {/* Fixed height keeps the subtitle from shifting when the CTA docks */}
              <div
                className={`h-[64px] transition-opacity duration-500 ${showCta ? '' : 'pointer-events-none'}`}
                style={{ opacity: showCta ? 1 : 0 }}
                inert={!showCta}
              >
                <AnimatePresence>
                  {!ctaDocked && (
                    <m.div key="hero-cta-inline" data-track="quiz_cta_click" data-track-placement="hero_inline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={ctaFade}>
                      <HeroCta />
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>

          {/* Credibility strip on the first screen */}
          <m.div
            className="absolute bottom-28 [@media(max-height:860px)]:bottom-6 left-1/2 -translate-x-1/2 w-[440px] max-w-[80vw] text-center z-20"
            style={{ opacity: credOpacity }}
          >
            <p className="text-sm text-night/80 tracking-wide mb-2">כפי שהופיעה ב</p>
            <LogoMarquee tone="dark" logoClassName="h-9" duration={26} />
          </m.div>

          {/* Scroll hint */}
          <m.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 [@media(max-height:860px)]:hidden"
            style={{ opacity: scrollHintOpacity }}
          >
            <m.div
              className="flex flex-col items-center gap-2 text-night/40"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-sm tracking-wide">גללו למטה</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </m.div>
          </m.div>
        </div>
      </section>

      {/* Same CTA, docked bottom-left: visible from the start, steps aside when another CTA is on screen */}
      <AnimatePresence>
        {ctaDocked && (
          <m.div
            key="hero-cta-docked"
            data-track="quiz_cta_click"
            data-track-placement="hero_dock"
            data-track-dock
            className={`fixed bottom-4 left-4 md:bottom-8 md:left-8 z-[100] ${otherCtaVisible ? 'pointer-events-none' : ''}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: otherCtaVisible ? 0 : 1, y: otherCtaVisible ? 12 : 0 }}
            exit={{ opacity: 0, y: 12 }}
            // Small delay only on the very first appearance after load
            transition={{ ...ctaFade, delay: ctaEntered ? 0 : 0.4 }}
            onAnimationComplete={() => setCtaEntered(true)}
            inert={otherCtaVisible}
          >
            <HeroCta />
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  )
}
