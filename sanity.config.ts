import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'

const singletonTypes = new Set(['homepageSection', 'siteSettings', 'imageLibrary'])

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
            // Homepage → opens directly to document with tabs
            S.listItem()
              .title('דף הבית')
              .id('homepage')
              .child(
                S.document()
                  .schemaType('homepageSection')
                  .documentId('homepageSection')
              ),

            S.listItem().title('הגדרות אתר').id('siteSettings').child(
              S.document().schemaType('siteSettings').documentId('siteSettings')
            ),

            S.divider(),

            ...(() => {
              const items = S.documentTypeListItems().filter(
                (item) => item.getId() && !singletonTypes.has(item.getId()!)
              )
              const library = S.listItem()
                .title('מאגר תמונות')
                .id('imageLibrary')
                .child(S.document().schemaType('imageLibrary').documentId('imageLibrary'))
              const after = items.findIndex((item) => item.getId() === 'mediaMention')
              items.splice(after >= 0 ? after + 1 : items.length, 0, library)
              return items
            })(),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
})
