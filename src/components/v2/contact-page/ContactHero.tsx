'use client'

import Image from 'next/image'
import { m } from 'framer-motion'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { Kicker } from '../coaching/ui'
import ContactPageForm from './ContactPageForm'
import { ClockIcon, LockIcon, WhatsAppIcon, ArrowIcon } from './form-ui'
import { AVATAR, FORM_ID } from './contact-content'

const rise = (reduce: boolean, delay: number, y = 18) => ({
  initial: reduce ? (false as const) : { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { ...enterSpring, delay },
})

// First screen: the invitation on the right, the form card on the left (below the title on phones).
// On load the title wipes up out of a clip, the copy follows, and the card rises into place.
export default function ContactHero({ tag, status, whatsappUrl }: { tag?: string; status?: string; whatsappUrl: string | null }) {
  const reduce = useHydratedReducedMotion()

  return (
    <section className="relative bg-cream overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,black_60%,transparent)]">
        <AuroraBackground palette="cream" />
        <GrainOverlay />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 md:px-8 pt-24 md:pt-28 lg:pt-32 pb-16 md:pb-24 grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] lg:grid-rows-[auto_1fr] gap-x-14 xl:gap-x-20 gap-y-10 lg:gap-y-0 items-start">
        {/* Title */}
        <div className="text-right lg:col-start-1 lg:row-start-1">
          <m.div {...rise(reduce, 0.05, 10)}>
            <Kicker>צרו קשר</Kicker>
          </m.div>
          <m.h1
            className="mt-5 font-sans font-black tracking-[-0.01em] text-[#2d1a0e] text-[3.4rem] leading-[1.02] sm:text-7xl lg:text-[5.6rem]"
            initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)', y: 30 }}
            animate={{ clipPath: 'inset(0 0 -14% 0)', y: 0 }}
            transition={{ ...enterSpring, delay: 0.12 }}
          >
            בואו <span className="font-garamond font-bold text-brand">נדבר</span>
          </m.h1>
          <m.p {...rise(reduce, 0.24)} className="mt-6 text-xl md:text-2xl font-bold text-[#3d2814] leading-snug max-w-md text-pretty">
            יש לכם שאלה? רוצים להתחיל? כתבו לי.
          </m.p>
        </div>

        {/* Reassurance (after the form on phones) */}
        <m.div {...rise(reduce, 0.36)} className="text-right order-3 lg:order-none lg:col-start-1 lg:row-start-2 lg:pt-10">
          <div className="inline-flex items-center gap-4 rounded-full bg-white/75 ring-1 ring-brand/10 pe-6 ps-1.5 py-1.5 shadow-[0_10px_30px_-18px_rgba(168,90,84,0.5)]">
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shrink-0">
              <Image src={AVATAR} alt="" fill sizes="48px" className="object-cover object-top" />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-[#2d1a0e]">טל קוראת כל פנייה בעצמה</p>
              <p className="text-sm text-[#5a4538]">בדיסקרטיות מלאה</p>
            </div>
          </div>

          <ul className="mt-8 space-y-1 max-w-md text-[#5a4538]">
            <li className="flex items-center gap-4 py-2.5">
              <span className="w-11 h-11 rounded-xl bg-brand/10 text-brand-dark flex items-center justify-center shrink-0">
                <ClockIcon />
              </span>
              כל פנייה נקראת אישית, ואחזור אליכם בהקדם
            </li>
            <li className="flex items-center gap-4 py-2.5">
              <span className="w-11 h-11 rounded-xl bg-brand/10 text-brand-dark flex items-center justify-center shrink-0">
                <LockIcon />
              </span>
              הפרטים נשמרים בדיסקרטיות מלאה ולא יועברו לאף גורם
            </li>
          </ul>

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 flex max-w-md items-center gap-4 rounded-2xl bg-white/60 hover:bg-white ring-1 ring-brand/10 hover:ring-[#1f8a4c]/40 p-4 transition-[background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f8a4c]/60"
            >
              <span className="w-11 h-11 rounded-xl bg-[#1f8a4c]/10 text-[#17663a] flex items-center justify-center shrink-0">
                <WhatsAppIcon />
              </span>
              <span className="flex-1">
                <span className="block font-bold text-[#2d1a0e]">מעדיפים וואטסאפ?</span>
                <span className="block text-sm text-[#5a4538]">הדרך הכי מהירה להגיע אליי</span>
              </span>
              <ArrowIcon className="text-[#17663a] transition-transform duration-300 group-hover:-translate-x-1" />
            </a>
          )}
        </m.div>

        {/* Form card */}
        <m.div
          id={FORM_ID}
          className="order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2 scroll-mt-6"
          initial={reduce ? false : { opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...enterSpring, delay: 0.2 }}
        >
          <div
            data-hide-dock
            className="relative rounded-[32px] bg-white/90 backdrop-blur-sm ring-1 ring-brand/10 shadow-[0_40px_90px_-36px_rgba(168,90,84,0.5)] p-6 sm:p-8 md:p-10"
          >
            <div className="text-right mb-7">
              <h2 className="font-sans font-black tracking-[-0.01em] text-2xl md:text-3xl text-[#2d1a0e]">שלחו לי הודעה</h2>
              <p className="mt-1.5 text-[#5a4538] text-lg">אחזור אליכם בהקדם</p>
            </div>
            <ContactPageForm tag={tag} status={status} hasWhatsApp={!!whatsappUrl} />
          </div>
        </m.div>
      </div>
    </section>
  )
}
