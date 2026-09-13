'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import quizContent from '@/lib/quiz-content.json'

type Step = 1 | 2 | 3 | 4
type Mode = 'explore' | 'repair'
type Path = 'woman_self' | 'woman_partner' | 'man_self' | 'man_partner' | 'couple'

// Build tags for each path and mode combination
const getTags = (path: Path, mode: Mode): string[] => {
  const tags: string[] = ['קיבל מתנה']

  // Add gender/type tag
  if (path === 'woman_self' || path === 'woman_partner') {
    tags.push('אישה')
  } else if (path === 'man_self' || path === 'man_partner') {
    tags.push('גבר')
  } else if (path === 'couple') {
    tags.push('זוג')
  }

  // Add "alone" tag for self paths
  if (path === 'woman_self' || path === 'man_self') {
    tags.push('לבד')
  }

  // Add mode tag
  if (mode === 'explore') {
    tags.push('העמקה')
  } else {
    tags.push('שיקום')
  }

  // Add specific audience tag
  const specificTags: Record<string, string> = {
    'woman_self_explore': 'מייל מתנה- אישה לעצמה העמקה',
    'woman_self_repair': 'מייל מתנה- אישה לעצמה שיקום',
    'woman_partner_explore': 'מייל מתנה- אישה בזוגיות העמקה',
    'woman_partner_repair': 'מייל מתנה- אישה בזוגיות שיקום',
    'man_self_explore': 'מייל מתנה- גבר לעצמו העמקה',
    'man_self_repair': 'מייל מתנה- גבר לעצמו שיקום',
    'man_partner_explore': 'מייל מתנה- גבר בזוגיות העמקה',
    'man_partner_repair': 'מייל מתנה- גבר בזוגיות שיקום',
    'couple_explore': 'מייל מתנה- זוג העמקה',
    'couple_repair': 'מייל מתנה- זוג שיקום',
  }

  const key = `${path}_${mode}`
  if (specificTags[key]) {
    tags.push(specificTags[key])
  }

  return tags
}

