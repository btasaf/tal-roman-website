import type { Metadata } from 'next'
import { fetchCourses } from '@/lib/queries'
import type { Course } from '@/lib/types'
import CourseCard from '@/components/CourseCard'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = { title: 'קורסים ומוצרים' }

export default async function CoursesPage() {
  const rawCourses: Course[] = await fetchCourses().catch(() => [])
  const courses = rawCourses.filter((c, i, arr) => arr.findIndex(x => x.slug === c.slug) === i)
  const digital = courses.filter((c) => c.type === 'digital')
  const workshops = courses.filter((c) => c.type === 'workshop')
  const personal = courses.filter((c) => c.type === 'personal')
  const other = courses.filter((c) => !['digital', 'workshop', 'personal'].includes(c.type ?? ''))

  const sections = [
    { label: 'קורסים דיגיטליים', items: digital },
    { label: 'סדנאות', items: workshops },
    { label: 'ליווי אישי', items: personal },
    ...(other.length ? [{ label: 'עוד', items: other }] : []),
  ].filter(s => s.items.length > 0)

  return (
    <div className="min-h-screen bg-cream">
      <PageHero
        title="הקורסים שלי"
        subtitle="כל תוכנית נבנתה מתוך ניסיון אמיתי עם אנשים אמיתיים. בחרו מה מדבר אליכם."
      />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {courses.length === 0 && (
          <p className="text-center text-mist text-lg py-20">קורסים בקרוב...</p>
        )}

        {sections.map((section) => (
          <div key={section.label} className="mb-16">
            <h2 className="text-2xl font-bold text-ink mb-8 pb-3 border-b border-gold/30">
              {section.label}
            </h2>
            {section.items.length === 0 ? (
              <p className="text-mist text-center py-8">קורסים בקטגוריה זו יתווספו בקרוב</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.items.map((course, i) => (
                  <CourseCard key={course.slug} {...course} index={i} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
