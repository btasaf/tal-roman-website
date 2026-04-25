'use client'

import { m } from 'framer-motion'

interface Testimonial {
  name: string
  courseTitle?: string
  body: string
  rating?: number
}

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials?.length) return null

  return (
    <section className="py-24 bg-[#0d0804] relative overflow-hidden">
      {/* Bokeh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%]  w-80 h-80 bg-[#e6c060]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] right-[15%] w-96 h-96 bg-[#cd2c2c]/8  rounded-full blur-3xl" />
        <div className="absolute top-[50%] right-[40%] w-64 h-64 bg-[#e6c060]/6  rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <m.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">המלצות</h2>
          <div className="w-16 h-1 bg-[#e6c060] mx-auto rounded-full" />
          <p className="text-[#b0956a] mt-4 text-lg">מה אומרים לקוחות קודמים</p>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <m.div
              key={i}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-[#e6c060]/15 text-right hover:border-[#e6c060]/35 transition-colors"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4 justify-end">
                {[...Array(t.rating ?? 5)].map((_, s) => (
                  <span key={s} className="text-[#e6c060] text-sm">★</span>
                ))}
              </div>
              <p className="text-white/85 leading-relaxed mb-5 text-sm">"{t.body}"</p>
              <div className="border-t border-[#e6c060]/15 pt-4">
                <span className="font-bold text-[#e6c060]">{t.name}</span>
                {t.courseTitle && (
                  <span className="text-white/50 text-sm block mt-0.5">{t.courseTitle}</span>
                )}
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
