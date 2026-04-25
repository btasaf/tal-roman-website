import type { Metadata } from 'next'
import { fetchCourses } from '@/lib/queries'
import type { Course } from '@/lib/types'
import CourseCard from '@/components/CourseCard'
import SectionDivider from '@/components/ui/SectionDivider'

export const metadata: Metadata = { title: 'קורסים ומוצרים' }

export default async function CoursesPage() {
  const courses: Course[] = await fetchCourses().catch(() => [])

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
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">הקורסים שלי</h1>
          <p className="text-charcoal text-xl max-w-xl mx-auto leading-relaxed">
            כל תוכנית נבנתה מתוך ניסיון אמיתי עם אנשים אמיתיים. בחרי מה מדבר אלייך.
          </p>
          <div className="mt-6">
            <SectionDivider />
          </div>
        </div>

        {courses.length === 0 && (
          <p className="text-center text-mist text-lg">קורסים בקרוב...</p>
        )}

        {sections.map((section) => (
          <div key={section.label} className="mb-16">
            <h2 className="text-2xl font-bold text-ink mb-8 pb-3 border-b border-gold/30">
              {section.label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.items.map((course, i) => (
                <CourseCard key={course.slug} {...course} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
