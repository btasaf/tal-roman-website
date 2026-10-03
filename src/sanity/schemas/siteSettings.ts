import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'הגדרות אתר',
  type: 'document',
  groups: [
    { name: 'contact', title: 'פרטי קשר', default: true },
    { name: 'seo',     title: 'SEO' },
    { name: 'crm',     title: 'CRM' },
    { name: 'social',  title: 'רשתות חברתיות' },
    { name: 'stats',   title: 'מספרים' },
  ],
  fields: [
    defineField({ name: 'phone',     title: 'טלפון',                          type: 'string', group: 'contact' }),
    defineField({ name: 'whatsapp',  title: 'WhatsApp (מספר עם קידומת +972)', type: 'string', group: 'contact' }),
    defineField({ name: 'instagram', title: 'Instagram URL',                   type: 'url',    group: 'social' }),
    defineField({ name: 'facebook',  title: 'Facebook URL',                    type: 'url',    group: 'social' }),
    defineField({ name: 'tiktok',    title: 'TikTok URL',                      type: 'url',    group: 'social' }),
    defineField({ name: 'youtube',   title: 'YouTube URL',                     description: 'ריק = לא מוצג באתר', type: 'url', group: 'social' }),

    defineField({ name: 'yearsExperience',  title: 'שנות ניסיון',            description: 'מוצג באתר כ-"10+" (עם פלוס)', type: 'number', group: 'stats', validation: (r) => r.min(0).integer() }),
    defineField({ name: 'communityMembers', title: 'חברים וחברות בקהילות',  description: 'פייסבוק + וואטסאפ יחד. מוצג כ-"22,000+"', type: 'number', group: 'social', validation: (r) => r.min(0).integer() }),
    defineField({ name: 'facebookFollowers',  title: 'עוקבים בפייסבוק',       description: 'עוקבים בעמוד הפייסבוק. ריק = 18,000', type: 'number', group: 'social', validation: (r) => r.min(0).integer() }),
    defineField({ name: 'instagramFollowers', title: 'עוקבים באינסטגרם',      description: 'ריק = לא מוצג באתר', type: 'number', group: 'social', validation: (r) => r.min(0).integer() }),
    defineField({ name: 'tiktokFollowers',  title: 'עוקבים בטיקטוק',         description: 'ריק = לא מוצג באתר', type: 'number', group: 'social', validation: (r) => r.min(0).integer() }),

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
