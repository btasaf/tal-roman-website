import StudioClient from './StudioClient'

export function generateStaticParams() {
  return [{ tool: undefined }]
}

export default function StudioPage() {
  return <StudioClient />
}
