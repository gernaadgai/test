import { motion, useReducedMotion } from 'framer-motion'

interface Props {
  tint?: string
  className?: string
}

/**
 * A light, reusable landscape wash — sky, drifting clouds, distant mountains, steppe —
 * so gameplay screens live inside the same Mongolian world as the hero, not on a flat card.
 */
export function SceneBackdrop({ tint, className }: Props) {
  const reduceMotion = useReducedMotion()
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className ?? ''}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="scenebackdrop-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-sky-light)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-cream)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#scenebackdrop-sky)" />

      <motion.g animate={reduceMotion ? undefined : { x: [0, 18, 0] }} transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }} opacity="0.75">
        <ellipse cx="66" cy="38" rx="24" ry="10" fill="var(--color-paper)" />
        <ellipse cx="88" cy="34" rx="15" ry="8" fill="var(--color-paper)" />
      </motion.g>
      <motion.g animate={reduceMotion ? undefined : { x: [0, -14, 0] }} transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }} opacity="0.6">
        <ellipse cx="308" cy="24" rx="19" ry="8" fill="var(--color-paper)" />
      </motion.g>

      <path d="M0 128 L60 90 L120 120 L180 78 L240 118 L300 94 L360 122 L400 106 L400 180 L0 180 Z" fill="var(--color-sky)" opacity="0.22" />
      <path d="M0 150 L70 116 L140 148 L210 104 L270 146 L340 116 L400 150 L400 300 L0 300 Z" fill="var(--color-forest-light)" opacity="0.3" />
      <path d="M0 192 Q200 170 400 192 L400 300 L0 300 Z" fill={tint ?? 'var(--color-grass)'} opacity="0.16" />
    </svg>
  )
}
