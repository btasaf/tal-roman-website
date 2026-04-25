import { defineField, defineType } from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'מאמרים (תוכן של טל)',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'כותרת', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'כתובת URL', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'publishedAt', title: 'תאריך פרסום', type: 'datetime' }),
    defineField({ name: 'excerpt', title: 'תקציר', type: 'text', rows: 2 }),
    defineField({ name: 'thumbnail', title: 'תמונה ראשית', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'body', title: 'תוכן המאמר', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
  ],
})
