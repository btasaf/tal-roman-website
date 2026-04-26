import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'המלצות',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'שם', type: 'string', validation: r => r.required() }),
    defineField({ name: 'courseTitle', title: 'שם הקורס/תוכנית', type: 'string' }),
    defineField({ name: 'body', title: 'תוכן ההמלצה', type: 'text', rows: 4, validation: r => r.required() }),
    defineField({ name: 'image', title: 'תמונה (WhatsApp screenshot)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'featured', title: 'מוצג בדף הבית', type: 'boolean', initialValue: false }),
    defineField({ name: 'sort', title: 'סדר הצגה', type: 'number' }),
  ],
  orderings: [{ title: 'סדר הצגה', name: 'sortAsc', by: [{ field: 'sort', direction: 'asc' }] }],
})
