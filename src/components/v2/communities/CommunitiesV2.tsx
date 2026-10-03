'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { animate, m, useInView, useMotionValue, useScroll, useTransform } from 'framer-motion'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { FadeUp, enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'

// ─── Content (same facts and links as the existing communities page) ─────────

const MEMBERS = 22000

const PILLARS = [
  { title: 'למידה מהטובים', text: 'חיבור לגוף, מיניות ויחסים דרך מורים מובילים שמתנדבים ומעניקים מהידע שלהם כל שבוע.', icon: 'learn' },
  { title: 'שיתוף ותמיכה', text: 'מרחב בטוח לשתף ולקבל תמיכה גם בנושאים הכי מורכבים.', icon: 'heart' },
  { title: 'שיח בין המינים', text: 'למידה מרתקת על המין השני דרך שיח בריא ומכבד בין גברים ונשים.', icon: 'talk' },
  { title: 'היכרויות וחברויות', text: 'נשים וגברים איכותיים, במפגשי זום מהנים ובעתיד גם פנים מול פנים.', icon: 'people' },
] as const

const FACEBOOK_GROUPS = [
  {
    title: 'קבוצת הנשים',
    subtitle: 'חיבור לגוף, מיניות ועצמאות נשית',
    description: 'קהילה נשית בטוחה ומחבקת שבה נתחבר יותר לעצמנו, לגוף שלנו ולמיניות שלנו. שיתוף, תמיכה וצמיחה יחד.',
    href: 'https://www.facebook.com/groups/220886165935825/',
    cta: 'הצטרפי לקבוצת הנשים',
  },
  {
    title: 'קבוצת הגברים',
    subtitle: 'חיבור לגבריות, מיניות ומערכות יחסים',
    description: 'קהילה גברית שבה נתחבר יותר לעצמנו, לגוף שלנו ולמיניות שלנו. שיתוף, תמיכה וצמיחה מתוך כוח ואותנטיות.',
    href: 'https://www.facebook.com/groups/1104647316547930/',
    cta: 'הצטרף לקבוצת הגברים',
  },
]

const WHATSAPP_GROUPS = [
  {
    tagline: 'קהילת הוואטסאפ',
    title: 'תכנים | אירועים | מפגשים',
    description: 'קהילה שנועדה ליצירת חיבור, שיח ושיתופים סביב עולמות של יחסים, זוגיות, מיניות והתפתחות אישית.',
    bullets: ['שיתופים על אירועים, סדנאות ומפגשים מהקהילה', 'הזדמנויות לחיבורים ושיתופי פעולה', 'הזמנות למפגשי אונליין', 'מרחב לשיח מכבד, פתוח ובריא'],
    href: 'https://chat.whatsapp.com/JkbCR2ofFuu5X0lAKBucX0',
  },
  {
    tagline: 'חינמיים ומתנות',
    title: 'יחסים, זוגיות ואינטימיות בריאה',
    description: 'הקהילה נועדה לאפשר לכם להעמיק, ללמוד ולקבל כלים משמעותיים לעולמות של זוגיות, חיבור רגשי, אינטימיות ומיניות בריאה.',
    bullets: ['תכנים חינמיים, מתנות וכלים פרקטיים', 'הזמנות מוקדמות והטבות מיוחדות לסדנאות', 'ידע איכותי מעולמות היחסים והמיניות', 'עדכונים חשובים, בלי הצפה ובלי ספאם'],
    href: 'https://chat.whatsapp.com/FPZYN0ApHYp2tlYXVasGdm',
  },
]

const GRAY = 'linear-gradient(to bottom, #5e5955, #48443f)'

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CommunitiesV2({ members = MEMBERS }: { members?: number }) {
  return (
    <div className="overflow-x-clip">
      <Hero members={members} />
      <Pillars />
      <FacebookSection />
      <WhatsAppSection />
      <Closing />
    </div>
  )
}

