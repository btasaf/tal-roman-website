'use client'

import { useState } from 'react'
import { useCrmTracking } from '@/hooks/useCrmTracking'

interface ContactFormProps {
  tag?: string
  status?: string
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactForm({ tag, status }: ContactFormProps) {
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { saveCustomer, trackFormSubmit } = useCrmTracking()

  function validate(data: FormData) {
    const errs: Record<string, string> = {}
    if (!data.get('name')?.toString().trim()) errs.name = 'נא להזין שם מלא'
    const email = data.get('email')?.toString().trim()
    if (!email) {
      errs.email = 'נא להזין כתובת מייל'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'כתובת מייל לא תקינה'
    }
    return errs
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const errs = validate(data)

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setState('submitting')
    setErrors({})

    try {
      await saveCustomer({
        name: data.get('name')?.toString().trim(),
        mail: data.get('email')?.toString().trim(),
        phone: data.get('phone')?.toString().trim() || undefined,
        tag: tag || undefined,
        status: status || undefined,
        freeText: data.get('freeText')?.toString().trim() || undefined,
        emailConsent: data.get('emailConsent') === 'on',
        notifyTal: true,
      })
      trackFormSubmit('contact')
      setState('success')
      form.reset()
    } catch {
      setState('error')
    }
  }

  const inputBase =
    'w-full bg-white border border-gold/30 rounded-xl px-4 py-3 text-right text-ink placeholder-mist focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-colors dir-rtl'
  const labelBase = 'block text-sm font-semibold text-ink mb-1 text-right'

  if (state === 'success') {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">✉️</div>
        <h3 className="text-2xl font-bold text-gold mb-2">תודה!</h3>
        <p className="text-sand text-lg">קיבלתי את הפנייה שלך ואחזור אליך בהקדם.</p>
        <button
          onClick={() => setState('idle')}
          className="mt-6 text-gold/70 underline text-sm hover:text-gold transition-colors"
        >
          שלח פנייה נוספת
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 max-w-lg mx-auto" dir="rtl">
      <div>
        <label htmlFor="name" className={labelBase}>
          שם מלא <span className="text-brand">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="הכניסי את שמך"
          className={inputBase}
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-brand text-xs mt-1 text-right">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className={labelBase}>
          כתובת מייל <span className="text-brand">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          className={`${inputBase} direction-ltr text-left`}
          dir="ltr"
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="text-brand text-xs mt-1 text-right">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className={labelBase}>
          טלפון <span className="text-sand/50 font-normal">(אופציונלי)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="050-0000000"
          className={inputBase}
          dir="ltr"
        />
      </div>

      <div>
        <label htmlFor="freeText" className={labelBase}>
          הודעה <span className="text-sand/50 font-normal">(אופציונלי)</span>
        </label>
        <textarea
          id="freeText"
          name="freeText"
          rows={4}
          placeholder="כתבי לי..."
          className={`${inputBase} resize-none`}
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          name="emailConsent"
          className="mt-1 w-4 h-4 accent-gold cursor-pointer flex-shrink-0"
        />
        <span className="text-sand/70 text-sm leading-relaxed group-hover:text-sand transition-colors">
          אשמח לקבל עדכונים, תכנים וטיפים ממך במייל
        </span>
      </label>

      {state === 'error' && (
        <p className="text-brand text-sm text-center">משהו השתבש. נסי שוב או כתבי ישירות בוואטסאפ.</p>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="w-full bg-brand text-white font-bold py-4 rounded-full text-lg hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg shadow-brand/30"
      >
        {state === 'submitting' ? 'שולח...' : 'שלח פנייה'}
      </button>
    </form>
  )
}
