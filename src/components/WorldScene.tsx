import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { getIllustration } from '../lib/illustrations'

interface Props {
  discoveredIds: string[]
  /** called with a WORLD_DISCOVERIES id */
  onSelect: (id: string) => void
  onEnterGer: () => void
  entering: boolean
}

type Layout = 'mobile' | 'desktop'

interface ArtItem {
  id: string
  art: string
  aspect: number // width / height of the artwork
  x: number
  y: number
  w: number
  flip?: boolean
}

interface FeatureSpot {
  id: string
  label: string
  cx: number
  cy: number
  r: number
}

interface LayoutConfig {
  viewBox: [number, number]
  ger: { x: number; y: number; scale: number }
  girl: { x: number; y: number; scale: number }
  boy: { x: number; y: number; scale: number }
  animals: ArtItem[]
  eagle: { x: number; y: number; w: number }
  features: FeatureSpot[]
  clouds: Array<{ x: number; y: number; s: number; dur: number; range: number }>
  sun: { x: number; y: number; r: number }
}

const CONFIG: Record<Layout, LayoutConfig> = {
  mobile: {
    viewBox: [400, 700],
    ger: { x: 200, y: 268, scale: 1.55 },
    girl: { x: 100, y: 340, scale: 1 },
    boy: { x: 276, y: 344, scale: 1 },
    animals: [
      { id: 'world-horse', art: 'horse-hero', aspect: 1.167, x: 206, y: 424, w: 120 },
      { id: 'world-dog', art: 'dog', aspect: 0.847, x: 140, y: 414, w: 54 },
      { id: 'world-sheep', art: 'sheep', aspect: 0.959, x: 18, y: 432, w: 78 },
    ],
    eagle: { x: 252, y: 118, w: 88 },
    features: [
      { id: 'world-river', label: 'Гол', cx: 366, cy: 440, r: 26 },
      { id: 'world-mountains', label: 'Уул', cx: 72, cy: 282, r: 34 },
    ],
    clouds: [
      { x: 70, y: 150, s: 1, dur: 28, range: 22 },
      { x: 300, y: 205, s: 0.7, dur: 22, range: 16 },
    ],
    sun: { x: 335, y: 80, r: 64 },
  },
  desktop: {
    viewBox: [1200, 675],
    ger: { x: 600, y: 290, scale: 2.1 },
    girl: { x: 410, y: 401, scale: 1.35 },
    boy: { x: 762, y: 407, scale: 1.35 },
    animals: [
      { id: 'world-horse', art: 'horse-hero', aspect: 1.167, x: 826, y: 452, w: 190 },
      { id: 'world-dog', art: 'dog', aspect: 0.847, x: 500, y: 498, w: 88 },
      { id: 'world-sheep', art: 'sheep', aspect: 0.959, x: 200, y: 486, w: 118 },
    ],
    eagle: { x: 700, y: 96, w: 130 },
    features: [
      { id: 'world-river', label: 'Гол', cx: 640, cy: 478, r: 38 },
      { id: 'world-mountains', label: 'Уул', cx: 235, cy: 345, r: 44 },
    ],
    clouds: [
      { x: 230, y: 140, s: 1.2, dur: 34, range: 30 },
      { x: 930, y: 190, s: 0.9, dur: 26, range: 24 },
    ],
    sun: { x: 1040, y: 90, r: 90 },
  },
}

const LABEL: Record<string, string> = {
  'world-horse': 'Адуу — товшиж нээ',
  'world-dog': 'Нохой — товшиж нээ',
  'world-sheep': 'Хонь — товшиж нээ',
  'world-eagle': 'Бүргэд — товшиж нээ',
  'world-river': 'Гол — товшиж нээ',
  'world-mountains': 'Уул — товшиж нээ',
}

const SPARKLE = 'M0 -9 L2.6 -2.6 L9 0 L2.6 2.6 L0 9 L-2.6 2.6 L-9 0 L-2.6 -2.6 Z'

