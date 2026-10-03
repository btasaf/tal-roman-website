'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { m, AnimatePresence, LazyMotion, MotionConfig, domMax, type Variants } from 'framer-motion'
import quizContent from '@/lib/quiz-content.json'
import { useCrmTracking } from '@/hooks/useCrmTracking'
import { getEnrollToSchool, getOrCreateVisitorId, getQuizResults, getQuizTags } from '@/lib/quiz-logic'
import TopBar from './TopBar'
import VisualPanel from './VisualPanel'
import QuestionStep from './QuestionStep'
import GiftStep from './GiftStep'
import IdentitySheet from './IdentitySheet'
import { AUTO_ADVANCE_MS, GIFT_STEP, QUESTION_COUNT, UI, questions, spring } from './quiz-config'

type Answers = [string | null, string | null, string | null]

// RTL: "forward" enters from the left and leaves to the right; back is the mirror.
const stepVariants: Variants = {
  enter: (dir: 1 | -1) => ({ opacity: 0, x: -dir * 40 }),
  center: { opacity: 1, x: 0, transition: spring },
  exit: (dir: 1 | -1) => ({ opacity: 0, x: dir * 32, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } }),
}

function visibleOptions(qIndex: number, hideOther: boolean) {
  const opts = questions[qIndex].options
  return qIndex === 2 && hideOther ? opts.filter((o) => o.value !== 'other') : opts
}

