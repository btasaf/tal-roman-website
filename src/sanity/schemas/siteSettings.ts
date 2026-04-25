import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'הגדרות אתר',
  type: 'document',
  fields: [
    defineField({ name: 'phone', title: 'טלפון', type: 'string' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp (מספר עם קידומת +972)', type: 'string', placeholder: '+972501234567' }),
    defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'seoTitle', title: 'כותרת SEO ברירת מחדל', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'תיאור SEO ברירת מחדל', type: 'text', rows: 2 }),
  ],
})