/** A tappable thing in the world: invisible generous hit area + a gentle "tap me" sparkle until found. */
function Hotspot({
  id,
  label,
  x,
  y,
  w,
  h,
  found,
  onSelect,
  children,
  reduceMotion,
}: {
  id: string
  label: string
  x: number
  y: number
  w: number
  h: number
  found: boolean
  onSelect: (id: string) => void
  children?: React.ReactNode
  reduceMotion: boolean
}) {
  // never let a touch target fall under ~48 world units
  const hw = Math.max(w, 48)
  const hh = Math.max(h, 48)
  const hx = x - (hw - w) / 2
  const hy = y - (hh - h) / 2
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      className="group cursor-pointer outline-none"
      onClick={() => onSelect(id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(id)
        }
      }}
    >
      {children}
      <rect
        x={hx - 4}
        y={hy - 4}
        width={hw + 8}
        height={hh + 8}
        rx={14}
        fill="transparent"
        stroke="var(--color-deepblue)"
        strokeWidth={3}
        className="opacity-0 group-focus-visible:opacity-100"
      />
      <rect x={hx} y={hy} width={hw} height={hh} fill="transparent" />
      <g transform={`translate(${hx + hw - 6}, ${hy + 10})`}>
        {found ? (
          <>
            <circle r={10} fill="var(--color-forest)" stroke="var(--color-paper)" strokeWidth={2} />
            <path d="M-4.5 0.5 L-1.5 3.5 L4.5 -3" fill="none" stroke="var(--color-paper)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : (
          <motion.path
            d={SPARKLE}
            fill="var(--color-gold)"
            stroke="var(--color-paper)"
            strokeWidth={1.4}
            strokeLinejoin="round"
            animate={reduceMotion ? undefined : { scale: [0.8, 1.15, 0.8], opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </g>
      <title>{label}</title>
    </g>
  )
}

export function WorldScene({ discoveredIds, onSelect, onEnterGer, entering }: Props) {
  const reduceMotion = !!useReducedMotion()
  const [layout, setLayout] = useState<Layout>(() => (typeof window !== 'undefined' && window.innerWidth >= 768 ? 'desktop' : 'mobile'))
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const raf = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setLayout(mq.matches ? 'desktop' : 'mobile')
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // very small pointer parallax, fine pointers only
  useEffect(() => {
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() =>
        setParallax({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 }),
      )
    }
    window.addEventListener('pointermove', move)
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf.current)
    }
  }, [reduceMotion])

  const cfg = CONFIG[layout]
  const [vw, vh] = cfg.viewBox
  const bg = getIllustration('background')
  const gerArt = getIllustration('ger')
  const girlArt = getIllustration('girl')
  const boyArt = getIllustration('boy')
  const eagleArt = getIllustration('eagle')
  const par = (f: number) => (reduceMotion ? undefined : `translate(${(parallax.x * f).toFixed(2)} ${(parallax.y * f * 0.5).toFixed(2)})`)
  const found = (id: string) => discoveredIds.includes(id)

  return (
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="group"
      aria-label="Монголын тал нутаг — товшиж судал"
    >
      <defs>
        <radialGradient id="ws-sun">
          <stop offset="0%" stopColor="#F3D68F" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#F3D68F" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ws-door">
          <stop offset="0%" stopColor="#FFE3A3" stopOpacity="1" />
          <stop offset="70%" stopColor="#E8BB62" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#C45A3C" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ws-glow">
          <stop offset="0%" stopColor="#F3D68F" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#F3D68F" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ws-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FAF8F1" stopOpacity="0" />
          <stop offset="100%" stopColor="#FAF8F1" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      {/* sky + landscape */}
      <g transform={par(-5)}>
        {bg && <image href={bg} x={-14} y={-8} width={vw + 28} height={vh + 16} preserveAspectRatio="xMidYMid slice" />}
      </g>

      {/* natural morning light — a slow glow, never a flare */}
      <motion.circle
        cx={cfg.sun.x}
        cy={cfg.sun.y}
        r={cfg.sun.r * 2.2}
        fill="url(#ws-sun)"
        animate={reduceMotion ? undefined : { opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* drifting clouds in front of the painted sky */}
      <g transform={par(8)}>
        {cfg.clouds.map((c, i) => (
          <motion.g
            key={i}
            transform={`translate(${c.x} ${c.y}) scale(${c.s})`}
            animate={reduceMotion ? undefined : { x: [0, c.range, 0] }}
            transition={{ duration: c.dur, repeat: Infinity, ease: 'easeInOut' }}
            opacity={0.88}
          >
            <ellipse cx={0} cy={0} rx={34} ry={14} fill="#FFFDF9" />
            <ellipse cx={24} cy={-6} rx={22} ry={12} fill="#FFFDF9" />
            <ellipse cx={-22} cy={4} rx={20} ry={10} fill="#FFFDF9" />
          </motion.g>
        ))}
      </g>

      {/* an occasional bird pair crossing the sky */}
      {!reduceMotion && (
        <motion.g
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: vw + 60, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 30, repeat: Infinity, repeatDelay: 18, ease: 'linear' }}
        >
          <g transform={`translate(0 ${vh * 0.24})`}>
            <path d="M0 0 Q5 -6 10 0 Q15 -6 20 0" stroke="var(--color-ink-soft)" strokeWidth={1.8} fill="none" strokeLinecap="round" />
            <path d="M18 9 Q22 4 26 9 Q30 4 34 9" stroke="var(--color-ink-soft)" strokeWidth={1.5} fill="none" strokeLinecap="round" opacity={0.7} />
          </g>
        </motion.g>
      )}

      {/* eagle — circles high above, tap to meet it */}
      {eagleArt && (
        <g transform={par(5)}>
          <motion.g
            animate={reduceMotion ? undefined : { x: [0, 26, 0, -26, 0], y: [0, -8, 0, 8, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Hotspot
              id="world-eagle"
              label={LABEL['world-eagle']}
              x={cfg.eagle.x}
              y={cfg.eagle.y}
              w={cfg.eagle.w}
              h={cfg.eagle.w * 0.97}
              found={found('world-eagle')}
              onSelect={onSelect}
              reduceMotion={reduceMotion}
            >
              <image href={eagleArt} x={cfg.eagle.x} y={cfg.eagle.y} width={cfg.eagle.w} height={cfg.eagle.w * 0.97} />
            </Hotspot>
          </motion.g>
        </g>
      )}

      {/* landscape features: invisible, but marked with the same sparkle */}
      {cfg.features.map((f) => (
        <Hotspot
          key={f.id}
          id={f.id}
          label={LABEL[f.id]}
          x={f.cx - f.r}
          y={f.cy - f.r}
          w={f.r * 2}
          h={f.r * 2}
          found={found(f.id)}
          onSelect={onSelect}
          reduceMotion={reduceMotion}
        />
      ))}

      {/* ground contact shadows keep everything feeling placed on the grass */}
      <g transform={par(12)}>
        <ellipse cx={cfg.ger.x} cy={cfg.ger.y + 90 * cfg.ger.scale} rx={88 * cfg.ger.scale} ry={10 * cfg.ger.scale} fill="#183F35" opacity={0.16} />

        {/* THE GER — the door of the whole game */}
        <g role="button" tabIndex={0} aria-label="Гэр рүү ор" className="group cursor-pointer outline-none"
          onClick={onEnterGer}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onEnterGer()
            }
          }}
          transform={`translate(${cfg.ger.x} ${cfg.ger.y}) scale(${cfg.ger.scale})`}
        >
          <motion.g
            style={{ transformOrigin: '0px 100px' }}
            animate={entering ? { scale: 1.1 } : { scale: 1 }}
            whileHover={entering || reduceMotion ? undefined : { scale: 1.025 }}
            whileTap={entering ? undefined : { scale: 0.985 }}
            transition={{ duration: entering ? 0.55 : 0.25, ease: 'easeOut' }}
          >
            {/* warm glow wakes up on hover / tap */}
            <motion.ellipse
              cx={0}
              cy={40}
              rx={120}
              ry={90}
              fill="url(#ws-glow)"
              initial={{ opacity: 0.25 }}
              animate={{ opacity: entering ? 1 : reduceMotion ? 0.25 : [0.2, 0.42, 0.2] }}
              transition={{ duration: entering ? 0.4 : 4.4, repeat: entering ? 0 : Infinity, ease: 'easeInOut' }}
            />
            {/* chimney smoke */}
            {!reduceMotion && (
              <motion.path
                d="M-2 -14 Q8 -30 -2 -44 Q-12 -58 0 -74"
                fill="none"
                stroke="#FFFDF9"
                strokeWidth={5}
                strokeLinecap="round"
                animate={{ y: [4, -22, 4], opacity: [0, 0.6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            {gerArt && <image href={gerArt} x={-92} y={-98} width={184} height={198} preserveAspectRatio="xMidYMax meet" />}
            {/* the door lights up and "opens" as the child steps in */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: entering ? 1 : 0 }} transition={{ duration: 0.45, delay: entering ? 0.15 : 0 }}>
              <rect x={-14.5} y={26} width={28.5} height={58} rx={3} fill="url(#ws-door)" />
            </motion.g>
            <rect x={-96} y={-60} width={192} height={160} rx={30} fill="transparent" stroke="var(--color-deepblue)" strokeWidth={2.5} className="opacity-0 group-focus-visible:opacity-100" />
            <rect x={-96} y={-60} width={192} height={160} fill="transparent" />
          </motion.g>
        </g>

        {/* the two children, close to the ger */}
        {girlArt && (
          <g transform={`translate(${cfg.girl.x} ${cfg.girl.y}) scale(${cfg.girl.scale})`}>
            <ellipse cx={0} cy={88} rx={22} ry={4.5} fill="#183F35" opacity={0.15} />
            <motion.g animate={reduceMotion ? undefined : { y: [0, -2.5, 0] }} transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut' }}>
              <image href={girlArt} x={-34} y={-14} width={68} height={104} preserveAspectRatio="xMidYMax meet" />
            </motion.g>
          </g>
        )}
        {boyArt && (
          <g transform={`translate(${cfg.boy.x} ${cfg.boy.y}) scale(${cfg.boy.scale})`}>
            <ellipse cx={0} cy={88} rx={22} ry={4.5} fill="#183F35" opacity={0.15} />
            <motion.g animate={reduceMotion ? undefined : { y: [0, -2.5, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}>
              <image href={boyArt} x={-34} y={-14} width={68} height={104} preserveAspectRatio="xMidYMax meet" />
            </motion.g>
          </g>
        )}

        {/* animals */}
        {cfg.animals.map((a, i) => {
          const src = getIllustration(a.art)
          if (!src) return null
          const h = a.w / a.aspect
          return (
            <Hotspot
              key={a.id}
              id={a.id}
              label={LABEL[a.id]}
              x={a.x}
              y={a.y}
              w={a.w}
              h={h}
              found={found(a.id)}
              onSelect={onSelect}
              reduceMotion={reduceMotion}
            >
              <ellipse cx={a.x + a.w / 2} cy={a.y + h - 2} rx={a.w * 0.36} ry={a.w * 0.05} fill="#183F35" opacity={0.18} />
              <motion.g
                style={{ transformOrigin: `${a.x + a.w / 2}px ${a.y + h}px` }}
                animate={reduceMotion ? undefined : { scaleY: [1, 1.018, 1] }}
                transition={{ duration: 3.2 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                whileTap={{ scale: 1.06 }}
              >
                <image href={src} x={a.x} y={a.y} width={a.w} height={h} />
              </motion.g>
            </Hotspot>
          )
        })}
      </g>

      {/* soft atmospheric haze + foreground grass in front of everything */}
      <rect x={0} y={vh * 0.55} width={vw} height={vh * 0.45} fill="url(#ws-haze)" pointerEvents="none" />
      <g transform={par(18)} pointerEvents="none">
        {Array.from({ length: Math.round(vw / 46) }, (_, i) => {
          const x = (vw / Math.round(vw / 46)) * i + 12
          const y = vh - 20 - (i % 4) * 9
          return (
            <motion.g
              key={i}
              transform={`translate(${x} ${y})`}
              animate={reduceMotion ? undefined : { rotate: [-5, 5, -5] }}
              transition={{ duration: 3 + (i % 4) * 0.35, repeat: Infinity, ease: 'easeInOut', delay: i * 0.12 }}
              style={{ transformOrigin: '0px 14px' }}
            >
              <path d="M0 14 Q-4 3 -2 -12 M0 14 Q0 0 0 -16 M0 14 Q4 3 2 -12" stroke="#183F35" strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.5} />
              {i % 3 === 0 && <circle cx={0} cy={-17} r={3} fill="#E8BB62" />}
              {i % 5 === 2 && <circle cx={0} cy={-17} r={3} fill="#FAF8F1" />}
            </motion.g>
          )
        })}
      </g>
    </svg>
  )
}
