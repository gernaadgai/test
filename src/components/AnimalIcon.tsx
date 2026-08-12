import type { AnimalId } from '../types'
import { getIllustration } from '../lib/illustrations'

interface Props {
  animal: AnimalId
  className?: string
  bodyColor?: string
  lineColor?: string
  /** Explicit pixel size — use when nesting inside another <svg> (e.g. GerScene), where
   *  CSS width/height on a nested svg viewport is unreliable across browsers. */
  size?: number
}

/**
 * Hand-drawn-style flat glyphs for each collectible species.
 * Single consistent stroke language so the whole roster reads as one world.
 *
 * If a matching file exists in src/assets/illustrations/ (e.g. horse.png), that
 * artwork is used instead — drop one in any time to upgrade a species with no code change.
 */
export function AnimalIcon({ animal, className, bodyColor = '#FFF9ED', lineColor = '#5C7C3E', size }: Props) {
  const artwork = getIllustration(animal)
  if (artwork) {
    if (size) {
      return <image href={artwork} width={size} height={size} className={className} preserveAspectRatio="xMidYMid meet" />
    }
    return <img src={artwork} alt={animal} className={className} style={{ objectFit: 'contain' }} />
  }

  const s = { fill: bodyColor, stroke: lineColor, strokeWidth: 3.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const line = { fill: 'none', stroke: lineColor, strokeWidth: 3.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  const paths: Record<AnimalId, React.ReactNode> = {
    horse: (
      <g>
        <path d="M35 78 Q30 50 40 32 Q46 20 60 20 Q72 20 74 32 L80 30 L76 40 L70 38 Q72 50 66 62 L68 78" {...s} />
        <path d="M60 20 Q68 14 76 18 Q70 22 68 26" {...s} />
        <path d="M40 32 L30 28" {...line} />
        <circle cx="66" cy="30" r="2.4" fill={lineColor} />
        <path d="M35 78 L30 78 M68 78 L73 78" {...line} />
      </g>
    ),
    camel: (
      <g>
        <path d="M18 76 Q16 55 26 50 Q30 40 38 42 Q40 32 48 34 Q50 26 58 30 Q66 26 68 36 Q76 38 76 48 L80 50 L76 54 Q78 66 70 76" {...s} />
        <path d="M38 42 Q34 30 40 20 Q46 24 44 34" {...s} />
        <path d="M18 76 L14 76 M70 76 L76 76" {...line} />
        <circle cx="42" cy="24" r="2.2" fill={lineColor} />
      </g>
    ),
    sheep: (
      <g>
        <circle cx="38" cy="42" r="14" {...s} />
        <circle cx="52" cy="36" r="12" {...s} />
        <circle cx="62" cy="46" r="13" {...s} />
        <circle cx="46" cy="52" r="14" {...s} />
        <ellipse cx="26" cy="56" rx="9" ry="7" fill={lineColor} stroke="none" />
        <circle cx="23" cy="53" r="1.8" fill={bodyColor} />
        <path d="M30 74 L30 68 M44 76 L44 68 M58 76 L58 68" {...line} />
      </g>
    ),
    goat: (
      <g>
        <ellipse cx="52" cy="58" rx="21" ry="14" {...s} />
        <circle cx="24" cy="40" r="13" {...s} />
        <path d="M18 30 Q10 20 16 12 Q22 18 22 28" {...s} />
        <path d="M28 30 Q30 18 38 14 Q36 22 32 30" {...s} />
        <ellipse cx="15" cy="38" rx="3.5" ry="5" {...s} />
        <path d="M22 48 Q20 56 24 60" {...line} />
        <path d="M34 78 L34 70 M60 78 L60 70" {...line} />
        <circle cx="19" cy="38" r="1.8" fill={lineColor} />
        <path d="M12 44 Q10 50 14 52" {...line} />
      </g>
    ),
    cow: (
      <g>
        <ellipse cx="50" cy="56" rx="26" ry="16" {...s} />
        <circle cx="26" cy="40" r="13" {...s} />
        <path d="M18 30 Q14 24 18 20 M32 30 Q34 22 30 18" {...s} />
        <path d="M40 56 q4 6 0 10 M52 56 q4 6 0 10" {...line} />
        <path d="M34 78 L34 70 M66 78 L66 70" {...line} />
        <circle cx="20" cy="38" r="1.8" fill={lineColor} />
      </g>
    ),
    mouse: (
      <g>
        <circle cx="20" cy="26" r="11" {...s} />
        <circle cx="44" cy="24" r="11" {...s} />
        <circle cx="32" cy="46" r="22" {...s} />
        <path d="M52 60 Q70 66 66 80" {...line} />
        <circle cx="26" cy="44" r="2" fill={lineColor} />
        <circle cx="38" cy="44" r="2" fill={lineColor} />
        <path d="M28 52 Q32 55 36 52" {...line} />
      </g>
    ),
    ox: (
      <g>
        <ellipse cx="50" cy="58" rx="27" ry="15" {...s} />
        <circle cx="26" cy="40" r="14" {...s} />
        <path d="M14 30 Q6 26 8 18 M38 30 Q46 24 44 16" {...s} />
        <path d="M18 46 Q26 52 34 46" {...line} />
        <path d="M36 78 L36 70 M64 78 L64 70" {...line} />
      </g>
    ),
    tiger: (
      <g>
        <circle cx="42" cy="42" r="24" {...s} />
        <path d="M22 26 L14 14 M62 26 L70 14" {...s} />
        <path d="M26 34 L18 32 M58 34 L66 32 M24 46 L16 48 M60 46 L68 48" {...line} />
        <circle cx="34" cy="40" r="2" fill={lineColor} />
        <circle cx="50" cy="40" r="2" fill={lineColor} />
        <path d="M38 50 Q42 54 46 50" {...line} />
      </g>
    ),
    rabbit: (
      <g>
        <path d="M28 40 Q20 14 30 6 Q36 18 34 40" {...s} />
        <path d="M44 40 Q46 12 56 6 Q60 20 52 40" {...s} />
        <circle cx="38" cy="54" r="20" {...s} />
        <circle cx="32" cy="52" r="2" fill={lineColor} />
        <circle cx="44" cy="52" r="2" fill={lineColor} />
        <path d="M34 60 Q38 64 42 60" {...line} />
      </g>
    ),
    dragon: (
      <g>
        <path d="M12 66 Q20 40 10 24 Q26 20 34 34 Q44 20 58 26 Q70 22 76 34 Q64 36 62 46 Q76 48 78 62 Q64 58 56 66" {...s} />
        <path d="M18 24 Q22 14 30 16 M26 20 Q30 12 38 16" {...s} />
        <circle cx="20" cy="28" r="2" fill={lineColor} />
        <path d="M64 30 Q70 26 76 30" {...line} />
      </g>
    ),
    snake: (
      <g>
        <path d="M20 20 Q50 20 34 40 Q18 58 48 62 Q70 64 66 80" {...line} strokeWidth={9} />
        <circle cx="18" cy="18" r="7" fill={bodyColor} stroke={lineColor} strokeWidth={3.5} />
        <circle cx="15" cy="16" r="1.6" fill={lineColor} />
        <path d="M24 14 L30 10" {...line} strokeWidth={2.4} />
      </g>
    ),
    monkey: (
      <g>
        <circle cx="20" cy="38" r="10" {...s} />
        <circle cx="60" cy="38" r="10" {...s} />
        <circle cx="40" cy="44" r="24" {...s} />
        <ellipse cx="40" cy="50" rx="13" ry="11" fill={lineColor} opacity="0.15" stroke="none" />
        <circle cx="33" cy="42" r="2" fill={lineColor} />
        <circle cx="47" cy="42" r="2" fill={lineColor} />
        <path d="M34 52 Q40 57 46 52" {...line} />
      </g>
    ),
    rooster: (
      <g>
        <path d="M30 30 Q26 16 34 14 Q34 22 38 20 Q38 12 46 14 Q44 22 50 22" {...s} />
        <circle cx="36" cy="38" r="16" {...s} />
        <path d="M52 36 L64 32 L54 42 Z" {...s} />
        <path d="M20 46 Q10 40 14 60 Q22 56 24 48" {...s} />
        <circle cx="40" cy="36" r="2" fill={lineColor} />
        <path d="M26 74 L26 66 M46 76 L46 68" {...line} />
      </g>
    ),
    dog: (
      <g>
        <circle cx="42" cy="44" r="22" {...s} />
        <path d="M22 32 Q10 30 12 46 Q20 46 26 40" {...s} />
        <path d="M62 32 Q74 30 72 46 Q64 46 58 40" {...s} />
        <circle cx="34" cy="44" r="2" fill={lineColor} />
        <circle cx="50" cy="44" r="2" fill={lineColor} />
        <ellipse cx="42" cy="54" rx="4" ry="3" fill={lineColor} />
        <path d="M38 58 Q42 62 46 58" {...line} />
      </g>
    ),
    pig: (
      <g>
        <circle cx="42" cy="46" r="22" {...s} />
        <path d="M24 30 L20 20 M60 30 L64 20" {...s} />
        <ellipse cx="42" cy="50" rx="10" ry="7" {...s} />
        <circle cx="38" cy="50" r="1.6" fill={lineColor} />
        <circle cx="46" cy="50" r="1.6" fill={lineColor} />
        <circle cx="30" cy="42" r="2" fill={lineColor} />
        <circle cx="54" cy="42" r="2" fill={lineColor} />
        <path d="M66 60 Q74 58 72 66 Q68 64 66 68" {...line} strokeWidth={2.6} />
      </g>
    ),
  }

  return (
    <svg viewBox="0 0 92 92" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
      {paths[animal]}
    </svg>
  )
}
