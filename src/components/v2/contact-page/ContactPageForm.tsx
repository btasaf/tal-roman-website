'use client'

import { useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { useCrmTracking } from '@/hooks/useCrmTracking'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { ConsentCheckbox, Field, FormError, PrivacyNote, SubmitButton, SuccessMark, validateNameEmail, type FormState, type NameEmailErrors } from './form-ui'

// Same CRM call and payload as the live contact form (saveCustomer: name, mail, phone, tag, status,
// freeText, emailConsent, notifyTal), with the v2 interface.
export default function ContactPageForm({ tag, status, hasWhatsApp }: { tag?: string; status?: string; hasWhatsApp: boolean }) {
  const reduce = useHydratedReducedMotion()
  const { saveCustomer, track } = useCrmTracking()
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<NameEmailErrors>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = data.get('name')?.toString().trim() ?? ''
    const email = data.get('email')?.toString().trim() ?? ''

    const errs = validateNameEmail(name, email)
    setErrors(errs)
    if (Object.keys(errs).length) {
      track('form_validation_error', { form: 'contact_page', fields: Object.keys(errs).join(',') })
      ;(form.querySelector(errs.name ? '#cp-name' : '#cp-email') as HTMLInputElement | null)?.focus()
      return
    }

    setState('submitting')
    try {
      await saveCustomer({
        name,
        mail: email,
        phone: data.get('phone')?.toString().trim() || undefined,
        tag: tag || undefined,
        status: status || undefined,
        freeText: data.get('freeText')?.toString().trim() || undefined,
        emailConsent: data.get('emailConsent') === 'on',
        notifyTal: true,
      })
      track('form_submit', { form: 'contact_page', result: 'success' })
      setState('success')
      form.reset()
    } catch {
      track('form_submit', { form: 'contact_page', result: 'error' })
      setState('error')
    }
  }

  const fade = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -16 } }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state === 'success' ? (
        <m.div key="success" {...fade} transition={enterSpring} className="text-center py-12 md:py-20" role="status" aria-live="polite">
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
        <m.form key="form" {...fade} transition={enterSpring} onSubmit={handleSubmit} noValidate data-track-form="contact_page" dir="rtl" className="space-y-5" aria-label="טופס יצירת קשר">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field id="cp-name" name="name" label="שם מלא" autoComplete="name" required error={errors.name} />
            <Field id="cp-phone" name="phone" label="טלפון" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" optional />
          </div>
          <Field id="cp-email" name="email" label="כתובת מייל" type="email" inputMode="email" autoComplete="email" dir="ltr" required error={errors.email} />
          <Field id="cp-msg" name="freeText" label="מה תרצו לשאול או לספר לי?" multiline optional />

          <ConsentCheckbox label="אשמח לקבל עדכונים, תכנים וטיפים ממך במייל" />

          <FormError show={state === 'error'}>
            משהו השתבש. אפשר לנסות שוב{hasWhatsApp ? ' או לכתוב לי ישירות בוואטסאפ' : ''}.
          </FormError>

          <div className="space-y-3 pt-1">
            <SubmitButton submitting={state === 'submitting'} reduce={reduce} label="שליחת פנייה" busyLabel="שולחים..." />
            <PrivacyNote />
          </div>
        </m.form>
      )}
    </AnimatePresence>
  )
}
