'use client'

import { useId, useRef, useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useCrmTracking } from '@/hooks/useCrmTracking'
import { getRevealCopy, type QuizResults } from '@/lib/quiz-logic'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { UI, spring, springSnappy, springSoft } from './quiz-config'

type Props = {
  results: QuizResults
  headingRef: React.RefObject<HTMLHeadingElement | null>
  submitting: boolean
  /** consent = the optional marketing box; the gift itself never depends on it */
  onSubmit: (email: string, consent: boolean) => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const item = {
  enter: { opacity: 0, y: 14 },
  center: { opacity: 1, y: 0, transition: spring },
}

export default function GiftStep({ results, headingRef, submitting, onSubmit }: Props) {
  const copy = getRevealCopy(results)
  const ids = useId()
  const emailRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState('')
  // Marketing consent is optional and unticked (Communications Law s.30A): the gift is sent either way
  const [consent, setConsent] = useState(false)
  const [tried, setTried] = useState(false)
  const { track } = useCrmTracking()

  const emailValid = EMAIL_RE.test(email.trim())
  const emailError = tried && !emailValid

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setTried(true)
    // Never the address itself: only whether it passed and the consent box state at submit
    track('quiz_email_submit_attempt', { emailValid, consent, path: results.path, mode: results.mode })
    if (!emailValid) {
      track('quiz_email_error', { field: email.trim() ? 'email_invalid' : 'email_empty' })
      return emailRef.current?.focus()
    }
    onSubmit(email.trim(), consent)
  }

  return (
    <m.div variants={{ center: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}>
      <m.p variants={item} className="flex items-center gap-2 text-[13px] font-bold text-[#a85a54]">
        <GiftBoxIcon />
        {UI.giftEyebrow}
      </m.p>
      <m.h1
        ref={headingRef}
        tabIndex={-1}
        variants={item}
        className="mt-2 text-balance font-sans text-[24px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#2d1a0e] outline-none sm:text-[34px] lg:text-[38px]"
      >
        {copy.line1}
      </m.h1>
      <m.p variants={item} className="mt-2 text-[14px] leading-[1.5] text-[#5e5955] sm:text-[16px] sm:leading-[1.6]">
        {copy.line2}
      </m.p>

      {/* The gift itself — a dark "ticket" that unwraps in */}
      <m.section variants={item} aria-labelledby={`${ids}-gift`} className="mt-3 lg:mt-5">
        <GiftTicket title={copy.giftTitle} titleId={`${ids}-gift`} listenLine={copy.listenLine} />
      </m.section>

      <m.div variants={item} className="mt-3">
        <WhyBlock heading={copy.whyHeading} body={copy.why} />
      </m.div>

      {/* Email capture */}
      <m.form
        variants={item}
        noValidate
        data-track-form="quiz_email"
        onSubmit={submit}
        aria-busy={submitting}
        className="mt-3 rounded-[22px] bg-white/75 p-3.5 shadow-[0_24px_60px_-34px_rgba(61,40,20,0.45)] ring-1 ring-[#3d2814]/[0.07] sm:p-5 lg:mt-4"
      >
        <label htmlFor={`${ids}-email`} className="block text-[17px] font-extrabold tracking-[-0.03em] text-[#2d1a0e] sm:text-[20px]">
          {copy.emailPrompt}
        </label>

        <div className="relative mt-2">
          <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a85a54]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="3" />
            <path d="m4 7 8 6 8-6" />
          </svg>
          <input
            ref={emailRef}
            id={`${ids}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            dir="ltr"
            required
            disabled={submitting}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={copy.emailPlaceholder}
            aria-invalid={emailError}
            aria-describedby={emailError ? `${ids}-email-err` : undefined}
            className={`h-12 w-full rounded-xl border bg-[#fffaf0] pl-4 pr-12 text-right text-[16px] text-[#2d1a0e] outline-none transition-[border-color,box-shadow] duration-200
              placeholder:text-right placeholder:text-[#5e5955]/60 focus:border-[#c97870] focus:shadow-[0_0_0_4px_rgba(201,120,112,0.18)] disabled:opacity-60 ${
                emailError ? 'border-[#a85a54]' : 'border-[#d4b896]/70'
              }`}
          />
        </div>
        <FieldError id={`${ids}-email-err`} show={emailError}>
          {UI.emailInvalid}
        </FieldError>

        <label className="mt-2.5 flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            name="emailConsent"
            checked={consent}
            disabled={submitting}
            onChange={(e) => {
              setConsent(e.target.checked)
              track('quiz_consent_toggle', { checked: e.target.checked })
            }}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[8px] border-2 transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 ${
              consent ? 'border-[#c97870] bg-[#c97870]' : 'border-[#d4b896] bg-white'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <m.path
                d="M5 12.5l4.2 4L19 7"
                stroke="#fff"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={false}
                animate={{ pathLength: consent ? 1 : 0, opacity: consent ? 1 : 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
            </svg>
          </span>
          <span className="text-[13px] leading-snug text-[#5e5955] sm:text-[13.5px]">{copy.consentCheckbox}</span>
        </label>

        <m.button
          type="submit"
          disabled={submitting}
          whileTap={submitting ? undefined : { scale: 0.98 }}
          transition={springSnappy}
          className="relative mt-3 flex h-[50px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#2d1a0e] px-6 text-[17px] font-bold text-[#fff2d4] shadow-[0_18px_40px_-18px_rgba(45,26,14,0.8)] outline-none
            transition-colors hover:bg-[#3d2814] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-wait"
        >
          <AnimatePresence mode="wait" initial={false}>
            {submitting ? (
              <m.span key="busy" className="flex items-center gap-2.5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={springSnappy}>
                <Spinner />
                {UI.sending}
              </m.span>
            ) : (
              <m.span key="idle" className="flex items-center gap-2.5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={springSnappy}>
                {copy.submitButton}
                <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 text-[#e6c060]" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </m.span>
            )}
          </AnimatePresence>
        </m.button>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-xs leading-snug text-[#5e5955]">
          <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          <span>
            {UI.privacyNote}
            {' · '}
            <Link href="/v2/privacy" className="font-semibold text-[#a85a54] underline-offset-2 hover:underline focus-visible:underline">
              {UI.privacyLink}
            </Link>
          </span>
        </p>
        <p role="status" className="sr-only">
          {submitting ? UI.sending : ''}
        </p>

        <p className="mt-2 text-center text-[11.5px] leading-snug text-[#5e5955]/80">{copy.keepInTouch}</p>
      </m.form>
    </m.div>
  )
}

function GiftTicket({ title, titleId, listenLine }: { title: string; titleId: string; listenLine: string }) {
  const reduce = useHydratedReducedMotion()
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-[#2d1a0e] px-5 py-3.5 text-[#fff2d4] shadow-[0_30px_60px_-30px_rgba(45,26,14,0.9)] sm:px-6 sm:py-5">
      {/* warm glow + ribbon */}
      <div aria-hidden className="absolute -left-10 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(closest-side,rgba(230,192,96,0.35),transparent)]" />
      <div aria-hidden className="absolute inset-y-0 left-12 w-[10px] bg-gradient-to-b from-[#e6c060]/0 via-[#e6c060]/60 to-[#e6c060]/0" />
      {/* one-time shimmer sweep */}
      {!reduce && (
        <m.div
          aria-hidden
          className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-[#fff2d4]/15 to-transparent"
          initial={{ x: '0%' }}
          animate={{ x: '400%' }}
          transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.7 }}
        />
      )}
      {/* ticket notches */}
      <span aria-hidden className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#fff2d4]" />
      <span aria-hidden className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#fff2d4]" />

      <p className="relative flex items-center gap-2 text-[12px] font-bold tracking-[0.06em] text-[#e6c060]">
        <span aria-hidden>✦</span>
        {UI.giftLabel}
      </p>
      <h2 id={titleId} className="relative mt-1.5 pl-10 text-balance text-[19px] font-extrabold leading-[1.15] tracking-[-0.03em] sm:text-[24px]">
        {title}
      </h2>
      <p className="relative mt-1.5 flex items-center gap-1.5 pl-10 text-[12.5px] text-[#fff2d4]/70">
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 text-[#e6c060]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
          <rect x="3" y="14" width="4.5" height="6" rx="1.5" />
          <rect x="16.5" y="14" width="4.5" height="6" rx="1.5" />
        </svg>
        {listenLine}
      </p>
    </div>
  )
}

/** Tiny gift box whose lid pops open once. */
function GiftBoxIcon() {
  return (
    <svg aria-hidden viewBox="0 0 28 28" className="h-6 w-6 overflow-visible">
      <rect x="5" y="13" width="18" height="11" rx="2" fill="#c97870" />
      <rect x="12.5" y="13" width="3" height="11" fill="#e6c060" />
      <m.g
        initial={{ y: 0, rotate: 0 }}
        animate={{ y: -4, rotate: -12 }}
        transition={{ ...springSoft, delay: 0.5 }}
        style={{ originX: '20%', originY: '100%' }}
      >
        <rect x="3.5" y="9" width="21" height="5" rx="1.5" fill="#a85a54" />
        <rect x="12.5" y="9" width="3" height="5" fill="#e6c060" />
        <path d="M14 9c-1.5-3.5-5.5-4-5.5-1.5S12 9 14 9Zm0 0c1.5-3.5 5.5-4 5.5-1.5S16 9 14 9Z" fill="none" stroke="#e6c060" strokeWidth="1.6" />
      </m.g>
    </svg>
  )
}

/** "Why this gift?" — always visible: the locked heading and its reasoning. */
function WhyBlock({ heading, body }: { heading: string; body: string }) {
  return (
    <div>
      <h2 className="text-[14px] font-extrabold leading-snug tracking-[-0.01em] text-[#2d1a0e] sm:text-[15.5px]">{heading}</h2>
      <p className="mt-1 text-[13.5px] leading-[1.5] text-[#5e5955] sm:text-[14.5px]">{body}</p>
    </div>
  )
}

function FieldError({ id, show, children }: { id: string; show: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <m.p
          id={id}
          role="alert"
          className="overflow-hidden text-[14px] font-medium text-[#a85a54]"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={springSnappy}
        >
          <span className="block pt-2">{children}</span>
        </m.p>
      )}
    </AnimatePresence>
  )
}

function Spinner() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 animate-spin motion-reduce:animate-none">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="#e6c060" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
