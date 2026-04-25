import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'
import { SECTION_KEYS } from './src/sanity/schemas/homepageSection'

const singletonTypes = new Set(['homepageSection', 'siteSettings'])

const homepageSections = SECTION_KEYS.map(({ value, title }) => ({ id: value, title }))

export default defineConfig({
  name: 'tal-roman-studio',
  title: 'טל רומן — Studio',
  projectId: 'f2dms55f',
  dataset: 'production',
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
