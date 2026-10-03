'use client'

import { useId, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, m } from 'framer-motion'
import { useCrmTracking } from '@/hooks/useCrmTracking'
import { cleanWhatsApp } from '@/lib/utils'
import { FadeUp, SectionTitle, enterSpring } from './motion-kit'
import { AuroraBackground, GrainOverlay } from './backgrounds'
import { useHydratedReducedMotion } from './useHydratedReducedMotion'
import { ABOUT_WINDOW_VH, CONTACT_HOLD_VH } from './seam-config'

const TAL_PHOTO = '/wix-assets/images/tal-photos/VV9A8369%20copy_edited.jpg'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Optional topic chips. The CRM has no topic field, so the choice is prepended to the free text.
const TOPICS = ['ליווי אישי', 'סדנה לזוגות', 'הרצאה / שיתוף פעולה', 'סתם שאלה']

interface Props {
  tag?: string
  status?: string
  whatsapp?: string
  /** True when the About section renders right before: contact pins behind its portrait window */
  afterAbout?: boolean
}

export default function ContactV2({ tag, status, whatsapp, afterAbout = false }: Props) {
  const wa = cleanWhatsApp(whatsapp)

  return (
    <div className="relative z-[60]" style={afterAbout ? { marginTop: `-${ABOUT_WINDOW_VH + 100}svh` } : undefined}>
    <section id="contact" className="sticky top-0 min-h-svh flex flex-col justify-center bg-cream pt-16 pb-24 md:pt-20 md:pb-28 overflow-x-clip">
      {/* Background fades in from the top so it meets the cream above with no seam */}
      <div aria-hidden className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_35vh)]">
        <AuroraBackground palette="cream" />
        <GrainOverlay />
      </div>

      {/* Phones: title → form → extras. Desktop: title + extras on the right (RTL), form on the left. */}
      <div className="relative max-w-6xl mx-auto px-5 md:px-6 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] lg:grid-rows-[auto_1fr] gap-x-16 gap-y-8 lg:gap-y-0 items-start">
        <div className="text-right lg:col-start-1 lg:row-start-1">
          <SectionTitle kicker="בואו נדבר" title="צרו איתי קשר" accent="קשר" align="start" />

          <FadeUp delay={0.15} y={14}>
            <p className="mt-5 text-[#3d2814]/85 text-lg md:text-xl leading-relaxed max-w-md text-pretty">
              יש לך שאלה, רוצה לבדוק התאמה לליווי או סדנה? כתבו לי כמה מילים, ואני אחזור אליכם באופן אישי.
            </p>
          </FadeUp>
        </div>

        <div className="text-right order-2 lg:order-none lg:col-start-1 lg:row-start-2">
          {/* Personal touch */}
          <FadeUp delay={0.22} y={14}>
            <div className="mt-8 inline-flex items-center gap-4 rounded-full bg-white/70 ring-1 ring-brand/10 pe-6 ps-1.5 py-1.5 shadow-[0_10px_30px_-18px_rgba(168,90,84,0.5)]">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white">
                <Image src={TAL_PHOTO} alt="טל רומן" fill sizes="48px" className="object-cover object-top" />
              </div>
              <div className="leading-tight">
                <p className="font-bold text-[#2d1a0e]">טל קוראת כל פנייה בעצמה</p>
                <p className="text-sm text-[#5a4538]">בדיסקרטיות מלאה</p>
              </div>
            </div>
          </FadeUp>

          {/* Other ways to reach + reassurance */}
          <FadeUp delay={0.3} y={14}>
            <ul className="mt-8 space-y-3 max-w-md">
              {wa && (
                <li>
                  <a
                    href={`https://wa.me/${wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl bg-white/60 hover:bg-white ring-1 ring-brand/10 hover:ring-[#1f8a4c]/40 p-4 transition-[background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f8a4c]/60"
                  >
                    <span className="w-11 h-11 rounded-xl bg-[#1f8a4c]/10 text-[#17663a] flex items-center justify-center shrink-0">
                      <WhatsAppIcon />
                    </span>
                    <span className="flex-1">
                      <span className="block font-bold text-[#2d1a0e]">מעדיפים וואטסאפ?</span>
                      <span className="block text-sm text-[#5a4538]">כתבו לי ישירות, בלי טפסים</span>
                    </span>
                    <ArrowIcon className="text-[#17663a] transition-transform duration-300 group-hover:-translate-x-1" />
                  </a>
                </li>
              )}
              <li className="flex items-center gap-4 rounded-2xl p-4 text-[#5a4538]">
                <span className="w-11 h-11 rounded-xl bg-brand/10 text-brand-dark flex items-center justify-center shrink-0">
                  <ClockIcon />
                </span>
                <span>כל פנייה נקראת אישית, ואחזור אליכם בהקדם</span>
              </li>
              <li className="flex items-center gap-4 rounded-2xl p-4 text-[#5a4538]">
                <span className="w-11 h-11 rounded-xl bg-brand/10 text-brand-dark flex items-center justify-center shrink-0">
                  <LockIcon />
                </span>
                <span>הפרטים נשמרים בדיסקרטיות מלאה ולא יועברו לאף גורם</span>
              </li>
            </ul>
          </FadeUp>
        </div>

        {/* Form card (left on desktop) */}
        <FadeUp delay={0.1} y={40} className="order-3 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <div
            data-hide-dock
            className="relative rounded-[32px] bg-white/85 backdrop-blur-sm ring-1 ring-brand/10 shadow-[0_30px_80px_-30px_rgba(168,90,84,0.45)] p-6 sm:p-8 md:p-10"
          >
            <ContactFormV2 tag={tag} status={status} whatsapp={wa} />
          </div>
        </FadeUp>
      </div>
    </section>
    {/* Room for the pinned stretch: About's window-opening tail (ABOUT_WINDOW_VH) + a short hold before the footer (40vh) */}
    {afterAbout && <div aria-hidden style={{ height: `${ABOUT_WINDOW_VH + CONTACT_HOLD_VH}svh` }} />}
    </div>
  )
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'
type Errors = Partial<Record<'name' | 'email', string>>

// Same CRM call and fields as the site's original contact form (saveCustomer with name, mail, phone, tag,
// status, freeText, emailConsent, notifyTal), with a new interface.
function ContactFormV2({ tag, status, whatsapp }: { tag?: string; status?: string; whatsapp?: string }) {
  const reduce = useHydratedReducedMotion()
  const { saveCustomer, track } = useCrmTracking()
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const [topic, setTopic] = useState<string | null>(null)
  const [firstName, setFirstName] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = data.get('name')?.toString().trim() ?? ''
    const email = data.get('email')?.toString().trim() ?? ''

    const errs: Errors = {}
    if (!name) errs.name = 'איך לפנות אליך?'
    if (!email) errs.email = 'נשאר רק המייל'
    else if (!EMAIL_RE.test(email)) errs.email = 'נראה שחסר משהו בכתובת המייל'
    setErrors(errs)
    if (Object.keys(errs).length) {
      track('form_validation_error', { form: 'home_contact', fields: Object.keys(errs).join(',') })
      ;(form.querySelector(errs.name ? '#c-name' : '#c-email') as HTMLInputElement | null)?.focus()
      return
    }

    const message = data.get('freeText')?.toString().trim()
    const freeText = [topic ? `נושא: ${topic}` : '', message ?? ''].filter(Boolean).join('\n') || undefined

    setState('submitting')
    try {
      await saveCustomer({
        name,
        mail: email,
        phone: data.get('phone')?.toString().trim() || undefined,
        tag: tag || undefined,
        status: status || undefined,
        freeText,
        emailConsent: data.get('emailConsent') === 'on',
        notifyTal: true,
      })
      track('form_submit', { form: 'home_contact', result: 'success', topic: topic ?? undefined })
      setFirstName(name.split(' ')[0])
      setState('success')
      form.reset()
      setTopic(null)
    } catch {
      track('form_submit', { form: 'home_contact', result: 'error', topic: topic ?? undefined })
      setState('error')
    }
  }

  const fade = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -16 } }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state === 'success' ? (
        <m.div key="success" {...fade} transition={enterSpring} className="text-center py-10 md:py-14" role="status" aria-live="polite">
          <SuccessMark reduce={reduce} />
          <h3 className="mt-6 font-sans font-black tracking-[-0.01em] text-3xl md:text-4xl text-[#2d1a0e]">
            תודה{firstName ? `, ${firstName}` : ''}!
          </h3>
          <p className="mt-3 text-lg text-[#5a4538] text-pretty">ההודעה הגיעה אליי, ואחזור אליך בהקדם.</p>
          <button
            type="button"
            onClick={() => setState('idle')}
            className="mt-8 text-brand-dark font-bold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded-full px-2"
          >
            שליחת הודעה נוספת
          </button>
        </m.div>
      ) : (
        <m.form key="form" {...fade} transition={enterSpring} onSubmit={handleSubmit} noValidate data-track-form="home_contact" dir="rtl" className="space-y-5">
          <div>
            <p className="font-bold text-[#2d1a0e] mb-3">
              על מה נדבר? <span className="font-normal text-[#5a4538] text-sm">(לא חובה)</span>
            </p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="נושא הפנייה">
              {TOPICS.map((t) => {
                const on = topic === t
                return (
                  <m.button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setTopic(on ? null : t)}
                    data-track={on ? undefined : 'contact_topic_select'}
                    data-track-topic={t}
                    data-track-form="home_contact"
                    whileTap={reduce ? undefined : { scale: 0.96 }}
                    className={`min-h-10 rounded-full px-4 py-2 text-sm font-bold ring-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 ${
                      on ? 'bg-brand text-white ring-brand' : 'bg-cream/60 text-[#3d2814] ring-brand/20 hover:ring-brand/50'
                    }`}
                  >
                    {t}
                  </m.button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field id="c-name" name="name" label="שם" autoComplete="name" required error={errors.name} />
            <Field id="c-phone" name="phone" label="טלפון" type="tel" autoComplete="tel" dir="ltr" optional />
          </div>
          <Field id="c-email" name="email" label="מייל" type="email" autoComplete="email" dir="ltr" required error={errors.email} />
          <Field id="c-msg" name="freeText" label="מה תרצו לשאול או לספר?" multiline optional />

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input type="checkbox" name="emailConsent" className="peer sr-only" />
            <span
              aria-hidden
              className="mt-0.5 w-5 h-5 rounded-md ring-1 ring-[#d4b896] bg-white flex items-center justify-center shrink-0 transition-colors peer-checked:bg-brand peer-checked:ring-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand/50 [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
            >
              <svg className="w-3.5 h-3.5 text-white transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-sm text-[#5a4538] leading-relaxed">אשמח לקבל עדכונים, תכנים וטיפים במייל</span>
          </label>

          <AnimatePresence>
            {state === 'error' && (
              <m.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl bg-brand/10 text-brand-dark text-sm p-3 text-center"
                role="alert"
              >
                משהו השתבש בשליחה. אפשר לנסות שוב{whatsapp ? ' או לכתוב לי בוואטסאפ' : ''}.
              </m.p>
            )}
          </AnimatePresence>

          <m.button
            type="submit"
            disabled={state === 'submitting'}
            whileTap={reduce || state === 'submitting' ? undefined : { scale: 0.98 }}
            className="group w-full inline-flex items-center justify-center gap-3 bg-brand text-white font-bold text-lg py-4 rounded-full shadow-xl shadow-brand/30 hover:shadow-brand/50 hover:bg-brand-dark transition-[background-color,box-shadow] disabled:opacity-70 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
          >
            {state === 'submitting' ? (
              <>
                <Spinner />
                שולחת...
              </>
            ) : (
              <>
                שליחה
                <ArrowIcon className="transition-transform duration-300 group-hover:-translate-x-1" />
              </>
            )}
          </m.button>
        </m.form>
      )}
    </AnimatePresence>
  )
}

// Floating-label field: the label sits inside the box and moves up when focused or filled
function Field({
  id,
  name,
  label,
  type = 'text',
  multiline,
  required,
  optional,
  error,
  dir,
  autoComplete,
}: {
  id: string
  name: string
  label: string
  type?: string
  multiline?: boolean
  required?: boolean
  optional?: boolean
  error?: string
  dir?: 'ltr' | 'rtl'
  autoComplete?: string
}) {
  const errId = useId()
  const base =
    'peer w-full rounded-2xl bg-cream/40 ring-1 px-4 pt-6 pb-2.5 text-[#2d1a0e] placeholder-transparent outline-none transition-[box-shadow,background-color] focus:bg-white focus:ring-2'
  const ringCls = error ? 'ring-brand focus:ring-brand' : 'ring-[#e3cfb4] hover:ring-[#d4b896] focus:ring-brand/60'
  const common = {
    id,
    name,
    placeholder: label,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errId : undefined,
    'aria-required': required || undefined,
    autoComplete,
    dir,
  }

  return (
    <div>
      <div className="relative">
        {multiline ? (
          <textarea {...common} rows={4} className={`${base} ${ringCls} resize-none text-right`} />
        ) : (
          <input {...common} type={type} className={`${base} ${ringCls} h-[60px] ${dir === 'ltr' ? 'text-left' : 'text-right'}`} />
        )}
        <label
          htmlFor={id}
          className="pointer-events-none absolute right-4 top-2 text-xs font-bold text-[#8a6a55] transition-all peer-placeholder-shown:top-[1.15rem] peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#8a7060] peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-brand-dark"
        >
          {label}
          {required && <span className="text-brand"> *</span>}
          {optional && <span className="font-normal opacity-70"> (לא חובה)</span>}
        </label>
      </div>
      <AnimatePresence>
        {error && (
          <m.p
            id={errId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-brand-dark text-sm mt-1.5 pr-1"
          >
            {error}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// Success: a circle and check that draw themselves in
function SuccessMark({ reduce }: { reduce: boolean }) {
  return (
    <div className="mx-auto w-24 h-24 rounded-full bg-brand/10 flex items-center justify-center">
      <svg className="w-14 h-14 text-brand" viewBox="0 0 52 52" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <m.circle cx="26" cy="26" r="23" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} />
        <m.path d="M15 27l7 7 15-15" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: reduce ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }} />
      </svg>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity={0.3} strokeWidth={3} />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
    </svg>
  )
}

function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 rotate-180 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V8a4 4 0 118 0v3" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.2z" />
    </svg>
  )
}
