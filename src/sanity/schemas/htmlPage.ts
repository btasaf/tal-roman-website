import { defineField, defineType } from 'sanity'

export const htmlPage = defineType({
  name: 'htmlPage',
  title: 'דפי HTML',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'שם הדף (לזיהוי פנימי)',
      type: 'string',
      validation: r => r.required(),
    }),
    defineField({
      name: 'urlNote',
      title: 'שימי לב',
      type: 'string',
      readOnly: true,
      initialValue: '👆 הכתובת הסופית תהיה: talroman.com/p/[סלאג]',
    }),
    defineField({
      name: 'slug',
      title: 'סלאג (חלק מהכתובת)',
      type: 'slug',
      options: { source: 'title' },
      validation: r => r.required(),
    }),
    defineField({
      name: 'htmlFile',
      title: 'קובץ HTML',
      type: 'file',
      options: {
        accept: '.html,.htm',
      },
      validation: r => r.required(),
    }),
    defineField({
      name: 'showHeader',
      title: 'הצג Header',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'showFooter',
      title: 'הצג Footer',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare({ title, slug }) {
      return {
        title: title || 'ללא שם',
        subtitle: slug ? `/p/${slug}` : 'חסר סלאג',
      }
    },
  },
})
