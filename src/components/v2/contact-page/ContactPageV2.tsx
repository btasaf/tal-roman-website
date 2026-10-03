import type { SiteSettings } from '@/lib/types'
import { socialUrls } from '../site-stats'
import ContactHero from './ContactHero'
import ContactWays from './ContactWays'
import ContactSteps from './ContactSteps'

// v2 contact page: invitation + form → other ways to reach (phone, social) → what happens next → where else to go
export default function ContactPageV2({ settings }: { settings: SiteSettings | null }) {
  const urls = socialUrls(settings)
  return (
    <div className="relative overflow-x-clip bg-cream">
      <ContactHero tag={settings?.contactFormTag} status={settings?.contactFormStatus} whatsappUrl={urls.whatsapp} />
      <ContactWays phone={settings?.phone} urls={urls} />
      <ContactSteps />
      {/* Cream continues under the footer's rounded shoulders */}
      <div aria-hidden className="absolute top-full inset-x-0 h-12 bg-cream pointer-events-none" />
    </div>
  )
}
