'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { useCrmTracking } from '@/hooks/useCrmTracking'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { FadeUp, SectionTitle } from '../coaching/motion'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { ArrowIcon, Field, FormError, LockIcon, PrivacyNote, SubmitButton, SuccessMark, validateNameEmail, type FormState, type NameEmailErrors } from '../contact-page/form-ui'
import { CheckIcon, GiftCover, SIGNUP_ID } from './gift-ui'

interface CrmProps {
  tag?: string
  status?: string
  enrollToSchool?: string
  slug: string
}

// The close: leave a name and email, get the guide. Same request, body and tracking as the live gift form.
export default function GiftSignup({ title, imageUrl, lead, ...crm }: CrmProps & { title: string; imageUrl: string | null; lead?: string }) {
  return (
    <section id={SIGNUP_ID} className="relative px-5 md:px-8 pt-16 md:pt-24 pb-28 md:pb-36 scroll-mt-4 overflow-x-clip">
      <div aria-hidden className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_40%)]">
        <AuroraBackground palette="cream" />
        <GrainOverlay />
      </div>

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-16 items-center">
        <div className="text-right">
          <SectionTitle kicker="במתנה ממני" title="קבלו את ההדרכה" accent="ההדרכה" align="start" />
          {lead && (
            <FadeUp y={14} delay={0.15}>
              <p className="mt-6 text-lg md:text-2xl font-bold text-[#3d2814] leading-relaxed whitespace-pre-line text-pretty max-w-lg">{lead}</p>
            </FadeUp>
          )}
          <FadeUp y={14} delay={0.22}>
            <ul className="mt-8 space-y-3 text-[#5a4538] text-lg">
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-brand/10 text-brand-dark flex items-center justify-center shrink-0"><CheckIcon /></span>
                בלי עלות
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-brand/10 text-brand-dark flex items-center justify-center shrink-0"><CheckIcon /></span>
                פרטי הגישה נשלחים גם למייל
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-brand/10 text-brand-dark flex items-center justify-center shrink-0"><LockIcon className="w-4 h-4" /></span>
                בדיסקרטיות מלאה
              </li>
            </ul>
          </FadeUp>
          <FadeUp y={20} delay={0.3} className="hidden lg:block mt-10 max-w-sm">
            <GiftCover src={imageUrl} title={title} size="sm" />
          </FadeUp>
        </div>

        <FadeUp delay={0.1} y={40} className="w-full max-w-2xl mx-auto lg:max-w-none">
          <div
            data-hide-dock
            className="relative rounded-[32px] bg-white/90 backdrop-blur-sm ring-1 ring-brand/10 shadow-[0_40px_90px_-36px_rgba(168,90,84,0.5)] p-6 sm:p-8 md:p-10"
          >
            <GiftForm {...crm} />
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

function GiftForm({ tag, status, enrollToSchool, slug }: CrmProps) {
  const reduce = useHydratedReducedMotion()
  const { track } = useCrmTracking()
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<NameEmailErrors>({})
  const [giftLink, setGiftLink] = useState<string | null>(null)
  const visitorIdRef = useRef<string | null>(null)

  useEffect(() => {
    const KEY = 'crm_visitor_id'
    let id = localStorage.getItem(KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(KEY, id)
    }
    visitorIdRef.current = id
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = data.get('name')?.toString().trim() ?? ''
    const email = data.get('email')?.toString().trim() ?? ''

    const errs = validateNameEmail(name, email)
    setErrors(errs)
    if (Object.keys(errs).length) {
      track('form_validation_error', { form: 'gift_signup', slug, fields: Object.keys(errs).join(',') })
      ;(form.querySelector(errs.name ? '#gf-name' : '#gf-email') as HTMLInputElement | null)?.focus()
      return
    }

    setState('submitting')
    try {
      // Every key present, even when null (JSON.stringify keeps null), exactly like the live form
      const body: Record<string, unknown> = {
        name: name || null,
        mail: email || null,
        tag: tag?.trim() || null,
        status: status?.trim() || null,
        enrollToSchool: enrollToSchool?.trim() || null,
        notifyTal: true,
        visitorId: visitorIdRef.current ?? null,
      }

      const res = await fetch('/api/crm/save-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const result = await res.json()

      // No window.open after async work (popup blockers); the visitor clicks an explicit button instead
      if (result?.uniqueLink) setGiftLink(result.uniqueLink)
      if (slug) track(`got-gift/${slug}`)
      track('form_submit', { form: 'gift_signup', slug, result: 'success' })
      setState('success')
    } catch {
      track('form_submit', { form: 'gift_signup', slug, result: 'error' })
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
          <h3 className="mt-6 font-sans font-black tracking-[-0.01em] text-3xl md:text-4xl text-[#2d1a0e] text-balance">ההדרכה מוכנה בשבילך!</h3>
          {giftLink ? (
            <>
              <a
                href={giftLink}
                onClick={() => {
                  if (slug) track(`watch-gift/${slug}`)
                }}
                data-track-skip
                className="group mt-8 inline-flex items-center justify-center gap-3 bg-brand text-white font-bold text-lg px-8 py-4 rounded-full shadow-xl shadow-brand/30 hover:bg-brand-dark hover:shadow-brand/50 transition-[background-color,box-shadow] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
              >
                לצפייה בהדרכה עכשיו
                <ArrowIcon className="transition-transform duration-300 group-hover:-translate-x-1" />
              </a>
              <p className="mt-5 text-[#5a4538] text-base leading-relaxed text-pretty max-w-sm mx-auto">
                פרטי הגישה נשלחים אליך גם למייל, כדי שאפשר יהיה לחזור ולצפות מתי שנוח.
              </p>
            </>
          ) : (
            <p className="mt-3 text-lg text-[#5a4538] leading-relaxed text-pretty">הפרטים נקלטו בהצלחה! פרטי הגישה להדרכה יישלחו אליך למייל.</p>
          )}
        </m.div>
      ) : (
        <m.form key="form" {...fade} transition={enterSpring} onSubmit={handleSubmit} noValidate data-track-form="gift_signup" dir="rtl" className="space-y-5" aria-label="טופס קבלת ההדרכה">
          <div className="text-right">
            <h3 className="font-sans font-black tracking-[-0.01em] text-2xl md:text-3xl text-[#2d1a0e]">לאן לשלוח?</h3>
            <p className="mt-1.5 text-[#5a4538] text-lg">השאירו פרטים ואשלח לכם ישירות</p>
          </div>
          <Field id="gf-name" name="name" label="שם מלא" autoComplete="name" required error={errors.name} />
          <Field id="gf-email" name="email" label="כתובת מייל" type="email" inputMode="email" autoComplete="email" dir="ltr" required error={errors.email} />

          <FormError show={state === 'error'}>משהו השתבש. אפשר לנסות שוב.</FormError>

          <div className="space-y-3 pt-1">
            <SubmitButton submitting={state === 'submitting'} reduce={reduce} label="שלחו לי את ההדרכה" busyLabel="שולחים..." />
            <PrivacyNote />
          </div>
        </m.form>
      )}
    </AnimatePresence>
  )
}
