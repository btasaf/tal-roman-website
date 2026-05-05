import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/ui/PageHero'
import SectionDivider from '@/components/ui/SectionDivider'
import ContactForm from '@/components/ContactForm'
import RecommendersSection from '@/components/RecommendersSection'
import LiquidBackground from '@/components/ui/LiquidBackground'
import SparkleBackground from '@/components/ui/SparkleBackground'
import { fetchTestimonials } from '@/lib/queries'

export const metadata: Metadata = { title: 'ליווי אישי — טל רומן' }

const learnItems = [
  'ליצור שינוי שמתרחב מהמיניות והאינטימיות אל הזוגיות, היחסים ואיכות החיים כולה.',
  'איך לאפשר לעצמך לחיות את המיניות ואת החיים שאת מדמיינת לעצמך, מתוך חופש, בחירה וחיבור אמיתי לעצמך.',
  'לעבוד בעדינות ובמקצועיות עם קשיים וכאבים רגשיים ופיזיים במיניות, מתוך חיבור לגוף ולרגש.',
  'לבנות ביטחון עצמי, נוכחות ואהבה עצמית, גם במרחב המיני וגם ביומיום.',
  'לפתח חיבור והקשבה לגוף, לרצונות ולצרכים שלך, ולפעול מתוכם בצורה בטוחה ומודעת.',
  'להבין לעומק את עצמך, את המיניות שלך ואת הדפוסים שמעצבים את האינטימיות והקשרים בחייך.',
]

const forWhom = [
  'לאנשים שמחפשים ליווי מקצועי, רגיש ולא שיפוטי.',
  'לאנשים שרוצים להרגיש בביטחון ובעוצמה שלהם ולחיות את החיים שהם באמת רוצים.',
  'לאנשים שחווים פער בין איך שהיו רוצים לחיות את המיניות והיחסים שלהם לבין מה שקורה בפועל. שיודעים ומרגישים שאפשר אחרת אך לא בטוחים איך.',
  'לאנשים שמרגישים תקיעות, בלבול או קושי במיניות, באינטימיות או בקשרים, ורוצים שינוי אמיתי ומעמיק.',
]

const faq = [
  {
    q: 'האם זה דיסקרטי?',
    a: 'בהחלט. כל התהליך מתקיים בפרטיות מלאה, במרחב בטוח, מקצועי ולא שיפוטי.',
  },
  {
    q: 'האם זה מתאים גם אם קשה לי להיפתח או לסמוך?',
    a: 'כן. הרבה אנשים מגיעים בדיוק מהמקום הזה. בניית אמון ותחושת ביטחון היא חלק מהתהליך, ואין ציפייה להיפתח מיד או "להצליח" במשהו.',
  },
  {
    q: 'מה אם אני חושש/ת להציף רגשות קשים?',
    a: 'העבודה נעשית בהדרגה ובזהירות, תוך הקשבה מלאה לגבולות שלך. לא נכנסים לשום מקום בלי שיש תחושת ביטחון והחזקה.',
  },
  {
    q: 'מה אם אני לא יודע/ת בדיוק מה הבעיה או מאיפה להתחיל?',
    a: 'אין צורך לדעת מראש. חלק מהליווי הוא לעזור לך להבין מה קורה לך, לנסח את הקושי יחד ולגלות בהדרגה מה מבקש תשומת לב וריפוי.',
  },
  {
    q: 'מה אם אני מרגיש/ה בושה או חוסר נוחות לדבר על מיניות?',
    a: 'זה טבעי מאוד. מיניות היא תחום רגיש ואינטימי עבור רוב האנשים. חלק מהתהליך הוא ליצור עבורך מרחב בטוח, שבו מתקדמים בקצב שלך, בלי לחץ ובלי צורך לחשוף יותר ממה שמתאים לך בכל רגע.',
  },
  {
    q: 'האם זה מתאים גם אם הקושי הוא פיזי?',
    a: 'כן. פעמים רבות קשיים פיזיים במיניות קשורים גם למרכיבים רגשיים. ניגש לזה בעדינות, במקצועיות ובהתאמה מלאה אליך.',
  },
  {
    q: 'האם חייבים להגיע לתהליך ארוך?',
    a: 'לא. יש מי שמגיעים למספר מפגשים ממוקדים ויש מי שבוחרים בתהליך מתמשך. הכל מותאם אליך, לצרכים שלך ולקצב שנכון לך.',
  },
]

