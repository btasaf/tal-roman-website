import LavaBackground from '@/components/ui/LavaBackground'
import SectionDivider from '@/components/ui/SectionDivider'

interface PageHeroProps {
  eyebrow?: string
  title: string
  subtitle?: string
  children?: React.ReactNode
  align?: 'center' | 'right'
  lavaColor1?: string
  lavaColor2?: string
  lavaColor3?: string
  lavaSpeed?: number
}
const lavaSpeed = 2
export default function PageHero({ eyebrow, title, subtitle, children, align = 'center', lavaColor1, lavaColor2, lavaColor3 }: PageHeroProps) {
  return (
    <section className="relative py-32 bg-dusk text-white overflow-hidden">
      <LavaBackground color1={lavaColor1} color2={lavaColor2} color3={lavaColor3} speed={lavaSpeed} />
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
