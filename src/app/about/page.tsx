import type { Metadata } from 'next'
import { fetchSiteSettings } from '@/lib/queries'

export const metadata: Metadata = { title: 'אודות טל רומן' }

export default async function AboutPage() {
  const settings = await fetchSiteSettings().catch(() => null)
  const wa = settings?.whatsapp?.replace(/\D/g, '')

  return (
    <div className="min-h-screen bg-[#fff2d4]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#303030] mb-6">שלום, אני טל</h1>
        <div className="w-16 h-1 bg-[#e6c060] mb-10 rounded-full" />

        <div className="prose prose-lg max-w-none text-[#4f4f4f] leading-relaxed space-y-6">
          <p className="text-xl text-[#4f4f4f]">
            אני מלווה אנשים וזוגות בנושאי מיניות ואינטימיות כבר שנים רבות. הדרך אלי מתחילה בשאלה אחת — למה זה כל כך קשה לדבר על זה?
          </p>
          <p>
            הכשרתי כמדריכת מיניות מוסמכת ואני עובדת עם אנשים בגישה חמה, ישירה ומכבדת. אין כאן שיפוטיות. אין כאן "נורמלי" ו"לא נורמלי". יש רק את.ה, את הצרכים שלך, ואת הרצון להבין טוב יותר.
          </p>
          <p>
            פעלתי ב-ynet, מאקו, וואלה ועוד, ואני מאמינה שחינוך מיני טוב צריך להיות נגיש לכולם — לא רק בקליניקה.
          </p>
        </div>

        <div className="mt-12 p-8 bg-white rounded-[24px] border border-[#e6c060]/20 shadow-sm">
          <h2 className="text-2xl font-bold text-[#303030] mb-4">רוצים להתחיל שיחה?</h2>
          <p className="text-[#4f4f4f] mb-6">כתבו לי בוואטסאפ ונמצא יחד את המסלול הנכון עבורכם.</p>
          {wa ? (
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#cd2c2c] text-white font-bold px-8 py-4 rounded-full hover:bg-[#a82424] transition-colors"
            >
              כתבי לי בוואטסאפ
            </a>
          ) : (
            <a href="/contact" className="inline-block bg-[#cd2c2c] text-white font-bold px-8 py-4 rounded-full">
              צרי קשר
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
