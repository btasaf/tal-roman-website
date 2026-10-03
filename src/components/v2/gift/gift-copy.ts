import type { Transition } from 'framer-motion'
import quizContent from '@/lib/quiz-content.json'

// ─── Types / data (same source as the original /gift page: quiz-content.json) ─
export type Mode = 'explore' | 'repair'
export type Path = 'woman_self' | 'woman_partner' | 'man_self' | 'man_partner' | 'couple'

export const VALID_PATHS: Path[] = ['woman_self', 'woman_partner', 'man_self', 'man_partner', 'couple']
export const VALID_MODES: Mode[] = ['explore', 'repair']

export const isPath = (v: string): v is Path => (VALID_PATHS as string[]).includes(v)
export const isMode = (v: string): v is Mode => (VALID_MODES as string[]).includes(v)

export type GiftData = {
  path: Path
  mode: Mode
  isCouple: boolean
  gift: { title: string; videoUrl: string | null }
  bridge: string[]
  tasteLine: string
  resultLine: string
  recommendation: string
  cta: { label: string; href: string; target: string }
  softRowIntro: string
  softRow: { label: string; href: string; target: string }[]
  playerCaption: string
  audioOnlyButton: string
  emailReminder: string
}

// The quiz targets (quiz-content.json, shared with the old quiz) mapped to their v2 pages
const V2_TARGETS: Record<string, string> = {
  PAGE_COURSE_WHAT_MEN_WANT: '/v2/courses/what-man-wants',
  PAGE_COURSE_WHAT_WOMEN_WANT: '/v2/courses/what-woman-wants',
  PAGE_PRIVATE_TANTRA_WORKSHOP: '/v2/courses/personal-tantra',
  PAGE_COURSES: '/v2/courses',
  PAGE_WORKSHOPS: '/v2/courses?type=workshop',
  PAGE_GUIDANCE: '/v2/personal-coaching',
}

export function getTargetUrl(target: string): string {
  if (V2_TARGETS[target]) return V2_TARGETS[target]
  // Unknown target: same route as the quiz content, under /v2 (fallback: all courses)
  const legacy = (quizContent.targets as Record<string, string>)[target]
  return legacy?.startsWith('/') ? `/v2${legacy}` : '/v2/courses'
}

export function getGiftData(path: Path, mode: Mode): GiftData {
  const p = quizContent.paths[path]
  const isCouple = path === 'couple'
  const g = p.gift[mode]
  return {
    path,
    mode,
    isCouple,
    gift: { title: g.title, videoUrl: g.videoUrl ?? null },
    bridge: p.bridge,
    tasteLine: isCouple ? quizContent.thankYouScreen.tasteLine_couple : quizContent.thankYouScreen.tasteLine,
    resultLine: p.resultLine[mode],
    recommendation: p.recommendation[mode],
    cta: { label: p.cta.label, target: p.cta.target, href: getTargetUrl(p.cta.target) },
    softRowIntro: quizContent.thankYouScreen.softRowIntro,
    softRow: p.softRow.map((s) => ({ label: s.label, target: s.target, href: getTargetUrl(s.target) })),
    playerCaption: quizContent.giftScreen.playerCaption,
    audioOnlyButton: quizContent.giftScreen.audioOnlyButton,
    emailReminder: quizContent.giftScreen.emailReminder,
  }
}

// ─── Motion tokens: calm, no overshoot ───────────────────────────────────────
export const springCalm: Transition = { type: 'spring', bounce: 0, visualDuration: 0.9 }
export const springUI: Transition = { type: 'spring', bounce: 0, visualDuration: 0.35 }

// ─── UI microcopy ────────────────────────────────────────────────────────────
// Strings carried over verbatim from the original gift page:
export const LEGACY = {
  watch: 'צפייה',
  listenOnly: 'האזנה בלבד',
  comingSoon: '(הסרטון יתווסף בקרוב)',
  paused: 'מושהה',
  listening: 'מאזינים...',
  showVideo: 'הצג וידאו',
}

// New, minimal microcopy written for v2
export const UI = {
  kicker: (isCouple: boolean) => (isCouple ? 'המתנה שלכם מוכנה' : 'המתנה שלך מוכנה'),
  giftLabel: 'מתנה ממני', // same as the v2 quiz ticket
  nextStep: 'הצעד הבא',
  signature: 'טל',
  rewind: 'אחורה 10 שניות',
  forward: 'קדימה 10 שניות',
  play: 'המשך האזנה',
  pause: 'השהיה',
  portraitAlt: 'טל רומן',
}
