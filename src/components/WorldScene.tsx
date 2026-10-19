import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { getIllustration } from '../lib/illustrations'

interface Props {
  discoveredIds: string[]
  /** called with a WORLD_DISCOVERIES id */
  onSelect: (id: string) => void
  onEnterGer: () => void
  entering: boolean
}

/** The painting's own coordinate space. Every hotspot below is measured on world-scene.webp. */
const IMG_W = 848
const IMG_H = 1264
const IMG_ASPECT = IMG_W / IMG_H

interface Spot {
  id: string
  label: string
  x: number
  y: number
  w: number
  h: number
}

const SPOTS: Spot[] = [
  { id: 'world-eagle', label: 'Бүргэд — товшиж нээ', x: 180, y: 165, w: 135, h: 140 },
  { id: 'world-mountains', label: 'Уул — товшиж нээ', x: 0, y: 495, w: 330, h: 95 },
  { id: 'world-river', label: 'Гол — товшиж нээ', x: 0, y: 612, w: 225, h: 80 },
  { id: 'world-sheep', label: 'Хонь — товшиж нээ', x: 32, y: 705, w: 215, h: 220 },
  { id: 'world-horse', label: 'Адуу — товшиж нээ', x: 606, y: 668, w: 232, h: 215 },
  { id: 'world-shagai', label: 'Шагай — товшиж нээ', x: 365, y: 985, w: 150, h: 85 },
  { id: 'world-dog', label: 'Нохой — товшиж нээ', x: 592, y: 940, w: 210, h: 140 },
]

/** where the ger sits — the camera pushes in toward the door, and the door glows */
const GER = { x: 190, y: 515, w: 472, h: 310 }
const DOOR = { x: 355, y: 658, w: 142, h: 166 }
const CHIMNEY = { x: 404, y: 470 }

/** The painting's real top and bottom edge colours — the tall-phone extension continues them seamlessly. */
const SKY_EDGE = 'linear-gradient(to right, #71ABD6 0%, #70AAD5 25%, #7CB4DA 50%, #84BADC 75%, #87BDDD 100%)'
const GRASS_EDGE = 'linear-gradient(to right, #204124 0%, #38572E 25%, #547A3B 50%, #577C3B 75%, #5C7F44 100%)'

const SPARKLE = 'M0 -9 L2.6 -2.6 L9 0 L2.6 2.6 L0 9 L-2.6 2.6 L-9 0 L-2.6 -2.6 Z'

