'use client'

import { useId, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, m } from 'framer-motion'
import { useCrmTracking } from '@/hooks/useCrmTracking'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { FadeUp, SectionTitle } from './motion'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { CONTACT_ID, CRM_STATUS, CRM_TAG } from './coaching-content'
import { ArrowIcon, DetailIcon } from './ui'

const AVATAR = '/wix-assets/images/tal-photos/VV9A8369%20copy_edited.jpg'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// The close: leave details for an intro call. Same CRM call as the live page's form
// (saveCustomer: name, mail, phone, tag "ליווי-אישי", status "קר", freeText, emailConsent, notifyTal).
export default function CoachingContact() {
  return (
    <section id={CONTACT_ID} className="relative px-5 md:px-8 pt-16 md:pt-24 pb-28 md:pb-36 scroll-mt-4 overflow-x-clip">
      <div aria-hidden className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_40%)]">
        <AuroraBackground palette="cream" />
      </div>
      <GrainOverlay />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
        <div className="text-right lg:sticky lg:top-28">
          <SectionTitle kicker="הצעד הראשון" title="השאירו פרטים" accent="פרטים" align="start" />
          <FadeUp delay={0.15} y={14}>
            <p className="mt-5 text-lg md:text-2xl text-[#3d2814]/85 leading-relaxed max-w-md text-pretty">
              ואחזור אליך בהקדם לתיאום שיחת היכרות
            </p>
          </FadeUp>

          <FadeUp delay={0.22} y={14}>
            <div className="mt-8 inline-flex items-center gap-4 rounded-full bg-white/70 ring-1 ring-brand/10 pe-6 ps-1.5 py-1.5 shadow-[0_10px_30px_-18px_rgba(168,90,84,0.5)]">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shrink-0">
                <Image src={AVATAR} alt="" fill sizes="48px" className="object-cover object-top" />
              </div>
              <div className="leading-tight">
                <p className="font-bold text-[#2d1a0e]">טל רומן</p>
                <p className="text-sm text-[#5a4538]">פרטיות מלאה ומרחב לא שיפוטי</p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.3} y={14}>
            <ul className="mt-6 space-y-4 max-w-md text-[#5a4538]">
              <li className="flex items-center gap-4">
                <span className="w-11 h-11 rounded-xl bg-brand/10 text-brand-dark flex items-center justify-center shrink-0">
                  <DetailIcon name="pin" />
                </span>
                קליניקה בדרום תל אביב או בזום
              </li>
            </ul>
          </FadeUp>
        </div>

        <FadeUp delay={0.1} y={40}>
          <div
            data-hide-dock
            className="relative rounded-[32px] bg-white/85 backdrop-blur-sm ring-1 ring-brand/10 shadow-[0_30px_80px_-30px_rgba(168,90,84,0.45)] p-6 sm:p-8 md:p-10"
          >
            <CoachingForm />
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'
type Errors = Partial<Record<'name' | 'email', string>>

function CoachingForm() {
  const reduce = useHydratedReducedMotion()
  const { saveCustomer, track } = useCrmTracking()
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<Errors>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = data.get('name')?.toString().trim() ?? ''
    const email = data.get('email')?.toString().trim() ?? ''

    const errs: Errors = {}
    if (!name) errs.name = 'נא להזין שם מלא'
    if (!email) errs.email = 'נא להזין כתובת מייל'
    else if (!EMAIL_RE.test(email)) errs.email = 'כתובת מייל לא תקינה'
    setErrors(errs)
    if (Object.keys(errs).length) {
      track('form_validation_error', { form: 'coaching', fields: Object.keys(errs).join(',') })
      ;(form.querySelector(errs.name ? '#pc-name' : '#pc-email') as HTMLInputElement | null)?.focus()
      return
    }

    setState('submitting')
    try {
      await saveCustomer({
        name,
        mail: email,
        phone: data.get('phone')?.toString().trim() || undefined,
        tag: CRM_TAG,
        status: CRM_STATUS,
        freeText: data.get('freeText')?.toString().trim() || undefined,
        emailConsent: data.get('emailConsent') === 'on',
        notifyTal: true,
      })
      track('form_submit', { form: 'coaching', result: 'success' })
      setState('success')
      form.reset()
    } catch {
      track('form_submit', { form: 'coaching', result: 'error' })
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
          <h3 className="mt-6 font-sans font-black tracking-[-0.01em] text-3xl md:text-4xl text-[#2d1a0e]">תודה!</h3>
          <p className="mt-3 text-lg text-[#5a4538] text-pretty">קיבלתי את הפנייה שלך ואחזור אליך בהקדם.</p>
          <button
            type="button"
            onClick={() => setState('idle')}
            className="mt-8 text-brand-dark font-bold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded-full px-2"
          >
            שליחת פנייה נוספת
          </button>
        </m.div>
      ) : (
        <m.form key="form" {...fade} transition={enterSpring} onSubmit={handleSubmit} noValidate data-track-form="coaching" dir="rtl" className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field id="pc-name" name="name" label="שם מלא" autoComplete="name" required error={errors.name} />
            <Field id="pc-phone" name="phone" label="טלפון" type="tel" autoComplete="tel" dir="ltr" optional />
          </div>
          <Field id="pc-email" name="email" label="כתובת מייל" type="email" autoComplete="email" dir="ltr" required error={errors.email} />
          <Field id="pc-msg" name="freeText" label="מה תרצו לשאול או לספר לי?" multiline optional />

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
            <span className="text-sm text-[#5a4538] leading-relaxed">אשמח לקבל עדכונים, תכנים וטיפים ממך במייל</span>
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
                משהו השתבש. אפשר לנסות שוב או לכתוב ישירות בוואטסאפ.
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
                שליחה...
              </>
            ) : (
              <>
                שליחת פנייה
                <ArrowIcon className="transition-transform duration-300 group-hover:-translate-x-1" />
              </>
            )}
          </m.button>
        </m.form>
      )}
    </AnimatePresence>
  )
}

// Floating-label field: the label rests inside the box and moves up when focused or filled
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
          className="pointer-events-none absolute right-4 top-2 text-xs font-bold text-[#8a6a55] transition-all peer-placeholder-shown:top-[1.15rem] peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#7a6050] peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-brand-dark"
        >
          {label}
          {required && <span className="text-brand"> *</span>}
          {optional && <span className="font-normal opacity-70"> (אופציונלי)</span>}
        </label>
      </div>
      <AnimatePresence>
        {error && (
          <m.p id={errId} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-brand-dark text-sm mt-1.5 pr-1">
            {error}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  )
}

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
