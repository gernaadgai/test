export type LandscapeVariant = 'steppe' | 'gobi' | 'altai' | 'night' | 'winter'

interface Props {
  variant: LandscapeVariant
  className?: string
}

const PALETTES: Record<LandscapeVariant, { sky: [string, string]; far: string; near: string; ground: string; accent: string }> = {
  steppe: { sky: ['#8FD8F2', '#FBF3E1'], far: '#8FD8F2', near: '#8FBF72', ground: '#E8B85C', accent: '#F3D48F' },
  gobi: { sky: ['#EFC589', '#FBF3E1'], far: '#C97056', near: '#A94B35', ground: '#E8B85C', accent: '#FFFCF4' },
  altai: { sky: ['#5B96B0', '#E2F0E8'], far: '#8FD8F2', near: '#4C7A3A', ground: '#8FBF72', accent: '#FFFCF4' },
  night: { sky: ['#33532A', '#8FBF72'], far: '#4C7A3A', near: '#33532A', ground: '#4C7A3A', accent: '#E8B85C' },
  winter: { sky: ['#5B96B0', '#E2F0E8'], far: '#8FD8F2', near: '#FFFCF4', ground: '#E2F0E8', accent: '#C97056' },
}

/** A reusable illustrated Mongolian landscape backdrop — background/midground/light layers, swappable by variant. */
export function Landscape({ variant, className }: Props) {
  const p = PALETTES[variant]
  const isNight = variant === 'night'
  const isWinter = variant === 'winter'
  const isGobi = variant === 'gobi'

  return (
    <svg viewBox="0 0 400 220" className={className} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id={`sky-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.sky[0]} />
          <stop offset="100%" stopColor={p.sky[1]} />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill={`url(#sky-${variant})`} />

      {/* sun / moon */}
      {isNight ? (
        <circle cx="320" cy="46" r="20" fill={p.accent} opacity="0.9" />
      ) : (
        <>
          <circle cx="330" cy="42" r="30" fill={p.accent} opacity="0.5" />
          <circle cx="330" cy="42" r="18" fill={p.accent} opacity="0.85" />
        </>
      )}

      {/* stars */}
      {isNight &&
        [...Array(14)].map((_, i) => (
          <circle key={i} cx={(i * 37 + 20) % 380 + 10} cy={(i * 23) % 90 + 10} r={i % 3 === 0 ? 1.6 : 1} fill="#FBF3E1" opacity={0.6 + (i % 3) * 0.1} />
        ))}

      {/* far ridge */}
      <path d="M0 130 L40 90 L90 122 L150 78 L220 128 L280 92 L340 130 L400 108 L400 220 L0 220 Z" fill={p.far} opacity="0.55" />
      {/* near ridge */}
      <path
        d={
          isGobi
            ? 'M0 165 Q60 140 130 168 Q200 190 270 160 Q330 138 400 168 L400 220 L0 220 Z'
            : 'M0 150 L70 108 L140 148 L210 100 L270 145 L340 112 L400 150 L400 220 L0 220 Z'
        }
        fill={p.near}
        opacity="0.85"
      />

      {/* ground */}
      <rect x="0" y="185" width="400" height="35" fill={p.ground} opacity={isWinter ? 0.5 : 0.3} />

      {isWinter &&
        [...Array(10)].map((_, i) => <circle key={i} cx={(i * 41 + 15) % 400} cy={130 + (i % 5) * 14} r="1.6" fill="#FFFCF4" opacity="0.8" />)}

      {isGobi && (
        <g opacity="0.7">
          <path d="M60 200 Q64 180 60 165 M60 200 Q66 188 74 182" stroke="#7C3A26" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M330 205 Q334 188 330 175 M330 205 Q336 195 342 190" stroke="#7C3A26" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* small ger silhouette for scale + story */}
      <g transform="translate(200,196)" opacity="0.9">
        <path d="M-14 2 L0 -14 L14 2 Z" fill={isNight ? '#0d1e17' : '#7C3A26'} />
        <rect x="-16" y="2" width="32" height="12" fill={isNight ? '#0d1e17' : '#4C7A3A'} opacity="0.9" />
      </g>
    </svg>
  )
}
