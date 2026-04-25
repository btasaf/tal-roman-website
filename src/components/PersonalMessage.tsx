'use client'

import { m } from 'framer-motion'

export default function PersonalMessage({ message }: { message: string }) {
  return (
    <section className="py-24 bg-[#1a0f08] relative overflow-hidden">
      {/* bokeh blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] left-[30%] w-96 h-96 bg-[#e6c060]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-[5%] right-[20%] w-80 h-80 bg-[#cd2c2c]/12 rounded-full blur-3xl" />
        <div className="absolute top-[40%] left-[10%] w-64 h-64 bg-[#e6c060]/6 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[#d4b896] text-xl md:text-2xl leading-loose whitespace-pre-line">
            {message}
          </p>
        </m.div>
      </div>
    </section>
  )
}
