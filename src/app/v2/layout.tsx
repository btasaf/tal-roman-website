import HeaderV2 from '@/components/v2/HeaderV2'
import FooterV2 from '@/components/v2/FooterV2'
import { fetchSiteSettings } from '@/lib/queries'
import V2Chrome from '@/components/v2/V2Chrome'

// v2 has its own header and footer; the root layout's Nav and Footer skip themselves on /v2 paths
export default async function V2Layout({ children }: { children: React.ReactNode }) {
  const settings = await fetchSiteSettings().catch(() => null)

  return (
    <>
      <V2Chrome
        header={<HeaderV2 settings={settings} />}
        footer={<FooterV2 settings={settings} year={new Date().getFullYear()} />}
      >
        {children}
      </V2Chrome>
    </>
  )
}
