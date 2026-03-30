/**
 * Watermark SVG components for section backgrounds.
 * These are purely decorative — aria-hidden on all elements.
 *
 * Pattern:
 *  - Odd sections (1,3,5…)  → WatermarkPalm
 *  - Even sections (2,4,6…) → WatermarkWave
 *
 * Usage:
 *   <section className="relative overflow-hidden">
 *     <WatermarkPalm position="center" />
 *     …content…
 *   </section>
 */

type PalmPosition = 'center' | 'right' | 'left' | 'top-right' | 'top-left' | 'bottom-right'
type WavePosition = 'bottom' | 'top' | 'left' | 'center'

interface WatermarkProps {
  position?: PalmPosition | WavePosition
  opacity?: number
}

// ─── Palm Tree Watermark ───────────────────────────────────────────────────
export function WatermarkPalm({ position = 'center', opacity = 0.1 }: WatermarkProps) {
  const pos: Record<string, string> = {
    center:       'inset-0 flex items-center justify-center',
    right:        'inset-y-0 right-0 flex items-center translate-x-1/4',
    left:         'inset-y-0 left-0 flex items-center -translate-x-1/4',
    'top-right':  'top-0 right-0 translate-x-1/6 -translate-y-1/6',
    'top-left':   'top-0 left-0 -translate-x-1/6 -translate-y-1/6',
    'bottom-right':'bottom-0 right-0 translate-x-1/6 translate-y-1/6',
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${pos[position] ?? pos.center} watermark-float`}
      style={{ opacity }}
    >
      <svg
        width="480"
        height="600"
        viewBox="0 0 480 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[320px] h-auto md:w-[420px] lg:w-[480px] select-none"
      >
        {/* Trunk */}
        <path
          d="M240 600 C235 520 220 440 210 360 C200 280 218 220 240 160"
          stroke="#8B7355"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
        />
        {/* Trunk curve upper */}
        <path
          d="M240 160 C255 110 265 70 260 40"
          stroke="#8B7355"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />

        {/* Frond 1 - left sweep */}
        <path
          d="M255 55 C220 30 160 10 80 25 C140 35 190 55 220 80"
          stroke="#5C7A4A"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Frond 1 leaves */}
        <path d="M255 55 C225 38 185 28 140 30" stroke="#6B8F58" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M255 55 C230 42 200 38 165 45" stroke="#6B8F58" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M255 55 C235 48 215 48 190 60" stroke="#6B8F58" strokeWidth="3" strokeLinecap="round" fill="none"/>

        {/* Frond 2 - right sweep */}
        <path
          d="M260 45 C300 20 370 5 440 18 C380 30 325 55 295 82"
          stroke="#5C7A4A"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M260 45 C295 28 335 20 375 22" stroke="#6B8F58" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M260 45 C290 32 320 28 355 35" stroke="#6B8F58" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M260 45 C285 38 308 38 335 50" stroke="#6B8F58" strokeWidth="3" strokeLinecap="round" fill="none"/>

        {/* Frond 3 - upper left */}
        <path
          d="M258 42 C230 8 195 -20 140 -30 C175 0 205 25 225 55"
          stroke="#5C7A4A"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M258 42 C238 18 210 2 178 -5" stroke="#6B8F58" strokeWidth="3" strokeLinecap="round" fill="none"/>

        {/* Frond 4 - upper right */}
        <path
          d="M262 40 C295 8 330 -18 385 -28 C348 2 315 28 295 58"
          stroke="#5C7A4A"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M262 40 C285 18 312 2 342 -5" stroke="#6B8F58" strokeWidth="3" strokeLinecap="round" fill="none"/>

        {/* Frond 5 - drooping left */}
        <path
          d="M250 60 C215 75 165 100 110 130 C155 110 200 95 230 82"
          stroke="#5C7A4A"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Frond 6 - drooping right */}
        <path
          d="M268 62 C305 78 355 105 410 135 C365 115 318 98 288 84"
          stroke="#5C7A4A"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Coconuts */}
        <circle cx="252" cy="68" r="9" stroke="#8B7355" strokeWidth="3" fill="none"/>
        <circle cx="268" cy="72" r="8" stroke="#8B7355" strokeWidth="3" fill="none"/>
        <circle cx="244" cy="74" r="7" stroke="#8B7355" strokeWidth="3" fill="none"/>

        {/* Seagulls */}
        <path d="M80 200 C90 193 100 193 110 200" stroke="#9BA89F" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M110 200 C120 193 130 193 140 200" stroke="#9BA89F" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

        <path d="M340 160 C348 154 356 154 364 160" stroke="#9BA89F" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M364 160 C372 154 380 154 388 160" stroke="#9BA89F" strokeWidth="2" strokeLinecap="round" fill="none"/>

        <path d="M390 240 C396 235 402 235 408 240" stroke="#9BA89F" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        <path d="M408 240 C414 235 420 235 426 240" stroke="#9BA89F" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      </svg>
    </div>
  )
}

// ─── Ocean Wave Watermark ──────────────────────────────────────────────────
export function WatermarkWave({ position = 'bottom', opacity = 0.1 }: WatermarkProps) {
  const pos: Record<string, string> = {
    bottom:  'bottom-0 left-0 right-0',
    top:     'top-0 left-0 right-0 rotate-180',
    left:    'inset-y-0 left-0 flex items-center -translate-x-1/3',
    center:  'inset-0 flex items-center justify-center',
  }

  if (position === 'left' || position === 'center') {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute ${pos[position] ?? pos.bottom}`}
        style={{ opacity }}
      >
        <svg
          width="500"
          height="500"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[300px] h-auto md:w-[400px] lg:w-[500px] select-none"
        >
          {/* Concentric wave rings */}
          <path d="M250 250 C310 200 370 200 430 250 C370 300 310 300 250 250Z" stroke="#2A6B7E" strokeWidth="3" fill="none"/>
          <path d="M250 250 C190 200 130 200 70 250 C130 300 190 300 250 250Z" stroke="#2A6B7E" strokeWidth="3" fill="none"/>
          <path d="M250 250 C330 185 410 185 480 250 C410 315 330 315 250 250Z" stroke="#2A6B7E" strokeWidth="2" fill="none" opacity="0.7"/>
          <path d="M250 250 C170 185 90 185 20 250 C90 315 170 315 250 250Z" stroke="#2A6B7E" strokeWidth="2" fill="none" opacity="0.7"/>

          {/* Wave lines */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const y = 80 + i * 55
            return (
              <path
                key={i}
                d={`M20 ${y} C80 ${y - 20} 140 ${y + 20} 200 ${y} C260 ${y - 20} 320 ${y + 20} 380 ${y} C440 ${y - 20} 480 ${y + 10} 500 ${y}`}
                stroke="#1B4D5C"
                strokeWidth={2 - i * 0.18}
                fill="none"
                opacity={0.8 - i * 0.08}
              />
            )
          })}
        </svg>
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${pos[position] ?? pos.bottom}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 1440 220"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full select-none"
        style={{ height: '220px' }}
      >
        {/* Wave layer 1 */}
        <path
          d="M0 120 C120 80 240 160 360 120 C480 80 600 160 720 120 C840 80 960 160 1080 120 C1200 80 1320 160 1440 120 L1440 220 L0 220 Z"
          fill="#1B4D5C"
          opacity="0.15"
        />
        {/* Wave layer 2 */}
        <path
          d="M0 150 C180 110 360 190 540 150 C720 110 900 190 1080 150 C1260 110 1380 175 1440 155 L1440 220 L0 220 Z"
          fill="#2A6B7E"
          opacity="0.12"
        />
        {/* Wave layer 3 - crests */}
        <path
          d="M0 80 C80 60 160 100 240 80 C320 60 400 100 480 80 C560 60 640 100 720 80 C800 60 880 100 960 80 C1040 60 1120 100 1200 80 C1280 60 1360 100 1440 80"
          stroke="#2A6B7E"
          strokeWidth="3"
          fill="none"
          opacity="0.3"
        />
        {/* Wave layer 4 - secondary crests */}
        <path
          d="M0 110 C100 90 200 130 300 110 C400 90 500 130 600 110 C700 90 800 130 900 110 C1000 90 1100 130 1200 110 C1300 90 1380 125 1440 110"
          stroke="#1B4D5C"
          strokeWidth="2"
          fill="none"
          opacity="0.25"
        />
        {/* Foam dots */}
        {[60, 180, 300, 420, 540, 660, 780, 900, 1020, 1140, 1260, 1380].map((x, i) => (
          <circle key={i} cx={x} cy={82 + (i % 3) * 8} r="3" fill="#7BA696" opacity="0.4"/>
        ))}
      </svg>
    </div>
  )
}
