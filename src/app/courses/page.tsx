import type { Metadata } from 'next'
import { fetchCourses } from '@/lib/queries'
import CourseCard from '@/components/CourseCard'

export const metadata: Metadata = { title: 'קורסים ומוצרים' }

export default async function CoursesPage() {
  const courses = await fetchCourses().catch(() => [])

  const digital = courses.filter((c: any) => c.type === 'digital')
  const workshops = courses.filter((c: any) => c.type === 'workshop')
  const personal = courses.filter((c: any) => c.type === 'personal')
  const other = courses.filter((c: any) => !['digital', 'workshop', 'personal'].includes(c.type))

  const sections = [
    { label: 'קורסים דיגיטליים', items: digital },
    { label: 'סדנאות', items: workshops },
    { label: 'ליווי אישי', items: personal },
    ...(other.length ? [{ label: 'עוד', items: other }] : []),
  ].filter(s => s.items.length > 0)

  return (
    <div className="min-h-screen bg-[#fff2d4]">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#303030] mb-4">הקורסים שלי</h1>
          <p className="text-[#4f4f4f] text-xl max-w-xl mx-auto leading-relaxed">
            כל תוכנית נבנתה מתוך ניסיון אמיתי עם אנשים אמיתיים. בחרי מה מדבר אלייך.
          </p>
          <div className="w-16 h-1 bg-[#e6c060] mx-auto mt-6 rounded-full" />
        </div>

        {courses.length === 0 && (
          <p className="text-center text-[#6b6b6b] text-lg">קורסים בקרוב...</p>
        )}

        {sections.map((section) => (
          <div key={section.label} className="mb-16">
            <h2 className="text-2xl font-bold text-[#303030] mb-8 pb-3 border-b border-[#e6c060]/30">
              {section.label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.items.map((course: any, i: number) => (
                <CourseCard key={course.slug} {...course} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
