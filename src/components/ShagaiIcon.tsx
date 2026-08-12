import { getIllustration } from '../lib/illustrations'

interface Props {
  size?: number
  className?: string
}

/**
 * A stylised shagai (ankle bone) — the recurring GER NAADGAI reward glyph.
 * Drop shagai.png into src/assets/illustrations/ to use real artwork here instead.
 */
export function ShagaiIcon({ size = 20, className }: Props) {
  const artwork = getIllustration('shagai')
  if (artwork) {
    return <img src={artwork} alt="Шагай" width={size} height={size} className={className} style={{ objectFit: 'contain' }} />
  }

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 10 Q6 4 12 4 Q16 1.5 20 5 Q26 4 25 11 Q28 14 24 18 Q26 24 19 25 Q16 29 11 25 Q4 26 5 19 Q2 15 8 10 Z"
        fill="var(--color-cream-dark)"
        stroke="var(--color-ink)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="13" cy="12" r="1.6" fill="var(--color-ink)" opacity="0.45" />
      <circle cx="19.5" cy="17.5" r="1.3" fill="var(--color-ink)" opacity="0.35" />
    </svg>
  )
}
