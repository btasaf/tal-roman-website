import type { Metadata } from 'next'
import BokehBackground from '@/components/ui/BokehBackground'
import SectionDivider from '@/components/ui/SectionDivider'

export const metadata: Metadata = { title: 'קהילות — טל רומן' }

const facebookGroups = [
  {
    title: 'קבוצת הנשים',
    emoji: '🌸',
    subtitle: 'חיבור לגוף, מיניות ועצמאות נשית',
    description: 'קהילה נשית בטוחה ומחבקת שבה נתחבר יותר לעצמנו, לגוף שלנו ולמיניות שלנו. שיתוף, תמיכה וצמיחה יחד.',
    href: 'https://www.facebook.com/groups/220886165935825/',
    buttonText: 'הצטרפי לקבוצת הנשים',
  },
  {
    title: 'קבוצת הגברים',
    emoji: '⚡',
    subtitle: 'חיבור לגבריות, מיניות ומערכות יחסים',
    description: 'קהילה גברית שבה נתחבר יותר לעצמנו, לגוף שלנו ולמיניות שלנו. שיתוף, תמיכה וצמיחה מתוך כוח ואותנטיות.',
    href: 'https://www.facebook.com/groups/1104647316547930/',
    buttonText: 'הצטרף לקבוצת הגברים',
  },
]

const whatsappGroups = [
  {
    title: 'תכנים | אירועים | מפגשים',
    emoji: '🌿',
    tagline: 'קהילת הוואטסאפ',
    description: `זו קהילה שנועדה ליצירת חיבור, שיח ושיתופים סביב עולמות של יחסים, זוגיות, מיניות והתפתחות אישית.`,
    bullets: [
      'שיתופים על אירועים, סדנאות ומפגשים מהקהילה',
      'הזדמנויות לחיבורים ושיתופי פעולה',
      'הזמנות למפגשי אונליין',
      'מרחב לשיח מכבד, פתוח ובריא',
    ],
    href: 'https://chat.whatsapp.com/JkbCR2ofFuu5X0lAKBucX0',
    buttonText: 'הצטרפו לקבוצה',
    available: true,
  },
  {
    title: 'יחסים, זוגיות ואינטימיות בריאה',
    emoji: '❤️',
    tagline: 'חינמיים ומתנות',
    description: `הקהילה נועדה לאפשר לכם להעמיק, ללמוד ולקבל כלים משמעותיים לעולמות של זוגיות, חיבור רגשי, אינטימיות ומיניות בריאה.`,
    bullets: [
      'תכנים חינמיים, מתנות וכלים פרקטיים',
      'הזמנות מוקדמות והטבות מיוחדות לסדנאות',
      'ידע איכותי מעולמות היחסים והמיניות',
      'עדכונים חשובים — בלי הצפה ובלי ספאם',
    ],
    href: null,
    buttonText: 'בקרוב...',
    available: false,
  },
]

