import { motion, useReducedMotion } from 'framer-motion'
import type { TargetAndTransition, Transition } from 'framer-motion'
import type { AnimalId } from '../types'

export type BuddyState = 'idle' | 'happy' | 'excited' | 'thinking' | 'sad' | 'celebrating' | 'sleeping'

interface Props {
  animal: AnimalId
  state?: BuddyState
  size?: number
  bodyColor?: string
  lineColor?: string
  className?: string
}

const EAR_SHAPES: Partial<Record<AnimalId, 'horse' | 'camel' | 'sheep' | 'goat' | 'cow'>> = {
  horse: 'horse',
  camel: 'camel',
  sheep: 'sheep',
  goat: 'goat',
  cow: 'cow',
}

const WRAPPER_MOTION: Record<BuddyState, { animate: TargetAndTransition; transition: Transition }> = {
  idle: { animate: { y: [0, -3, 0], rotate: 0 }, transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' } },
  happy: { animate: { y: [0, -6, 0] }, transition: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' } },
  excited: { animate: { y: [0, -10, 0], rotate: [0, -4, 4, 0] }, transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' } },
  thinking: { animate: { rotate: [-3, 3, -3] }, transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } },
  sad: { animate: { rotate: [0, -3, 3, -2, 0], y: [0, 1, 0] }, transition: { duration: 0.5, ease: 'easeOut' } },
  celebrating: { animate: { y: [0, -14, 0], rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }, transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' } },
  sleeping: { animate: { y: [0, -2, 0] }, transition: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' } },
}

/**
 * A friendly, expressive GER NAADGAI companion — the shared face/body language every
 * collectible animal wears at emotionally important moments (unlock, mini-game result).
 * Identity comes from ear silhouette + brand color; the face carries the emotion.
 */
export function CharacterBuddy({ animal, state = 'idle', size = 120, bodyColor = '#FFFDF9', lineColor = '#183F35', className }: Props) {
  const prefersReducedMotion = useReducedMotion()
  const ears = EAR_SHAPES[animal] ?? 'round'
  const motionProps = prefersReducedMotion
    ? {}
    : { animate: WRAPPER_MOTION[state].animate, transition: WRAPPER_MOTION[state].transition }

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <motion.g {...motionProps} style={{ transformOrigin: '60px 68px' }}>
        <Ears shape={ears} bodyColor={bodyColor} lineColor={lineColor} />
        {/* body */}
        <circle cx="60" cy="66" r="38" fill={bodyColor} stroke={lineColor} strokeWidth="4" />
        {ears === 'goat' && <Horns lineColor={lineColor} />}
        {ears === 'cow' && <Horns lineColor={lineColor} small />}
        <Face state={state} lineColor={lineColor} />
        {state === 'celebrating' && <Sparkles lineColor={lineColor} />}
        {state === 'sleeping' && <Zzz lineColor={lineColor} />}
      </motion.g>
    </svg>
  )
}

function Ears({ shape, bodyColor, lineColor }: { shape: string; bodyColor: string; lineColor: string }) {
  const s = { fill: bodyColor, stroke: lineColor, strokeWidth: 4, strokeLinejoin: 'round' as const }
  switch (shape) {
    case 'horse':
      return (
        <g>
          <path d="M40 40 L34 16 L52 34 Z" {...s} />
          <path d="M80 40 L86 16 L68 34 Z" {...s} />
        </g>
      )
    case 'camel':
      return (
        <g>
          <ellipse cx="38" cy="30" rx="9" ry="12" {...s} />
          <ellipse cx="82" cy="30" rx="9" ry="12" {...s} />
        </g>
      )
    case 'sheep':
      return (
        <g opacity="0.95">
          {[...Array(10)].map((_, i) => {
            const angle = (i / 10) * Math.PI * 2
            const cx = 60 + Math.cos(angle) * 40
            const cy = 66 + Math.sin(angle) * 40
            return <circle key={i} cx={cx} cy={cy} r="9" fill={bodyColor} stroke={lineColor} strokeWidth="3" />
          })}
        </g>
      )
    case 'goat':
      return (
        <g>
          <ellipse cx="34" cy="46" rx="8" ry="11" {...s} />
          <ellipse cx="86" cy="46" rx="8" ry="11" {...s} />
        </g>
      )
    case 'cow':
      return (
        <g>
          <ellipse cx="30" cy="48" rx="10" ry="9" {...s} />
          <ellipse cx="90" cy="48" rx="10" ry="9" {...s} />
        </g>
      )
    default:
      return (
        <g>
          <circle cx="32" cy="34" r="11" {...s} />
          <circle cx="88" cy="34" r="11" {...s} />
        </g>
      )
  }
}

function Horns({ lineColor, small = false }: { lineColor: string; small?: boolean }) {
  const w = small ? 3.4 : 4
  return (
    <g stroke={lineColor} strokeWidth={w} strokeLinecap="round" fill="none">
      <path d="M48 28 Q44 16 38 12" />
      <path d="M72 28 Q76 16 82 12" />
    </g>
  )
}

function Sparkles({ lineColor }: { lineColor: string }) {
  const pts = [
    [14, 30],
    [106, 24],
    [10, 78],
    [110, 82],
  ]
  return (
    <g>
      {pts.map(([x, y], i) => (
        <motion.path
          key={i}
          d={`M${x} ${y - 6} L${x + 2} ${y} L${x + 8} ${y} L${x + 2.5} ${y + 3.5} L${x + 4.5} ${y + 10} L${x} ${y + 5.5} L${x - 4.5} ${y + 10} L${x - 2.5} ${y + 3.5} L${x - 8} ${y} L${x - 2} ${y} Z`}
          fill="#E8BB62"
          stroke={lineColor}
          strokeWidth="1"
          strokeLinejoin="round"
          animate={{ scale: [0.6, 1, 0.6], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2 }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      ))}
    </g>
  )
}

function Zzz({ lineColor }: { lineColor: string }) {
  return (
    <motion.text
      x="92"
      y="30"
      fontSize="16"
      fontWeight="800"
      fill={lineColor}
      opacity="0.6"
      animate={{ y: [30, 18, 30], opacity: [0.2, 0.7, 0.2] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      z z z
    </motion.text>
  )
}

function Face({ state, lineColor }: { state: BuddyState; lineColor: string }) {
  const eye = { stroke: lineColor, strokeWidth: 4, strokeLinecap: 'round' as const, fill: 'none' }
  const dot = { fill: lineColor }

  switch (state) {
    case 'happy':
      return (
        <g>
          <path d="M42 60 Q46 54 50 60" {...eye} />
          <path d="M70 60 Q74 54 78 60" {...eye} />
          <path d="M44 74 Q60 88 76 74" {...eye} strokeWidth={4.5} />
        </g>
      )
    case 'excited':
      return (
        <g>
          <circle cx="46" cy="60" r="3.4" {...dot} />
          <circle cx="74" cy="60" r="3.4" {...dot} />
          <path d="M40 74 Q60 92 80 74 Q60 82 40 74 Z" fill={lineColor} opacity="0.9" />
        </g>
      )
    case 'celebrating':
      return (
        <g>
          <path d="M42 60 Q46 52 50 60" {...eye} />
          <path d="M70 60 Q74 52 78 60" {...eye} />
          <path d="M40 72 Q60 94 80 72 Q60 84 40 72 Z" fill={lineColor} opacity="0.9" />
        </g>
      )
    case 'thinking':
      return (
        <g>
          <circle cx="46" cy="62" r="3.2" {...dot} />
          <circle cx="74" cy="58" r="3.2" {...dot} />
          <path d="M64 46 Q76 40 84 44" {...eye} strokeWidth={3.2} />
          <path d="M48 76 Q60 72 72 78" {...eye} strokeWidth={3.6} />
        </g>
      )
    case 'sad':
      return (
        <g>
          <path d="M42 62 Q46 66 50 62" {...eye} />
          <path d="M70 62 Q74 66 78 62" {...eye} />
          <path d="M46 82 Q60 72 74 82" {...eye} strokeWidth={4} />
        </g>
      )
    case 'sleeping':
      return (
        <g>
          <path d="M40 60 L52 60" {...eye} />
          <path d="M68 60 L80 60" {...eye} />
          <ellipse cx="60" cy="76" rx="6" ry="4" fill={lineColor} opacity="0.7" />
        </g>
      )
    case 'idle':
    default:
      return (
        <g>
          <circle cx="46" cy="60" r="3.4" {...dot} />
          <circle cx="74" cy="60" r="3.4" {...dot} />
          <path d="M48 76 Q60 84 72 76" {...eye} strokeWidth={4} />
        </g>
      )
  }
}
