import type { Metadata } from 'next'
import { fetchSiteSettings } from '@/lib/queries'
import { cleanWhatsApp } from '@/lib/utils'
import PageHero from '@/components/ui/PageHero'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'צור קשר',
  description: 'יש לכם שאלה? רוצים להתחיל תהליך? צרו קשר עם טל רומן — מדריכת מיניות ואינטימיות.',
  alternates: { canonical: 'https://www.talroman.com/contact' },
  openGraph: {
    title: 'צור קשר | טל רומן',
    description: 'יש לכם שאלה? רוצים להתחיל תהליך? צרו קשר עם טל רומן — מדריכת מיניות ואינטימיות.',
    url: 'https://www.talroman.com/contact',
    locale: 'he_IL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'צור קשר | טל רומן',
    description: 'יש לכם שאלה? רוצים להתחיל תהליך? צרו קשר עם טל רומן — מדריכת מיניות ואינטימיות.',
  },
}

export default async function ContactPage() {
  const settings = await fetchSiteSettings().catch(() => null)
  const wa = cleanWhatsApp(settings?.whatsapp)

  return (
    <div className="min-h-screen bg-cream">
      <PageHero
        title="צרו קשר"
        subtitle="יש לכם שאלה? רוצים להתחיל? כתבו לי."
      />

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-6">
          {/* Contact form — first */}
          <div className="bg-white rounded-2xl px-8 py-10 shadow-sm border border-gold/20">
            <div className="text-right mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-ink mb-1">שלחי לי הודעה</h2>
              <p className="text-charcoal">אחזור אליך בהקדם</p>
            </div>
            <ContactForm
              tag={settings?.contactFormTag}
              status={settings?.contactFormStatus}
            />
          </div>

          {/* Contact links */}
          {wa && (
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gold/20 hover:shadow-md hover:border-gold/50 transition-all group"
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
              className="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gold/20 hover:shadow-md transition-all group"
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
              className="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gold/20 hover:shadow-md transition-all group"
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
