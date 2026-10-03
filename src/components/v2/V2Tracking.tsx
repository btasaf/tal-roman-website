'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useCrmTracking } from '@/hooks/useCrmTracking'

// Keeps the live site's WhatsApp tracking on v2: the live floating button reports click_whatsapp_fab { page }.
// v2 has no floating button, so a click on any direct WhatsApp chat link (menu, footer, contact) reports the same event.
//
// Also the v2-wide delegated tracking (new events only, fire-and-forget, never blocks navigation):
//   data-track="event_name" + data-track-foo="bar"  → click on it (or a link/button inside it) sends event_name { foo, path }
//     data-track-once      → at most once per page view
//     data-track-open-only → only when it opens (skips clicks while aria-expanded="true" / <details open>)
//   form[data-track-form="name"]                     → form_start { form, path } on the first focus inside it (once per page view)
//   links to the quiz with no data-track             → quiz_cta_click { placement: 'other', label, path }
//   external links with no data-track                → outbound_click { host, label, path }
export default function V2Tracking() {
  const pathname = usePathname()
  const { track } = useCrmTracking()

  useEffect(() => {
    const page = pathname.replace(/^\/v2(?=\/|$)/, '') || '/'
    const once = new Set<string>()
    const send = (event: string, data: Record<string, unknown>) => {
      try {
        void track(event, { ...data, path: page }).catch(() => {})
      } catch {}
    }

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null
      const a = target?.closest?.('a[href]') as HTMLAnchorElement | null
      if (a && /^https?:\/\/(wa\.me|api\.whatsapp\.com)\//.test(a.href) && !a.matches('.fixed.bottom-6.left-6')) {
        void track('click_whatsapp_fab', { page }) // the old floating button tracks itself
      }

      const el = target?.closest?.('[data-track]') as HTMLElement | null
      if (el) {
        const interactive = target!.closest('a,button,summary,[role="button"],[role="tab"],input,label')
        if (!interactive || !(el.contains(interactive) || interactive.contains(el))) return
        if (el.dataset.trackOpenOnly !== undefined) {
          const details = interactive.closest('details')
          if (interactive.getAttribute('aria-expanded') === 'true' || el.getAttribute('aria-expanded') === 'true' || (interactive.tagName === 'SUMMARY' && details?.open)) return
        }
        const data: Record<string, unknown> = {}
        for (const [k, v] of Object.entries(el.dataset)) {
          if (!k.startsWith('track') || k === 'track' || k === 'trackOnce' || k === 'trackOpenOnly' || v === undefined) continue
          const key = k.charAt(5).toLowerCase() + k.slice(6)
          data[key] = /^\d+$/.test(v) ? Number(v) : v
        }
        if (el.dataset.trackDock !== undefined) {
          // Which part of the page was on screen when the docked button was used
          delete data.dock
          const mid = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
          const section = mid?.closest('section[id]')?.id
          const scrollable = document.documentElement.scrollHeight - window.innerHeight
          if (section) data.section = section
          data.scrollPercent = scrollable > 0 ? Math.round((window.scrollY / scrollable) * 100) : 0
        }
        const event = el.dataset.track!
        if (el.dataset.trackOnce !== undefined) {
          const key = event + JSON.stringify(data)
          if (once.has(key)) return
          once.add(key)
        }
        send(event, data)
        return
      }

      if (!a || a.closest('[data-track-skip]')) return
      const href = a.getAttribute('href') || ''

      // Any other link into the quiz (no explicit placement): the page path says where it was
      if (/^\/(v2\/)?quiz\/?(\?|#|$)/.test(href)) {
        send('quiz_cta_click', { placement: 'other', label: labelOf(a) })
        return
      }

      // Generic outbound link (anything not tracked above)
      if (/^(mailto|tel):/i.test(href)) {
        send('outbound_click', { host: href.split(':')[0].toLowerCase(), label: labelOf(a) })
        return
      }
      let url: URL
      try {
        url = new URL(a.href)
      } catch {
        return
      }
      if (!/^https?:$/.test(url.protocol) || url.host === window.location.host) return
      if (/^(wa\.me|api\.whatsapp\.com)$/.test(url.host)) return
      send('outbound_click', { host: url.host.replace(/^www\./, ''), label: labelOf(a) })
    }

    const onFocusIn = (e: FocusEvent) => {
      const form = (e.target as Element | null)?.closest?.('[data-track-form]') as HTMLElement | null
      const name = form?.dataset.trackForm
      if (!name || once.has(`form:${name}`)) return
      once.add(`form:${name}`)
      send('form_start', { form: name })
    }

    document.addEventListener('click', onClick, true)
    document.addEventListener('focusin', onFocusIn, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('focusin', onFocusIn, true)
    }
  }, [pathname, track])

  return null
}

function labelOf(el: Element) {
  return (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80) || undefined
}