export default function QuizExperience() {
  const router = useRouter()
  const visitorIdRef = useRef<string | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stepRef = useRef(0)
  const navigated = useRef(false)
  const { track } = useCrmTracking()
  const trackedOnce = useRef({ start: false, emailStep: false })

  const [step, setStep] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const [answers, setAnswers] = useState<Answers>([null, null, null])
  const [identityOpen, setIdentityOpen] = useState(false)
  const [hideOther, setHideOther] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Same visitor id as GiftForm / the original quiz.
  useEffect(() => {
    visitorIdRef.current = getOrCreateVisitorId()
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
  }, [])

  const results = getQuizResults(answers[0], answers[1], answers[2])
  const isQuestion = step < GIFT_STEP
  const currentAnswer = isQuestion ? answers[step] : null

  const clearTimer = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    advanceTimer.current = null
  }

  const goTo = useCallback((next: number, direction: 1 | -1) => {
    clearTimer()
    navigated.current = true
    stepRef.current = next
    setDir(direction)
    setStep(next)
  }, [])

  const goBack = useCallback(() => {
    const s = stepRef.current
    if (s > 0 && !submitting) {
      track('quiz_back', { fromStep: s + 1 })
      goTo(s - 1, -1)
    }
  }, [goTo, submitting, track])

  const selectAnswer = useCallback((qIndex: number, value: string) => {
    if (stepRef.current !== qIndex) return // ignore taps on a step that is leaving
    clearTimer()
    if (!trackedOnce.current.start) {
      trackedOnce.current.start = true
      track('quiz_start')
    }
    track('quiz_answer', { step: qIndex + 1, question: questions[qIndex].id, answer: value })
    if (qIndex === 2 && value === 'other') {
      setIdentityOpen(true)
      return
    }
    setAnswers((prev) => {
      const next = [...prev] as Answers
      next[qIndex] = value
      return next
    })
    advanceTimer.current = setTimeout(() => {
      if (stepRef.current === qIndex) goTo(qIndex + 1, 1)
    }, AUTO_ADVANCE_MS)
  }, [goTo, track])

  const closeIdentity = useCallback(() => setIdentityOpen(false), [])

  const handleIdentityChoice = useCallback(
    (action: string) => {
      setIdentityOpen(false)
      track('quiz_identity_choice', { action })
      if (action === 'goToGuidanceAndWorkshops') {
        router.push('/v2/personal-coaching')
      } else {
        setHideOther(true)
        requestAnimationFrame(() => headingRef.current?.focus())
      }
    },
    [router, track],
  )

  // Reached the email (gift) step: once per page view
  useEffect(() => {
    if (step !== GIFT_STEP || !results || trackedOnce.current.emailStep) return
    trackedOnce.current.emailStep = true
    track('quiz_email_step_view', { path: results.path, mode: results.mode })
  }, [step, results, track])

  // Same request, payload and redirect behaviour as the original quiz, plus the optional
  // marketing-consent choice (the gift is sent either way; the CRM stores the proof).
  const handleEmailSubmit = useCallback(
    async (email: string, emailConsent: boolean) => {
      if (!results || submitting) return
      setSubmitting(true)
      let uniqueLink: string | undefined
      try {
        const tags = getQuizTags(results.path, results.mode)
        const res = await fetch('/api/crm/save-customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mail: email,
            tags,
            // Which course the CRM should enrol this person in — it answers with their personal link.
            enrollToSchool: getEnrollToSchool(results),
            notifyTal: true,
            visitorId: visitorIdRef.current ?? null,
            emailConsent,
            consentSource: 'quiz',
            consentText: quizContent.revealScreen.consentCheckbox,
          }),
        })
        uniqueLink = (await res.json())?.uniqueLink
      } catch (e) {
        console.error(e)
      }
      // The CRM hands back the personal course link — send the viewer straight there.
      // Only when it doesn't, fall back to the gift page on the site.
      try {
        track('quiz_complete', { path: results.path, mode: results.mode, destination: uniqueLink ? 'course_link' : 'gift_page' })
        if (uniqueLink) {
          window.location.href = uniqueLink
          return
        }
        router.push(`/v2/gift/${results.path}/${results.mode}`)
      } catch {
        setSubmitting(false)
      }
    },
    [results, router, submitting, track],
  )

  // Keyboard: 1–9 picks an answer (and moves on), Esc goes back.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (identityOpen || e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable
      if (typing) return
      const s = stepRef.current

      if (s < GIFT_STEP && /^[1-9]$/.test(e.key)) {
        const opt = visibleOptions(s, hideOther)[Number(e.key) - 1]
        if (opt) {
          e.preventDefault()
          selectAnswer(s, opt.value)
        }
        return
      }
      if (e.key === 'Escape' && s > 0) {
        e.preventDefault()
        goBack()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [identityOpen, hideOther, selectAnswer, goBack])

  // New step mounted → bring it into view and move focus to its heading
  // (unless focus sits on the persistent top bar, e.g. repeated "back").
  const onStepMounted = useCallback(() => {
    if (!navigated.current) return
    if (window.scrollY > 0) window.scrollTo({ top: 0 })
    const active = document.activeElement
    if (active && active.closest('[data-quiz-topbar]') && active.isConnected) return
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  const progressLabel = isQuestion
    ? quizContent.quiz.progressLabel.replace('{current}', String(step + 1)).replace('{total}', String(QUESTION_COUNT))
    : UI.giftProgress
  const announcement = isQuestion ? `${progressLabel}. ${questions[step].title}` : `${progressLabel}. ${quizContent.revealScreen.line1}`
  const prevQ = step > 0 && isQuestion ? questions[step - 1] : null
  const prevLabel = prevQ ? prevQ.options.find((o) => o.value === answers[step - 1])?.label : undefined

  return (
    <LazyMotion features={domMax}>
      <MotionConfig reducedMotion="user">
        <section dir="rtl" className="relative isolate min-h-svh bg-[#fff2d4] text-[#2d1a0e]">
          {/* Same overrides as the v2 homepage: no top padding from the root <main>, hide the WhatsApp FAB */}
          <style>{`
            main.pt-20 { padding-top: 0 !important; }
            .fixed.bottom-6.left-6 { display: none !important; }
            /* the quiz is a focused flow with its own home link: hide the v2 header's floating menu button */
            button.fixed.top-6.right-6 { display: none !important; }
            /* …and the site-wide scroll progress line (the quiz has its own progress) */
            .fixed.top-0.left-0.right-0.origin-left { display: none !important; }
          `}</style>

          {/* Ambient warmth */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-[radial-gradient(closest-side,rgba(230,192,96,0.18),transparent)]" />
            <div className="absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(201,120,112,0.12),transparent)]" />
          </div>

          <p aria-live="polite" className="sr-only">
            {announcement}
          </p>

          <div className="lg:grid lg:min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            {/* Content column (start / right side) */}
            <div className="flex min-h-svh flex-col">
              <div data-quiz-topbar className="sticky top-0 z-30">
                <TopBar step={step} answered={Boolean(currentAnswer)} onBack={goBack} />
              </div>

              <div className={`mx-auto flex w-full max-w-[600px] flex-1 flex-col px-5 sm:px-8 lg:max-w-[640px] lg:px-12 xl:px-16 ${isQuestion ? 'pb-10 lg:pt-[7vh]' : 'pb-3 lg:pt-[2svh]'}`}>
                {isQuestion && <VisualPanel variant="band" step={step} sending={submitting} className="mb-3 mt-2 lg:hidden" />}

                {/* Context slot: intro line on Q1, the previous answer as a chip after that */}
                {isQuestion && (
                  <div className="mb-3 flex min-h-[36px] items-center sm:mb-4">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {step === 0 ? (
                        <m.p
                          key="intro"
                          className="flex items-center gap-2 text-[14px] font-medium text-[#a85a54] sm:text-[15px]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <span aria-hidden className="text-[#e6c060]">✦</span>
                          {UI.intro}
                        </m.p>
                      ) : prevQ && prevLabel ? (
                        <m.div
                          key={prevQ.id}
                          layoutId={`picked-${prevQ.id}`}
                          className="flex min-w-0 max-w-full items-center gap-2 bg-[#2d1a0e] py-1.5 pe-4 ps-1.5 text-[13.5px] text-[#fff2d4]"
                          style={{ borderRadius: 999 }}
                          transition={spring}
                          exit={{ opacity: 0 }}
                        >
                          <m.span
                            layout="position"
                            className="flex min-w-0 items-center gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { duration: 0.25, delay: 0.25 } }}
                          >
                            <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#e6c060] text-[#2d1a0e]">
                              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12.5l4.2 4L19 7" />
                              </svg>
                            </span>
                            <span className="shrink-0 text-[#e6c060]">{UI.youPicked}</span>
                            <span className="truncate">{prevLabel}</span>
                          </m.span>
                        </m.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                )}

                <AnimatePresence mode="wait" initial={false} custom={dir}>
                  <m.div key={step} custom={dir} variants={stepVariants} initial="enter" animate="center" exit="exit">
                    <OnMount run={onStepMounted} />
                    {isQuestion ? (
                      <QuestionStep
                        qid={questions[step].id}
                        title={questions[step].title}
                        options={visibleOptions(step, hideOther)}
                        selected={answers[step]}
                        headingRef={headingRef}
                        onSelect={(value) => selectAnswer(step, value)}
                      />
                    ) : (
                      results && (
                        <GiftStep results={results} headingRef={headingRef} submitting={submitting} onSubmit={handleEmailSubmit} />
                      )
                    )}
                  </m.div>
                </AnimatePresence>

                {isQuestion && (
                  <p className="mt-8 hidden text-[13px] text-[#5e5955]/75 [@media(hover:hover)_and_(min-width:1024px)]:block">{UI.keyboardHint}</p>
                )}
              </div>
            </div>

            {/* Visual column (end / left side) — desktop only */}
            <aside aria-hidden className="hidden p-4 lg:block">
              <div className="sticky top-4 h-[calc(100svh-2rem)] min-h-[560px]">
                <VisualPanel variant="panel" step={step} sending={submitting} />
              </div>
            </aside>
          </div>

          <IdentitySheet open={identityOpen} onClose={closeIdentity} onChoice={handleIdentityChoice} />
        </section>
      </MotionConfig>
    </LazyMotion>
  )
}

function OnMount({ run }: { run: () => void }) {
  useEffect(() => {
    const raf = requestAnimationFrame(run)
    return () => cancelAnimationFrame(raf)
  }, [run])
  return null
}
