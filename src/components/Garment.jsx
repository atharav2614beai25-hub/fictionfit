// Draws one garment as an SVG. Props:
//   category: 'hoodie' | 'tshirt' | 'jacket' | 'coat' | 'cargo' | 'shoes' | 'accessory'
//   colour:   fill colour of the garment (a hex string from product.colours)
//   detail:   colour for small details like buttons and emblems
// The drawing area is 200 wide by 250 tall (viewBox), and scales to any size.
export default function Garment({ category, colour, detail = '#ece5d8' }) {
  const shade = 'rgba(0,0,0,0.22)'            // darker overlay for hoods, pockets, bands
  const base = { fill: colour, stroke: 'rgba(0,0,0,0.5)', strokeWidth: 2, strokeLinejoin: 'round' }
  const dark = { fill: shade, stroke: 'rgba(0,0,0,0.35)', strokeWidth: 1.5, strokeLinejoin: 'round' }
  const line = { fill: 'none', stroke: 'rgba(0,0,0,0.5)', strokeWidth: 2, strokeLinecap: 'round' }

  const shapes = {
    hoodie: (
      <>
        <path d="M62 72 L30 90 L22 190 L48 194 L62 130 Z" {...base} />
        <path d="M138 72 L170 90 L178 190 L152 194 L138 130 Z" {...base} />
        <path d="M62 70 L138 70 L146 218 L54 218 Z" {...base} />
        <path d="M54 204 H146 L146 218 H54 Z" {...dark} />
        <path d="M70 72 Q100 14 130 72 Q100 98 70 72 Z" {...base} />
        <path d="M82 70 Q100 38 118 70 Q100 86 82 70 Z" {...dark} />
        <path d="M72 160 L128 160 L136 192 L64 192 Z" {...dark} />
        <path d="M93 90 L91 128 M107 90 L109 128" {...line} stroke={detail} />
      </>
    ),
    tshirt: (
      <>
        <path d="M70 40 Q100 62 130 40 L172 64 L156 102 L138 92 L138 218 L62 218 L62 92 L44 102 L28 64 Z" {...base} />
        <path d="M70 40 Q100 62 130 40 Q100 78 70 40 Z" {...dark} />
        <path d="M100 112 L118 146 H82 Z" fill={detail} stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M62 204 H138" {...line} />
      </>
    ),
    jacket: (
      <>
        <path d="M62 62 L30 84 L22 196 L48 200 L62 130 Z" {...base} />
        <path d="M138 62 L170 84 L178 196 L152 200 L138 130 Z" {...base} />
        <path d="M62 60 L138 60 L146 208 L54 208 Z" {...base} />
        <path d="M54 194 H146 L146 208 H54 Z" {...dark} />
        <path d="M70 60 L82 40 L100 52 L118 40 L130 60 L100 74 Z" {...base} />
        <path d="M100 74 V208" {...line} stroke={detail} />
        <rect x="68" y="98" width="24" height="22" {...dark} />
        <rect x="108" y="98" width="24" height="22" {...dark} />
        <path d="M66 160 H92 V186 H66 Z M108 160 H134 V186 H108 Z" {...dark} />
      </>
    ),
    coat: (
      <>
        <path d="M62 44 L30 66 L22 196 L48 200 L62 130 Z" {...base} />
        <path d="M138 44 L170 66 L178 196 L152 200 L138 130 Z" {...base} />
        <path d="M62 42 L138 42 L152 240 L48 240 Z" {...base} />
        <path d="M80 42 L100 160 L120 42 Z" {...dark} />
        <path d="M62 42 L76 28 Q100 18 124 28 L138 42 L120 42 L100 74 L80 42 Z" {...base} />
        <path d="M80 42 L100 74 L120 42" {...line} />
        <circle cx="94" cy="176" r="4" fill={detail} />
        <circle cx="94" cy="204" r="4" fill={detail} />
        <path d="M64 150 H86 M114 150 H136" {...line} />
      </>
    ),
    cargo: (
      <>
        <path d="M62 24 L138 24 L146 130 L154 240 L108 240 L100 118 L92 240 L46 240 L54 130 Z" {...base} />
        <path d="M60 24 H140 V42 H60 Z" {...dark} />
        <path d="M100 42 V118" {...line} />
        <rect x="42" y="118" width="24" height="38" {...dark} />
        <rect x="134" y="118" width="24" height="38" {...dark} />
        <path d="M50 226 H92 M108 226 H150" {...line} stroke={detail} />
      </>
    ),
    accessory: (
      <>
        <path d="M32 150 Q40 90 100 84 Q160 90 168 150 Z" {...base} />
        <path d="M100 86 V150 M66 98 Q70 126 74 150 M134 98 Q130 126 126 150" {...line} />
        <path d="M30 150 Q100 176 170 150 L178 162 Q100 194 22 162 Z" {...dark} />
        <circle cx="100" cy="85" r="5" fill={detail} />
      </>
    ),
    shoes: (
      <>
        <path d="M28 120 L86 120 Q96 150 130 156 Q178 160 180 188 L180 200 L28 200 Z" {...base} />
        <path d="M28 186 H180 V204 H28 Z" {...dark} />
        <path d="M92 128 L106 140 M104 122 L118 136 M116 118 L130 132" {...line} stroke={detail} />
      </>
    ),
  }

  return (
    <svg className="garment" viewBox="0 0 200 250" aria-hidden="true">
      {shapes[category] ?? shapes.tshirt}
    </svg>
  )
}
