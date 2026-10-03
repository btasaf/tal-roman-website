import { useSyncExternalStore } from 'react'

// prefers-reduced-motion that is `false` during SSR + hydration, then the real value.
// Use it to pick between two different trees (motion's useReducedMotion reads the media query on the
// first client render, which mismatches the server HTML when the trees differ).
const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

export function useHydratedReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false)
}
