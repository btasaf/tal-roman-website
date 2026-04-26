import { defineField, defineType } from 'sanity'

export const gift = defineType({
  name: 'gift',
  title: 'מתנות (דפי נחיתה)',
  type: 'document',
  groups: [
    { name: 'content',  title: 'תוכן',      default: true },
    { name: 'hero',     title: 'הירו' },
    { name: 'crm',      title: 'CRM' },
  ],
  fields: [
    defineField({ name: 'title',    title: 'כותרת (שם המתנה)',      type: 'string', group: 'content', validation: r => r.required() }),
    defineField({ name: 'slug',     title: 'כתובת URL',              type: 'slug',   group: 'content', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'subtitle', title: 'כותרת משנה (קטגוריה)', type: 'string', group: 'content' }),
    defineField({ name: 'image',    title: 'תמונת הירו',             type: 'image',  group: 'content', options: { hotspot: true } }),
    defineField({ name: 'active',   title: 'פעיל',                   type: 'boolean',group: 'content', initialValue: true }),

    // Hero section
    defineField({ name: 'heroSubheadline', title: 'שורה קטנה מעל ה-H1',  type: 'string', group: 'hero' }),
    defineField({ name: 'heroHeadline',    title: 'כותרת ראשית (H1)',      type: 'string', group: 'hero' }),

    // Body
    defineField({
      name: 'mainBody',
      title: 'טקסט גוף ראשי',
      type: 'array',
      group: 'content',
      of: [{ type: 'block', styles: [{ title: 'רגיל', value: 'normal' }], marks: { decorators: [{ title: 'Bold', value: 'strong' }, { title: 'Italic', value: 'em' }] } }],
    }),
    defineField({ name: 'secondaryText', title: 'טקסט CTA (מתחת לרשימה)', type: 'text', rows: 3, group: 'content' }),

    // List items — what you'll get
    defineField({
      name: 'listItems',
      title: 'מה תקבל / תלמד (רשימה)',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
    }),

    // CRM
    defineField({ name: 'crmStatus', title: 'סטטוס CRM',                      type: 'string', group: 'crm' }),
    defineField({ name: 'crmTags',   title: 'טאגים CRM (מופרדים בפסיקים)',    type: 'string', group: 'crm' }),
    defineField({ name: 'enrollToSchool', title: 'שם בית הספר / קורס (enrollToSchool)', type: 'string', group: 'crm' }),

  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle', media: 'image' },
  },
})
