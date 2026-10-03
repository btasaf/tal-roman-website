import type { Testimonial } from '@/lib/types'

// Content helpers for /v2/about. Everything shown comes from the CMS (homepage "about" fields + testimonials);
// these only clean and shape it. Fallbacks mirror the current CMS text so the page never renders empty.

const PHOTOS = '/wix-assets/images/tal-photos/'
export const PHOTO = {
  // Warm dark-brown studio portrait: its background dissolves into the manifesto's dark room
  hero: `${PHOTOS}IMG_5123_2048px.jpg`,
  closing: `${PHOTOS}VV9A8415%20copy.jpg`,
  // Story photos (same two warm shoots, one per paragraph)
  story: [
    `${PHOTOS}IMG_4918_2048px.jpg`,
    `${PHOTOS}IMG_5118_2048px.jpg`,
    `${PHOTOS}IMG_4922_2048px.jpg`,
    `${PHOTOS}IMG_5134_2048px.jpg`,
    `${PHOTOS}IMG_4913_2048px.jpg`,
  ],
}

export const COMMUNITY_SIZE = 22000 // as published on /communities (Facebook + WhatsApp)

const FALLBACK_BIO =
  'מנחה, מרצה ומלווה כבר מעל ל-10 שנים בתחומי היחסים והמיניות הבריאה.\n' +
  'הדרך בה אני מאמינה ועובדת היא שמיניות לא קשורה ״רק״ לעונג או הבאת ילדים לעולם -\nאלא היא שער לשינוי עמוק בחיים וביחסים.\n' +
  'זה המקום שבו החלקים העמוקים שלנו נחשפים:\nהתשוקות, הרצונות והצרכים וגם הפחדים והמחסומים שמתבטאים בתחומים אחרים בחיים.\n' +
  'דווקא במיניות קשה יותר להתעלם או לברוח מעצמנו והיא יכולה להיות שער עוצמתי לשינוי\nלהכיר טוב יותר את עצמנו ואת הפרטנרים שלנו,\nולהכניס יותר ביטחון, חיות, עונג וביטוי לחיים ולקשרים שלנו.\n' +
  'ובונוס ענקי - חלק מהתהליכים הכי משמעותיים אפשר לעשות דרך עונג.\n' +
  'לאורך השנים ליוויתי אלפי אנשים וזוגות בתהליכים אישיים, זוגיים וקבוצתיים בארץ ובחו״ל.\n' +
  'המטרה שלי היא לעזור לאנשים לחיות חיים מלאים בתשוקה, חיבור ומימוש עצמי וזוגי.'

const FALLBACK_CREDENTIALS =
  'מנחה, מרצה ומלווה נשים, גברים, זוגות ונוער. בעלת הכשרות של פסיכותרפיה גופנית ועבודת טראומה בשיטות האקומי ואומניתרפיה והכשרות שונות בתחום המיניות האלטרנטיבית והעבודה הרגשית. ' +
  'מנחה בבלוג הוידאו "שניים לעונג" באתר YNET והתארחתי בערוצי הטלויזיה כאן 11 וערוץ 12. כותבת כתבות בנושאי מיניות ויחסים לאתרי חדשות שונים בארץ כולל מגזין את, MAKO, וואלה ו-ynet ומייסדת ומנהלת קהילות מתחברים ומתחברות.'

const tidy = (s: string) =>
  s
    .replace(/[​-‍﻿]/g, '')
    .replace(/\s+-\s+/g, ' — ')
    .replace(/\s+—$/, ' —')
    .replace(/\s{2,}/g, ' ')
    .trim()

