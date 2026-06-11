// Client-only module. not-found.tsx sets this in its useEffect (child effect),
// which runs before usePageView reads it (parent effect) — React fires child
// effects before parent effects on mount.
let _url: string | null = null

export const notFoundSignal = {
  set:   (url: string) => { _url = url },
  get:   ()            => _url,
  clear: ()            => { _url = null },
}
