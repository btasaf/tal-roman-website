import type { Metadata } from 'next'
import { fetchSiteSettings } from '@/lib/queries'
import { cleanWhatsApp } from '@/lib/utils'
import SectionDivider from '@/components/ui/SectionDivider'

export const metadata: Metadata = { title: 'צור קשר' }

export default async function ContactPage() {
  const settings = await fetchSiteSettings().catch(() => null)
  const wa = cleanWhatsApp(settings?.whatsapp)

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">צרו קשר</h1>
        <p className="text-charcoal text-xl mb-4">יש לכם שאלה? רוצים להתחיל? כתבו לי.</p>
        <div className="mb-12">
          <SectionDivider />
        </div>

        <div className="space-y-6">
          {wa && (
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-[20px] p-6 shadow-sm border border-gold/20 hover:shadow-md hover:border-gold/50 transition-all group"
            >
              <span className="text-4xl">💬</span>
              <div>
                <h2 className="text-xl font-bold text-ink group-hover:text-brand transition-colors">WhatsApp</h2>
                <p className="text-charcoal">הדרך הכי מהירה להגיע אליי</p>
              </div>
              <span className="text-gold text-xl mr-auto">←</span>
            </a>
          )}

          {settings?.phone && (
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-4 bg-white rounded-[20px] p-6 shadow-sm border border-gold/20 hover:shadow-md transition-all group"
            >
              <span className="text-4xl">📞</span>
              <div>
                <h2 className="text-xl font-bold text-ink group-hover:text-brand transition-colors">טלפון</h2>
                <p className="text-charcoal">{settings.phone}</p>
              </div>
            </a>
          )}

          {settings?.instagram && (
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-[20px] p-6 shadow-sm border border-gold/20 hover:shadow-md transition-all group"
            >
              <span className="text-4xl">📸</span>
              <div>
                <h2 className="text-xl font-bold text-ink group-hover:text-brand transition-colors">Instagram</h2>
                <p className="text-charcoal">עקבו אחריי לתוכן שוטף</p>
              </div>
              <span className="text-gold text-xl mr-auto">←</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
