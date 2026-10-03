// Copy and assets for the v2 contact page (facts come from the live page and the site's existing v2 copy)

const PHOTOS = '/wix-assets/images/tal-photos/'

export const AVATAR = `${PHOTOS}VV9A8369%20copy_edited.jpg`
export const PHOTO = `${PHOTOS}IMG_4930_2048px.jpg`
export const FORM_ID = 'contact-form'

// What happens after writing
export const STEPS = [
  { title: 'כותבים לי', body: 'בטופס, בוואטסאפ או בטלפון. כמה מילים מספיקות.' },
  { title: 'אני קוראת בעצמי', body: 'כל פנייה נקראת אישית, בדיסקרטיות מלאה.' },
  { title: 'חוזרת אליכם', body: 'בהקדם, באופן אישי.' },
] as const

// Other places on the site people often look for
export const EXPLORE = [
  { href: '/v2/personal-coaching', title: 'ליווי אישי', body: 'תהליך אחד על אחד, במרחב בטוח ולא שיפוטי' },
  { href: '/v2/courses', title: 'קורסים וסדנאות', body: 'מיניות, זוגיות ואינטימיות' },
  { href: '/v2/communities', title: 'קהילות', body: 'נשים וגברים שלומדים ומתחברים יחד' },
  { href: '/v2/articles', title: 'מאמרים', body: 'תשובות לשאלות שאנשים שואלים בשקט' },
] as const
