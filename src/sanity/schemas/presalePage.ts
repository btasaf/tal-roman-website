import { defineField, defineType } from 'sanity'

export const presalePage = defineType({
  name: 'presalePage',
  title: 'דפי פריסייל (Schooler)',
  type: 'document',
  groups: [
    { name: 'general', title: 'כללי', default: true },
    { name: 'intro', title: 'פתיח' },
    { name: 'body', title: 'טקסט גוף' },
    { name: 'course', title: 'קורס' },
    { name: 'purchase', title: 'רכישה' },
    { name: 'benefits', title: 'יתרונות' },
  ],
  fields: [
    // ── General ──────────────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'שם פנימי',
      type: 'string',
      description: 'לשימוש פנימי בלבד — לא מוצג באתר',
      validation: r => r.required(),
      group: 'general',
    }),
    defineField({
      name: 'slug',
      title: 'כתובת URL',
      type: 'slug',
      options: { source: 'title' },
      validation: r => r.required(),
      group: 'general',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'תמונת רקע',
      type: 'image',
      options: { hotspot: true },
      group: 'general',
    }),

    // ── Intro Section ────────────────────────────────────────────────────────
    defineField({
      name: 'introTitle',
      title: 'כותרת פתיח',
      type: 'string',
      description: 'למשל: "מקווה שנהנית מההדרכה איתי"',
      group: 'intro',
    }),
    defineField({
      name: 'introSubtitle',
      title: 'תת-כותרת פתיח',
      type: 'text',
      rows: 3,
      description: 'הטקסט שמתחת לכותרת הראשית',
      group: 'intro',
    }),

    // ── Body Section ─────────────────────────────────────────────────────────
    defineField({
      name: 'bodyLines',
      title: 'שורות טקסט גוף',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'כל שורה תוצג בשורה נפרדת',
      group: 'body',
    }),

    // ── Course Section ───────────────────────────────────────────────────────
    defineField({
      name: 'courseEyebrow',
      title: 'טקסט מעל שם הקורס',
      type: 'string',
      description: 'למשל: "מה שלמדנו כאן הוא הפרק הראשון מתוך הקורס המלא:"',
      group: 'course',
    }),
    defineField({
      name: 'courseTitle',
      title: 'שם הקורס',
      type: 'string',
      description: 'למשל: "מה נשים באמת רוצות במיטה"',
      group: 'course',
    }),
    defineField({
      name: 'courseTitleHighlight',
      title: 'מילה מודגשת בשם הקורס',
      type: 'string',
      description: 'המילה שתקבל קו תחתון (למשל: "באמת")',
      group: 'course',
    }),
    defineField({
      name: 'courseSpecialText',
      title: 'טקסט מתחת לשם הקורס',
      type: 'string',
      description: 'למשל: "ורק מי שיגיע עד לכאן מקבל ממני את ההמשך במחיר מיוחד:"',
      group: 'course',
    }),

    // ── Purchase Section ─────────────────────────────────────────────────────
    defineField({
      name: 'ctaButtonText',
      title: 'טקסט כפתור',
      type: 'string',
      description: 'למשל: "בא לי להמשיך"',
      group: 'purchase',
    }),
    defineField({
      name: 'ctaButtonLink',
      title: 'קישור כפתור',
      type: 'url',
      description: 'קישור לעמוד הרכישה ב-Schooler',
      group: 'purchase',
    }),
    defineField({
      name: 'priceNew',
      title: 'מחיר חדש',
      type: 'number',
      description: 'המחיר המוצג (בש״ח)',
      group: 'purchase',
    }),
    defineField({
      name: 'priceOld',
      title: 'מחיר ישן',
      type: 'number',
      description: 'המחיר המקורי (מחוק)',
      group: 'purchase',
    }),
    defineField({
      name: 'deviceImage',
      title: 'תמונת מכשירים',
      type: 'image',
      options: { hotspot: true },
      description: 'תמונה של מחשב/טלפון',
      group: 'purchase',
    }),
    defineField({
      name: 'trustBadges',
      title: 'תגי אמון',
      type: 'array',
      group: 'purchase',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'אייקון',
              type: 'string',
              options: {
                list: [
                  { title: 'מנעול (תשלום מאובטח)', value: 'lock' },
                  { title: 'מגן (החזר כספי)', value: 'shield' },
                  { title: 'עין (צפייה דיסקרטית)', value: 'eye' },
                  { title: 'לב (אהבה)', value: 'heart' },
                  { title: 'וי (אישור)', value: 'check' },
                ],
              },
            }),
            defineField({ name: 'text', title: 'טקסט', type: 'string' }),
          ],
          preview: {
            select: { title: 'text', icon: 'icon' },
            prepare({ title, icon }) {
              const icons: Record<string, string> = {
                lock: '🔒',
                shield: '🛡️',
                eye: '👁️',
                heart: '❤️',
                check: '✓',
              }
              return { title: `${icons[icon] || ''} ${title || ''}` }
            },
          },
        },
      ],
    }),

    // ── Benefits Section ─────────────────────────────────────────────────────
    defineField({
      name: 'benefits',
      title: 'יתרונות',
      type: 'array',
      group: 'benefits',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'אייקון',
              type: 'string',
              options: {
                list: [
                  { title: 'אינסוף (גישה לכל החיים)', value: 'infinity' },
                  { title: 'צ׳אט (מענה לשאלות)', value: 'chat' },
                  { title: 'וידאו (הדגמה)', value: 'video' },
                  { title: 'תיקייה (פרקים)', value: 'folder' },
                  { title: 'ספר (למידה)', value: 'book' },
                  { title: 'שעון (זמן)', value: 'clock' },
                  { title: 'כוכב (מועדף)', value: 'star' },
                ],
              },
            }),
            defineField({ name: 'title', title: 'כותרת', type: 'string' }),
            defineField({ name: 'description', title: 'תיאור', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'title', icon: 'icon' },
            prepare({ title, icon }) {
              const icons: Record<string, string> = {
                infinity: '∞',
                chat: '💬',
                video: '▶️',
                folder: '📁',
                book: '📖',
                clock: '⏰',
                star: '⭐',
              }
              return { title: `${icons[icon] || ''} ${title || ''}` }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare({ title, slug }) {
      return {
        title: title || 'ללא שם',
        subtitle: slug ? `/presale/${slug}` : 'ללא כתובת',
      }
    },
  },
})
