import BokehBackground from '@/components/ui/BokehBackground'
import SectionDivider from '@/components/ui/SectionDivider'

interface PageHeroProps {
  eyebrow?: string
  title: string
  subtitle?: string
  children?: React.ReactNode
  align?: 'center' | 'right'
}

export default function PageHero({ eyebrow, title, subtitle, children, align = 'center' }: PageHeroProps) {
  return (
    <section className="relative py-32 bg-dusk text-white overflow-hidden">
      <BokehBackground />
      <div className={`relative max-w-3xl mx-auto px-6 ${align === 'center' ? 'text-center' : 'text-right'}`}>
        {eyebrow && (
          <p className="text-gold/70 text-sm font-semibold uppercase tracking-widest mb-4">
            {eyebrow}
          </p>
        )}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 font-garamond text-gold-gradient">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sand text-xl md:text-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
        {children}
        <div className="mt-8">
          <SectionDivider />
        </div>
      </div>
    </section>
  )
}
