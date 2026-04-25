import { defineField, defineType } from 'sanity'

export const SECTION_KEYS = [
  { value: 'hero', title: 'Hero — פורטרט וכותרת' },
  { value: 'personalMessage', title: 'הודעה אישית' },
  { value: 'gifts', title: 'מתנות חינמיות' },
  { value: 'about', title: 'אודות טל' },
  { value: 'featuredPromo', title: 'פרומו מוצג' },
  { value: 'courses', title: 'קורסים' },
  { value: 'media', title: 'בתקשורת' },
  { value: 'testimonials', title: 'המלצות' },
  { value: 'contact', title: 'צור קשר' },
]

export const homepageSection = defineType({
  name: 'homepageSection',
  title: 'דף הבית',
  type: 'document',
  groups: [
    { name: 'hero',            title: 'Hero',           default: true },
    { name: 'personalMessage', title: 'הודעה אישית' },
    { name: 'gifts',           title: 'מתנות חינמיות' },
    { name: 'about',           title: 'אודות טל' },
    { name: 'featuredPromo',   title: 'פרומו מוצג' },
    { name: 'courses',         title: 'קורסים' },
    { name: 'media',           title: 'בתקשורת' },
    { name: 'contact',         title: 'צור קשר' },
    { name: 'order',           title: 'סדר סקשנים' },
  ],
  fields: [
    // ── Hero ──────────────────────────────────────────────────────────────
    defineField({ name: 'heroHeadline',    title: 'כותרת ראשית',   type: 'string', group: 'hero' }),
    defineField({ name: 'heroSubheadline', title: 'כותרת משנה',    type: 'string', group: 'hero' }),
    defineField({ name: 'heroBodyText',    title: 'טקסט גוף',      type: 'text', rows: 3, group: 'hero' }),
    defineField({ name: 'heroCtaText',     title: 'כפתור CTA',     type: 'string', group: 'hero' }),
    defineField({ name: 'heroImage',       title: 'תמונת פורטרט', type: 'image', options: { hotspot: true }, group: 'hero' }),

    // ── Personal message ──────────────────────────────────────────────────
    defineField({
      name: 'personalMessage',
      title: 'מסר אישי',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'personalMessage',
    }),

    // ── Free gifts ────────────────────────────────────────────────────────
    defineField({ name: 'giftsHeadline',    title: 'כותרת סקשן מתנות',    type: 'string', group: 'gifts' }),
    defineField({ name: 'giftsSubheadline', title: 'תת-כותרת סקשן מתנות', type: 'string', group: 'gifts' }),

    // ── About ─────────────────────────────────────────────────────────────
    defineField({ name: 'aboutImage', title: 'תמונה',      type: 'image', options: { hotspot: true }, group: 'about' }),
    defineField({ name: 'aboutBio',   title: 'ביוגרפיה',   type: 'text', rows: 5, group: 'about' }),
    defineField({ name: 'aboutQuote', title: 'ציטוט אישי', type: 'text', rows: 4, group: 'about' }),

    // ── Featured promo ────────────────────────────────────────────────────
    defineField({ name: 'featuredPromoTitle',   title: 'כותרת פרומו', type: 'string', group: 'featuredPromo' }),
    defineField({ name: 'featuredPromoBody',    title: 'טקסט פרומו',  type: 'text', rows: 5, group: 'featuredPromo' }),
    defineField({ name: 'featuredPromoCtaText', title: 'כפתור',       type: 'string', group: 'featuredPromo' }),
    defineField({ name: 'featuredPromoUrl',     title: 'קישור',       type: 'url', group: 'featuredPromo' }),
    defineField({ name: 'featuredPromoImage',   title: 'תמונה',       type: 'image', options: { hotspot: true }, group: 'featuredPromo' }),

    // ── Courses ───────────────────────────────────────────────────────────
    defineField({ name: 'coursesHeadline', title: 'כותרת סקשן קורסים', type: 'string', group: 'courses' }),
    defineField({
      name: 'featuredCourses',
      title: 'קורסים מוצגים בדף הבית',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'course' }] }],
      group: 'courses',
    }),

    // ── Scroll gallery (legacy) ───────────────────────────────────────────
    defineField({
      name: 'scrollGalleryItems',
      title: 'פסקאות גלריית גלילה',
      type: 'array',
      group: 'media',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'image',    title: 'תמונה', type: 'image', options: { hotspot: true } }),
          defineField({ name: 'headline', title: 'כותרת', type: 'string' }),
          defineField({ name: 'body',     title: 'תיאור', type: 'text', rows: 2 }),
        ],
        preview: { select: { title: 'headline', media: 'image' } },
      }],
    }),

    // ── Section ordering ──────────────────────────────────────────────────
    defineField({
      name: 'sectionOrder',
      title: 'סדר הסקשנים בדף הבית',
      description: 'גרור את השורות לשינוי הסדר שבו הסקשנים מוצגים',
      type: 'array',
      group: 'order',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'sectionKey',
            title: 'סקשן',
            type: 'string',
            options: { list: SECTION_KEYS },
            validation: (r) => r.required(),
          }),
        ],
        preview: {
          select: { title: 'sectionKey' },
          prepare({ title }) {
            const label = SECTION_KEYS.find((s) => s.value === title)?.title ?? title
            return { title: label }
          },
        },
      }],
    }),
  ],
})