export function WorldScene({ discoveredIds, onSelect, onEnterGer, entering }: Props) {
  const reduceMotion = !!useReducedMotion()
  const art = getIllustration('world-scene')
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))

  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (!art) return null

  // Fit the whole painting (nothing important is ever cropped), then continue the sky above
  // and the grass below with soft mirrored copies so the screen is always filled.
  const narrow = vp.w / vp.h < IMG_ASPECT
  const w = narrow ? vp.w : vp.h * IMG_ASPECT
  const h = w / IMG_ASPECT
  const left = (vp.w - w) / 2
  const extra = Math.max(0, vp.h - h)
  const top = extra * 0.42 // a little more sky than grass — the HUD lives in the sky
  const k = w / IMG_W // image units -> screen px
  const px = (n: number) => n / k // n screen px, expressed in image units
  const found = (id: string) => discoveredIds.includes(id)

  const doorCx = left + (DOOR.x + DOOR.w / 2) * k
  const doorCy = top + (DOOR.y + DOOR.h / 2) * k

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{ transformOrigin: `${doorCx}px ${doorCy}px`, backgroundColor: '#8FB9E3' }}
      animate={entering && !reduceMotion ? { scale: 1.45 } : { scale: 1 }}
      transition={{ duration: 0.75, ease: [0.45, 0, 0.35, 1] }}
    >
      {/* blurred surround for wide screens */}
      {!narrow && <img src={art} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-90 blur-2xl" />}

      {/* sky and grass continue past the painting on tall phones, in the painting's own edge colours */}
      {narrow && extra > 0 && (
        <>
          <div className="absolute inset-x-0 top-0" style={{ height: top + h * 0.06, background: SKY_EDGE }} aria-hidden />
          <div className="absolute inset-x-0 bottom-0" style={{ height: vp.h - (top + h) + h * 0.06, background: GRASS_EDGE }} aria-hidden />
        </>
      )}

      <div
        className="absolute"
        style={{
          left,
          top,
          width: w,
          height: h,
          // soften the painting's top and bottom edge into the extension so there is no seam
          maskImage: narrow && extra > 0 ? 'linear-gradient(to bottom, transparent 0%, #000 6%, #000 94%, transparent 100%)' : undefined,
          WebkitMaskImage: narrow && extra > 0 ? 'linear-gradient(to bottom, transparent 0%, #000 6%, #000 94%, transparent 100%)' : undefined,
        }}
      >
        <svg viewBox={`0 0 ${IMG_W} ${IMG_H}`} className="absolute inset-0 h-full w-full overflow-visible" role="group" aria-label="Монголын тал нутаг — товшиж судал">
          <defs>
            <radialGradient id="ws-sun">
              <stop offset="0%" stopColor="#FFF1C2" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFF1C2" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ws-door">
              <stop offset="0%" stopColor="#FFE9B0" stopOpacity="1" />
              <stop offset="65%" stopColor="#E8BB62" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#C45A3C" stopOpacity="0" />
            </radialGradient>
          </defs>

          <image href={art} x={0} y={0} width={IMG_W} height={IMG_H} />

          {/* morning light breathes very slowly from the upper right */}
          <motion.circle
            cx={760}
            cy={160}
            r={420}
            fill="url(#ws-sun)"
            style={{ mixBlendMode: 'soft-light' }}
            animate={reduceMotion ? { opacity: 0.6 } : { opacity: [0.35, 0.8, 0.35] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            pointerEvents="none"
          />

          {/* a bird pair crossing now and then */}
          {!reduceMotion && (
            <motion.g
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: IMG_W + 80, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 34, repeat: Infinity, repeatDelay: 20, ease: 'linear' }}
              pointerEvents="none"
            >
              <g transform="translate(0 330) scale(1.6)">
                <path d="M0 0 Q5 -6 10 0 Q15 -6 20 0" stroke="#3a4a52" strokeWidth={1.8} fill="none" strokeLinecap="round" />
                <path d="M18 9 Q22 4 26 9 Q30 4 34 9" stroke="#3a4a52" strokeWidth={1.5} fill="none" strokeLinecap="round" opacity={0.7} />
              </g>
            </motion.g>
          )}

          {/* chimney smoke */}
          {!reduceMotion && (
            <motion.path
              d={`M${CHIMNEY.x} ${CHIMNEY.y} q18 -26 0 -54 q-16 -28 6 -58`}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={9}
              strokeLinecap="round"
              animate={{ y: [6, -34, 6], opacity: [0, 0.5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeOut' }}
              pointerEvents="none"
            />
          )}

          {/* animals, the children's shagai, river, mountains: tap to discover */}
          {SPOTS.map((s) => {
            const isFound = found(s.id)
            const minHit = px(52)
            const hw = Math.max(s.w, minHit)
            const hh = Math.max(s.h, minHit)
            const hx = s.x - (hw - s.w) / 2
            const hy = s.y - (hh - s.h) / 2
            const mx = hx + hw / 2
            const my = hy + Math.min(14 + px(10), hh / 2)
            return (
              <g
                key={s.id}
                role="button"
                tabIndex={0}
                aria-label={s.label}
                className="group cursor-pointer outline-none"
                onClick={() => onSelect(s.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelect(s.id)
                  }
                }}
              >
                <rect x={hx} y={hy} width={hw} height={hh} rx={px(14)} fill="transparent" />
                <rect
                  x={hx - 4}
                  y={hy - 4}
                  width={hw + 8}
                  height={hh + 8}
                  rx={px(16)}
                  fill="none"
                  stroke="#435A8C"
                  strokeWidth={px(3)}
                  className="opacity-0 group-focus-visible:opacity-100"
                />
                <g transform={`translate(${mx} ${my}) scale(${px(1)})`}>
                  {isFound ? (
                    <>
                      <circle r={11} fill="#183F35" stroke="#FFFDF9" strokeWidth={2.2} />
                      <path d="M-4.6 0.6 L-1.6 3.6 L4.8 -3.2" fill="none" stroke="#FFFDF9" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
                    </>
                  ) : (
                    <motion.path
                      d={SPARKLE}
                      transform="scale(1.35)"
                      fill="#E8BB62"
                      stroke="#FFFDF9"
                      strokeWidth={1.3}
                      strokeLinejoin="round"
                      animate={reduceMotion ? undefined : { scale: [1.15, 1.6, 1.15], opacity: [0.65, 1, 0.65] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                </g>
                <title>{s.label}</title>
              </g>
            )
          })}

          {/* THE GER — the door of the whole game */}
          <g
            role="button"
            tabIndex={0}
            aria-label="Гэр рүү ор"
            className="group cursor-pointer outline-none"
            onClick={onEnterGer}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onEnterGer()
              }
            }}
          >
            <motion.rect
              x={DOOR.x}
              y={DOOR.y}
              width={DOOR.w}
              height={DOOR.h}
              rx={10}
              fill="url(#ws-door)"
              initial={{ opacity: 0 }}
              animate={{ opacity: entering ? 1 : 0 }}
              transition={{ duration: 0.45, delay: entering ? 0.1 : 0 }}
              pointerEvents="none"
            />
            {/* a quiet pulse on the door says "this is the way in" */}
            {!entering && !reduceMotion && (
              <motion.rect
                x={DOOR.x - 6}
                y={DOOR.y - 6}
                width={DOOR.w + 12}
                height={DOOR.h + 12}
                rx={14}
                fill="none"
                stroke="#FFE9B0"
                strokeWidth={5}
                animate={{ opacity: [0, 0.75, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                pointerEvents="none"
              />
            )}
            <rect
              x={GER.x}
              y={GER.y}
              width={GER.w}
              height={GER.h}
              rx={30}
              fill="none"
              stroke="#435A8C"
              strokeWidth={px(3)}
              className="opacity-0 group-focus-visible:opacity-100"
            />
            <rect x={GER.x} y={GER.y} width={GER.w} height={GER.h} fill="transparent" />
          </g>
        </svg>
      </div>
    </motion.div>
  )
}
