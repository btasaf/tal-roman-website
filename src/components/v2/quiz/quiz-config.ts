import type { Transition } from 'framer-motion'
import quizContent from '@/lib/quiz-content.json'

// ─── Motion tokens ────────────────────────────────────────────────────────────
// Calm, no-overshoot springs: warm and unhurried, never bouncy.
export const spring: Transition = { type: 'spring', bounce: 0, visualDuration: 0.5 }
export const springSoft: Transition = { type: 'spring', bounce: 0, visualDuration: 0.8 }
export const springSnappy: Transition = { type: 'spring', bounce: 0, visualDuration: 0.28 }

/** Fresh answers move on by themselves after this pause (long enough to see the selection land). */
export const AUTO_ADVANCE_MS = 520

// ─── Steps ────────────────────────────────────────────────────────────────────
export const questions = quizContent.quiz.questions
export const QUESTION_COUNT = questions.length // 3
export const GIFT_STEP = QUESTION_COUNT // step index of the gift / email screen
export type StepIndex = number // 0..QUESTION_COUNT

export type Visual = {
  src: string
  width: number
  height: number
  /** short line shown under the illustration on the visual panel */
  caption: string
}

/** One illustration per step (unDraw, recolored; see public/illustrations/quiz-v2/LICENSES.md). */
export const STEP_VISUALS: Visual[] = [
  { src: '/illustrations/quiz-v2/q1-journey.svg', width: 921, height: 718, caption: 'כל שינוי מתחיל בסקרנות קטנה' },
  { src: '/illustrations/quiz-v2/q2-calm.svg', width: 800, height: 555, caption: 'אין כאן תשובה נכונה, רק תשובה כנה' },
  { src: '/illustrations/quiz-v2/q3-together.svg', width: 792, height: 800, caption: 'כדי שאדבר אלייך בשפה שלך' },
  { src: '/illustrations/quiz-v2/gift.svg', width: 800, height: 500, caption: 'משהו קטן, ממני אלייך' },
]

export const SENDING_VISUAL = { src: '/illustrations/quiz-v2/sending.svg', width: 640, height: 683 }
export const WELCOME_VISUAL = { src: '/illustrations/quiz-v2/welcome.svg', width: 681, height: 800 }

// ─── UI microcopy (functional strings, not the locked quiz copy) ─────────────
export const UI = {
  home: 'טל רומן',
  homeLabel: 'חזרה לדף הבית',
  intro: 'שלוש שאלות קצרות, ומתנה ממני מחכה בסוף',
  segmentLabels: ['הסיבה', 'המצב', 'היכרות', 'המתנה'],
  giftProgress: 'המתנה שלך מוכנה',
  keyboardHint: 'אפשר גם להקיש על המספרים במקלדת',
  youPicked: 'בחרת:',
  giftEyebrow: 'נפתח במיוחד בשבילך',
  giftLabel: 'מתנה ממני',
  emailInvalid: 'נראה שחסר משהו בכתובת המייל',
  privacyNote: 'פרטיך נשמרים בדיסקרטיות',
  privacyLink: 'מדיניות פרטיות',
  sending: 'עוטפת לך את המתנה…',
  close: 'סגירה',
}

/** Questions keyed by index → optional pronoun badge per answer (q3: how Tal will address you). */
export const PRONOUNS: Record<string, string> = {
  woman: 'את',
  man: 'אתה',
  couple: 'אתם',
}
