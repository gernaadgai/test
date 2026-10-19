import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Compass, Search, X } from 'lucide-react'
import { DiscoverySheet } from '../components/DiscoverySheet'
import { ConfettiBurst } from '../components/ConfettiBurst'
import { ShagaiReward } from '../components/ShagaiReward'
import { GER_OBJECTS, type GerObject } from '../data/discoveries'
import { getBadge } from '../data/badges'
import { getIllustration } from '../lib/illustrations'
import { useCollectionStore } from '../store/useCollectionStore'
import { sound } from '../lib/sound'

const IMG_W = 848
const IMG_H = 1264
const IMG_ASPECT = IMG_W / IMG_H
const QUEST_LENGTH = 5

const SPARKLE = 'M0 -9 L2.6 -2.6 L9 0 L2.6 2.6 L0 9 L-2.6 2.6 L-9 0 L-2.6 -2.6 Z'

function pickQuest() {
  const ids = GER_OBJECTS.map((o) => o.id)
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
  }
  return ids.slice(0, QUEST_LENGTH)
}

interface Quest {
  order: string[]
  step: number
  misses: number
}

/** MY GER — step inside. Tap things to learn about them, or play "Find it!" to earn a decoration. */
export function GerScreen() {
  const navigate = useNavigate()
  const reduceMotion = !!useReducedMotion()
  const discoveredIds = useCollectionStore((s) => s.discoveredIds)
  const discover = useCollectionStore((s) => s.discover)
  const gerQuestDone = useCollectionStore((s) => s.gerQuestDone)
  const completeGerQuest = useCollectionStore((s) => s.completeGerQuest)

  const interior = getIllustration('ger-interior')
  const shagai = getIllustration('shagai')

  const [sheet, setSheet] = useState<{ item: GerObject; isNew: boolean } | null>(null)
  const [quest, setQuest] = useState<Quest | null>(null)
  const [shakeId, setShakeId] = useState<string | null>(null)
  const [okId, setOkId] = useState<string | null>(null)
  const [finished, setFinished] = useState<{ isNew: boolean; newBadges: string[] } | null>(null)
  const [fit, setFit] = useState<'slice' | 'meet'>('slice')
  const timers = useRef<number[]>([])

  useEffect(() => {
    const update = () => setFit(window.innerWidth / window.innerHeight < IMG_ASPECT ? 'slice' : 'meet')
    update()
    window.addEventListener('resize', update)
    const pending = timers.current
    return () => {
      window.removeEventListener('resize', update)
      pending.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const found = GER_OBJECTS.filter((o) => discoveredIds.includes(o.id)).length
  const target = quest ? GER_OBJECTS.find((o) => o.id === quest.order[quest.step]) : undefined

  const onTap = useCallback(
    (obj: GerObject) => {
      if (!quest) {
        const { isNew } = discover(obj.id)
        if (isNew) sound.unlock()
        else sound.tap()
        setSheet({ item: obj, isNew })
        return
      }
      if (obj.id === quest.order[quest.step]) {
        sound.success()
        setOkId(obj.id)
        later(() => setOkId(null), 700)
        const nextStep = quest.step + 1
        if (nextStep >= QUEST_LENGTH) {
          const result = completeGerQuest()
          later(() => {
            setQuest(null)
            setFinished(result)
            sound.complete()
          }, 650)
        } else {
          setQuest({ ...quest, step: nextStep, misses: 0 })
        }
      } else {
        sound.pop()
        setShakeId(obj.id)
        later(() => setShakeId(null), 500)
        setQuest({ ...quest, misses: quest.misses + 1 })
      }
    },
    [quest, discover, completeGerQuest],
  )

  const startQuest = () => {
    sound.tap()
    setFinished(null)
    setQuest({ order: pickQuest(), step: 0, misses: 0 })
  }

  const garland = useMemo(() => Array.from({ length: 7 }, (_, i) => i), [])
  const needHint = !!quest && quest.misses >= 2

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
            const isTarget = needHint && target?.id === o.id
            return (
              <g
                key={o.id}
                role="button"
                tabIndex={0}
                aria-label={quest ? `${o.nameMn}` : `${o.nameMn} — ${o.nameEn}`}
                className="group cursor-pointer outline-none"
                onClick={() => onTap(o)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onTap(o)
                  }
                }}
              >
                <motion.g
                  style={{ transformOrigin: `${o.cx}px ${o.cy}px` }}
                  animate={shakeId === o.id ? { x: [0, -10, 10, -6, 6, 0] } : okId === o.id ? { scale: [1, 1.12, 1] } : {}}
                  transition={{ duration: 0.45 }}
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
                  {okId === o.id && <circle cx={o.cx} cy={o.cy} r={o.r} fill="#E8BB62" opacity={0.35} />}
                  {isTarget && (
                    <motion.circle
                      cx={o.cx}
                      cy={o.cy}
                      r={o.r}
                      fill="none"
                      stroke="#E8BB62"
                      strokeWidth={8}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                  )}
                  {/* sparkle until found, tick once found; hidden while playing the quest */}
                  {!quest && (
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
                  )}
                </motion.g>
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

      {/* "Find it!" prompt */}
      <AnimatePresence>
        {quest && target && (
          <motion.div
            key="prompt"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="pointer-events-none absolute inset-x-0 top-[calc(4.5rem+env(safe-area-inset-top))] z-20 flex justify-center px-4"
          >
            <div className="pointer-events-auto flex w-full max-w-[420px] items-center gap-3 rounded-2xl bg-paper px-4 py-3 shadow-[var(--shadow-pop)]">
              <Search size={22} className="shrink-0 text-terracotta" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">
                  Ол! {quest.step + 1}/{QUEST_LENGTH}
                </p>
                <p className="truncate font-display text-lg font-extrabold leading-tight text-forest">{target.nameMn}</p>
                <p className="text-[11px] font-medium text-ink-soft">{quest.misses > 0 ? 'Дахин нэг оролдоод үз!' : target.nameEn}</p>
              </div>
              <button
                type="button"
                onClick={() => setQuest(null)}
                aria-label="Тоглоомоос гарах / Leave game"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream text-forest"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* start the activity */}
      {!quest && !finished && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-20 flex justify-center px-4 md:bottom-28">
          <motion.button
            type="button"
            onClick={startQuest}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-gold px-6 py-3.5 text-sm font-extrabold text-forest-dark shadow-[var(--shadow-pop)]"
          >
            <Search size={18} /> {gerQuestDone ? 'Дахин ол!' : 'Тоглоом: Хайж ол!'}
          </motion.button>
        </div>
      )}

      <DiscoverySheet item={sheet?.item ?? null} isNew={sheet?.isNew ?? false} onClose={() => setSheet(null)} />

      {/* finish */}
      <AnimatePresence>
        {finished && (
          <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" aria-label="Хаах / Close" onClick={() => setFinished(null)} className="absolute inset-0 cursor-default bg-forest-dark/55 backdrop-blur-[2px]" />
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-label="Баяр хүргэе"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              className="relative w-full max-w-[400px] rounded-[28px] bg-paper p-7 text-center shadow-[var(--shadow-pop)]"
            >
              <ConfettiBurst colors={['#E8BB62', '#C45A3C', '#A7BB82']} count={18} />
              <h2 className="font-display text-2xl font-extrabold text-forest">Маш сайн!</h2>
              <p className="mt-1 text-sm font-medium text-ink-soft">Чи гэрийн бүх зүйлийг олчихлоо.</p>
              <div className="mt-4 flex justify-center">
                <ShagaiReward count={QUEST_LENGTH} />
              </div>
              {finished.newBadges.map((id) => {
                const b = getBadge(id)
                return b ? (
                  <p key={id} className="mt-4 rounded-2xl bg-gold/20 px-4 py-2 text-xs font-extrabold text-forest">
                    Шинэ тэмдэг: {b.nameMn}
                  </p>
                ) : null
              })}
              <p className="mt-3 text-xs font-medium text-ink-soft">Гэрт шагайн чимэг өлгөгдлөө!</p>
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={startQuest} className="flex-1 rounded-2xl border-2 border-forest/15 py-3 text-sm font-extrabold text-forest transition-transform active:scale-[0.97]">
                  Дахин тоглох
                </button>
                <button type="button" onClick={() => setFinished(null)} className="flex-1 rounded-2xl bg-forest py-3 text-sm font-extrabold text-cream transition-transform active:scale-[0.97]">
                  Болсон
                </button>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