// Hero: giant halftone title, the member count, and two jump links
function Hero({ members }: { members: number }) {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const p = useTransform(() => scrollYProgress.get())
  // Gentle depth on scroll: the giant word drifts slower than the content
  const titleY = useTransform(p, [0, 1], ['0%', '30%'])
  const contentY = useTransform(p, [0, 1], ['0%', '-12%'])
  const fade = useTransform(p, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative min-h-svh flex flex-col items-center justify-center bg-cream px-6 pt-28 pb-20 text-center">
      <AuroraBackground palette="cream" />
      <GrainOverlay />
      <OrbitDots />

      <m.p
        aria-hidden
        className="relative font-sans font-black leading-[0.85] tracking-[-0.02em] select-none text-transparent bg-clip-text [-webkit-background-clip:text] text-[30vw] md:text-[18vw]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(168,90,84,0.5) 0.9px, transparent 1.3px), linear-gradient(to bottom, rgba(168,90,84,0.2), rgba(201,120,112,0.07))',
          backgroundSize: '3.5px 3.5px, 100% 100%',
          ...(reduce ? {} : { y: titleY, opacity: fade }),
        }}
      >
        קהילות
      </m.p>

      <m.div className="relative -mt-[8vw] md:-mt-[6vw] max-w-2xl" style={reduce ? undefined : { y: contentY, opacity: fade }}>
        <FadeUp y={12}>
          <p className="inline-flex items-center gap-2 rounded-full bg-brand/10 text-brand-dark px-4 py-1.5 text-sm font-bold">
            <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-brand" />
            מתחברים ומתחברות
          </p>
        </FadeUp>

        <h1 className="sr-only">הקהילות של טל רומן</h1>

        <FadeUp delay={0.1} y={20}>
          <p className="mt-6 font-sans font-black tracking-[-0.01em] text-[#2d1a0e] text-6xl md:text-8xl leading-none">
            <CountUp to={members} suffix="+" />
          </p>
        </FadeUp>
        <FadeUp delay={0.2} y={16}>
          <p className="mt-4 text-lg md:text-2xl text-[#3d2814]/85 leading-relaxed text-balance">
            נשים וגברים שתומכים, נתמכים ולומדים המון,{' '}
            <span className="font-garamond font-bold text-brand-dark">בחינם וביחד</span>
          </p>
        </FadeUp>

        <FadeUp delay={0.3} y={16} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#facebook"
            className="inline-flex items-center gap-2.5 rounded-full bg-[#2d1a0e] text-cream font-bold px-6 py-3.5 hover:bg-[#3d2814] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
          >
            <FacebookIcon className="w-5 h-5" />
            קבוצות הפייסבוק
          </a>
          <a
            href="#whatsapp"
            className="inline-flex items-center gap-2.5 rounded-full bg-white/80 ring-1 ring-brand/20 text-[#2d1a0e] font-bold px-6 py-3.5 hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
          >
            <WhatsAppIcon className="w-5 h-5 text-[#17663a]" />
            קבוצות הוואטסאפ
          </a>
        </FadeUp>
      </m.div>

      <ScrollHint />
    </section>
  )
}

// Small rose/gold dots slowly orbiting the hero - a quiet "many people, one circle" motif
function OrbitDots() {
  const reduce = useHydratedReducedMotion()
  const dots = Array.from({ length: 14 }, (_, i) => i)
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <m.div
        className="relative w-[min(92vw,820px)] aspect-square"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 160, ease: 'linear', repeat: Infinity }}
      >
        <div className="absolute inset-0 rounded-full border border-brand/10" />
        {dots.map((i) => {
          const a = (i / dots.length) * Math.PI * 2
          const size = [8, 5, 11, 6, 9][i % 5]
          return (
            <span
              key={i}
              className={`absolute rounded-full ${i % 3 === 0 ? 'bg-gold/60' : 'bg-brand/45'}`}
              style={{
                width: size,
                height: size,
                left: `calc(50% + ${Math.cos(a) * 50}% - ${size / 2}px)`,
                top: `calc(50% + ${Math.sin(a) * 50}% - ${size / 2}px)`,
              }}
            />
          )
        })}
      </m.div>
    </div>
  )
}

