import { defineField, defineType } from 'sanity'

export const freeGift = defineType({
  name: 'freeGift',
  title: 'מתנות חינמיות',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'שם המתנה', type: 'string', validation: r => r.required() }),
    defineField({ name: 'subtitle', title: 'תת-כותרת', type: 'string' }),
    defineField({ name: 'description', title: 'תיאור', type: 'text', rows: 2 }),
    defineField({ name: 'image', title: 'תמונה עגולה', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'emoji', title: "אמוג'י (גיבוי)", type: 'string', placeholder: '🎁' }),
    defineField({ name: 'downloadUrl', title: 'קישור להורדה/לדף חיצוני', type: 'url', validation: r => r.required() }),
    defineField({ name: 'order', title: 'סדר הצגה', type: 'number' }),
  ],
  orderings: [{ title: 'סדר הצגה', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})
