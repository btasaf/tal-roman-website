export type StrokePattern = 'wave' | 'brush' | 'sharp' | 'mountain' | 'drip'

export interface StrokeData {
  pattern?: StrokePattern
  color?: string
}

// Paths are "solid top → wavy bottom → transparent below".
// viewBox 0 0 1440 80.
// The filled shape starts at y=0 (top of SVG) and ends at the wavy edge (~y=38-68).
// Everything below the wavy edge is transparent — the next section shows through.
const PATHS: Record<StrokePattern, string> = {
  wave:
    'M0,0 L1440,0 L1440,38 ' +
    'C1320,72 1200,8 1080,38 ' +
    'C960,68 840,68 720,38 ' +
    'C600,8 480,8 360,38 ' +
    'C240,68 120,72 0,38 Z',

  brush:
    'M0,0 L1440,0 L1440,34 ' +
    'C1370,50 1315,62 1240,44 ' +
    'C1160,24 1090,52 1010,42 ' +
    'C910,30 850,64 760,48 ' +
    'C660,30 585,58 500,46 ' +
    'C390,30 320,64 225,48 ' +
    'C135,34 70,58 0,44 Z',

  sharp:
    'M0,0 L1440,0 L1440,28 ' +
    'L1320,58 L1210,24 L1100,62 L990,26 ' +
    'L880,60 L770,22 L660,64 L550,26 ' +
    'L440,58 L330,24 L220,62 L110,28 L0,56 Z',

  mountain:
    'M0,0 L1440,0 L1440,24 ' +
    'C1360,18 1320,64 1240,58 ' +
    'C1160,52 1130,20 1050,26 ' +
    'C960,34 930,70 840,62 ' +
    'C750,54 720,18 630,28 ' +
    'C540,40 500,68 410,58 ' +
    'C320,48 285,18 200,28 ' +
    'C120,38 75,64 0,52 Z',

  drip:
    'M0,0 L1440,0 L1440,30 ' +
    'C1390,34 1360,18 1325,24 ' +
    'C1290,30 1280,76 1245,78 ' +
    'C1210,80 1210,32 1160,30 ' +
    'C1080,26 1060,54 1015,52 ' +
    'C970,50 970,24 900,28 ' +
    'C830,32 820,86 775,88 ' +
    'C730,90 735,36 660,32 ' +
    'C585,28 565,58 520,56 ' +
    'C475,54 470,28 400,32 ' +
    'C320,36 300,76 255,74 ' +
    'C210,72 220,30 150,32 ' +
    'C80,34 45,58 0,48 Z',
}

interface PaintStrokeProps {
  color?: string
  pattern?: StrokePattern
  /** Flip vertically for top-of-section placement */
  flipped?: boolean
}

export default function PaintStroke({ color = '#fff2d4', pattern = 'wave', flipped = false }: PaintStrokeProps) {
  return (
    <svg
      viewBox="0 0 1440 80"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className="w-full h-full"
      style={flipped ? { transform: 'scaleY(-1)' } : undefined}
      aria-hidden="true"
    >
      <path d={PATHS[pattern]} fill={color} />
   
    </svg>
  )
}
