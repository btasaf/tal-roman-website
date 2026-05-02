import { defineField, defineType } from 'sanity'

export const course = defineType({
  name: 'course',
  title: 'קורסים ומוצרים',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'שם הקורס', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'כתובת URL', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'shortDescription', title: 'תיאור קצר', type: 'text', rows: 2 }),
    defineField({ name: 'description', title: 'תיאור מלא (hover)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'thumbnail', title: 'תמונה (כרטיסייה)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'primaryImage', title: 'תמונה ראשית (עמוד)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'price', title: 'מחיר (טקסט חופשי)', type: 'string' }),
    defineField({ name: 'purchaseUrl', title: 'קישור לרכישה', type: 'url' }),
    defineField({ name: 'landingPageUrl', title: 'קישור לדף נחיתה', type: 'url' }),
    defineField({
      name: 'type',
      title: 'סוג',
      type: 'string',
      options: { list: [{ title: 'דיגיטלי', value: 'digital' }, { title: 'סדנה', value: 'workshop' }, { title: 'אישי', value: 'personal' }] }
    }),
    defineField({ name: 'active', title: 'פעיל', type: 'boolean', initialValue: true }),
    defineField({ name: 'featured', title: 'מוצג בדף הבית', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'סדר הצגה', type: 'number' }),
    defineField({ name: 'location', title: 'מיקום', type: 'string' }),
    defineField({ name: 'cancellationPolicy', title: 'דמי ביטולים', type: 'text', rows: 2 }),
    defineField({ name: 'ctaText', title: 'הנעה לפעולה', type: 'text', rows: 2 }),
    defineField({ name: 'ctaButtonLabel', title: 'כיתוב כפתור', type: 'string' }),
    defineField({ name: 'fullDetails', title: 'פרטים מלאים על הסדנה', type: 'text', rows: 6 }),
    defineField({ name: 'paragraphBelowSubtitle', title: 'פסקה מתחת לכותרת משנה', type: 'text', rows: 4 }),
    defineField({
      name: 'whatYoullLearn',
      title: '📚 מה נלמד',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'whoIsItFor',
      title: '👤 למי זה מתאים',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'faq',
      title: 'שאלות ותשובות',
      type: 'array',
      of: [
        defineField({
          name: 'faqItem',
          title: 'שאלה ותשובה',
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'שאלה', type: 'string' }),
            defineField({ name: 'answer', title: 'תשובה', type: 'text', rows: 3 }),
          ],
        }),
      ],
    }),
  ],
  orderings: [{ title: 'סדר הצגה', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})
