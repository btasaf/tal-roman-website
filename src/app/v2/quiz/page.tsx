import type { Metadata } from 'next'
import quizContent from '@/lib/quiz-content.json'
import QuizExperience from '@/components/v2/quiz/QuizExperience'

export const metadata: Metadata = {
  title: quizContent.hero.title,
  robots: { index: false, follow: false },
}

export default function QuizV2Page() {
  return <QuizExperience />
}
