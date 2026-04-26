/**
 * One-shot migration: reads the two gift CSVs and upserts them into Sanity.
 * Run with:  npx ts-node --esm scripts/migrate-gifts.ts
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const token = process.env.SANITY_WRITE_TOKEN ?? process.env.SANITY_API_TOKEN
if (!token) { console.error('Missing SANITY_WRITE_TOKEN in .env.local'); process.exit(1) }

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// ─── Helper: plain-text paragraphs → Portable Text blocks ────────────────────

function toBlocks(paragraphs: string[]): object[] {
  return paragraphs
    .map(p => p.trim())
    .filter(Boolean)
    .map((text, i) => ({
      _type: 'block',
      _key: `b${i}`,
      style: 'normal',
      children: [{ _type: 'span', _key: `s${i}`, text, marks: [] }],
      markDefs: [],
    }))
}

// ─── Helper: strip HTML tags ──────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\r/g, '')
    .trim()
}

// ─── Helper: extract H1 / H6 from Wix HTML ───────────────────────────────────

function extractH1(html: string): string {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  return m ? stripHtml(m[1]) : ''
}

function extractH6(html: string): string {
  const m = html.match(/<h6[^>]*>([\s\S]*?)<\/h6>/i)
  return m ? stripHtml(m[1]) : ''
}

function extractH4Paragraphs(html: string): string[] {
  const matches = [...html.matchAll(/<h4[^>]*>([\s\S]*?)<\/h4>/gi)]
  return matches.map(m => stripHtml(m[1])).filter(Boolean)
}

// ─── Data ─────────────────────────────────────────────────────────────────────

// List items keyed by wixId of parent gift
const LIST_ITEMS: Record<string, string[]> = {
  // Gift 1 — "להחזיר"
  '2257a535-5fef-471f-819f-0e23b2937e1d': [
    'איך ליצור ביניכם משיכה טבעית, זורמת ומתמשכת, כזו שלא תלויה במאמץ או "מצב רוח".',
    'אראה לך בצורה פרקטית ופשוטה, איך נשים באמת מתעוררות לאורך זמן.',
    'תלמד לזהות את הטעויות והמיתוסים הנפוצים, שדווקא מרחיקים נשים, ומה לעשות אחרת כדי לגרום לה להתמסר?',
    'איך להתאים את הידע הזה לבת הזוג שלך.',
    'תקבל כלים והבנות, שעוזרים לך להיות פחות במאמץ ויותר בקרבה, חשק ושחרור.',
  ],
  // Gift 2 — "להעמיק"
  'd6613508-f00b-44ba-8fd4-52af40ff8249': [
    'תקבל כלים והבנות, שעוזרים לך להיות פחות במאמץ ויותר בקרבה, חשק ושחרור.',
    'תלמד לזהות את הטעויות והמיתוסים הנפוצים, שדווקא מרחיקים נשים, ומה לעשות אחרת כדי לגרום לה להתמסר?',
    'איך לבנות אינטימיות שממשיכה לגדול ולהיות מהנה יותר משנה לשנה.',
    'תלמד איך להעמיק את החיבור ביניכם, ממיניות שכבר טובה — למדהימה.',
  ],
}

// Raw gifts parsed directly from the CSV values
const RAW_GIFTS = [
  {
    wixId: '2257a535-5fef-471f-819f-0e23b2937e1d',
    title: 'אני רוצה להחזיר את המיניות שלנו',
    slug: 'אני-רוצה-להחזיר-את-המיניות-שלנו',
    subtitle: 'הדרכה לגברים',
    heroTitleHtml: `<h6>הדרכה מוקלטת במתנה ממני</h6><h1>מה הכי מעורר נשים לאורך זמן?</h1>`,
    mainBodyHtml: `
      <h4>כשאתה מגיע עם אישה לחדר המיטות, בא לך לשכוח רגע מה"צרות" של היומיום. להוריד שריון, לנשום, ולהרגיש שאתה שוב גבר שנחשק… לא רק מתפקד.</h4>
      <h4>שהיא תרצה אותך. שתימשך אליך. שתתמסר אליך באמת. שיהיה ביניכם וואו, לא רק "בסדר".</h4>
      <h4>הבעיה היא שנראה שלא משנה כמה אתה מנסה, זה לא עובד. קראת חומרים. צפית בטכניקות. הצעת לנסות דברים חדשים. אבל בפועל זה מרגיש שככל שאתה מנסה ומשתדל יותר, ככה היא דווקא מתרחקת ורוצה פחות.</h4>
      <h4>וזה כואב. ומאכזב במיוחד כשאתה אוהב אותה, נמשך אליה, רוצה להתחבר אליה ולעוף איתה. אז למה זה לפעמים מרגיש שהיא לא רוצה את אותו הדבר? למה זה מרגיש לפעמים כל כך קשה?</h4>
      <h4>מה שרוב הגברים לא יודעים, זה שמיניות נשית פועלת לפי חוקים אחרים ממה שלימדו אותנו. חוקים שרוב הגברים, וגם רוב הנשים, לא באמת מכירים.</h4>
      <h4>וכשמבינים איך היא באמת פועלת, הכל מתחיל להיות הרבה יותר פשוט… וגם הרבה יותר מענג.</h4>
      <h4>ובדיוק בשביל זה נוצרה ההדרכה הזו!</h4>
    `,
    secondaryText: 'הגיע הזמן להחזיר לקשר שלכם את מה שחסר בו באמת.\nאליך, אליה, אליכם!\nצפה כבר עכשיו בהדרכה',
    crmStatus: 'קר',
    crmTags: 'קיבל מתנה,לחזיר תשוקה',
    courseSlug: 'what-woman-wants-2',
  },
  {
    wixId: 'd6613508-f00b-44ba-8fd4-52af40ff8249',
    title: 'אני רוצה להעמיק במיניות שלנו',
    slug: 'אני-רוצה-להעמיק-במיניות-שלנו',
    subtitle: 'הדרכה לגברים',
    heroTitleHtml: `<h6>הדרכה מוקלטת במתנה ממני</h6><h1>מה הכי מעורר נשים לאורך זמן?</h1>`,
    mainBodyHtml: `
      <h4>גם כשיש ביניכם מיניות טובה, חיבור ומשיכה — יש עוד הרבה לאן לגדול.</h4>
      <h4>לא כי משהו חסר, אלא כי למיניות אין באמת תקרת זכוכית. תמיד אפשר להעמיק ולהעצים יותר.</h4>
      <h4>יותר עונג. יותר ריגוש. יותר חיבור ואינטימיות.</h4>
      <h4>וברוב המקרים, גם כשיש ביניכם מיניות מעולה (וזה באמת לא מובן מאליו), עם הזמן היא עלולה להפוך לשגרתית וקצת צפויה…</h4>
      <h4>אני רוצה ללמד אותך מיניות אחרת. כזו שלא נתקעת ולא נשחקת, אלא רק הולכת ומעמיקה, מתחזקת ומתעצמת עם השנים.</h4>
      <h4>מיניות שמבוססת על ידע ופרקטיקות שרוב הגברים וגם רוב הנשים כמעט שלא נחשפים אליהם. וחבל.</h4>
      <h4>כי בניגוד למה שהרבה חושבים, מיניות עמוקה ומספקת לאורך זמן היא לא עניין של מזל או רק כימיה. זו מיומנות.</h4>
      <h4>ובדיוק בגלל זה יצרתי את ההדרכה הזו!</h4>
    `,
    secondaryText: 'מאות גברים כבר בחרו לקחת מיניות שכבר טובה — ולהפוך אותה לחוויה ברמה אחרת לגמרי!',
    crmStatus: 'קר',
    crmTags: 'קיבל מתנה,העמקה',
    courseSlug: 'what-woman-wants',
  },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log(`Connecting to Sanity project ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID} …`)

  for (const raw of RAW_GIFTS) {
    const heroHeadline    = extractH1(raw.heroTitleHtml)
    const heroSubheadline = extractH6(raw.heroTitleHtml)
    const bodyParagraphs  = extractH4Paragraphs(raw.mainBodyHtml)
    const mainBody        = toBlocks(bodyParagraphs)
    const listItems       = LIST_ITEMS[raw.wixId] ?? []

    const doc = {
      _id:   `gift-${raw.wixId}`,
      _type: 'gift',
      title: raw.title,
      slug:  { _type: 'slug', current: raw.slug },
      subtitle: raw.subtitle,
      active: true,
      heroHeadline,
      heroSubheadline,
      mainBody,
      secondaryText: raw.secondaryText,
      listItems,
      crmStatus: raw.crmStatus,
      crmTags:   raw.crmTags,
      enrollToSchool: raw.courseSlug,
      wixId: raw.wixId,
    }

    console.log(`\nUploading: "${raw.title}"`)
    console.log(`  slug:            ${raw.slug}`)
    console.log(`  heroHeadline:    ${heroHeadline}`)
    console.log(`  heroSubheadline: ${heroSubheadline}`)
    console.log(`  body paragraphs: ${bodyParagraphs.length}`)
    console.log(`  list items:      ${listItems.length}`)

    await sanity.createOrReplace(doc)
    console.log(`  ✓ saved`)
  }

  console.log('\nDone. Both gifts are now in Sanity.')
  console.log('Next step: open Sanity Studio and upload an image for each gift document.')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