function CtaButton() {
  return (
    <a
      href="#contact"
      className="inline-block bg-gold hover:bg-gold/80 text-night font-bold px-10 py-4 rounded-full text-lg shadow-lg shadow-gold/20 transition-all hover:scale-105"
    >
      אשמח לקבל פרטים נוספים
    </a>
  )
}

export default async function PersonalCoachingPage() {
  const testimonials = await fetchTestimonials().catch(() => [])

  return (
    <div className="min-h-screen bg-cream" dir="rtl">

      {/* 1 ── Hero ── DARK */}
      <PageHero
        eyebrow="מרחב בטוח ולא שיפוטי"
        title="תהליך ליווי אישי"
        subtitle="ליווי רגשי אישי ומקצועי להתפתחות ולשינוי דרך עבודה עם הקשיים, הכאבים והתקיעויות במיניות וביחסים שלך."
      >
        <p className="text-sand/70 text-lg leading-loose mt-4 mb-10 max-w-2xl mx-auto">
          אני מזמינה אותך לעבור איתי תהליך שמאפשר לעצור בתוך הקושי,
          להבין לעומק מה מתרחש בגוף וברגש — וליצור את החיים האינטימיים שאת\ה חולמ\ת עליהם.
        </p>
        <CtaButton />
      </PageHero>

      {/* 2 ── Personal Story ── BRIGHT */}
      <section className="py-24 bg-cream">
        <div className="max-w-2xl mx-auto px-6 text-right">
          <div className="space-y-5 text-charcoal text-lg leading-loose">
            <p>
              יכול להיות שכבר הרבה זמן משהו לא עובד לך.
              שיש רצון עמוק שהמיניות והאינטימיות בחיים שלך ירגישו אחרת,
              אבל לקח זמן עד שהעזת לפנות לעזרה.
            </p>
            <p className="text-brand font-semibold text-xl">אני מבינה אותך.</p>
            <p>
              מיניות ויחסים הם תחומים מאוד רגישים ומורכבים,
              שלרוב מלווים בבושה, אשמה ותסכול,
              ולפעמים קשה להאמין שבאמת אפשר לשנות שם משהו.
            </p>
            <p>
              אני מכירה את המקומות האלו לא רק מהקליניקה, אלא גם מהחיים שלי.
              שנים הרגשתי שהמיניות שלי תקועה —
              שהפער בין מה שידעתי ורציתי שיהיה
              לבין מה שקרה בפועל היה כואב ומתסכל.
            </p>
            <p>
              כמעט ויתרתי, אבל משהו בתוכי לא הסכים לוותר
              ולקח אותי לתהליך מטורף שהפך אותי למי שאני היום —
              אישה שחיה את החיים שהיא חלמה.
            </p>
            <p className="text-sienna font-medium">
              חיים מלאים בהגשמה ובעונג, עם בן זוג מדהים, מיניות וואו,
              והכי חשוב — גרם לי לאהוב את עצמי באמת.
            </p>
            <p>
              דווקא המסע האישי הזה הוא מה שהפך את התחום הזה ללב העשייה שלי היום.
              המטרה שלי היא לעזור לך לממש את הפוטנציאל שלך —
              גם במיניות, גם בקשרים, ובכלל בחיים.
            </p>
          </div>

          <div className="mt-10 p-6 rounded-2xl border border-gold/30 bg-white/60">
            <p className="text-charcoal text-base leading-loose text-right">
              הליווי שאני מציעה משלב שיח רגשי מעמיק עם עבודה דרך הגוף,
              באופן שאינו כולל מגע מצידי, אלא נעזר בלמידה מעמיקה של הגוף שלך
              כדי להבין את הצרכים הכי עמוקים שלך —
              וגם כדי להגיע לחלקים לא מודעים ש"תוקעים אותך",
              ובכך ליצור תהליכי שחרור וריפוי שלא תמיד מתאפשרים דרך שיחה בלבד.
            </p>
          </div>

          <div className="mt-10 text-center">
            <CtaButton />
          </div>
        </div>
      </section>

      {/* 3 ── What We'll Learn ── DARK */}
      <section className="py-24 text-white relative overflow-hidden">
        <LiquidBackground />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gold mb-4">
              מה נלמד יחד?
            </h2>
            <SectionDivider />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {learnItems.map((item, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-2xl p-6 border border-gold/15 flex gap-4 items-start hover:bg-white/10 transition-all duration-200"
              >
                <div className="shrink-0 w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sand leading-relaxed text-right text-base">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 ── For Whom ── BRIGHT */}
      <section className="py-24 bg-cream relative overflow-hidden">
        <SparkleBackground />
        <div className="relative max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              למי זה מתאים?
            </h2>
            <SectionDivider />
          </div>
          <div className="space-y-4">
            {forWhom.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 items-start bg-white border border-gold/20 rounded-2xl p-5 hover:shadow-md transition-all"
              >
                <span className="text-gold text-2xl shrink-0 mt-0.5">✦</span>
                <p className="text-charcoal leading-relaxed text-right text-base">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 ── Testimonials ── DARK */}
      <RecommendersSection testimonials={testimonials} dark />

      {/* 6 ── Pricing ── LIQUID */}
      <section className="py-24 text-white relative overflow-hidden">
        <LiquidBackground />
        <div className="relative max-w-xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gold mb-4">
              מיקום ועלויות
            </h2>
            <SectionDivider />
          </div>
          <div className="bg-white/8 rounded-3xl border border-gold/25 overflow-hidden">
            <div className="bg-gradient-to-br from-dusk to-night p-8 text-center text-white">
              <p className="text-gold text-5xl font-extrabold mb-1">₪400</p>
              <p className="text-sand/70 text-base">לפגישה · שעה מלאה</p>
            </div>
            <div className="p-8 space-y-5 text-right">
              <div className="flex items-center gap-3">
                <span className="text-gold text-xl shrink-0">📍</span>
                <p className="text-sand/85 text-base">קליניקה בדרום תל אביב או בזום</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gold text-xl shrink-0">🗓</span>
                <p className="text-sand/85 text-base">תדירות מומלצת — פעם בשבוע, עם גמישות מלאה לפי הצורך</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gold text-xl shrink-0">🔒</span>
                <p className="text-sand/85 text-base">פרטיות מלאה ומרחב לא שיפוטי</p>
              </div>
              <div className="pt-4 border-t border-gold/10">
                <CtaButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 ── FAQ ── CREAM */}
      <section className="py-24 bg-cream text-ink">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
              שאלות ותשובות
            </h2>
            <SectionDivider />
          </div>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <div
                key={i}
                className="border border-gold/25 rounded-2xl overflow-hidden bg-white"
              >
                <div className="flex items-start gap-3 p-5 bg-gold/5">
                  <span className="text-sienna font-bold text-lg shrink-0 mt-0.5">?</span>
                  <p className="font-bold text-ink text-right text-base">{item.q}</p>
                </div>
                <div className="px-5 py-4 text-right">
                  <p className="text-charcoal leading-relaxed text-base">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 ── Contact Form ── BRIGHT */}
      <section id="contact" className="py-24 bg-cream relative overflow-hidden">
        <div className="relative max-w-xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-3">
              השאירי פרטים
            </h2>
            <p className="text-charcoal text-base">ואחזור אליך בהקדם לתיאום שיחת היכרות</p>
            <div className="mt-6">
              <SectionDivider />
            </div>
          </div>
          <ContactForm tag="ליווי-אישי" status="קר" />
        </div>
      </section>

    </div>
  )
}
