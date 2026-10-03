import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchSiteSettings } from '@/lib/queries'
import { cleanWhatsApp } from '@/lib/utils'
import LegalPageV2, { ToFill } from '@/components/v2/LegalPageV2'

const TITLE = 'הצהרת נגישות — טל רומן'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: 'הצהרת הנגישות של אתר טל רומן: התאמות הנגישות שבוצעו באתר, מגבלות ידועות, נגישות השירות ודרכי פנייה בנושא נגישות.',
  alternates: { canonical: 'https://www.talroman.com/accessibility' },
  robots: { index: false, follow: true },
}

// DRAFT accessibility statement following reg. 35 of the Equal Rights for Persons with Disabilities
// (Service Accessibility Adjustments) Regulations 2013 and IS 5568 (WCAG 2.0 AA). It deliberately says
// "we strive to" rather than claiming full compliance, and lists the limitations found in the code
// (no skip link, auto-playing decorative background video without a pause control, third-party Vimeo
// players and captions, older pages not yet rebuilt). Highlighted [..] items must be completed or
// confirmed by the site owner after an actual accessibility check.
export default async function AccessibilityPage() {
  const settings = await fetchSiteSettings().catch(() => null)
  const wa = cleanWhatsApp(settings?.whatsapp)
  const phone = settings?.phone?.trim()

  return (
    <>
      <style>{`
        main.pt-20 { padding-top: 0 !important; }
        .fixed.bottom-6.left-6 { display: none !important; }
      `}</style>
      <LegalPageV2 kicker="נגישות" title="הצהרת נגישות" updated={<ToFill>תאריך עדכון</ToFill>}>
        <section>
          <p>
            חשוב לי שכל אחת ואחד, כולל אנשים עם מוגבלות, יוכלו להשתמש באתר talroman.com ולקבל את השירותים שלי בנוחות,
            בעצמאות ובכבוד. אני פועלת להנגיש את האתר בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ״ח-1998, ולתקנות
            שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013.
          </p>
        </section>

        <section>
          <h2>רמת הנגישות באתר</h2>
          <p>
            האתר שואף לעמוד בדרישות התקן הישראלי ת״י 5568, ״קווים מנחים לנגישות תכנים באינטרנט״, המבוסס על הנחיות WCAG
            2.0, ברמה AA. ההנגשה נעשית באופן שוטף, וחלק מהעמודים עדיין בתהליך התאמה (ראו ״מגבלות ידועות״ בהמשך).
          </p>
          <ul className="mt-4">
            <li>
              בדיקת הנגישות האחרונה נערכה בתאריך <ToFill>תאריך הבדיקה</ToFill> על ידי{' '}
              <ToFill>מי ביצע/ה את הבדיקה: בעלת האתר / מורשה/ית נגישות שירות / חברת נגישות</ToFill>.
            </li>
            <li>
              האתר נבדק בדפדפנים <ToFill>למשל Chrome, Safari, Firefox, Edge</ToFill>, ובטכנולוגיות מסייעות{' '}
              <ToFill>למשל NVDA במחשב ו-VoiceOver בטלפון</ToFill>.
            </li>
          </ul>
        </section>

        <section>
          <h2>התאמות הנגישות שבוצעו באתר</h2>
          <ul>
            <li>האתר מותאם לתצוגה במחשב, בטאבלט ובטלפון נייד.</li>
            <li>האתר כתוב בעברית, בכיווניות מימין לשמאל, עם הגדרת שפה מתאימה לתוכנות קורא מסך.</li>
            <li>אפשר לנווט באתר באמצעות המקלדת, עם סימון ברור של הרכיב שבפוקוס.</li>
            <li>מבנה כותרות היררכי ותגיות סמנטיות, לתמיכה בתוכנות קורא מסך.</li>
            <li>טקסט חלופי לתמונות בעלות משמעות; תמונות ורקעים דקורטיביים מוסתרים מקוראי מסך.</li>
            <li>שדות הטפסים מתויגים, והודעות שגיאה מוצגות בטקסט ומקושרות לשדה הרלוונטי.</li>
            <li>הקפדה על ניגודיות צבעים בין טקסט לרקע.</li>
            <li>כיבוד הגדרת המערכת להפחתת תנועה: למשתמשים שביקשו זאת, האנימציות מוחלשות או מבוטלות.</li>
            <li>אפשר להגדיל את הטקסט באמצעות הדפדפן (Ctrl ו-+, או צביטה בטלפון) בלי לאבד תוכן.</li>
            <li>בנגן סרטון המתנה יש כפתור הפעלה והשהיה עם תווית לקוראי מסך, שניתן להפעיל במקלדת.</li>
          </ul>
        </section>

        <section>
          <h2>מגבלות ידועות</h2>
          <p>
            למרות המאמצים, ייתכן שחלקים באתר עדיין אינם נגישים במלואם. אלה המגבלות הידועות לי כיום, ואני פועלת לתקן
            אותן:
          </p>
          <ul className="mt-4">
            <li>
              בחלק מהעמודים מוצג ברקע סרטון וידאו דקורטיבי, ללא קול, שמתנגן אוטומטית, וכרגע אין לצידו כפתור עצירה.
              למשתמשים שהגדירו במכשיר ״הפחתת תנועה״, האנימציות באתר מוחלשות.
            </li>
            <li>
              סרטונים מוטמעים מ-Vimeo מוצגים בנגן של צד שלישי, ולא לכולם יש כרגע כתוביות או תמליל.{' '}
              <ToFill>לעדכן אם נוספו כתוביות לסרטוני המתנה</ToFill>
            </li>
            <li>עדיין אין באתר קישור ״דלג לתוכן הראשי״ בתחילת כל עמוד.</li>
            <li>
              חלק מהעמודים (למשל עמודי המאמרים, הקורסים וההמלצות) נמצאים בתהליך עיצוב ובנייה מחדש, וייתכן שהנגישות שלהם
              עדיין אינה מלאה.
            </li>
            <li>
              עמודי רכישה ותשלום, קבוצות קהילה, ורשתות חברתיות (כמו וואטסאפ, פייסבוק ואינסטגרם) הם שירותים של צד שלישי
              שאינם בשליטתי, ונגישותם באחריות מפעיליהם.
            </li>
            <li>
              <ToFill>מגבלות נוספות שיימצאו בבדיקת הנגישות, אם יש</ToFill>
            </li>
          </ul>
          <p className="mt-4">
            אם תוכן כלשהו אינו נגיש לך, אשמח להעביר לך אותו בדרך חלופית, למשל במייל, בטלפון, בוואטסאפ או בשיחת זום.
          </p>
        </section>

        <section>
          <h2>נגישות השירות והקליניקה</h2>
          <p>
            מפגשי הליווי האישי מתקיימים בקליניקה בדרום תל אביב או בשיחת וידאו (זום). פגישה בזום היא חלופה זמינה למי
            שהגעה פיזית קשה לו.
          </p>
          <ul className="mt-4">
            <li>
              הסדרי הנגישות בקליניקה: <ToFill>למשל: קומה, מעלית, מדרגות בכניסה, חניית נכים קרובה, שירותים נגישים</ToFill>
              .
            </li>
            <li>
              הסדרי נגישות בסדנאות ובמפגשים פרונטליים: <ToFill>לפרט, או לכתוב שיפורסמו בכל אירוע</ToFill>.
            </li>
            <li>
              אם נדרשת לך התאמה מסוימת כדי להשתתף במפגש, בסדנה או בקורס, אפשר לפנות מראש ונמצא יחד פתרון מתאים.
            </li>
          </ul>
        </section>

        <section>
          <h2>פנייה בנושא נגישות</h2>
          <p>
            נתקלת בקושי, בתוכן שאינו נגיש, או שיש לך הצעה לשיפור? אשמח לשמוע. אפשר לפנות לרכז/ת הנגישות:
          </p>
          <ul className="mt-4">
            <li>
              שם: <ToFill>שם רכז/ת הנגישות</ToFill>
            </li>
            {phone ? (
              <li>
                טלפון: <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} dir="ltr">{phone}</a>
              </li>
            ) : (
              <li>
                טלפון: <ToFill>מספר טלפון לפניות נגישות</ToFill>
              </li>
            )}
            {wa && (
              <li>
                וואטסאפ: <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">שליחת הודעה</a>
              </li>
            )}
            <li className="break-words">
              דוא״ל: <ToFill>כתובת מייל לפניות נגישות</ToFill>
            </li>
            <li className="break-words">
              דואר: <ToFill>כתובת למשלוח דואר</ToFill>
            </li>
          </ul>
          <p className="mt-4">
            כדי שאוכל לטפל בפנייה, נשמח לפרטים: מה הקושי, באיזה עמוד (או קישור), ובאיזה מכשיר, דפדפן או טכנולוגיה
            מסייעת השתמשת. אשתדל להשיב תוך <ToFill>מספר ימי עסקים למענה</ToFill> ולתקן את הבעיה בהקדם האפשרי.
          </p>
        </section>

        <section>
          <h2>עדכון ההצהרה</h2>
          <p>
            הצהרה זו נבדקת ומעודכנת מעת לעת, ובכל שינוי מהותי באתר. התאריך בראש העמוד מציין את העדכון האחרון. ראו גם את{' '}
            <Link href="/v2/privacy">מדיניות הפרטיות</Link> ואת <Link href="/v2/terms">תנאי השימוש</Link>.
          </p>
        </section>
      </LegalPageV2>
    </>
  )
}
