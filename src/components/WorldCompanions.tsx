import { motion, useReducedMotion } from 'framer-motion'

export type GuideMood = 'idle' | 'thinking' | 'celebrating'

interface GuideProps {
  mood?: GuideMood
}

/**
 * Small hand-drawn companions for the shared world scenes. They intentionally use
 * simple SVG geometry rather than a rendered mascot style, so the game keeps its
 * picture-book character until final illustration assets are commissioned.
 */
export function GirlGuide({ mood = 'idle' }: GuideProps) {
  return <ChildGuide kind="girl" mood={mood} />
}

export function BoyGuide({ mood = 'idle' }: GuideProps) {
  return <ChildGuide kind="boy" mood={mood} />
}

function ChildGuide({ kind, mood }: { kind: 'girl' | 'boy'; mood: GuideMood }) {
  const reduceMotion = useReducedMotion()
  const isGirl = kind === 'girl'
  const coat = isGirl ? 'var(--color-terracotta)' : 'var(--color-forest)'
  const trim = 'var(--color-gold-light)'
  const skin = isGirl ? '#EBC18E' : '#E6B580'
  const bounce = mood === 'celebrating' ? [0, -9, 0, -5, 0] : [0, -2.5, 0]

  return (
    <motion.g
      animate={reduceMotion ? undefined : { y: bounce, rotate: mood === 'thinking' ? [-2, 2, -2] : 0 }}
      transition={{ duration: mood === 'celebrating' ? 0.7 : 3.2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '0px 56px' }}
    >
      <ellipse cx="0" cy="60" rx="18" ry="4" fill="var(--color-ink)" opacity="0.12" />
      <path d="M-8 36 L-10 58 M8 36 L10 58" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
      <path d="M-13 59 H-5 M5 59 H13" stroke="var(--color-ink)" strokeWidth="4.5" strokeLinecap="round" />

      <path d="M-18 4 Q0 -5 18 4 L15 40 Q0 48 -15 40 Z" fill={coat} stroke="var(--color-ink)" strokeWidth="1.7" />
      <path d="M0 1 V42 M-10 13 H10" stroke={trim} strokeWidth="1.6" opacity="0.9" />
      <path d="M-17 8 Q-27 15 -22 26 M17 8 Q27 15 22 26" fill="none" stroke={coat} strokeWidth="7" strokeLinecap="round" />

      <circle cx="0" cy="-13" r="16" fill={skin} stroke="var(--color-ink)" strokeWidth="1.8" />
      {isGirl ? (
        <>
          <path d="M-16 -17 Q-15 -34 0 -35 Q15 -34 16 -17 Q8 -26 0 -25 Q-8 -26 -16 -17Z" fill="var(--color-ink)" />
          <path d="M-16 -15 Q-21 -4 -14 1 M16 -15 Q21 -4 14 1" fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
          <path d="M-14 -23 Q0 -30 14 -23" fill="none" stroke="var(--color-gold)" strokeWidth="2.6" />
        </>
      ) : (
        <>
          <path d="M-16 -17 Q-14 -34 0 -35 Q14 -34 16 -17 Q8 -25 0 -24 Q-8 -25 -16 -17Z" fill="var(--color-ink)" />
          <path d="M-13 -24 Q0 -31 13 -24" fill="none" stroke="var(--color-gold)" strokeWidth="2.4" />
        </>
      )}
      {mood === 'celebrating' ? (
        <>
          <path d="M-7 -11 Q-4 -16 -1 -11 M1 -11 Q4 -16 7 -11" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" />
          <path d="M-7 -4 Q0 4 7 -4" fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinecap="round" />
          <Sparkle x={-25} y={-29} />
          <Sparkle x={25} y={-17} />
        </>
      ) : (
        <>
          <circle cx="-5" cy="-11" r="1.7" fill="var(--color-ink)" />
          <circle cx="5" cy="-11" r="1.7" fill="var(--color-ink)" />
          <path d={mood === 'thinking' ? 'M-4 -4 Q0 -7 5 -4' : 'M-4 -4 Q0 0 4 -4'} fill="none" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
    </motion.g>
  )
}

function Sparkle({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y - 4} L${x + 1.5} ${y - 1.5} L${x + 4} ${y} L${x + 1.5} ${y + 1.5} L${x} ${y + 4} L${x - 1.5} ${y + 1.5} L${x - 4} ${y} L${x - 1.5} ${y - 1.5} Z`} fill="var(--color-gold)" />
}

/** A calm, stand-alone steppe horse for the home world—not an icon inside a bubble. */
export function HorseGuide() {
  const reduceMotion = useReducedMotion()
  return (
    <motion.g animate={reduceMotion ? undefined : { y: [0, -1.5, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}>
      <ellipse cx="40" cy="46" rx="32" ry="4" fill="var(--color-ink)" opacity="0.12" />
      <path d="M22 30 L20 45 M31 31 L30 45 M51 29 L54 45 M60 27 L63 45" stroke="var(--color-ink)" strokeWidth="3.8" strokeLinecap="round" />
      <path d="M18 27 Q6 32 9 41" fill="none" stroke="var(--color-ink)" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="38" cy="27" rx="22" ry="12" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1.8" />
      <path d="M52 26 Q64 21 67 9 Q68 4 63 3 Q59 3 58 8 L54 15" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinejoin="round" />
      <ellipse cx="65" cy="7" rx="7" ry="5.8" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1.8" />
      <path d="M60 3 L61 -2 L64 3 M67 3 L69 -2 L70 4" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="67" cy="6" r="1" fill="var(--color-ink)" />
      <path d="M46 10 L43 5 M50 13 L48 7 M54 16 L52 10" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M26 21 Q38 25 49 20" fill="none" stroke="var(--color-terracotta)" strokeWidth="2" opacity="0.8" />
    </motion.g>
  )
}
