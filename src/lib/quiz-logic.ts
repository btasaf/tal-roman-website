// Shared quiz logic — mirrors the inline logic of src/app/quiz/page.tsx exactly
// (results mapping, CRM tags, reveal copy). Used by the v2 quiz.
import quizContent from '@/lib/quiz-content.json'

export type Mode = 'explore' | 'repair'
export type Path = 'woman_self' | 'woman_partner' | 'man_self' | 'man_partner' | 'couple'
export type QuizResults = { path: Path; mode: Mode }

export const getQuizResults = (
  q1: string | null,
  q2: string | null,
  q3: string | null,
): QuizResults | null => {
  if (!q1 || !q2 || !q3) return null
  const mode: Mode = q2 === 'good' ? 'explore' : 'repair'
  const path: Path = q3 === 'couple' ? 'couple' : (`${q3}_${q1}` as Path)
  return { path, mode }
}

// Build tags for each path and mode combination
export const getQuizTags = (path: Path, mode: Mode): string[] => {
  const tags: string[] = ['קיבל מתנה']

  if (path === 'woman_self' || path === 'woman_partner') {
    tags.push('אישה')
  } else if (path === 'man_self' || path === 'man_partner') {
    tags.push('גבר')
  } else if (path === 'couple') {
    tags.push('זוג')
  }

  if (path === 'woman_self' || path === 'man_self') {
    tags.push('לבד')
  }

  tags.push(mode === 'explore' ? 'העמקה' : 'שיקום')

  const specificTags: Record<string, string> = {
    woman_self_explore: 'מייל מתנה- אישה לעצמה העמקה',
    woman_self_repair: 'מייל מתנה- אישה לעצמה שיקום',
    woman_partner_explore: 'מייל מתנה- אישה בזוגיות העמקה',
    woman_partner_repair: 'מייל מתנה- אישה בזוגיות שיקום',
    man_self_explore: 'מייל מתנה- גבר לעצמו העמקה',
    man_self_repair: 'מייל מתנה- גבר לעצמו שיקום',
    man_partner_explore: 'מייל מתנה- גבר בזוגיות העמקה',
    man_partner_repair: 'מייל מתנה- גבר בזוגיות שיקום',
    couple_explore: 'מייל מתנה- זוג העמקה',
    couple_repair: 'מייל מתנה- זוג שיקום',
  }

  const specific = specificTags[`${path}_${mode}`]
  if (specific) tags.push(specific)

  return tags
}

// Copy for the gift-reveal / email screen, resolved exactly as the original quiz does.
export const getRevealCopy = ({ path, mode }: QuizResults) => {
  const rs = quizContent.revealScreen
  const p = quizContent.paths[path]
  const line2Template =
    path === 'couple' ? rs.line2_couple : path === 'man_partner' ? rs.line2_man_partner : rs.line2
  const whyTemplate = path === 'couple' ? rs.whyHeading_couple : rs.whyHeading
  return {
    line1: rs.line1,
    line2: line2Template.replace('{personalWindow}', p.personalWindow[mode]),
    giftTitle: p.giftReason[mode].giftTitle,
    whyHeading: whyTemplate.replace('{giftTitle}', p.giftReason[mode].giftTitle),
    why: p.giftReason[mode].why,
    listenLine: rs.listenLine,
    emailPrompt: rs.emailPrompt,
    emailPlaceholder: rs.emailPlaceholder,
    consentCheckbox: rs.consentCheckbox,
    submitButton: rs.submitButton,
    keepInTouch: rs.keepInTouch,
  }
}

export const getEnrollToSchool = ({ path, mode }: QuizResults): string | null =>
  quizContent.paths[path].gift[mode].enrollToSchool || null

// Same localStorage key as GiftForm / the original quiz.
export const getOrCreateVisitorId = (): string | null => {
  try {
    const KEY = 'crm_visitor_id'
    let id = localStorage.getItem(KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(KEY, id)
    }
    return id
  } catch {
    return null
  }
}
