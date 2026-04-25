import type { Metadata } from 'next'
import { fetchSiteSettings } from '@/lib/queries'
import { cleanWhatsApp } from '@/lib/utils'
import CTAButton from '@/components/ui/CTAButton'
import SectionDivider from '@/components/ui/SectionDivider'

export const metadata: Metadata = { title: 'אודות טל רומן' }

export default async function AboutPage() {
  const settings = await fetchSiteSettings().catch(() => null)
  const wa = cleanWhatsApp(settings?.whatsapp)

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-ink mb-6">שלום, אני טל</h1>
        <div className="mb-10">
          <SectionDivider />
        </div>

        <div className="prose prose-lg max-w-none text-charcoal leading-relaxed space-y-6">
          <p className="text-xl text-charcoal">
            אני מלווה אנשים וזוגות בנושאי מיניות ואינטימיות כבר שנים רבות. הדרך אלי מתחילה בשאלה אחת — למה זה כל כך קשה לדבר על זה?
          </p>
          <p>
            הכשרתי כמדריכת מיניות מוסמכת ואני עובדת עם אנשים בגישה חמה, ישירה ומכבדת. אין כאן שיפוטיות. אין כאן "נורמלי" ו"לא נורמלי". יש רק את.ה, את הצרכים שלך, ואת הרצון להבין טוב יותר.
          </p>
          <p>
            פעלתי ב-ynet, מאקו, וואלה ועוד, ואני מאמינה שחינוך מיני טוב צריך להיות נגיש לכולם — לא רק בקליניקה.
          </p>
        </div>

        <div className="mt-12 p-8 bg-white rounded-[24px] border border-gold/20 shadow-sm">
          <h2 className="text-2xl font-bold text-ink mb-4">רוצים להתחיל שיחה?</h2>
          <p className="text-charcoal mb-6">כתבו לי בוואטסאפ ונמצא יחד את המסלול הנכון עבורכם.</p>
          <CTAButton
            href={wa ? `https://wa.me/${wa}` : '/contact'}
            target={wa ? '_blank' : undefined}
            rel={wa ? 'noopener noreferrer' : undefined}
          >
            {wa ? 'כתבי לי בוואטסאפ' : 'צרי קשר'}
          </CTAButton>
        </div>
      </div>
    </div>
  )
}
