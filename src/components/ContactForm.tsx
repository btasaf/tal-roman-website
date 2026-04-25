'use client'

import { useState } from 'react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

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

    // Placeholder — no server yet. Simulate a short delay.
    await new Promise((r) => setTimeout(r, 800))
    setState('success')
    form.reset()
  }

  const inputBase =
    'w-full bg-white border border-[#e6c060]/30 rounded-xl px-4 py-3 text-right text-[#303030] placeholder-[#9a9a9a] focus:outline-none focus:border-[#e6c060] focus:ring-2 focus:ring-[#e6c060]/20 transition-colors dir-rtl'
  const labelBase = 'block text-sm font-semibold text-[#e8d5bf] mb-1 text-right'

  if (state === 'success') {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">✉️</div>
        <h3 className="text-2xl font-bold text-[#e6c060] mb-2">תודה!</h3>
        <p className="text-[#d4b896] text-lg">קיבלתי את הפנייה שלך ואחזור אליך בהקדם.</p>
        <button
          onClick={() => setState('idle')}
          className="mt-6 text-[#e6c060]/70 underline text-sm hover:text-[#e6c060] transition-colors"
        >
          שלח פנייה נוספת
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 max-w-lg mx-auto" dir="rtl">
      {/* Name */}
      <div>
        <label htmlFor="name" className={labelBase}>
          שם מלא <span className="text-[#cd2c2c]">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="הכניסי את שמך"
          className={inputBase}
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-[#cd2c2c] text-xs mt-1 text-right">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelBase}>
          כתובת מייל <span className="text-[#cd2c2c]">*</span>
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
        {errors.email && <p className="text-[#cd2c2c] text-xs mt-1 text-right">{errors.email}</p>}
      </div>

      {/* Phone (optional) */}
      <div>
        <label htmlFor="phone" className={labelBase}>
          טלפון <span className="text-[#d4b896]/50 font-normal">(אופציונלי)</span>
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

      {/* Message (optional) */}
      <div>
        <label htmlFor="message" className={labelBase}>
          הודעה <span className="text-[#d4b896]/50 font-normal">(אופציונלי)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="כתבי לי..."
          className={`${inputBase} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="w-full bg-[#cd2c2c] text-white font-bold py-4 rounded-full text-lg hover:bg-[#a82424] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg shadow-[#cd2c2c]/30"
      >
        {state === 'submitting' ? 'שולח...' : 'שלח פנייה'}
      </button>
    </form>
  )
}