function ScrollHint() {
  const reduce = useHydratedReducedMotion()
  return (
    <m.div
      aria-hidden
      className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#3d2814]/50 flex flex-col items-center gap-1 text-sm"
      animate={reduce ? undefined : { y: [0, 8, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <span>גללו למטה</span>
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </m.div>
  )
}

// What happens in the communities: four calm pillars
function Pillars() {
  const reduce = useHydratedReducedMotion()
  return (
    <section className="relative bg-cream px-6 py-24 md:py-32">
      <GrainOverlay />
      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
          <div className="text-right lg:sticky lg:top-32">
            <FadeUp y={12}>
              <p className="inline-flex items-center gap-2 rounded-full bg-brand/10 text-brand-dark px-3.5 py-1.5 text-sm font-bold">
                <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-brand" />
                מה קורה בקהילות
              </p>
            </FadeUp>
            <FadeUp delay={0.08} y={20}>
              <h2 className="mt-5 font-sans font-black tracking-[-0.01em] text-[#2d1a0e] text-4xl md:text-6xl leading-[1.1]">
                הקהילות הכי שוות לחיבור{' '}
                <span className="font-garamond font-bold text-brand">לעצמנו ובינינו</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.16} y={14}>
              <p className="mt-6 text-lg text-[#3d2814]/85 leading-relaxed max-w-md">
                ועוד מלא פינות, שרשורים, מתנות, כלים ואירועים. והכל בחינם.
              </p>
            </FadeUp>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PILLARS.map((pl, i) => (
              <m.li
                key={pl.title}
                className="group relative rounded-[28px] bg-white/75 ring-1 ring-brand/10 p-7 shadow-[0_20px_50px_-30px_rgba(168,90,84,0.5)] text-right overflow-hidden"
                initial={reduce ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ ...enterSpring, delay: (i % 2) * 0.1 }}
              >
                <span aria-hidden className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-[radial-gradient(circle,rgba(230,192,96,0.35)_0%,transparent_70%)] transition-transform duration-500 group-hover:scale-125" />
                <span className="relative flex w-12 h-12 items-center justify-center rounded-2xl bg-brand/10 text-brand-dark">
                  <PillarIcon name={pl.icon} />
                </span>
                <h3 className="relative mt-5 font-sans font-black text-xl text-[#2d1a0e]">{pl.title}</h3>
                <p className="relative mt-2 text-[#3d2814]/85 leading-relaxed">{pl.text}</p>
              </m.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

// Facebook: the two big communities, on the warm gray
function FacebookSection() {
  return (
    <section id="facebook" className="relative px-6 py-24 md:py-32 text-cream scroll-mt-8" style={{ background: GRAY }}>
      <AuroraBackground palette="gray" />
      <GrainOverlay opacity={0.2} blend="soft-light" />
      <div className="relative max-w-6xl mx-auto">
        <SectionHead
          tone="dark"
          kicker="קהילות הפייסבוק"
          icon={<FacebookIcon className="w-4 h-4" />}
          title="מתחברים"
          accent="ומתחברות"
          lead="שתי קהילות, אחת לנשים ואחת לגברים. כל אחת מרחב בטוח משלה."
        />
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {FACEBOOK_GROUPS.map((g, i) => (
            <GroupCard key={g.title} index={i} tone="dark" kind="facebook" title={g.title} tagline={g.subtitle} description={g.description} href={g.href} cta={g.cta} />
          ))}
        </div>
      </div>
    </section>
  )
}

// WhatsApp: focused groups, back on cream
function WhatsAppSection() {
  return (
    <section id="whatsapp" className="relative bg-cream px-6 py-24 md:py-32 scroll-mt-8">
      <AuroraBackground palette="cream" />
      <GrainOverlay />
      <div className="relative max-w-6xl mx-auto">
        <SectionHead
          tone="light"
          kicker="קהילות הוואטסאפ"
          icon={<WhatsAppIcon className="w-4 h-4" />}
          title="ממוקדות"
          accent="ואיכותיות"
          lead="ערך אמיתי, בלי הצפה ובלי ספאם."
        />
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {WHATSAPP_GROUPS.map((g, i) => (
            <GroupCard key={g.title} index={i} tone="light" kind="whatsapp" title={g.title} tagline={g.tagline} description={g.description} bullets={g.bullets} href={g.href} cta="הצטרפו לקבוצה" />
          ))}
        </div>
      </div>
    </section>
  )
}

// Closing: the story in one line, then the gift
function Closing() {
  return (
    <section className="relative bg-cream px-6 pt-8 pb-28 md:pb-36 text-center">
      <GrainOverlay />
      <div className="relative max-w-3xl mx-auto">
        <FadeUp y={20}>
          <span aria-hidden className="block font-garamond text-7xl leading-none text-brand/40">”</span>
          <p className="mt-2 font-garamond font-bold text-[#2d1a0e] text-3xl md:text-5xl leading-snug text-balance">
            שתי הקבוצות נפתחו בתקופת הקורונה, וכבר מעל 22,000 גברים ונשים לומדים בהן ביחד.
          </p>
        </FadeUp>
        <FadeUp delay={0.15} y={14}>
          <p className="mt-6 text-lg md:text-xl text-[#3d2814]/80">בואו להצטרף אלינו, ובינתיים, מתנה ממני:</p>
        </FadeUp>
        <FadeUp delay={0.25} y={14} className="mt-8 flex justify-center">
          <Link
            data-hide-dock
            href="/v2/quiz"
            className="inline-flex flex-col items-center bg-brand text-white rounded-full px-10 py-3 shadow-xl shadow-brand/30 hover:shadow-brand/50 hover:scale-105 transition-[box-shadow,scale] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
          >
            <span className="font-bold text-lg md:text-xl leading-tight">להעמיק גם לבד</span>
            <span className="text-sm font-medium leading-tight mt-0.5">הדרכה במתנה · 3 שאלות קצרות</span>
          </Link>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Building blocks ─────────────────────────────────────────────────────────

function SectionHead({
  tone,
  kicker,
  icon,
  title,
  accent,
  lead,
}: {
  tone: 'light' | 'dark'
  kicker: string
  icon: React.ReactNode
  title: string
  accent: string
  lead: string
}) {
  const dark = tone === 'dark'
  return (
    <div className="text-center max-w-2xl mx-auto">
      <FadeUp y={12}>
        <p className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${dark ? 'bg-cream/10 text-gold' : 'bg-brand/10 text-brand-dark'}`}>
          {icon}
          {kicker}
        </p>
      </FadeUp>
      <FadeUp delay={0.08} y={20}>
        <h2 className={`mt-5 font-sans font-black tracking-[-0.01em] text-5xl md:text-7xl leading-[1.05] ${dark ? 'text-cream' : 'text-[#2d1a0e]'}`}>
          {title} <span className={`font-garamond font-bold ${dark ? 'text-gold' : 'text-brand'}`}>{accent}</span>
        </h2>
      </FadeUp>
      <FadeUp delay={0.16} y={14}>
        <p className={`mt-5 text-lg md:text-xl leading-relaxed ${dark ? 'text-cream/85' : 'text-[#3d2814]/85'}`}>{lead}</p>
      </FadeUp>
    </div>
  )
}

function GroupCard({
  index,
  tone,
  kind,
  title,
  tagline,
  description,
  bullets,
  href,
  cta,
}: {
  index: number
  tone: 'light' | 'dark'
  kind: 'facebook' | 'whatsapp'
  title: string
  tagline: string
  description: string
  bullets?: string[]
  href: string
  cta: string
}) {
  const reduce = useHydratedReducedMotion()
  const dark = tone === 'dark'
  const Icon = kind === 'facebook' ? FacebookIcon : WhatsAppIcon

  return (
    <m.article
      className={`group relative flex flex-col rounded-[32px] p-8 md:p-10 text-right overflow-hidden transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 ${
        dark
          ? 'bg-cream/[0.07] ring-1 ring-cream/15 hover:bg-cream/[0.1]'
          : 'bg-white/80 ring-1 ring-brand/10 shadow-[0_30px_70px_-35px_rgba(168,90,84,0.55)]'
      }`}
      initial={reduce ? false : { opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ ...enterSpring, delay: index * 0.12 }}
    >
      {/* Soft corner glows */}
      <span aria-hidden className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(230,192,96,0.35)_0%,transparent_70%)] pointer-events-none" />
      <span aria-hidden className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(201,120,112,0.35)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className={`text-sm font-bold ${dark ? 'text-gold' : 'text-brand-dark'}`}>{tagline}</p>
          <h3 className={`mt-2 font-sans font-black text-3xl md:text-4xl leading-tight text-balance ${dark ? 'text-cream' : 'text-[#2d1a0e]'}`}>{title.replace(/ \|/g, ' |')}</h3>
        </div>
        <span
          className={`shrink-0 flex w-14 h-14 items-center justify-center rounded-2xl ${
            kind === 'facebook' ? (dark ? 'bg-cream/10 text-cream' : 'bg-[#1877f2]/10 text-[#1877f2]') : 'bg-[#1f8a4c]/12 text-[#17663a]'
          } ${dark && kind === 'whatsapp' ? 'bg-cream/10 text-cream' : ''}`}
        >
          <Icon className="w-7 h-7" />
        </span>
      </div>

      <p className={`relative mt-6 text-lg leading-relaxed ${dark ? 'text-cream/85' : 'text-[#3d2814]/85'}`}>{description}</p>

      {bullets && (
        <ul className="relative mt-6 space-y-3">
          {bullets.map((b) => (
            <li key={b} className={`flex items-start gap-3 ${dark ? 'text-cream/90' : 'text-[#3d2814]/90'}`}>
              <span aria-hidden className="mt-2 w-2 h-2 rounded-full bg-gold shrink-0 shadow-[0_0_10px_rgba(230,192,96,0.6)]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="relative mt-auto pt-8">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-track="community_join_click"
          data-track-kind={kind}
          data-track-group={title}
          className={`inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full font-bold px-8 py-4 transition-[background-color,transform] duration-300 focus-visible:outline-none focus-visible:ring-4 ${
            dark
              ? 'bg-gold text-[#2d1a0e] hover:bg-cream focus-visible:ring-gold/40'
              : 'bg-brand text-white hover:bg-brand-dark shadow-lg shadow-brand/30 focus-visible:ring-brand/40'
          }`}
        >
          <Icon className="w-5 h-5" />
          {cta}
          <svg className="w-4 h-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          <span className="sr-only">(נפתח בחלון חדש)</span>
        </a>
      </div>
    </m.article>
  )
}

// Counts up once when scrolled into view (thousands separators)
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useHydratedReducedMotion()
  const value = useMotionValue(0)
  const display = useTransform(() => `${Math.round(value.get()).toLocaleString('en-US')}${suffix}`)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      value.set(to)
      return
    }
    const controls = animate(value, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [inView, reduce, to, value])

  return (
    <span ref={ref} aria-label={`${to.toLocaleString('en-US')}${suffix}`}>
      <m.span aria-hidden>{display}</m.span>
    </span>
  )
}

function PillarIcon({ name }: { name: (typeof PILLARS)[number]['icon'] }) {
  const common = { className: 'w-6 h-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.8, 'aria-hidden': true } as const
  switch (name) {
    case 'learn':
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      )
    case 'heart':
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      )
    case 'talk':
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      )
    case 'people':
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      )
  }
}

function FacebookIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z" />
    </svg>
  )
}

function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.2z" />
    </svg>
  )
}
