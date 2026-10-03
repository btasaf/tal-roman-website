import { notFound } from 'next/navigation'

// Unknown /v2 URLs: static and dynamic v2 routes win over this catch-all, so it only sees paths no route claims.
// Calling notFound() renders src/app/v2/not-found.tsx inside the v2 layout with a 404 status.
export default function MissingV2Page() {
  notFound()
}
