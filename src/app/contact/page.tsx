import type { Metadata } from 'next'
import { fetchSiteSettings } from '@/lib/queries'

export const metadata: Metadata = { title: 'צור קשר' }

export default async function ContactPage() {
  const settings = await fetchSiteSettings().catch(() => null)
  const wa = settings?.whatsapp?.replace(/\D/g, '')

  return (
    <div className="min-h-screen bg-[#fff2d4]">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#303030] mb-4">צרו קשר</h1>
        <p className="text-[#4f4f4f] text-xl mb-4">יש לכם שאלה? רוצים להתחיל? כתבו לי.</p>
        <div className="w-16 h-1 bg-[#e6c060] mb-12 rounded-full" />

        <div className="space-y-6">
          {wa && (
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-[20px] p-6 shadow-sm border border-[#e6c060]/20 hover:shadow-md hover:border-[#e6c060]/50 transition-all group"
            >
              <span className="text-4xl">💬</span>
              <div>
                <h2 className="text-xl font-bold text-[#303030] group-hover:text-[#cd2c2c] transition-colors">WhatsApp</h2>
                <p className="text-[#4f4f4f]">הדרך הכי מהירה להגיע אליי</p>
              </div>
              <span className="text-[#e6c060] text-xl mr-auto">←</span>
            </a>
          )}

          {settings?.phone && (
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-4 bg-white rounded-[20px] p-6 shadow-sm border border-[#e6c060]/20 hover:shadow-md transition-all group"
            >
              <span className="text-4xl">📞</span>
              <div>
                <h2 className="text-xl font-bold text-[#303030] group-hover:text-[#cd2c2c] transition-colors">טלפון</h2>
                <p className="text-[#4f4f4f]">{settings.phone}</p>
              </div>
            </a>
          )}

          {settings?.instagram && (
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-[20px] p-6 shadow-sm border border-[#e6c060]/20 hover:shadow-md transition-all group"
            >
              <span className="text-4xl">📸</span>
              <div>
                <h2 className="text-xl font-bold text-[#303030] group-hover:text-[#cd2c2c] transition-colors">Instagram</h2>
                <p className="text-[#4f4f4f]">עקבו אחריי לתוכן שוטף</p>
              </div>
              <span className="text-[#e6c060] text-xl mr-auto">←</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
