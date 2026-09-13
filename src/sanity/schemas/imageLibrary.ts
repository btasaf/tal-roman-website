import { defineField, defineType } from 'sanity'

export const imageLibrary = defineType({
  name: 'imageLibrary',
  title: 'מאגר תמונות',
  type: 'document',
  fields: [
    defineField({
      name: 'images',
      title: 'תמונות',
      description: 'אפשר לגרור כמה תמונות יחד, ולכתוב לכל אחת הסבר',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'description', title: 'הסבר על התמונה', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'description', media: 'asset' } },
        },
      ],
      options: { layout: 'grid' },
    }),
  ],
  preview: { prepare: () => ({ title: 'מאגר תמונות' }) },
})
