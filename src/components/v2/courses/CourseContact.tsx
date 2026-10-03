'use client'

import { useId, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { useCrmTracking } from '@/hooks/useCrmTracking'
import { GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { CONTACT_ID } from './course-data'
import { FadeUp, SectionTitle } from './motion'
import { ArrowIcon } from './ui'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Shown only for a course without a purchase link (like the live page). Same CRM call as the live ContactForm:
// saveCustomer({ name, mail, phone, tag: <course slug>, status: "קר", freeText, emailConsent, notifyTal: true }).
export default function CourseContact({ slug }: { slug: string }) {
  return (
    <section id={CONTACT_ID} className="relative px-5 md:px-8 pt-8 md:pt-12 pb-28 md:pb-36 scroll-mt-4">
      <GrainOverlay />
      <div className="relative max-w-xl mx-auto">
        <SectionTitle kicker="צור קשר" title="השאירו פרטים" accent="פרטים" />
        <FadeUp delay={0.12} y={14}>
          <p className="mt-5 text-center text-lg md:text-xl text-[#3d2814]/85">ואחזור אליך בהקדם לתיאום שיחת היכרות</p>
        </FadeUp>
        <FadeUp delay={0.18} y={36} className="mt-10">
          <div data-hide-dock className="rounded-[32px] bg-white/85 ring-1 ring-brand/10 shadow-[0_30px_80px_-30px_rgba(168,90,84,0.45)] p-6 sm:p-8 md:p-10">
            <ContactForm slug={slug} />
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'
type Errors = Partial<Record<'name' | 'email', string>>

function ContactForm({ slug }: { slug: string }) {
  const reduce = useHydratedReducedMotion()
  const { saveCustomer, track } = useCrmTracking()
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const uid = useId()

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
      track('form_validation_error', { form: 'course', slug, fields: Object.keys(errs).join(',') })
      ;(form.elements.namedItem(errs.name ? 'name' : 'email') as HTMLInputElement | null)?.focus()
      return
    }
    setState('submitting')
    try {
      await saveCustomer({
        name,
        mail: email,
        phone: data.get('phone')?.toString().trim() || undefined,
        tag: slug || undefined,
        status: 'קר',
        freeText: data.get('freeText')?.toString().trim() || undefined,
        emailConsent: data.get('emailConsent') === 'on',
        notifyTal: true,
      })
      track('form_submit', { form: 'course', slug, result: 'success' })
      setState('success')
      form.reset()
    } catch {
      track('form_submit', { form: 'course', slug, result: 'error' })
      setState('error')
    }
  }

  const fade = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -16 } }

  const input =
    'w-full rounded-2xl bg-cream/40 ring-1 ring-[#e3cfb4] hover:ring-[#d4b896] px-4 py-3.5 text-[#2d1a0e] outline-none transition-[box-shadow,background-color] focus:bg-white focus:ring-2 focus:ring-brand/60'
  const label = 'block text-sm font-bold text-[#5a4538] mb-1.5'

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state === 'success' ? (
        <m.div key="ok" {...fade} transition={enterSpring} className="text-center py-10" role="status" aria-live="polite">
          <h3 className="font-sans font-black text-3xl md:text-4xl text-[#2d1a0e]">תודה!</h3>
          <p className="mt-3 text-lg text-[#5a4538]">קיבלתי את הפנייה שלך ואחזור אליך בהקדם.</p>
          <button type="button" onClick={() => setState('idle')} className="mt-8 text-brand-dark font-bold underline-offset-4 hover:underline rounded-full px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
            שליחת פנייה נוספת
          </button>
        </m.div>
      ) : (
        <m.form key="form" {...fade} transition={enterSpring} onSubmit={handleSubmit} noValidate data-track-form="course" dir="rtl" className="space-y-5 text-right">
          <div>
            <label htmlFor={`${uid}-name`} className={label}>
              שם מלא <span className="text-brand">*</span>
            </label>
            <input id={`${uid}-name`} name="name" autoComplete="name" aria-invalid={!!errors.name || undefined} aria-describedby={errors.name ? `${uid}-name-e` : undefined} className={input} />
            {errors.name && <p id={`${uid}-name-e`} className="text-brand-dark text-sm mt-1.5">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor={`${uid}-email`} className={label}>
              כתובת מייל <span className="text-brand">*</span>
            </label>
            <input id={`${uid}-email`} name="email" type="email" dir="ltr" autoComplete="email" aria-invalid={!!errors.email || undefined} aria-describedby={errors.email ? `${uid}-email-e` : undefined} className={`${input} text-left`} />
            {errors.email && <p id={`${uid}-email-e`} className="text-brand-dark text-sm mt-1.5">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor={`${uid}-phone`} className={label}>
              טלפון <span className="font-normal opacity-70">(אופציונלי)</span>
            </label>
            <input id={`${uid}-phone`} name="phone" type="tel" dir="ltr" autoComplete="tel" className={`${input} text-left`} />
          </div>
          <div>
            <label htmlFor={`${uid}-msg`} className={label}>
              הודעה <span className="font-normal opacity-70">(אופציונלי)</span>
            </label>
            <textarea id={`${uid}-msg`} name="freeText" rows={4} placeholder="מה תרצו לשאול או לספר לי?" className={`${input} resize-none placeholder:text-[#8a6a55]`} />
          </div>
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input type="checkbox" name="emailConsent" className="mt-1 w-4 h-4 accent-[#c97870]" />
            <span className="text-sm text-[#5a4538] leading-relaxed">אשמח לקבל עדכונים, תכנים וטיפים ממך במייל</span>
          </label>
          {state === 'error' && (
            <p className="rounded-2xl bg-brand/10 text-brand-dark text-sm p-3 text-center" role="alert">
              משהו השתבש. אפשר לנסות שוב או לכתוב ישירות בוואטסאפ.
            </p>
          )}
          <button
            type="submit"
            disabled={state === 'submitting'}
            className="group w-full inline-flex items-center justify-center gap-3 bg-brand text-white font-bold text-lg py-4 rounded-full shadow-xl shadow-brand/30 hover:bg-brand-dark transition-colors disabled:opacity-70 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
          >
            {state === 'submitting' ? 'שליחה...' : 'שליחת פנייה'}
            {state !== 'submitting' && <ArrowIcon className="transition-transform duration-300 group-hover:-translate-x-1" />}
          </button>
        </m.form>
      )}
    </AnimatePresence>
  )
}
