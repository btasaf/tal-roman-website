/* CRM tracking for the static body-map pages.
   Mirrors src/hooks/useCrmTracking.ts + usePageView.ts (same visitor id, same API routes). */
(function () {
  function visitorId() {
    try {
      var id = localStorage.getItem('crm_visitor_id')
      if (!id) { id = crypto.randomUUID(); localStorage.setItem('crm_visitor_id', id) }
      return id
    } catch (e) { return null }
  }

  // Don't pollute prod CRM data with dev traffic (set localStorage crm_track_debug=1 to test locally)
  function devSkip() {
    var h = location.hostname
    var debug = false
    try { debug = localStorage.getItem('crm_track_debug') === '1' } catch (e) {}
    return (h === 'localhost' || h === '127.0.0.1') && !debug
  }

  function track(eventType, eventData) {
    var vid = visitorId()
    if (!vid || devSkip()) return Promise.resolve(undefined)
    return fetch('/api/crm/track', {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: vid,
        eventType: eventType,
        pageUrl: location.href,
        referrer: document.referrer || undefined,
        eventData: eventData,
      }),
    })
      .then(function (r) { return r.json() })
      .then(function (d) { return d && d.eventId != null ? String(d.eventId) : undefined })
      .catch(function () { return undefined })
  }

  // Not dev-skipped, same as useCrmTracking's saveCustomer
  function saveCustomer(data) {
    data.visitorId = visitorId() || undefined
    return fetch('/api/crm/save-customer', {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(function () {})
  }

  // Page view + time on page / scroll depth, like usePageView
  function pageView(label) {
    var start = Date.now(), hiddenAccum = 0, hiddenSince = null, maxScroll = 0, sent = false, eventId = null
    function depth() {
      var s = document.documentElement.scrollHeight - innerHeight
      return s <= 0 ? 100 : Math.min(100, Math.round((scrollY / s) * 100))
    }
    function onScroll() { var d = depth(); if (d > maxScroll) maxScroll = d }
    function send() {
      if (sent || !eventId) return
      sent = true
      var now = Date.now(), hiddenNow = hiddenSince ? now - hiddenSince : 0
      navigator.sendBeacon('/api/crm/track/' + eventId, new Blob([JSON.stringify({ eventData: {
        timeOnPageSeconds: Math.round((now - start - hiddenAccum - hiddenNow) / 1000),
        maxScrollDepthPercent: maxScroll,
      } })], { type: 'application/json' }))
    }
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') { hiddenSince = Date.now(); send() }
      else { if (hiddenSince) { hiddenAccum += Date.now() - hiddenSince; hiddenSince = null } sent = false }
    })
    addEventListener('beforeunload', send)
    track(label).then(function (id) { if (id) eventId = id })
  }

  window.crm = { track: track, saveCustomer: saveCustomer, pageView: pageView }
})()
