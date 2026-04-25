import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
})

async function upsert(doc: Record<string, unknown>) {
  const existing = await client.fetch(`*[_id == $id][0]._id`, { id: doc._id })
  if (existing) {
    console.log(`  skipping (exists): ${doc._id}`)
    return
  }
  await client.createIfNotExists(doc as any)
  console.log(`  created: ${doc._id}`)
}

async function seed() {
  console.log('\n=== Seeding Sanity ===\n')

  // ─── Site Settings ────────────────────────────────────────────────
  console.log('siteSettings...')
  await upsert({
    _id: 'siteSettings',
    _type: 'siteSettings',
    phone: '058-654-0744',
    whatsapp: '+972586540744',
    seoTitle: 'טל רומן — מגשרת על פערים באינטימיות וביחסים',
    seoDescription: 'סדנאות וליווי רגשי לאנשים שמרגישים שמשהו באינטימיות חסר. בגישה פרקטית ובגובה העיניים.',
  })

  // ─── Courses ──────────────────────────────────────────────────────
  console.log('\ncourses...')

  await upsert({
    _id: 'course-what-women-want',
    _type: 'course',
    title: 'מה נשים רוצות במיטה',
    slug: { _type: 'slug', current: 'what-women-want' },
    shortDescription: 'הדרכות הכוללות כלים וידע, וכן תרגולים וכלים מעשיים של מגע',
    description: [
      {
        _type: 'block',
        _key: 'desc1',
        children: [{ _type: 'span', _key: 's1', text: 'בהדרכה נתמקד במגע בעזרת תרגולים וכלים מיוחדים שיטריפו את האישה, יהפכו אותך למאהב מהסרטים והכי חשוב תעצים את שביעות הרצון והכיף של שניכם יחד. נלמד איך לגעת ולהרטיט את גופה ואיברי מינה של האישה, לגרום לה לחוות אורגזמות בשרשרת. ההדרכה כוללת הדגמה על דוגמנית ללא עירום ומגע מיני.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    type: 'workshop',
    featured: true,
    order: 1,
  })

  await upsert({
    _id: 'course-tantra-couples',
    _type: 'course',
    title: 'סדנת טנטרה פרטית לזוגות',
    slug: { _type: 'slug', current: 'tantra-couples' },
    shortDescription: 'סדנה ייחודית שנועדה להעצים את העונג, התקשורת והחיבור הזוגי באופן חוויתי, אינטימי ומרגש',
    description: [
      {
        _type: 'block',
        _key: 'desc1',
        children: [{ _type: 'span', _key: 's1', text: 'סדנת טנטרה זוגית ייחודית שמיועדת לזוגות שרוצים להעמיק את האינטימיות, האהבה והמיניות. במפגש חווייתי ופרטי תלמדו תרגולים וטכניקות מגע מעולם הטנטרה והעיסוי הטנטרי, שיעזרו לכם להגביר חיבור ועונג הדדי. הסדנה מתקיימת באווירה רומנטית ויכולה להתבצע עם או בלי עירום ומגע אינטימי (רק בין בני הזוג). מתאימה לכל סוגי הזוגות ואינה דורשת ניסיון קודם.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    type: 'workshop',
    featured: true,
    order: 2,
  })

  await upsert({
    _id: 'course-tantra-digital',
    _type: 'course',
    title: 'שניים לטנטרה דיגיטאלי',
    slug: { _type: 'slug', current: 'tantra-digital' },
    shortDescription: '18 פרקים של תרגולים מעולמות הטנטרה שיביאו את האינטימיות ביניכם לשלב הבא בלי לצאת מהבית',
    description: [
      {
        _type: 'block',
        _key: 'desc1',
        children: [{ _type: 'span', _key: 's1', text: 'קורס טנטרה זוגי דיגיטלי שיעמיק את הקשר, החיבור והאינטימיות. הקורס כולל 18 פרקים של תרגולים, טכניקות, טקסים טנטריים, נקודות עונג ומגע – לצפייה חופשית, בכל זמן ובכל סדר. מיועד לכל סוגי הזוגות, חדשים או ותיקים, שרוצים לחזק את העונג, הקירבה והחוויה המינית בדרך דיסקרטית ונוחה מהבית.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    type: 'digital',
    featured: true,
    order: 3,
  })

  await upsert({
    _id: 'course-talk-me-into-it',
    _type: 'course',
    title: 'TALK ME INTO IT',
    slug: { _type: 'slug', current: 'talk-me-into-it' },
    shortDescription: 'איך להשתמש במילים כדי להגביר תשוקה, לחזק קרבה, ולהחזיר את ההתרגשות',
    description: [
      {
        _type: 'block',
        _key: 'desc1',
        children: [{ _type: 'span', _key: 's1', text: 'השגרה, העומס והעייפות משפיעים על החשק – וזה קורה לרבים. הבשורה הטובה? לא צריך להפוך את העולם כדי להצית מחדש את התשוקה. לפעמים מילים נכונות בזמן הנכון יוצרות שינוי ענק. בקורס TALK ME INTO IT תגלו איך להשתמש במילים כדי להגביר תשוקה, לחזק קרבה, ולהחזיר את ההתרגשות.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    type: 'digital',
    featured: false,
    order: 4,
  })

  // ─── Free Gifts ───────────────────────────────────────────────────
  console.log('\nfreeGifts...')

  await upsert({
    _id: 'gift-explosive-desire',
    _type: 'freeGift',
    title: 'תשוקה מתפרצת',
    subtitle: 'מחזירות את החשק',
    description: 'הדרכה פרקטית עם תרגילים שמחזירים את הניצוץ',
    emoji: '🔥',
    downloadUrl: 'https://www.talroman.com',
    order: 1,
  })

  await upsert({
    _id: 'gift-orgasm-effortless',
    _type: 'freeGift',
    title: 'אורגזמה בלי מאמץ',
    subtitle: 'הכירי את גופך לעומק',
    description: 'כלים להבנת הגוף שלך ולהנאה אמיתית',
    emoji: '🌸',
    downloadUrl: 'https://www.talroman.com',
    order: 2,
  })

  await upsert({
    _id: 'gift-sexuality-movies',
    _type: 'freeGift',
    title: 'מיניות מהסרטים החדשים',
    subtitle: 'מחזירים את התשוקה לזוגיות',
    description: 'הדרכה לזוגות שרוצים להחזיר את האש',
    emoji: '🎬',
    downloadUrl: 'https://www.talroman.com',
    order: 3,
  })

  // ─── Testimonials ─────────────────────────────────────────────────
  console.log('\ntestimonials...')

  const testimonials = [
    {
      _id: 'testimonial-miriam',
      name: 'מרים',
      courseTitle: 'סדנת טנטרה זוגית',
      body: 'אחרי הסדנה הזוגית שעשינו לפני כמה ימים... שיפור משמעותי. מתקשר הרבה יותר ומכוון ואני הרבה יותר סבלנית ומרגישה חשק.',
      rating: 5,
      featured: true,
    },
    {
      _id: 'testimonial-shachar',
      name: 'שחר',
      courseTitle: 'סדנת עונג נשי לגברים',
      body: 'אני מרגיש שתוך שלוש שעות משהו בי ממש השתנה. הידע שלך פשוט פרייסלס!',
      rating: 5,
      featured: true,
    },
    {
      _id: 'testimonial-almog',
      name: 'אלמוג',
      courseTitle: 'מאסטרית בעונג',
      body: 'אחרי שנים ללא תחושה, בזכותך הצלחתי. וואו ראיתי כוכבים.',
      rating: 5,
      featured: true,
    },
    {
      _id: 'testimonial-avi-shulamit',
      name: 'אבי ושולמית',
      courseTitle: 'סדנת טנטרה זוגית',
      body: 'ממש מהנה שגם אחרי מלא שנים אפשר לחדד וללמוד. כמה כיף לעצור לפעמים ולנשום.',
      rating: 5,
      featured: true,
    },
  ]

  for (const t of testimonials) {
    await upsert({ _type: 'testimonial', ...t })
  }

  // ─── Media Mentions ───────────────────────────────────────────────
  console.log('\nmediaMentions...')

  const mentions = [
    {
      _id: 'media-youth-dont-know',
      title: 'הצעירים לא יודעים הרבה היום',
      excerpt: 'כתבה בנושא מיניות לצעירים בתכנית NEXT בערוץ 12',
      source: 'channel12',
      mediaType: 'video',
      externalUrl: 'https://www.talroman.com',
      featured: true,
      order: 1,
    },
    {
      _id: 'media-shed-self-hate',
      title: 'לפשוט את השנאה העצמית',
      excerpt: 'כתבה על הסדנה "מתחברות למקור"',
      source: 'other',
      mediaType: 'article',
      externalUrl: 'https://www.talroman.com',
      featured: true,
      order: 2,
    },
    {
      _id: 'media-less-action-more-talk',
      title: 'פחות מעשים יותר דיבורים',
      excerpt: 'כתבה על חשיבות התקשורת במיניות',
      source: 'other',
      mediaType: 'article',
      externalUrl: 'https://www.talroman.com',
      featured: true,
      order: 3,
    },
    {
      _id: 'media-sleep-forum',
      title: 'פורום השינה של ישראל',
      excerpt: 'תכנית בה התארחתי על הקשר בין מיניות לשינה',
      source: 'other',
      mediaType: 'podcast',
      externalUrl: 'https://www.talroman.com',
      featured: true,
      order: 4,
    },
    {
      _id: 'media-sex-ed-21',
      title: 'חינוך מיני במאה ה-21',
      excerpt: 'כתבה על חינוך מיני בתכנית ערב',
      source: 'other',
      mediaType: 'video',
      externalUrl: 'https://www.talroman.com',
      featured: true,
      order: 5,
    },
    {
      _id: 'media-tantra-sexapil',
      title: 'טנטרה — סקסאפיל',
      excerpt: 'הדרכה בנושא פערים בתשוקה בפודקאסט',
      source: 'sexapil',
      mediaType: 'podcast',
      externalUrl: 'https://www.talroman.com',
      featured: true,
      order: 6,
    },
    {
      _id: 'media-two-for-pleasure',
      title: 'שניים לעונג',
      excerpt: 'בלוג וידאו בנושא מיניות זוגית באתר ynet',
      source: 'ynet',
      mediaType: 'video',
      externalUrl: 'https://www.talroman.com',
      featured: true,
      order: 7,
    },
    {
      _id: 'media-its-all-for-you',
      title: 'זה הכל בשבילך',
      excerpt: 'כתבה עם מדריך לעינוג נשים',
      source: 'other',
      mediaType: 'article',
      externalUrl: 'https://www.talroman.com',
      featured: true,
      order: 8,
    },
    {
      _id: 'media-anal-sexapil',
      title: 'אנאלי — סקסאפיל',
      excerpt: 'הדרכה בנושא מין אנאלי בפודקאסט',
      source: 'sexapil',
      mediaType: 'podcast',
      externalUrl: 'https://www.talroman.com',
      featured: true,
      order: 9,
    },
    {
      _id: 'media-communication-lesson',
      title: 'שיעור בתקשורת',
      excerpt: 'כתבה על תקשורת מינית',
      source: 'other',
      mediaType: 'article',
      externalUrl: 'https://www.talroman.com',
      featured: true,
      order: 10,
    },
  ]

  for (const m of mentions) {
    await upsert({ _type: 'mediaMention', ...m })
  }

  // ─── Homepage Section ─────────────────────────────────────────────
  console.log('\nhomepageSection...')
  await upsert({
    _id: 'homepageSection',
    _type: 'homepageSection',

    heroHeadline: 'טל רומן',
    heroSubheadline: 'מגשרת על פערים באינטימיות וביחסים',
    heroBodyText: 'סדנאות וליווי רגשי לאנשים שמרגישים שמשהו באינטימיות חסר\nורוצים להבין, לשפר, ולהעמיק את החיבור.\nבגישה פרקטית, בגובה העיניים, שמובילה לשינוי אמיתי.',
    heroCtaText: 'הסתקרנתי, מה הצעד הראשון?',

    personalMessage: `מיניות היא לא רק עונג —
היא שער לשינוי עמוק בחיים וביחסים

מיניות היא כלי עוצמתי להתפתחות אישית ולשדרוג מערכות יחסים.
זה המקום שבו החלקים העמוקים שלנו נחשפים:
התשוקות, הרצונות והצרכים שמבקשים יותר מקום,
וגם הפחדים והמחסומים שמתבטאים בתחומים אחרים בחיים.

דווקא במיניות קשה יותר להתעלם או לברוח מעצמנו,
ובגלל זה היא שער כל כך חזק לשינוי.

דרכה אפשר לרפא, להבין את עצמנו ואת הפרטנרים שלנו לעומק,
ולהכניס יותר ביטחון, עוצמה, חיות, עונג וביטוי לחיים ולקשרים שלנו.

לאורך השנים ליוויתי אלפי אנשים וזוגות
בתהליכים אישיים, זוגיים וקבוצתיים בארץ ובחו"ל.
המטרה שלי היא לעזור לאנשים לחיות חיים מלאים
בתשוקה, חיבור ומימוש עצמי וזוגי.

אם אתם מרגישים שמשהו במיניות או באינטימיות שלכם מבקש שינוי,
או שיש בכם רצון לחיבור עמוק, חי ומלא יותר —
אתם מוזמנים להתחיל כאן.`,

    giftsHeadline: 'קבלו ממני הדרכות',
    giftsSubheadline: 'עם ידע פרקטי, תרגילים פשוטים וכלים שמשפרים את החיבור לגוף ואת ההנאה במיטה.',

    aboutBio: `מנחה, מרצה ומלווה כבר מעל ל-10 שנים בתחומי היחסים והמיניות הבריאה.
עובדת עם נשים, גברים, זוגות וגם נוער בבתי ספר.
בעלת הכשרות של פסיכותרפיה גופנית ועבודת טראומה בשיטות האקומי ואומניתרפיה והכשרות שונות בתחום המיניות האלטרנטיבית והעבודה הרגשית.
בעלת בלוג הוידאו "שניים לעונג" באתר YNET.
כותבת כתבות בנושאי מיניות ויחסים למגזין את, MAKO, וואלה ו-ynet ומייסדת ומנהלת קהילות מתחברים ומתחברות.`,

    aboutQuote: `אני חוקרת כבר שנים רבות את עולמות המיניות, היחסים, הבריאות, העבודה הרגשית והטיפולית.
ככל שהעמקתי יותר גיליתי עד כמה הם משתלבים ביחד.
כמה המיניות היא עוצמתית, כמה היא משפיעה ומושפעת מכל תחומי החיים
ואיזו טרנספורמציה ענקית אנחנו יכולים לעשות דרך עבודה איתה בחיים וביחסים שלנו!
בחשק, בעונג, באהבה, בתשוקה, בריגוש`,

    featuredPromoTitle: 'מרגישים שהאש בזוגיות קצת נחלשה?',
    featuredPromoBody: `השגרה, העומס והעייפות משפיעים על החשק – וזה קורה לרבים.
הבשורה הטובה? לא צריך להפוך את העולם כדי להצית מחדש את התשוקה.
לפעמים מילים נכונות בזמן הנכון יוצרות שינוי ענק.

בקורס TALK ME INTO IT
תגלו איך להשתמש במילים כדי להגביר תשוקה, לחזק קרבה, ולהחזיר את ההתרגשות.`,
    featuredPromoCtaText: 'לפרטים נוספים לחצו פה',
    featuredPromoUrl: 'https://www.talroman.com',

    coursesHeadline: 'בואו להעשיר את עצמכם ביחד איתי',
    featuredCourses: [
      { _type: 'reference', _key: 'fc1', _ref: 'course-what-women-want' },
      { _type: 'reference', _key: 'fc2', _ref: 'course-tantra-couples' },
      { _type: 'reference', _key: 'fc3', _ref: 'course-tantra-digital' },
    ],
  })

  console.log('\n=== Done! ===\n')
  console.log('NOTE: Images need to be uploaded manually in Sanity Studio (/studio):')
  console.log('  - heroImage (portrait of Tal for hero section)')
  console.log('  - aboutImage (photo of Tal for about section)')
  console.log('  - featuredPromoImage (TALK ME INTO IT laptop mockup)')
  console.log('  - freeGift images (3 circular photos)')
  console.log('  - mediaMention thumbnails')
  console.log('  - course thumbnails')
}

seed().catch(console.error)
