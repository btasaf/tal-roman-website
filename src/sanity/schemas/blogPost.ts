import { defineField, defineType } from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'מאמרים (תוכן של טל)',
  type: 'document',
  fields: [
    defineField({ name: 'docxFile', title: 'קובץ Word/Docs (.docx)', type: 'file', options: { accept: '.docx' }, description: 'הורידי את הקובץ מגוגל דוקס: File → Download → Microsoft Word (.docx)' }),
    defineField({ name: 'title', title: 'כותרת המאמר', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'כתובת URL', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'excerpt', title: 'תקציר קצר (לכרטיס ו-SEO)', type: 'text', rows: 2 }),
    defineField({ name: 'thumbnail', title: 'תמונה ראשית', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'active', title: 'פעיל', type: 'boolean', initialValue: true }),
    defineField({ name: 'publishedAt', title: 'תאריך פרסום', type: 'datetime' }),
  ],
})