export default function QuizPage() {
  const router = useRouter()
  const visitorIdRef = useRef<string | null>(null)

  const [step, setStep] = useState<Step>(1)
  const [q1, setQ1] = useState<string | null>(null)
  const [q2, setQ2] = useState<string | null>(null)
  const [q3, setQ3] = useState<string | null>(null)
  const [viaLgbtqWindow, setViaLgbtqWindow] = useState(false)
  const [showLgbtqModal, setShowLgbtqModal] = useState(false)
  const [hideLgbtqOption, setHideLgbtqOption] = useState(false)
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get or create visitor ID (same as GiftForm)
  useEffect(() => {
    const KEY = 'crm_visitor_id'
    let id = localStorage.getItem(KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(KEY, id)
    }
    visitorIdRef.current = id
  }, [])

  const questions = quizContent.quiz.questions

  // Calculate results
  const getResults = (): { path: Path; mode: Mode } | null => {
    if (!q1 || !q2 || !q3) return null
    const mode: Mode = q2 === 'good' ? 'explore' : 'repair'
    const path: Path = q3 === 'couple' ? 'couple' : `${q3}_${q1}` as Path
    return { path, mode }
  }

  const handleQ1Answer = (value: string) => {
    setQ1(value)
    setStep(2)
  }

  const handleQ2Answer = (value: string) => {
    setQ2(value)
    setStep(3)
  }

  const handleQ3Answer = (value: string) => {
    if (value === 'other') {
      setShowLgbtqModal(true)
      return
    }
    setQ3(value)
    setStep(4)
  }

  const handleBack = () => {
    if (step === 2) setStep(1)
    else if (step === 3) setStep(2)
    else if (step === 4) setStep(3)
  }

  const handleLgbtqChoice = (action: string) => {
    setShowLgbtqModal(false)
    if (action === 'goToGuidanceAndWorkshops') {
      router.push('/personal-coaching')
    } else {
      setHideLgbtqOption(true)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@') || !consent) return

    setIsSubmitting(true)
    const results = getResults()

    if (results) {
      try {
        const tags = getTags(results.path, results.mode)
        await fetch('/api/crm/save-customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mail: email,
            tags,
            notifyTal: true,
            visitorId: visitorIdRef.current ?? null,
          }),
        })
      } catch (e) {
        console.error(e)
      }
      router.push(`/gift/${results.path}/${results.mode}`)
    }
    setIsSubmitting(false)
  }

  const results = getResults()

  // Get filtered options for Q3
  const q3Options = questions[2].options.filter(
    opt => !(hideLgbtqOption && opt.value === 'other')
  )

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-8" dir="rtl">
      <div className="w-full max-w-lg">

        {/* Intro text */}
        <p className="text-center text-ink/70 text-lg leading-relaxed mb-8">
          {quizContent.quiz.intro}
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i <= step && step <= 3 ? 'bg-brand' : 'bg-sand/40'
              }`}
            />
          ))}
        </div>

        {/* Back button */}
        {step > 1 && step <= 4 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-mist hover:text-ink mb-6 transition-colors"
          >
            <span>←</span>
            {quizContent.quiz.backLabel}
          </button>
        )}

        {/* Question 1 */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink mb-8 text-center">
              {questions[0].title}
            </h1>
            <div className="space-y-3">
              {questions[0].options.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleQ1Answer(option.value)}
                  className="w-full p-5 text-right bg-white border-2 border-sand/30 rounded-xl
                    hover:border-brand hover:bg-brand/5 transition-all duration-200 text-ink text-lg"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 2 */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink mb-8 text-center">
              {questions[1].title}
            </h1>
            <div className="space-y-3">
              {questions[1].options.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleQ2Answer(option.value)}
                  className="w-full p-5 text-right bg-white border-2 border-sand/30 rounded-xl
                    hover:border-brand hover:bg-brand/5 transition-all duration-200 text-ink text-lg"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 3 */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink mb-8 text-center">
              {questions[2].title}
            </h1>
            <div className="space-y-3">
              {q3Options.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleQ3Answer(option.value)}
                  className="w-full p-5 text-right bg-white border-2 border-sand/30 rounded-xl
                    hover:border-brand hover:bg-brand/5 transition-all duration-200 text-ink text-lg"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Email screen (step 4) */}
        {step === 4 && results && (
          <div className="text-center space-y-6">
            <p className="text-xl text-ink font-medium">
              {quizContent.revealScreen.line1}
            </p>

            <p className="text-lg text-ink leading-relaxed">
              {(results.path === 'couple'
                ? quizContent.revealScreen.line2_couple
                : results.path === 'man_partner'
                  ? quizContent.revealScreen.line2_man_partner
                  : quizContent.revealScreen.line2
              ).replace(
                '{personalWindow}',
                quizContent.paths[results.path].personalWindow[results.mode]
              )}
            </p>

            <div className="space-y-3 text-right">
              <p className="text-lg text-ink font-bold">
                {(results.path === 'couple'
                  ? quizContent.revealScreen.whyHeading_couple
                  : quizContent.revealScreen.whyHeading
                ).replace(
                  '{giftTitle}',
                  quizContent.paths[results.path].giftReason[results.mode].giftTitle
                )}
              </p>
              <p className="text-lg text-ink leading-relaxed">
                {quizContent.paths[results.path].giftReason[results.mode].why}
              </p>
              <p className="text-lg text-ink">
                {quizContent.revealScreen.listenLine}
              </p>
            </div>

            <div className="pt-4">
              <p className="text-lg text-ink font-medium mb-4">
                {quizContent.revealScreen.emailPrompt}
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={quizContent.revealScreen.emailPlaceholder}
                  dir="ltr"
                  className="w-full p-4 text-right border-2 border-sand/30 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-brand text-lg bg-white
                    text-ink placeholder-mist"
                />

                <label className="flex items-start gap-3 text-right cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-sand/30 text-brand
                      focus:ring-brand focus:ring-2 cursor-pointer"
                  />
                  <span className="text-sm text-ink/80 leading-relaxed">
                    {quizContent.revealScreen.consentCheckbox}
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting || !consent}
                  className="w-full p-4 bg-brand text-white font-bold rounded-xl
                    hover:bg-brand-dark transition-colors text-lg shadow-lg shadow-brand/30
                    disabled:opacity-60"
                >
                  {isSubmitting ? 'שולח...' : quizContent.revealScreen.submitButton}
                </button>

                <p className="text-sm text-ink/70 leading-relaxed">
                  {quizContent.revealScreen.keepInTouch}
                </p>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* LGBTQ Modal */}
      {showLgbtqModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowLgbtqModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-cream rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl"
          >
            <div className="space-y-4 text-ink text-right">
              {quizContent.lgbtqModal.body.map((paragraph, i) => (
                <p key={i} className="leading-relaxed">{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              {quizContent.lgbtqModal.buttons.map((button, i) => (
                <button
                  key={i}
                  onClick={() => handleLgbtqChoice(button.action)}
                  className={`w-full p-4 rounded-xl font-medium transition-colors
                    ${i === 0
                      ? 'bg-brand text-white hover:bg-brand-dark'
                      : 'bg-white border-2 border-sand/30 text-ink hover:border-brand'
                    }`}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
