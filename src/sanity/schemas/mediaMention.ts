import { defineField, defineType } from 'sanity'

export const mediaMention = defineType({
  name: 'mediaMention',
  title: 'כיסוי תקשורתי',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'כותרת הכתבה', type: 'string', validation: r => r.required() }),
    defineField({ name: 'excerpt', title: 'תיאור קצר', type: 'text', rows: 2 }),
    defineField({
      name: 'source',
      title: 'מקור',
      type: 'string',
      options: {
        list: [
          { title: 'ynet', value: 'ynet' },
          { title: 'מאקו', value: 'mako' },
          { title: 'וואלה', value: 'walla' },
          { title: 'ערוץ 12', value: 'channel12' },
          { title: 'סקסאפיל (פודקאסט)', value: 'sexapil' },
          { title: 'מגזין את', value: 'et' },
          { title: 'אחר', value: 'other' },
        ],
      },
      validation: r => r.required(),
    }),
    defineField({
      name: 'mediaType',
      title: 'סוג מדיה',
      type: 'string',
      options: {
        list: [
          { title: 'כתבה', value: 'article' },
          { title: 'וידאו', value: 'video' },
          { title: 'פודקאסט', value: 'podcast' },
          { title: 'ראיון', value: 'interview' },
        ],
      },
    }),
    defineField({ name: 'thumbnail', title: 'תמונה מייצגת', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'thumbnailAlt', title: 'תיאור תמונה', type: 'string' }),
    defineField({ name: 'logo', title: 'לוגו מקור', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'logoAlt', title: 'תיאור לוגו', type: 'string' }),
    defineField({ name: 'linkText', title: 'מלל כפתור', type: 'string' }),
    defineField({ name: 'upperTitle', title: 'כותרת עליונה', type: 'string' }),
    defineField({ name: 'externalUrl', title: 'קישור לכתבה', type: 'url', validation: r => r.required() }),
    defineField({ name: 'publicationDate', title: 'תאריך פרסום', type: 'date' }),
    defineField({ name: 'active', title: 'פעיל', type: 'boolean', initialValue: true }),
    defineField({ name: 'featured', title: 'מוצג בדף הבית', type: 'boolean', initialValue: true }),
    defineField({ name: 'order', title: 'סדר הצגה', type: 'number' }),
  ],
  orderings: [{ title: 'סדר הצגה', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})
