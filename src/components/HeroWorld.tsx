import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { sound } from '../lib/sound'

interface Props {
  onEnter: () => void
}

type Phase = 'idle' | 'entering'

/**
 * The first screen of GER NAADGAI — a full-viewport, parallaxed, illustrated Mongolian
 * landscape a child taps into. Not a hero banner: this is the world itself, and the ger
 * is the primary interaction (see docs/PRODUCT_REQUIREMENTS.md §9, §19, §38).
 */
export function HeroWorld({ onEnter }: Props) {
  const prefersReducedMotion = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')
  const [isDesktop, setIsDesktop] = useState(() => (typeof window === 'undefined' ? true : window.innerWidth >= 768))
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    function handleMove(e: PointerEvent) {
      const w = window.innerWidth
      const h = window.innerHeight
      setParallax({ x: (e.clientX / w - 0.5) * 2, y: (e.clientY / h - 0.5) * 2 })
    }
    window.addEventListener('pointermove', handleMove)
    return () => window.removeEventListener('pointermove', handleMove)
  }, [prefersReducedMotion])

  function depth(factor: number) {
    if (prefersReducedMotion) return {}
    return { transform: `translate3d(${parallax.x * factor}px, ${parallax.y * factor * 0.6}px, 0)` }
  }

  function handleEnter() {
    if (phase === 'entering') return
    setPhase('entering')
    sound.pop()
    window.setTimeout(() => sound.unlock(), 120)
    window.setTimeout(onEnter, 820)
  }

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 overflow-hidden select-none touch-none bg-cream"
      style={{ touchAction: 'none' }}
    >
      <div className="absolute inset-0" style={depth(-4)}>
        {isDesktop ? <DesktopScene phase={phase} parallax={parallax} reduceMotion={!!prefersReducedMotion} /> : <MobileScene phase={phase} parallax={parallax} reduceMotion={!!prefersReducedMotion} />}
      </div>

      {/* brand */}
      <div className="absolute top-0 inset-x-0 pt-[max(1.75rem,env(safe-area-inset-top))] flex flex-col items-center pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-display font-extrabold text-2xl md:text-3xl tracking-wide text-ink drop-shadow-[0_2px_10px_rgba(255,252,244,0.8)]"
        >
          ГЭР НААДГАЙ
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="text-xs md:text-sm font-semibold text-ink-soft/80 mt-1 drop-shadow-[0_2px_8px_rgba(255,252,244,0.8)]"
        >
          Монголын наадгайгаар аялцгаая!
        </motion.p>
      </div>

      {/* interactive hit area over the ger — real button for a11y + touch target */}
      <button
        type="button"
        aria-label="Гэрт орж тоглож эхлэх"
        onClick={handleEnter}
        className="absolute left-1/2 -translate-x-1/2 rounded-[40%] focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-4"
        style={{ top: isDesktop ? '38%' : '34%', width: isDesktop ? '18%' : '46%', height: isDesktop ? '30%' : '20%', minWidth: 96, minHeight: 96 }}
      />

      {/* supporting CTA */}
      <div className="absolute inset-x-0 flex justify-center pointer-events-none" style={{ bottom: 'max(2.25rem, env(safe-area-inset-bottom))' }}>
        <motion.button
          type="button"
          onClick={handleEnter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: prefersReducedMotion ? 1 : [1, 1.03, 1] }}
          transition={{ opacity: { delay: 0.7, duration: 0.5 }, y: { delay: 0.7, duration: 0.5 }, scale: { delay: 1.4, duration: 2.2, repeat: Infinity, ease: 'easeInOut' } }}
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-terracotta text-cream font-display font-extrabold text-sm md:text-base px-7 py-3.5 shadow-[var(--shadow-pop)] active:scale-[0.97] transition-transform"
        >
          НААДЪЯ <span aria-hidden>→</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {phase === 'entering' && (
          <motion.div
            key="cover"
            className="absolute inset-0 bg-cream"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.2, ease: 'easeIn' }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

interface SceneProps {
  phase: Phase
  parallax: { x: number; y: number }
  reduceMotion: boolean
}

function MobileScene({ phase, parallax, reduceMotion }: SceneProps) {
  const p = (factor: number) => (reduceMotion ? undefined : `translate(${parallax.x * factor}, ${parallax.y * factor * 0.5})`)
  return (
    <svg viewBox="0 0 400 700" className="w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <SceneDefs />
      <rect width="400" height="700" fill="url(#skyGradient)" />
      <SunGlow cx={330} cy={90} r={46} reduceMotion={reduceMotion} />
      <g transform={p(4)}>
        <BirdFlock reduceMotion={reduceMotion} originX={60} originY={130} scale={0.8} />
      </g>
      <g transform={p(8)}>
        <CloudGlyph cx={80} cy={110} scale={1} reduceMotion={reduceMotion} duration={26} range={14} />
        <CloudGlyph cx={280} cy={160} scale={0.7} reduceMotion={reduceMotion} duration={19} range={10} />
      </g>
      <g transform={p(14)}>
        <MountainRange y={230} width={400} height={130} tone="var(--color-sky)" opacity={0.55} jag={0.9} />
      </g>
      <g transform={p(22)}>
        <MountainRange y={270} width={400} height={130} tone="var(--color-forest-light)" opacity={0.65} jag={1.15} />
      </g>
      <g transform={p(30)}>
        <HillBand y={340} width={400} height={140} tone="var(--color-forest-light)" opacity={0.32} />
      </g>
      {/* steppe ground */}
      <path d="M0 430 Q200 405 400 430 L400 700 L0 700 Z" fill="var(--color-cream-dark)" />
      <path d="M0 460 Q200 438 400 460 L400 700 L0 700 Z" fill="var(--color-forest-light)" opacity="0.22" />

      <g transform="translate(200,300) scale(1.55)">
        <GerGlyph phase={phase} />
      </g>

      <g transform="translate(112,398) scale(0.72)">
        <GirlCharacter reduceMotion={reduceMotion} />
      </g>
      <g transform="translate(258,402) scale(0.72)">
        <BoyCharacter reduceMotion={reduceMotion} />
      </g>

      <g transform="translate(58,470) scale(0.85)">
        <HorseGlyph reduceMotion={reduceMotion} />
      </g>

      <ForegroundBand y={560} width={400} reduceMotion={reduceMotion} />
    </svg>
  )
}

function DesktopScene({ phase, parallax, reduceMotion }: SceneProps) {
  const p = (factor: number) => (reduceMotion ? undefined : `translate(${parallax.x * factor}, ${parallax.y * factor * 0.5})`)
  return (
    <svg viewBox="0 0 1200 675" className="w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <SceneDefs />
      <rect width="1200" height="675" fill="url(#skyGradient)" />
      <SunGlow cx={1030} cy={110} r={64} reduceMotion={reduceMotion} />
      <g transform={p(6)}>
        <BirdFlock reduceMotion={reduceMotion} originX={220} originY={140} scale={1} />
      </g>
      <g transform={p(10)}>
        <CloudGlyph cx={190} cy={120} scale={1.3} reduceMotion={reduceMotion} duration={30} range={22} />
        <CloudGlyph cx={620} cy={90} scale={0.9} reduceMotion={reduceMotion} duration={24} range={16} />
        <CloudGlyph cx={980} cy={190} scale={1.05} reduceMotion={reduceMotion} duration={21} range={18} />
      </g>
      <g transform={p(18)}>
        <MountainRange y={230} width={1200} height={160} tone="var(--color-sky)" opacity={0.5} jag={0.7} />
      </g>
      <g transform={p(28)}>
        <MountainRange y={280} width={1200} height={160} tone="var(--color-forest-light)" opacity={0.6} jag={0.95} />
      </g>
      <g transform={p(38)}>
        <HillBand y={360} width={1200} height={150} tone="var(--color-forest-light)" opacity={0.3} />
      </g>

      <path d="M0 440 Q600 405 1200 440 L1200 675 L0 675 Z" fill="var(--color-cream-dark)" />
      <path d="M0 475 Q600 445 1200 475 L1200 675 L0 675 Z" fill="var(--color-forest-light)" opacity="0.2" />

      <g transform="translate(600,290) scale(2.1)">
        <GerGlyph phase={phase} />
      </g>

      <g transform="translate(430,430) scale(1)">
        <GirlCharacter reduceMotion={reduceMotion} />
      </g>
      <g transform="translate(742,436) scale(1)">
        <BoyCharacter reduceMotion={reduceMotion} />
      </g>

      <g transform="translate(870,470) scale(1.3) scale(-1,1) translate(-110,0)">
        <HorseGlyph reduceMotion={reduceMotion} />
      </g>

      <ForegroundBand y={560} width={1200} reduceMotion={reduceMotion} />
    </svg>
  )
}

function SceneDefs() {
  return (
    <defs>
      <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--color-sky-light)" />
        <stop offset="55%" stopColor="#DCEFF7" />
        <stop offset="100%" stopColor="var(--color-cream)" />
      </linearGradient>
      <radialGradient id="sunGlow">
        <stop offset="0%" stopColor="var(--color-gold-light)" stopOpacity="0.9" />
        <stop offset="100%" stopColor="var(--color-gold-light)" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="gerGlow">
        <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.55" />
        <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

function SunGlow({ cx, cy, r, reduceMotion }: { cx: number; cy: number; r: number; reduceMotion: boolean }) {
  return (
    <motion.g
      animate={reduceMotion ? undefined : { opacity: [0.85, 1, 0.85] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <circle cx={cx} cy={cy} r={r * 2.1} fill="url(#sunGlow)" />
      <circle cx={cx} cy={cy} r={r * 0.55} fill="var(--color-gold-light)" />
    </motion.g>
  )
}

function CloudGlyph({ cx, cy, scale, reduceMotion, duration, range }: { cx: number; cy: number; scale: number; reduceMotion: boolean; duration: number; range: number }) {
  return (
    <motion.g
      transform={`translate(${cx},${cy}) scale(${scale})`}
      animate={reduceMotion ? undefined : { x: [0, range, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    >
      <ellipse cx="0" cy="0" rx="34" ry="15" fill="var(--color-paper)" opacity="0.92" />
      <ellipse cx="26" cy="-5" rx="22" ry="13" fill="var(--color-paper)" opacity="0.92" />
      <ellipse cx="-24" cy="5" rx="20" ry="11" fill="var(--color-paper)" opacity="0.92" />
    </motion.g>
  )
}

function BirdFlock({ originX, originY, scale, reduceMotion }: { originX: number; originY: number; scale: number; reduceMotion: boolean }) {
  if (reduceMotion) return null
  return (
    <motion.g
      animate={{ x: [0, 900], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 26, repeat: Infinity, repeatDelay: 14, ease: 'linear' }}
    >
      <g transform={`translate(${originX},${originY}) scale(${scale})`}>
        <path d="M0 0 Q5 -6 10 0 Q15 -6 20 0" stroke="var(--color-ink-soft)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M18 8 Q22 3 26 8 Q30 3 34 8" stroke="var(--color-ink-soft)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.75" />
      </g>
    </motion.g>
  )
}

function MountainRange({ y, width, height, tone, opacity, jag }: { y: number; width: number; height: number; tone: string; opacity: number; jag: number }) {
  const peaks = Math.max(4, Math.round((width / 220) * jag))
  let d = `M0 ${y + height}`
  for (let i = 0; i <= peaks; i++) {
    const x = (width / peaks) * i
    const peakY = y + (i % 2 === 0 ? 0 : height * 0.32) + (i % 3 === 0 ? -height * 0.18 : 0)
    d += ` L${x.toFixed(1)} ${peakY.toFixed(1)}`
  }
  d += ` L${width} ${y + height} Z`
  return <path d={d} fill={tone} opacity={opacity} />
}

function HillBand({ y, width, height, tone, opacity }: { y: number; width: number; height: number; tone: string; opacity: number }) {
  return <path d={`M0 ${y + height} Q${width * 0.25} ${y} ${width * 0.5} ${y + height * 0.4} Q${width * 0.75} ${y + height * 0.9} ${width} ${y} L${width} ${y + height} Z`} fill={tone} opacity={opacity} />
}

function ForegroundBand({ y, width, reduceMotion }: { y: number; width: number; reduceMotion: boolean }) {
  const count = Math.round(width / 42)
  const tufts = Array.from({ length: count }, (_, i) => ({
    x: (width / count) * i + 14,
    flower: i % 3 === 0,
  }))
  return (
    <g>
      <path d={`M0 ${y} Q${width / 2} ${y - 26} ${width} ${y} L${width} 700 L0 700 Z`} fill="var(--color-forest-light)" opacity="0.9" />
      {tufts.map((t, i) => (
        <motion.g
          key={i}
          transform={`translate(${t.x}, ${y + 24 + (i % 4) * 8})`}
          animate={reduceMotion ? undefined : { rotate: [-5, 5, -5] }}
          transition={{ duration: 2.6 + (i % 4) * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.12 }}
          style={{ transformOrigin: '0px 10px' }}
        >
          <path d="M0 10 Q-3 2 -1 -9 M0 10 Q0 0 0 -11 M0 10 Q3 2 1 -9" stroke="var(--color-forest-dark)" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.65" />
          {t.flower && <circle cx="0" cy="-11" r="2.6" fill="var(--color-gold)" />}
        </motion.g>
      ))}
    </g>
  )
}

/** The ger — drawn in a local ~200x190 box, anchored at its base (0,0) with roof rising above. */
function GerGlyph({ phase }: { phase: Phase }) {
  const entering = phase === 'entering'
  return (
    <motion.g animate={entering ? { scale: 1.12 } : { scale: [1, 1.015, 1] }} transition={entering ? { duration: 0.5, ease: 'easeOut' } : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '0px 78px' }}>
      <ellipse cx="0" cy="86" rx="92" ry="11" fill="var(--color-ink)" opacity="0.14" />

      {/* warm glow, strengthens on hover/enter */}
      <motion.circle cx="0" cy="10" r="70" fill="url(#gerGlow)" animate={entering ? { opacity: 1, scale: 1.6 } : { opacity: [0.5, 0.8, 0.5] }} transition={entering ? { duration: 0.6 } : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }} />

      {/* smoke */}
      <motion.path
        d="M0 -76 Q7 -88 0 -98 Q-7 -108 3 -118"
        fill="none"
        stroke="var(--color-sky)"
        strokeWidth="3.4"
        strokeLinecap="round"
        animate={{ y: [-2, -22, -2], opacity: [0, 0.55, 0] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeOut' }}
      />

      {/* roof */}
      <path d="M-76 10 L0 -54 L76 10 Z" fill="var(--color-terracotta)" />
      <path d="M-76 10 L0 -54 L76 10 L76 19 L0 -43 L-76 19 Z" fill="var(--color-terracotta-dark)" />
      {[-48, -24, 0, 24, 48].map((x) => (
        <line key={x} x1={x * 0.94} y1={10} x2="0" y2="-48" stroke="var(--color-terracotta-dark)" strokeWidth="1.7" opacity="0.55" />
      ))}
      {/* toono */}
      <circle cx="0" cy="-47" r="10.5" fill="var(--color-gold)" />
      <circle cx="0" cy="-47" r="6.5" fill="var(--color-ink)" />
      <line x1="-4.5" y1="-57" x2="-4.5" y2="-74" stroke="var(--color-terracotta-dark)" strokeWidth="2.2" />
      <line x1="4.5" y1="-57" x2="4.5" y2="-74" stroke="var(--color-terracotta-dark)" strokeWidth="2.2" />
      <path d="M-4.5 -74 Q2.5 -81 9.5 -72" fill="none" stroke="var(--color-terracotta)" strokeWidth="2.8" strokeLinecap="round" />

      {/* wall */}
      <rect x="-84" y="10" width="168" height="64" rx="7" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2.2" />
      {[...Array(11)].map((_, i) => (
        <path key={i} d={`M${-76 + i * 15.2} 10 q4.5 10 0 20`} stroke="var(--color-gold)" strokeWidth="2.4" fill="none" opacity="0.75" />
      ))}
      <rect x="-84" y="10" width="168" height="8" fill="var(--color-terracotta)" opacity="0.9" />

      {/* door — swings open when entering */}
      <g transform="translate(-17,40)">
        <rect x="0" y="0" width="34" height="34" rx="3" fill="var(--color-ink)" opacity="0.85" />
        <motion.rect
          x="0"
          y="0"
          width="34"
          height="34"
          rx="3"
          fill="var(--color-terracotta)"
          stroke="var(--color-terracotta-dark)"
          strokeWidth="2.2"
          animate={entering ? { rotateY: 74, x: -4 } : { x: 0, rotateY: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{ transformOrigin: '0px 17px' }}
        />
        <circle cx="26" cy="18" r="1.9" fill="var(--color-gold-light)" />
      </g>
    </motion.g>
  )
}

function faceProps() {
  return { fill: 'none', stroke: 'var(--color-ink)', strokeWidth: 2.6, strokeLinecap: 'round' as const }
}

/** Girl companion — deel with terracotta trim, holding shagai, looking toward the ger. */
function GirlCharacter({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.g animate={reduceMotion ? undefined : { y: [0, -2.5, 0] }} transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut' }}>
      <ellipse cx="0" cy="86" rx="20" ry="4.5" fill="var(--color-ink)" opacity="0.12" />
      {/* legs */}
      <path d="M-7 62 L-9 84 M7 62 L9 84" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
      {/* deel body */}
      <path d="M-19 32 Q0 22 19 32 L15 66 Q0 74 -15 66 Z" fill="var(--color-terracotta)" stroke="var(--color-terracotta-dark)" strokeWidth="1.6" />
      <path d="M-8 38 L-8 60 M0 40 L0 62 M8 38 L8 60" stroke="var(--color-gold-light)" strokeWidth="1.4" opacity="0.75" />
      {/* arms */}
      <path d="M-19 34 Q-28 44 -24 54" fill="none" stroke="var(--color-terracotta)" strokeWidth="7" strokeLinecap="round" />
      <path d="M19 34 Q27 42 22 50" fill="none" stroke="var(--color-terracotta)" strokeWidth="7" strokeLinecap="round" />
      {/* shagai in hand */}
      <rect x="17" y="45" width="8" height="7" rx="1.8" fill="var(--color-cream-dark)" stroke="var(--color-ink)" strokeWidth="1.4" />
      {/* head */}
      <circle cx="0" cy="14" r="16" fill="#F1CFA0" stroke="var(--color-ink)" strokeWidth="2" />
      <path d="M-16 10 Q-18 -6 0 -8 Q18 -6 16 10 Q10 -1 0 0 Q-10 -1 -16 10 Z" fill="var(--color-ink)" />
      <path d="M-16 8 Q-19 20 -13 26" fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 8 Q19 20 13 26" fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="-5.5" cy="15" r="1.7" fill="var(--color-ink)" />
      <circle cx="5.5" cy="15" r="1.7" fill="var(--color-ink)" />
      <path d="M-3.5 21 Q0 24 3.5 21" {...faceProps()} strokeWidth={2.2} />
      {/* headband ornament */}
      <path d="M-15 5 Q0 -2 15 5" fill="none" stroke="var(--color-gold)" strokeWidth="2.6" />
    </motion.g>
  )
}

/** Boy companion — forest-green deel, holding a small toy horse, looking toward the landscape. */
function BoyCharacter({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.g animate={reduceMotion ? undefined : { y: [0, -2.5, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}>
      <ellipse cx="0" cy="86" rx="20" ry="4.5" fill="var(--color-ink)" opacity="0.12" />
      <path d="M-8 62 L-10 84 M8 62 L10 84" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
      <path d="M-19 32 Q0 22 19 32 L16 66 Q0 75 -16 66 Z" fill="var(--color-forest)" stroke="var(--color-forest-dark)" strokeWidth="1.6" />
      <path d="M0 32 L0 66" stroke="var(--color-gold-light)" strokeWidth="1.6" opacity="0.8" />
      <path d="M-19 34 Q-27 40 -22 48" fill="none" stroke="var(--color-forest)" strokeWidth="7" strokeLinecap="round" />
      <path d="M19 34 Q28 44 24 54" fill="none" stroke="var(--color-forest)" strokeWidth="7" strokeLinecap="round" />
      {/* small toy horse */}
      <g transform="translate(20,46)">
        <path d="M0 8 Q-2 0 3 -4 Q6 -8 11 -6 L13 -8 L12 -5 L10 -4 Q11 0 8 5" fill="none" stroke="var(--color-terracotta)" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <circle cx="0" cy="14" r="16" fill="#EFC08D" stroke="var(--color-ink)" strokeWidth="2" />
      <path d="M-16 9 Q-17 -8 0 -9 Q17 -8 16 9 Q10 0 0 1 Q-10 0 -16 9 Z" fill="var(--color-ink)" />
      <circle cx="-5.5" cy="16" r="1.7" fill="var(--color-ink)" />
      <circle cx="5.5" cy="16" r="1.7" fill="var(--color-ink)" />
      <path d="M-3.5 22 Q0 25 3.5 22" {...faceProps()} strokeWidth={2.2} />
      <path d="M-13 2 Q0 -4 13 2" fill="none" stroke="var(--color-gold)" strokeWidth="2.4" />
    </motion.g>
  )
}

/** Mongolian horse, standing side profile, facing right — drawn in a local ~112x90 box, base at y=88. */
function HorseGlyph({ reduceMotion, muted = false }: { reduceMotion: boolean; muted?: boolean }) {
  const line = muted ? 'var(--color-forest-dark)' : 'var(--color-ink)'
  const body = muted ? 'var(--color-cream-dark)' : 'var(--color-paper)'
  return (
    <g opacity={muted ? 0.55 : 1}>
      <ellipse cx="50" cy="88" rx="38" ry="5" fill="var(--color-ink)" opacity="0.12" />

      {/* legs, back pair then front pair so the body ellipse overlaps their tops cleanly */}
      <path d="M30 62 L27 87 M40 64 L38 87" stroke={line} strokeWidth="5" strokeLinecap="round" />
      <path d="M68 60 L71 87 M78 58 L82 87" stroke={line} strokeWidth="5" strokeLinecap="round" />

      {/* tail */}
      <motion.path
        d="M22 46 Q6 52 8 74 Q14 64 20 58"
        fill="none"
        stroke={line}
        strokeWidth="3"
        strokeLinecap="round"
        animate={reduceMotion ? undefined : { rotate: [-7, 7, -7] }}
        transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '22px 46px' }}
      />

      {/* neck, drawn under the body/head so the joins disappear */}
      <path d="M62 52 Q84 46 92 20 Q94 12 86 10 Q78 9 76 18 L70 26 Q68 38 62 52 Z" fill={body} stroke={line} strokeWidth="2.2" strokeLinejoin="round" />

      {/* body */}
      <ellipse cx="46" cy="54" rx="30" ry="16" fill={body} stroke={line} strokeWidth="2.2" />

      {/* head */}
      <ellipse cx="90" cy="18" rx="11" ry="9" fill={body} stroke={line} strokeWidth="2.2" />
      <path d="M99 16 Q108 18 106 24 Q101 22 98 20 Z" fill={body} stroke={line} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M84 10 L86 3 L90 10 Z" fill={body} stroke={line} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="93" cy="16" r="1.7" fill={line} />

      {/* mane */}
      <path d="M68 12 L64 6 M74 16 L70 9 M80 21 L76 14" stroke={line} strokeWidth="2.2" strokeLinecap="round" />
    </g>
  )
}