// The bio arrives as hard-wrapped lines (some with the period stuck to the start of the next line).
// Rejoin wrapped lines into sentences, then: lead (first), belief (second), story paragraphs (the rest).
export function parseBio(bio?: string | null) {
  const raw = (bio?.trim() ? bio : FALLBACK_BIO)!.split('\n')
  const cut = raw.findIndex((l) => l.includes('רקע והכשרות'))
  const lines = (cut === -1 ? raw : raw.slice(0, cut)).map((l) => l.replace(/[​-‍﻿]/g, '').trim()).filter(Boolean)

  const paras: string[] = []
  for (let l of lines) {
    // A leading "." belongs to the previous line
    if (l.startsWith('.')) {
      if (paras.length && !/[.!?]$/.test(paras[paras.length - 1])) paras[paras.length - 1] += '.'
      l = l.replace(/^[.\s]+/, '')
    }
    if (!l) continue
    const prev = paras[paras.length - 1]
    if (prev !== undefined && !/[.!?]$/.test(prev)) paras[paras.length - 1] = `${prev} ${l}`
    else paras.push(l)
  }
  const clean = paras.map(tidy).filter(Boolean)
  return { lead: clean[0] ?? '', belief: clean[1] ?? '', story: clean.slice(2) }
}

export type Credential = { label: string; text: string }

// Credentials arrive as one run-on string: split into sentences (also where a number runs into the next word),
// and give the founding of the communities its own line.
export function parseCredentials(quote?: string | null) {
  const src = quote?.trim() ? quote : FALLBACK_CREDENTIALS
  const items = src
    .replace(/[“”]/g, '"')
    // CMS typo ("שטנים" for "שונים")
    .replace(/שטנים/g, 'שונים')
    .split(/\.\s*|(?<=\d)(?=[֐-׿])|\s+ו(?=מייסדת)/)
    .map((s) => tidy(s))
    .filter((s) => s.length > 3)

  // The first sentence ("מנחה, מרצה ומלווה ...") introduces the numbers; the rest are the list
  const roleIndex = items.findIndex((s) => /^מנחה, מרצה/.test(s))
  const role = roleIndex === -1 ? '' : items[roleIndex]
  const list: Credential[] = items
    .filter((_, i) => i !== roleIndex)
    .map((text) => ({ text, label: labelFor(text) }))
  return { role, list }
}

function labelFor(text: string) {
  if (/הכשר|פסיכותרפיה/.test(text)) return 'הכשרה'
  if (/בלוג|טלו?ויזיה|ערוץ/.test(text)) return 'מסך'
  if (/כותבת|כתבות/.test(text)) return 'כתיבה'
  if (/קהילות/.test(text)) return 'קהילה'
  return 'ליווי'
}

// Key phrases in the story that get the gold highlight (only when present in the CMS text)
export const STORY_HIGHLIGHTS = ['שער עוצמתי לשינוי', 'דרך עונג', 'אלפי אנשים וזוגות', 'תשוקה, חיבור ומימוש עצמי וזוגי', 'החלקים העמוקים שלנו']

// A few testimonials that speak about Tal's way and about lasting change (chosen by content, in this order);
// tops up from the rest if any are missing from the CMS.
const PREFERRED = ['עדין ואותנטי', 'נדלק מחדש', 'מה חוסם אותי', 'החזרת לי את האמון', 'פתחת לי עולם']

export function pickVoices(all: Testimonial[], count = 5) {
  const seen = new Set<string>()
  const unique = all.filter((t) => {
    const key = t.body?.trim().replace(/\s+/g, ' ')
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
  const chosen: Testimonial[] = []
  for (const phrase of PREFERRED) {
    const t = unique.find((u) => u.body.includes(phrase))
    if (t && !chosen.includes(t)) chosen.push(t)
  }
  for (const t of [...unique].sort((a, b) => b.body.length - a.body.length)) {
    if (chosen.length >= count) break
    if (!chosen.includes(t) && t.body.length < 220) chosen.push(t)
  }
  return chosen.slice(0, count)
}

// The v2 halftone fill (as on the homepage "המלצות" title): fine dots over a soft solid fill, for use with bg-clip-text
export function halftone(dot: string, fillTop: string, fillBottom: string, size = 3.5) {
  return {
    backgroundImage: `radial-gradient(circle, ${dot} 0.9px, transparent 1.3px), linear-gradient(to bottom, ${fillTop}, ${fillBottom})`,
    backgroundSize: `${size}px ${size}px, 100% 100%`,
  }
}