export default function CommunitiesPage() {
  return (
    <div className="min-h-screen bg-cream" dir="rtl">

      {/* Hero */}
      <section className="relative py-36 bg-dusk text-white overflow-hidden text-center">
        <BokehBackground />
        <div className="relative max-w-3xl mx-auto px-6">
          <p className="text-gold/70 text-sm font-semibold uppercase tracking-widest mb-4">
            מתחברים ומתחברות
          </p>
          <h1 className="text-6xl md:text-8xl font-extrabold text-gold leading-tight mb-6">
            קהילות
          </h1>
          <p className="text-sand text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto">
            כ-7,500 נשים וגברים שתומכים, נתמכים ולומדים המון — בחינם, ביחד
          </p>
          <div className="mt-8">
            <SectionDivider />
          </div>
        </div>
      </section>

      {/* Facebook intro */}
      <section className="py-20 bg-night text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-300 text-sm font-semibold px-5 py-2 rounded-full mb-8 border border-blue-500/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            קהילות הפייסבוק שלנו
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gold mb-6">
            קהילות מתחברים ומתחברות
          </h2>
          <p className="text-sand/90 text-lg leading-loose mb-4">
            אני מזמינה אתכם להצטרף אלינו לקהילות מתחברים ומתחברות — הקהילות הכי שוות בפייסבוק לחיבור לעצמנו ובינינו!
          </p>
          <div className="text-right max-w-2xl mx-auto space-y-3 text-sand/80 text-base leading-relaxed border border-gold/20 rounded-2xl p-6 bg-white/5 mt-8">
            <p className="font-bold text-gold text-lg mb-4">איך אנו עושים זאת בקהילות?</p>
            <div className="flex gap-3">
              <span className="text-xl shrink-0">🔶</span>
              <p>למידה על חיבור לגוף, מיניות ויחסים דרך מורים מובילים שמתנדבים ומעניקים מהידע שלהם כל שבוע</p>
            </div>
            <div className="flex gap-3">
              <span className="text-xl shrink-0">🔶</span>
              <p>שיתוף וקבלת תמיכה בכל הנושאים הכי מורכבים</p>
            </div>
            <div className="flex gap-3">
              <span className="text-xl shrink-0">🔶</span>
              <p>למידה מרתקת על המין השני דרך שיח בריא בין גברים ונשים</p>
            </div>
            <div className="flex gap-3">
              <span className="text-xl shrink-0">🔶</span>
              <p>היכרויות וחברויות עם נשים וגברים איכותיים — במפגשי זום מהנים ובעתיד גם פנים מול פנים</p>
            </div>
            <p className="text-gold/60 text-sm pt-2 text-center">ועוד מלא פינות, שרשורים, מתנות, כלים, אירועים.. והכל בחינם!</p>
          </div>
        </div>
      </section>

      {/* Facebook groups cards */}
      <section className="py-16 bg-cream">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {facebookGroups.map((group) => (
              <div
                key={group.title}
                className="bg-white rounded-3xl shadow-xl border border-gold/20 overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white text-center">
                  <div className="text-5xl mb-3">{group.emoji}</div>
                  <h3 className="text-2xl font-extrabold mb-1">{group.title}</h3>
                  <p className="text-blue-200 text-sm">{group.subtitle}</p>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-charcoal leading-relaxed text-right mb-6 flex-1">
                    {group.description}
                  </p>
                  <a
                    href={group.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-4 rounded-2xl transition-colors w-full text-center"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    {group.buttonText}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="bg-cream py-4">
        <div className="max-w-xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        </div>
      </div>

      {/* WhatsApp intro */}
      <section className="py-16 bg-dusk text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-green-600/20 text-green-300 text-sm font-semibold px-5 py-2 rounded-full mb-8 border border-green-500/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            קהילות הוואטסאפ שלנו
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gold mb-4">
            הצטרפו לקבוצות הוואטסאפ
          </h2>
          <p className="text-sand/80 text-lg">
            קהילות ממוקדות ואיכותיות — ערך אמיתי, בלי הצפה ובלי ספאם
          </p>
        </div>
      </section>

      {/* WhatsApp cards */}
      <section className="py-16 bg-cream">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whatsappGroups.map((group) => (
              <div
                key={group.title}
                className={`bg-white rounded-3xl shadow-xl border overflow-hidden flex flex-col transition-all duration-300 ${
                  group.available
                    ? 'border-green-200 hover:shadow-2xl hover:-translate-y-1'
                    : 'border-gold/20 opacity-80'
                }`}
              >
                <div className={`p-8 text-white text-center ${
                  group.available
                    ? 'bg-gradient-to-br from-green-500 to-green-700'
                    : 'bg-gradient-to-br from-amber-600 to-amber-800'
                }`}>
                  <div className="text-5xl mb-3">{group.emoji}</div>
                  <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">
                    {group.tagline}
                  </p>
                  <h3 className="text-xl font-extrabold leading-snug">{group.title}</h3>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-charcoal leading-relaxed text-right mb-4">
                    {group.description}
                  </p>
                  <ul className="space-y-2 mb-6 text-right flex-1">
                    {group.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-charcoal/80 text-sm">
                        <span className="text-base shrink-0 mt-0.5">🔶</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  {group.available && group.href ? (
                    <a
                      href={group.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-4 rounded-2xl transition-colors w-full text-center"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      {group.buttonText}
                    </a>
                  ) : (
                    <div className="flex items-center justify-center bg-gold/20 text-gold/80 font-bold px-6 py-4 rounded-2xl w-full text-center border border-gold/30">
                      {group.buttonText}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-night text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-4xl mb-4">🤍</div>
          <h3 className="text-2xl font-extrabold text-gold mb-4">
            שתי הקבוצות נפתחו בתקופת הקורונה
          </h3>
          <p className="text-sand/80 text-lg leading-relaxed">
            וכבר כ-7,500 גברים ונשים תומכים, נתמכים ולומדים המון ביחד. בואו להצטרף אלינו!
          </p>
        </div>
      </section>

    </div>
  )
}
