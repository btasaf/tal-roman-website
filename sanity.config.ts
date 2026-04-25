import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'
import { sanityConfig } from './src/sanity/config'

const singletonTypes = new Set(['homepageSection', 'siteSettings'])

const homepageSections = [
  { id: 'hero',            title: 'Hero — פורטרט וכותרת' },
  { id: 'personalMessage', title: 'הודעה אישית' },
  { id: 'gifts',           title: 'מתנות חינמיות' },
  { id: 'about',           title: 'אודות טל' },
  { id: 'featuredPromo',   title: 'פרומו מוצג' },
  { id: 'courses',         title: 'קורסים' },
  { id: 'media',           title: 'בתקשורת' },
  { id: 'contact',         title: 'צור קשר' },
  { id: 'order',           title: 'סדר סקשנים' },
]

export default defineConfig({
  name: 'tal-roman-studio',
  title: 'טל רומן — Studio',
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .id('root')
          .title('תוכן האתר')
          .items([
            // Homepage → sub-list with one item per section (tab)
            S.listItem()
              .title('דף הבית')
              .id('homepage')
              .child(
                S.list()
                  .id('homepageSections')
                  .title('סקשנים בדף הבית')
                  .items(
                    homepageSections.map(({ id, title }) =>
                      S.listItem()
                        .id(`homepageSection-${id}`)
                        .title(title)
                        .child(
                          S.document()
                            .schemaType('homepageSection')
                            .documentId('homepageSection')
                            .title(title)
                            .views([
                              S.view.form().id('form').title(title),
                            ])
                        )
                    )
                  )
              ),

            S.listItem().title('הגדרות אתר').id('siteSettings').child(
              S.document().schemaType('siteSettings').documentId('siteSettings')
            ),

            S.divider(),

            ...S.documentTypeListItems().filter(
              (item) => item.getId() && !singletonTypes.has(item.getId()!)
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
})
