'use client'

import { useId } from 'react'
import Link from 'next/link'
import { AnimatePresence, m } from 'framer-motion'

// Form building blocks shared by the v2 contact page and the v2 free-gift page.
// Same floating-label look as the homepage contact form (ContactV2), with 16px+ text so iOS never zooms.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type FormState = 'idle' | 'submitting' | 'success' | 'error'
export type NameEmailErrors = Partial<Record<'name' | 'email', string>>

// Same validation and messages as the site's original forms
export function validateNameEmail(name: string, email: string): NameEmailErrors {
  const errs: NameEmailErrors = {}
  if (!name) errs.name = 'נא להזין שם מלא'
  if (!email) errs.email = 'נא להזין כתובת מייל'
  else if (!EMAIL_RE.test(email)) errs.email = 'כתובת מייל לא תקינה'
  return errs
}

export function Field({
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
  inputMode,
  tone = 'light',
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
  inputMode?: 'email' | 'tel' | 'text'
  tone?: 'light' | 'white'
}) {
  const errId = useId()
  const bg = tone === 'white' ? 'bg-white' : 'bg-cream/40 focus:bg-white'
  const base = `peer w-full rounded-2xl ${bg} ring-1 px-4 pt-6 pb-2.5 text-base text-[#2d1a0e] placeholder-transparent outline-none transition-[box-shadow,background-color] focus:ring-2`
  const ringCls = error ? 'ring-brand focus:ring-brand' : 'ring-[#e3cfb4] hover:ring-[#d4b896] focus:ring-brand/60'
  const common = {
    id,
    name,
    placeholder: label,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errId : undefined,
    'aria-required': required || undefined,
    autoComplete,
    inputMode,
    dir,
  }

  return (
    <div>
      <div className="relative">
        {multiline ? (
          <textarea {...common} rows={4} className={`${base} ${ringCls} resize-none text-right`} />
        ) : (
          <input
            {...common}
            type={type}
            spellCheck={type === 'email' ? false : undefined}
            autoCapitalize={type === 'email' ? 'off' : undefined}
            className={`${base} ${ringCls} h-[60px] ${dir === 'ltr' ? 'text-left' : 'text-right'}`}
          />
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

// Required line next to every submit button (legal review)
export function PrivacyNote({ tone = 'light', className = '' }: { tone?: 'light' | 'dark'; className?: string }) {
  const dark = tone === 'dark'
  return (
    <p className={`flex items-center justify-center gap-2 text-sm text-center ${dark ? 'text-cream/70' : 'text-[#6f5546]'} ${className}`}>
      <LockIcon className="w-4 h-4 shrink-0 opacity-80" />
      <span>
        פרטיך נשמרים בדיסקרטיות.{' '}
        <Link
          href="/v2/privacy"
          className={`font-bold underline underline-offset-4 decoration-1 rounded focus-visible:outline-none focus-visible:ring-2 ${dark ? 'text-cream decoration-cream/40 hover:decoration-cream focus-visible:ring-gold/50' : 'text-brand-dark decoration-brand/40 hover:decoration-brand focus-visible:ring-brand/40'}`}
        >
          מדיניות פרטיות
        </Link>
      </span>
    </p>
  )
}

// Optional, unticked marketing consent (sent as emailConsent: true/false, exactly like the original form)
export function ConsentCheckbox({ label }: { label: string }) {
  return (
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
      <span className="text-[15px] text-[#5a4538] leading-relaxed">{label}</span>
    </label>
  )
}

export function FormError({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {show && (
        <m.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="rounded-2xl bg-brand/10 text-brand-dark text-[15px] p-3 text-center"
          role="alert"
        >
          {children}
        </m.p>
      )}
    </AnimatePresence>
  )
}

export function SubmitButton({ submitting, reduce, label, busyLabel }: { submitting: boolean; reduce: boolean; label: string; busyLabel: string }) {
  return (
    <m.button
      type="submit"
      disabled={submitting}
      whileTap={reduce || submitting ? undefined : { scale: 0.98 }}
      className="group w-full inline-flex items-center justify-center gap-3 bg-brand text-white font-bold text-lg py-4 rounded-full shadow-xl shadow-brand/30 hover:shadow-brand/50 hover:bg-brand-dark transition-[background-color,box-shadow] disabled:opacity-70 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
    >
      {submitting ? (
        <>
          <Spinner />
          {busyLabel}
        </>
      ) : (
        <>
          {label}
          <ArrowIcon className="transition-transform duration-300 group-hover:-translate-x-1" />
        </>
      )}
    </m.button>
  )
}

// A circle and check that draw themselves in
export function SuccessMark({ reduce }: { reduce: boolean }) {
  return (
    <div className="mx-auto w-24 h-24 rounded-full bg-brand/10 flex items-center justify-center">
      <svg className="w-14 h-14 text-brand" viewBox="0 0 52 52" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <m.circle cx="26" cy="26" r="23" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} />
        <m.path d="M15 27l7 7 15-15" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: reduce ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }} />
      </svg>
    </div>
  )
}

export function Spinner() {
  return (
    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity={0.3} strokeWidth={3} />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
    </svg>
  )
}

export function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 rotate-180 shrink-0 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

export function LockIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V8a4 4 0 118 0v3" />
    </svg>
  )
}

export function ClockIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
    </svg>
  )
}

export function WhatsAppIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.2z" />
    </svg>
  )
}

export function PhoneIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h3.5l1.8 4.4-2.2 1.4a11 11 0 006.1 6.1l1.4-2.2L20 15.5V19a1.5 1.5 0 01-1.6 1.5A16.5 16.5 0 013.5 5.6 1.5 1.5 0 015 4z" />
    </svg>
  )
}
