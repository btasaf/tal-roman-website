import { defineField, defineType } from 'sanity'

export const STROKE_PATTERNS = [
  { title: 'גל עדין', value: 'wave' },
  { title: 'מכחול', value: 'brush' },
  { title: 'גלים חדים', value: 'sharp' },
  { title: 'הרים', value: 'mountain' },
  { title: 'טפטוף', value: 'drip' },
]

export const sectionStroke = defineType({
  name: 'sectionStroke',
  title: 'מפריד מעוצב',
  type: 'object',
  fields: [
    // ── Top divider ───────────────────────────────────────────────────────
    defineField({
      name: 'topEnabled',
      title: 'מפריד עליון',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'topPattern',
      title: 'דפוס עליון',
      type: 'string',
      options: { list: STROKE_PATTERNS, layout: 'radio' },
      initialValue: 'wave',
      hidden: ({ parent }) => !parent?.topEnabled,
    }),
    defineField({
      name: 'topColor',
      title: 'צבע עליון (hex)',
      type: 'string',
      description: 'לדוגמה: #fff2d4 או #1a0f08',
      initialValue: '#fff2d4',
      hidden: ({ parent }) => !parent?.topEnabled,
      validation: (r) =>
        r.custom((val: string | undefined, ctx) => {
          const parent = ctx.parent as { topEnabled?: boolean }
          if (!parent?.topEnabled || !val) return true
          if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val)) return true
          return 'חייב להיות קוד hex תקין, למשל #fff2d4'
        }),
    }),

    // ── Bottom divider ────────────────────────────────────────────────────
    defineField({
      name: 'bottomEnabled',
      title: 'מפריד תחתי',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'bottomPattern',
      title: 'דפוס תחתי',
      type: 'string',
      options: { list: STROKE_PATTERNS, layout: 'radio' },
      initialValue: 'wave',
      hidden: ({ parent }) => !parent?.bottomEnabled,
    }),
    defineField({
      name: 'bottomColor',
      title: 'צבע תחתי (hex)',
      type: 'string',
      description: 'לדוגמה: #fff2d4 או #1a0f08',
      initialValue: '#fff2d4',
      hidden: ({ parent }) => !parent?.bottomEnabled,
      validation: (r) =>
        r.custom((val: string | undefined, ctx) => {
          const parent = ctx.parent as { bottomEnabled?: boolean }
          if (!parent?.bottomEnabled || !val) return true
          if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val)) return true
          return 'חייב להיות קוד hex תקין, למשל #fff2d4'
        }),
    }),
  ],
  preview: {
    select: { te: 'topEnabled', be: 'bottomEnabled', tp: 'topPattern', bp: 'bottomPattern' },
    prepare({ te, be, tp, bp }) {
      const parts = []
      if (te) parts.push(`עליון: ${STROKE_PATTERNS.find((p) => p.value === tp)?.title ?? tp}`)
      if (be) parts.push(`תחתי: ${STROKE_PATTERNS.find((p) => p.value === bp)?.title ?? bp}`)
      return { title: parts.length ? parts.join(' | ') : 'כבוי' }
    },
  },
})
