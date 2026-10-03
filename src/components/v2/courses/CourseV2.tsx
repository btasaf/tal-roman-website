import type { CourseView } from './course-view'
import CourseHero from './CourseHero'
import CourseStory from './CourseStory'
import CourseLearn from './CourseLearn'
import CourseFit from './CourseFit'
import CourseVoices from './CourseVoices'
import CourseOffer from './CourseOffer'
import CourseFAQ from './CourseFAQ'
import CourseClose from './CourseClose'
import CourseContact from './CourseContact'
import CourseDock from './CourseDock'

// v2 course page: the offer → the longer story → what you'll learn → who it's for → testimonials →
// price & details → FAQ → closing call (→ contact form when the course has no purchase link).
// Sections without content in Sanity are skipped.
export default function CourseV2({ course }: { course: CourseView }) {
  return (
    <div className="relative overflow-x-clip bg-cream">
      <CourseHero course={course} />
      <CourseStory course={course} />
      <CourseLearn course={course} />
      <CourseFit course={course} />
      <CourseVoices testimonials={course.testimonials} />
      <CourseOffer course={course} />
      <CourseFAQ items={course.faq} />
      <CourseClose course={course} />
      {course.hasContactForm && <CourseContact slug={course.slug} />}
      <CourseDock course={course} />
      {/* Cream continues under the footer's rounded shoulders */}
      <div aria-hidden className="absolute top-full inset-x-0 h-12 bg-cream pointer-events-none" />
    </div>
  )
}
