import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Compass, Search } from 'lucide-react'
import { DiscoverySheet } from '../components/DiscoverySheet'
import { GER_OBJECTS, type GerObject } from '../data/discoveries'
import { getIllustration } from '../lib/illustrations'
import { useCollectionStore } from '../store/useCollectionStore'
import { sound } from '../lib/sound'

const IMG_W = 848
const IMG_H = 1264
const IMG_ASPECT = IMG_W / IMG_H

const SPARKLE = 'M0 -9 L2.6 -2.6 L9 0 L2.6 2.6 L0 9 L-2.6 2.6 L-9 0 L-2.6 -2.6 Z'

/** MY GER — step inside. Tap things to learn about them, or head to "Find it!" to play with the whole room. */
export function GerScreen() {
  const navigate = useNavigate()
  const reduceMotion = !!useReducedMotion()
  const discoveredIds = useCollectionStore((s) => s.discoveredIds)
  const discover = useCollectionStore((s) => s.discover)
  const gerQuestDone = useCollectionStore((s) => s.gerQuestDone)

  const interior = getIllustration('ger-interior')
  const shagai = getIllustration('shagai')

  const [sheet, setSheet] = useState<{ item: GerObject; isNew: boolean } | null>(null)
  const [fit, setFit] = useState<'slice' | 'meet'>('slice')

  useEffect(() => {
    const update = () => setFit(window.innerWidth / window.innerHeight < IMG_ASPECT ? 'slice' : 'meet')
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const found = GER_OBJECTS.filter((o) => discoveredIds.includes(o.id)).length
  const onTap = (obj: GerObject) => {
    const { isNew } = discover(obj.id)
    if (isNew) sound.unlock()
    else sound.tap()
    setSheet({ item: obj, isNew })
  }

  const garland = useMemo(() => Array.from({ length: 7 }, (_, i) => i), [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-forest-dark">
      {interior && (
        <img src={interior} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-80 blur-xl" />
      )}

      {interior ? (
        <svg
          viewBox={`0 0 ${IMG_W} ${IMG_H}`}
          preserveAspectRatio={`xMidYMid ${fit}`}
          className="absolute inset-0 h-full w-full"
          role="group"
          aria-label="Миний гэрийн дотор"
        >
          <image href={interior} x={0} y={0} width={IMG_W} height={IMG_H} />

          {/* reward: a shagai garland you unlock by finishing "Find it!" */}
          {gerQuestDone && shagai && (
            <g aria-label="Шагайн чимэг">
              <path d="M215 560 Q425 640 640 560" fill="none" stroke="#E8BB62" strokeWidth={3} strokeLinecap="round" />
              {garland.map((i) => {
                const t = (i + 0.5) / garland.length
                const x = 215 + (640 - 215) * t
                const y = 560 + 80 * 4 * t * (1 - t) * 0.5 + 6
                return (
                  <motion.g
                    key={i}
                    style={{ transformOrigin: `${x}px ${y}px` }}
                    animate={reduceMotion ? undefined : { rotate: [-5, 5, -5] }}
                    transition={{ duration: 3 + (i % 3) * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                  >
                    <line x1={x} y1={y - 6} x2={x} y2={y + 6} stroke="#E8BB62" strokeWidth={2} />
                    <image href={shagai} x={x - 17} y={y + 4} width={34} height={34} />
                  </motion.g>
                )
              })}
            </g>
          )}

          {GER_OBJECTS.map((o) => {
            const isFound = discoveredIds.includes(o.id)
            return (
              <g
                key={o.id}
                role="button"
                tabIndex={0}
                aria-label={`${o.nameMn} — ${o.nameEn}`}
                className="group cursor-pointer outline-none"
                onClick={() => onTap(o)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onTap(o)
                  }
                }}
              >
                <circle cx={o.cx} cy={o.cy} r={o.r} fill="transparent" />
                <circle
                  cx={o.cx}
                  cy={o.cy}
                  r={o.r + 6}
                  fill="none"
                  stroke="var(--color-deepblue)"
                  strokeWidth={5}
                  className="opacity-0 group-focus-visible:opacity-100"
                />
                {/* sparkle until found, tick once found */}
                <g transform={`translate(${o.cx} ${o.cy - Math.min(o.r - 8, 34)})`}>
                  {isFound ? (
                    <>
                      <circle r={17} fill="#183F35" stroke="#FFFDF9" strokeWidth={3} />
                      <path d="M-7 1 L-2.5 6 L7.5 -5" fill="none" stroke="#FFFDF9" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
                    </>
                  ) : (
                    <motion.path
                      d={SPARKLE}
                      transform="scale(1.9)"
                      fill="#E8BB62"
                      stroke="#FFFDF9"
                      strokeWidth={1.3}
                      strokeLinejoin="round"
                      animate={reduceMotion ? undefined : { scale: [1.5, 2.1, 1.5], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                </g>
              </g>
            )
          })}
        </svg>
      ) : null}

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-8 md:pt-6">
        <button
          type="button"
          onClick={() => {
            sound.tap()
            navigate('/')
          }}
          className="pointer-events-auto flex h-11 items-center gap-1.5 rounded-full bg-paper/90 pl-3 pr-4 text-xs font-extrabold text-forest shadow-[var(--shadow-soft)] backdrop-blur-sm transition-transform active:scale-95"
        >
          <ArrowLeft size={18} /> Гадаа гарах
        </button>
        <div className="flex items-center gap-2">
          <span
            className="flex h-11 items-center gap-1.5 rounded-full bg-paper/90 px-3 text-xs font-extrabold text-forest shadow-[var(--shadow-soft)] backdrop-blur-sm"
            aria-label={`Нээлт ${found} / ${GER_OBJECTS.length}`}
          >
            <Compass size={16} /> {found}/{GER_OBJECTS.length}
          </span>
        </div>
      </div>

      {/* the Find it! game lives in its own place, with the whole room as a scene */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-20 flex justify-center px-4 md:bottom-28">
        <motion.button
          type="button"
          onClick={() => {
            sound.tap()
            navigate('/seek/ger')
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-gold px-6 py-3.5 text-sm font-extrabold text-forest-dark shadow-[var(--shadow-pop)]"
        >
          <Search size={18} /> {gerQuestDone ? 'Дахин хайж ол!' : 'Тоглоом: Хайж ол!'}
        </motion.button>
      </div>

      <DiscoverySheet item={sheet?.item ?? null} isNew={sheet?.isNew ?? false} onClose={() => setSheet(null)} />
    </div>
  )
}
