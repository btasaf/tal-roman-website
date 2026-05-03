// CSS-animated SVG turbulence grain — no JS runtime cost after mount
export default function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="grain-svg absolute"
        style={{ width: '200%', height: '200%', top: '-50%', left: '-50%', opacity: 0.045 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="grain-filter" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </div>
  )
}
