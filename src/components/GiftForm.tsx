'use client'

import { useState, useEffect, useRef } from 'react'
import { useCrmTracking } from '@/hooks/useCrmTracking'
import { useOriginRipple } from '@/hooks/useOriginRipple'

interface GiftFormProps {
  tag?: string
  status?: string
  enrollToSchool?: string
  slug?: string
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function GiftForm({ tag, status, enrollToSchool, slug }: GiftFormProps) {
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const visitorIdRef = useRef<string | null>(null)
  const { track } = useCrmTracking()
  const { rippleHandlers, ripple } = useOriginRipple()

  useEffect(() => {
    const KEY = 'crm_visitor_id'
    let id = localStorage.getItem(KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(KEY, id)
    }
    visitorIdRef.current = id
  }, [])

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
      // Build the body object explicitly so every key is present,
      // even when the value is null — JSON.stringify drops `undefined` but keeps `null`.
      const body: Record<string, unknown> = {
        name:           data.get('name')?.toString().trim() ?? null,
        mail:           data.get('email')?.toString().trim() ?? null,
        tag:            tag?.trim()            || null,
        status:         status?.trim()         || null,
        enrollToSchool: enrollToSchool?.trim() || null,
        notifyTal:      true,
        visitorId:      visitorIdRef.current ?? null,
      }

      const res = await fetch('/api/crm/save-customer', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })

      const result = await res.json()

      if (result?.uniqueLink) {
        window.open(result.uniqueLink, '_blank', 'noopener,noreferrer')
      }
      if (slug) track(`got_gift_${slug}`)
      setState('success')
    } catch {
      setState('error')
    }
  }

  const inputBase =
    'w-full bg-white border border-gold/30 rounded-xl px-4 py-3 text-right text-ink placeholder-mist focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-colors'
  const labelBase = 'block text-sm font-semibold text-sand mb-1 text-right'

  if (state === 'success') {
    return (
      <div className="text-center py-10 max-w-lg mx-auto" dir="rtl">
        <div className="text-6xl mb-5">🎬</div>
        <h3 className="text-2xl font-extrabold text-gold mb-3">תהנו מהצפייה!</h3>
        <p className="text-sand text-lg leading-relaxed">
          ההדרכה נפתחה בחלון חדש — אם לא ראיתם אותה, בדקו שהדפדפן לא חסם חלון קופץ.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 max-w-lg mx-auto" dir="rtl">
      <div>
        <label htmlFor="gift-name" className={labelBase}>
          שם מלא <span className="text-brand">*</span>
        </label>
        <input
          id="gift-name"
          name="name"
          type="text"
          placeholder="הכניסו את שמכם"
          className={inputBase}
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-brand text-xs mt-1 text-right">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="gift-email" className={labelBase}>
          כתובת מייל <span className="text-brand">*</span>
        </label>
        <input
          id="gift-email"
          name="email"
          type="email"
          placeholder="your@email.com"
          className={`${inputBase} text-left`}
          dir="ltr"
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="text-brand text-xs mt-1 text-right">{errors.email}</p>}
      </div>

      {state === 'error' && (
        <p className="text-brand text-sm text-center">משהו השתבש. נסו שוב.</p>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="relative overflow-hidden w-full bg-brand text-white font-bold py-4 rounded-full text-lg disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-brand/30"
        {...rippleHandlers}
      >
        <span className="relative">{state === 'submitting' ? 'שולח...' : 'שליחה'}</span>
        {ripple}
      </button>
    </form>
  )
}
