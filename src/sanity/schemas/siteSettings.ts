import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'הגדרות אתר',
  type: 'document',
  groups: [
    { name: 'contact', title: 'פרטי קשר', default: true },
    { name: 'seo',     title: 'SEO' },
    { name: 'crm',     title: 'CRM' },
  ],
  fields: [
    defineField({ name: 'phone',     title: 'טלפון',                          type: 'string', group: 'contact' }),
    defineField({ name: 'whatsapp',  title: 'WhatsApp (מספר עם קידומת +972)', type: 'string', group: 'contact' }),
    defineField({ name: 'instagram', title: 'Instagram URL',                   type: 'url',    group: 'contact' }),

    defineField({ name: 'seoTitle',       title: 'כותרת SEO ברירת מחדל',  type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'תיאור SEO ברירת מחדל',  type: 'text', rows: 2, group: 'seo' }),

    defineField({
      name: 'contactFormTag',
      title: 'תגית ל-CRM מטופס יצירת קשר',
      description: 'הלקוח יתויג בתגית זו כשמגיש טופס יצירת קשר',
      type: 'string',
      group: 'crm',
      initialValue: 'contact-form',
    }),
    defineField({
      name: 'contactFormStatus',
      title: 'סטטוס ל-CRM מטופס יצירת קשר',
      description: 'הסטטוס שיוגדר ללקוח בעת הגשת הטופס (ריק = ברירת מחדל של CRM)',
      type: 'string',
      group: 'crm',
    }),
  ],
})
