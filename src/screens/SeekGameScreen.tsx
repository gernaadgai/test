import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Image as ImageIcon, Lightbulb, MessageCircleQuestion, Star, Type, ZoomIn, ZoomOut } from 'lucide-react'
import { SeekThumb } from '../components/SeekThumb'
import { ConfettiBurst } from '../components/ConfettiBurst'
import { ShagaiIcon } from '../components/ShagaiIcon'
import {
  SEEK_H,
  SEEK_SCENES,
  SEEK_W,
  getSeekScene,
  pickRound,
  starsForMisses,
  type SeekItem,
  type SeekScene,
} from '../data/seek'
import { GER_OBJECTS, WORLD_DISCOVERIES } from '../data/discoveries'
import { getBadge } from '../data/badges'
import { getIllustration } from '../lib/illustrations'
import { useCollectionStore } from '../store/useCollectionStore'
import { sound } from '../lib/sound'

type Mode = 'picture' | 'name' | 'riddle'

const MODES: Array<{ id: Mode; titleMn: string; hintMn: string; icon: typeof ImageIcon }> = [
  { id: 'picture', titleMn: 'Зургаар', hintMn: 'Жижиг зургийг тааруулж ол', icon: ImageIcon },
  { id: 'name', titleMn: 'Нэрээр', hintMn: 'Нэрийг уншаад ол', icon: Type },
  { id: 'riddle', titleMn: 'Оньсогоор', hintMn: 'Оньсого уншаад таа', icon: MessageCircleQuestion },
]

const HINTS_PER_ROUND = 3
const ZOOM = 1.9
/** a tap this close (in screen px) to a thing still counts, so small fingers can play */
const MIN_HIT_RADIUS = 26
const KNOWN_IDS = new Set([...GER_OBJECTS.map((o) => o.id), ...WORLD_DISCOVERIES.map((o) => o.id)])

interface Round {
  mode: Mode
  items: SeekItem[]
  found: string[]
  misses: number
  hintsLeft: number
}

interface Result {
  stars: number
  firstTime: boolean
  newBadges: string[]
}

function Stars({ value, size = 18, className = '' }: { value: number; size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} role="img" aria-label={`${value} / 3 од`}>
      {[1, 2, 3].map((n) => (
        <Star key={n} size={size} className={n <= value ? 'fill-gold text-gold' : 'fill-transparent text-ink-soft/30'} strokeWidth={2} />
      ))}
    </span>
  )
}

export function SeekGameScreen() {
  const { sceneId } = useParams()
  const scene = sceneId ? getSeekScene(sceneId) : undefined
  if (!scene) return <Navigate to="/seek" replace />
  return <SeekGame key={scene.id} scene={scene} />
}

function SeekGame({ scene }: { scene: SeekScene }) {
  const navigate = useNavigate()
  const reduceMotion = !!useReducedMotion()
  const art = getIllustration(scene.art)
  const discover = useCollectionStore((s) => s.discover)
  const completeSeek = useCollectionStore((s) => s.completeSeek)
  const bestStars = useCollectionStore((s) => s.seekStars[scene.id] ?? 0)

  const [round, setRound] = useState<Round | null>(null)
  const [lastMode, setLastMode] = useState<Mode>(() => {
    try {
      const saved = window.localStorage.getItem('gn-seek-mode')
      return saved === 'name' || saved === 'riddle' || saved === 'picture' ? saved : 'picture'
    } catch {
      return 'picture'
    }
  })
  const [zoomed, setZoomed] = useState(false)
  const [toast, setToast] = useState<{ item: SeekItem; key: number } | null>(null)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [tip, setTip] = useState<{ id: number; x: number; y: number; text: string } | null>(null)
  const [hintId, setHintId] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [announce, setAnnounce] = useState('')

  const boxRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const timers = useRef<number[]>([])
  const seq = useRef(0)

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timers.current.push(id)
    return id
  }, [])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((t) => window.clearTimeout(t))
  }, [])

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // fit the whole painting in the available space, optionally zoomed in for small fingers
  const fit = box.w > 0 && box.h > 0 ? Math.min(box.w / SEEK_W, box.h / SEEK_H) : 0
  const sc = fit * (zoomed ? ZOOM : 1)
  const dispW = SEEK_W * sc
  const dispH = SEEK_H * sc

  // keep the view centred when zooming
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
    el.scrollTop = (el.scrollHeight - el.clientHeight) / 2
  }, [zoomed])

  const pending = round ? round.items.filter((i) => !round.found.includes(i.id)) : []
  const target = round?.mode === 'riddle' ? pending[0] : undefined

  const startRound = (mode: Mode) => {
    sound.tap()
    try {
      window.localStorage.setItem('gn-seek-mode', mode)
    } catch {
      // storage unavailable — the choice just isn't remembered
    }
    setLastMode(mode)
    setResult(null)
    setToast(null)
    setHintId(null)
    setRound({ mode, items: pickRound(scene), found: [], misses: 0, hintsLeft: HINTS_PER_ROUND })
  }

  const addMiss = (x: number, y: number) => {
    sound.pop()
    const id = ++seq.current
    setRipples((r) => [...r, { id, x, y }])
    setRound((r) => (r ? { ...r, misses: r.misses + 1 } : r))
  }

  const showTip = (x: number, y: number, text: string) => {
    const id = ++seq.current
    setTip({ id, x, y, text })
    later(() => setTip((t) => (t?.id === id ? null : t)), 1700)
  }

  const onFound = (item: SeekItem) => {
    if (!round) return
    sound.success()
    if (KNOWN_IDS.has(item.id)) discover(item.id)
    const found = [...round.found, item.id]
    setRound({ ...round, found })
    setHintId(null)
    const key = ++seq.current
    setToast({ item, key })
    setAnnounce(`Олдлоо: ${item.nameMn}`)
    later(() => setToast((t) => (t?.key === key ? null : t)), 6500)
    if (found.length === round.items.length) {
      const stars = starsForMisses(round.misses)
      later(() => {
        const res = completeSeek(scene.id, stars)
        sound.complete()
        setResult({ stars, firstTime: res.firstTime, newBadges: res.newBadges })
      }, 1200)
    }
  }

  const tapAt = (x: number, y: number) => {
    if (!round || result) return
    if (round.found.length === round.items.length) return
    const minR = MIN_HIT_RADIUS / (sc || 1)
    const hit = (it: SeekItem) =>
      it.areas.some((ar) => ((x - ar.cx) / Math.max(ar.rx, minR)) ** 2 + ((y - ar.cy) / Math.max(ar.ry, minR)) ** 2 <= 1)
    const size = (it: SeekItem) => Math.min(...it.areas.map((ar) => ar.rx * ar.ry))
    const hits = scene.items.filter(hit).sort((a, b) => size(a) - size(b))

    const winner = round.mode === 'riddle' ? hits.find((i) => i.id === target?.id) : hits.find((i) => pending.some((p) => p.id === i.id))
    if (winner) return onFound(winner)

    if (hits.length === 0) return addMiss(x, y)
    // a real thing, just not the one being asked for: say what it is, and only count it in riddle mode
    const first = hits[0]
    showTip(x, y, first.nameMn)
    if (round.mode === 'riddle' && pending.some((p) => p.id === first.id)) addMiss(x, y)
    else sound.tap()
  }

  const onSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return
    tapAt(((e.clientX - rect.left) / rect.width) * SEEK_W, ((e.clientY - rect.top) / rect.height) * SEEK_H)
  }

  const showHint = () => {
    if (!round || result || round.hintsLeft <= 0 || hintId) return
    const pick = target ?? pending[0]
    if (!pick) return
    sound.tap()
    setHintId(pick.id)
    setRound({ ...round, hintsLeft: round.hintsLeft - 1 })
    // bring it into view when zoomed in
    const el = boxRef.current
    if (el && zoomed) {
      const ar = pick.areas[0]
      el.scrollTo({
        left: Math.max(0, ar.cx * sc - el.clientWidth / 2),
        top: Math.max(0, ar.cy * sc - el.clientHeight / 2),
        behavior: reduceMotion ? 'auto' : 'smooth',
      })
    }
    later(() => setHintId((h) => (h === pick.id ? null : h)), 3800)
  }

  const nextScene = SEEK_SCENES[(SEEK_SCENES.findIndex((s) => s.id === scene.id) + 1) % SEEK_SCENES.length]
  const foundCount = round?.found.length ?? 0
  const total = round?.items.length ?? 0
  const mark = (px: number) => px / (sc || 1)

  const markers = useMemo(() => round?.items.filter((i) => round.found.includes(i.id)) ?? [], [round])
  const hintItem = hintId ? scene.items.find((i) => i.id === hintId) : undefined

  return (
    <div className="fixed inset-0 z-0 flex flex-col overflow-hidden bg-forest-dark">
      {art && <img src={art} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-xl" />}

      {/* top bar */}
      <div className="relative z-20 flex items-center gap-2 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] md:px-6">
        <button
          type="button"
          onClick={() => {
            sound.tap()
            navigate('/seek')
          }}
          aria-label="Бүх газар руу буцах"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper/92 text-forest shadow-[var(--shadow-soft)] backdrop-blur-sm transition-transform active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="min-w-0 flex-1 rounded-full bg-paper/92 px-4 py-1.5 shadow-[var(--shadow-soft)] backdrop-blur-sm">
          <p className="truncate font-display text-sm font-extrabold leading-tight" style={{ color: scene.accent }}>
            {scene.nameMn}
          </p>
          <p className="truncate text-[10px] font-semibold leading-tight text-ink-soft">{scene.nameEn}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            sound.tap()
            setZoomed((z) => !z)
          }}
          aria-pressed={zoomed}
          aria-label={zoomed ? 'Жижигрүүлэх' : 'Томруулах'}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-[var(--shadow-soft)] backdrop-blur-sm transition-transform active:scale-95 ${
            zoomed ? 'bg-forest text-cream' : 'bg-paper/92 text-forest'
          }`}
        >
          {zoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
        </button>
        <button
          type="button"
          onClick={showHint}
          disabled={!round || round.hintsLeft <= 0 || !!hintId || !!result}
          aria-label={`Зөвлөгөө: ${round?.hintsLeft ?? 0} үлдсэн`}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-forest-dark shadow-[var(--shadow-soft)] transition-transform active:scale-95 disabled:opacity-45"
        >
          <Lightbulb size={20} />
          {round && (
            <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-forest px-1 text-[10px] font-extrabold text-cream">
              {round.hintsLeft}
            </span>
          )}
        </button>
      </div>

      {/* the painting */}
      <div ref={boxRef} className="relative z-10 min-h-0 flex-1 overflow-auto overscroll-contain">
        <div className="flex min-h-full min-w-full">
          {fit > 0 && art && (
            <div className="relative m-auto shrink-0 overflow-hidden rounded-[18px] shadow-[var(--shadow-pop)]" style={{ width: dispW, height: dispH }}>
              <img src={art} alt={`${scene.nameMn} — ${scene.nameEn}`} draggable={false} className="absolute inset-0 h-full w-full select-none" />
              <svg
                ref={svgRef}
                viewBox={`0 0 ${SEEK_W} ${SEEK_H}`}
                className={`absolute inset-0 h-full w-full ${round && !result ? 'cursor-pointer' : ''}`}
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                onClick={onSvgClick}
              >
                {/* found: a gold ring and a tick */}
                {markers.map((it) =>
                  it.areas.map((ar, i) => (
                    <g key={`${it.id}-${i}`} pointerEvents="none">
                      <motion.ellipse
                        cx={ar.cx}
                        cy={ar.cy}
                        rx={Math.max(ar.rx, mark(18)) + mark(4)}
                        ry={Math.max(ar.ry, mark(18)) + mark(4)}
                        fill="#E8BB62"
                        fillOpacity={0.14}
                        stroke="#E8BB62"
                        strokeWidth={mark(3.5)}
                        initial={reduceMotion ? false : { opacity: 0, scale: 1.25 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ transformOrigin: `${ar.cx}px ${ar.cy}px` }}
                        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                      />
                      {i === 0 && (
                        <motion.g
                          initial={reduceMotion ? false : { scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{ transformOrigin: `${ar.cx}px ${Math.max(mark(16), ar.cy - Math.max(ar.ry, mark(18)))}px` }}
                          transition={{ delay: 0.12, type: 'spring', stiffness: 320, damping: 14 }}
                        >
                          <circle cx={ar.cx} cy={Math.max(mark(16), ar.cy - Math.max(ar.ry, mark(18)))} r={mark(13)} fill="#183F35" stroke="#FFFDF9" strokeWidth={mark(2.5)} />
                          <path
                            d={`M${ar.cx - mark(5.5)} ${Math.max(mark(16), ar.cy - Math.max(ar.ry, mark(18))) + mark(0.5)} l${mark(3.5)} ${mark(3.6)} l${mark(7)} ${mark(-7.4)}`}
                            fill="none"
                            stroke="#FFFDF9"
                            strokeWidth={mark(2.6)}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </motion.g>
                      )}
                    </g>
                  )),
                )}

                {/* hint */}
                {hintItem &&
                  hintItem.areas.map((ar, i) => (
                    <motion.ellipse
                      key={`hint-${i}`}
                      cx={ar.cx}
                      cy={ar.cy}
                      rx={Math.max(ar.rx, mark(24)) + mark(6)}
                      ry={Math.max(ar.ry, mark(24)) + mark(6)}
                      fill="#E8BB62"
                      fillOpacity={0.16}
                      stroke="#FFFDF9"
                      strokeWidth={mark(4)}
                      strokeDasharray={`${mark(10)} ${mark(8)}`}
                      pointerEvents="none"
                      animate={reduceMotion ? undefined : { opacity: [0.35, 1, 0.35] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  ))}

                {/* gentle ripple for a tap on nothing */}
                {ripples.map((r) => (
                  <motion.circle
                    key={r.id}
                    cx={r.x}
                    cy={r.y}
                    fill="#C45A3C"
                    fillOpacity={0.18}
                    stroke="#FFFDF9"
                    strokeWidth={mark(3)}
                    pointerEvents="none"
                    initial={{ r: mark(6), opacity: 0.9 }}
                    animate={{ r: mark(38), opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: 'easeOut' }}
                    onAnimationComplete={() => setRipples((list) => list.filter((x) => x.id !== r.id))}
                  />
                ))}

                {/* keyboard access: every unfound thing in this round can be reached with Tab */}
                {round &&
                  !result &&
                  pending.map((it) => (
                    <g
                      key={`kb-${it.id}`}
                      role="button"
                      tabIndex={0}
                      aria-label={it.nameMn}
                      className="group outline-none"
                      pointerEvents="none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          tapAt(it.areas[0].cx, it.areas[0].cy)
                        }
                      }}
                    >
                      {it.areas.map((ar, i) => (
                        <ellipse
                          key={i}
                          cx={ar.cx}
                          cy={ar.cy}
                          rx={Math.max(ar.rx, mark(26)) + mark(5)}
                          ry={Math.max(ar.ry, mark(26)) + mark(5)}
                          fill="none"
                          stroke="#435A8C"
                          strokeWidth={mark(4)}
                          className="opacity-0 group-focus-visible:opacity-100"
                        />
                      ))}
                    </g>
                  ))}

              </svg>

              {/* name of whatever was tapped by mistake */}
              <AnimatePresence>
                {tip && (
                  <motion.span
                    key={tip.id}
                    initial={{ opacity: 0, y: 6, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="pointer-events-none absolute z-10 whitespace-nowrap rounded-full bg-paper px-3 py-1 text-xs font-extrabold text-forest shadow-[var(--shadow-pop)]"
                    style={{
                      left: `${(tip.x / SEEK_W) * 100}%`,
                      top: `${(tip.y / SEEK_H) * 100}%`,
                      transform: 'translate(-50%, -130%)',
                    }}
                  >
                    {tip.text}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* bottom tray */}
      <div className="relative z-20 rounded-t-[26px] bg-paper px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_-12px_rgba(15,42,35,0.5)] md:px-8">
        <p className="sr-only" role="status" aria-live="polite">
          {announce}
        </p>

        <AnimatePresence>
          {toast && (
            <motion.button
              key={toast.key}
              type="button"
              onClick={() => setToast(null)}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-x-3 bottom-full mb-2 mx-auto flex max-w-[520px] items-center gap-3 rounded-2xl bg-forest p-2.5 pr-4 text-left text-cream shadow-[var(--shadow-pop)]"
              aria-label="Хаах"
            >
              <SeekThumb scene={scene} item={toast.item} size={60} className="rounded-xl" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 font-display text-sm font-extrabold leading-tight text-gold-light">
                  <Check size={15} strokeWidth={3} /> {toast.item.nameMn}
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-cream/60">{toast.item.nameEn}</span>
                </span>
                <span className="mt-0.5 block text-[12.5px] font-medium leading-snug text-cream/95">{toast.item.factMn}</span>
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {round ? (
          <>
            <div className="mb-2 flex items-center gap-3">
              <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink-soft" aria-label={`Олдсон ${foundCount} / ${total}`}>
                <ShagaiIcon size={18} /> {foundCount}/{total} · {MODES.find((m) => m.id === round.mode)?.titleMn}
              </p>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-dark">
                <div className="h-full rounded-full bg-gold transition-[width] duration-500" style={{ width: `${total ? (foundCount / total) * 100 : 0}%` }} />
              </div>
            </div>

            {round.mode === 'picture' && (
              <ul className="mx-auto grid max-w-[520px] grid-cols-6 gap-1.5">
                {round.items.map((it) => {
                  const done = round.found.includes(it.id)
                  return (
                    <li key={it.id} className="relative" aria-label={done ? it.nameMn : 'Хайх зүйл'}>
                      <SeekThumb scene={scene} item={it} size="100%" className={`rounded-xl ring-2 transition-all ${done ? 'opacity-45 ring-gold' : 'ring-forest/15'}`} />
                      {done && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest text-cream">
                            <Check size={14} strokeWidth={3.2} />
                          </span>
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}

            {round.mode === 'name' && (
              <ul className="mx-auto flex max-w-[520px] flex-wrap justify-center gap-1.5">
                {round.items.map((it) => {
                  const done = round.found.includes(it.id)
                  return (
                    <li
                      key={it.id}
                      className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-extrabold transition-colors ${
                        done ? 'bg-gold/30 text-forest/60 line-through' : 'bg-cream text-forest ring-1 ring-forest/15'
                      }`}
                    >
                      {done && <Check size={13} strokeWidth={3.2} />}
                      {it.nameMn}
                    </li>
                  )
                })}
              </ul>
            )}

            {round.mode === 'riddle' && (
              <div className="mx-auto max-w-[520px] rounded-2xl bg-cream px-4 py-3 text-center ring-1 ring-forest/10">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={target?.id ?? 'done'}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-display text-[15px] font-extrabold leading-snug text-forest"
                  >
                    {target ? target.riddleMn : 'Бүгдийг нь оллоо!'}
                  </motion.p>
                </AnimatePresence>
              </div>
            )}
          </>
        ) : (
          <p className="py-1 text-center text-xs font-semibold text-ink-soft">Хэрхэн хайхаа сонго</p>
        )}
      </div>

      {/* choose how to play */}
      <AnimatePresence>
        {!round && (
          <motion.div className="absolute inset-0 z-30 flex items-end justify-center sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-forest-dark/55 backdrop-blur-[3px]" />
            <motion.section
              role="dialog"
              aria-label={scene.nameMn}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="relative w-full max-w-[460px] overflow-hidden rounded-t-[28px] bg-paper shadow-[var(--shadow-pop)] sm:rounded-[28px]"
            >
              <div className="relative h-36 overflow-hidden">
                {art && <img src={art} alt="" className="h-full w-full object-cover" style={{ objectPosition: scene.thumbPos }} />}
                <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/10 to-transparent" />
                {bestStars > 0 && <Stars value={bestStars} size={20} className="absolute right-4 top-3 rounded-full bg-paper/90 px-2.5 py-1" />}
              </div>
              <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-1">
                <h1 className="font-display text-2xl font-extrabold leading-tight" style={{ color: scene.accent }}>
                  {scene.nameMn}
                </h1>
                <p className="text-xs font-semibold text-ink-soft">{scene.taglineMn}</p>
                <div className="mt-4 flex flex-col gap-2.5">
                  {MODES.map((m) => {
                    const Icon = m.icon
                    const recommended = m.id === lastMode
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => startRound(m.id)}
                        className={`flex min-h-14 items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition-transform active:scale-[0.98] ${
                          recommended ? 'bg-forest text-cream' : 'bg-cream text-forest ring-1 ring-forest/10'
                        }`}
                      >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${recommended ? 'bg-cream/15' : 'bg-paper'}`}>
                          <Icon size={20} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-[15px] font-extrabold leading-tight">{m.titleMn}</span>
                          <span className={`block text-[11.5px] font-medium ${recommended ? 'text-cream/75' : 'text-ink-soft'}`}>{m.hintMn}</span>
                        </span>
                        <ArrowRight size={18} className="shrink-0 opacity-60" />
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* result */}
      <AnimatePresence>
        {result && round && (
          <motion.div className="absolute inset-0 z-40 flex items-center justify-center p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-forest-dark/60 backdrop-blur-[3px]" />
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-label="Дүн"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
              className="relative w-full max-w-[420px] rounded-[28px] bg-paper p-6 text-center shadow-[var(--shadow-pop)]"
            >
              <ConfettiBurst colors={['#E8BB62', '#C45A3C', '#A7BB82']} count={20} />
              <div className="flex justify-center gap-1.5">
                {[1, 2, 3].map((n) => (
                  <motion.span
                    key={n}
                    initial={reduceMotion ? false : { scale: 0, rotate: -40 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.25 + n * 0.18, type: 'spring', stiffness: 280, damping: 12 }}
                  >
                    <Star size={42} strokeWidth={2} className={n <= result.stars ? 'fill-gold text-gold' : 'fill-transparent text-ink-soft/25'} />
                  </motion.span>
                ))}
              </div>
              <h2 className="mt-3! font-display text-2xl font-extrabold text-forest">
                {result.stars === 3 ? 'Хурц нүдтэй юм аа!' : result.stars === 2 ? 'Маш сайн!' : 'Сайхан тоглолоо!'}
              </h2>
              <p className="mt-1! text-sm font-medium text-ink-soft">
                {round.items.length} зүйлийг бүгдийг нь оллоо{round.misses === 0 ? ' — нэг ч алдаагүй!' : '.'}
              </p>

              <ul className="mt-4 flex justify-center gap-1.5">
                {round.items.map((it) => (
                  <li key={it.id}>
                    <SeekThumb scene={scene} item={it} size={44} className="rounded-lg ring-2 ring-gold" />
                  </li>
                ))}
              </ul>

              {result.firstTime && <p className="mt-4! rounded-2xl bg-gold/20 px-4 py-2 text-xs font-extrabold text-forest">Анхны удаа! +20 Наадгайн оноо</p>}
              {result.newBadges.map((id) => {
                const b = getBadge(id)
                return b ? (
                  <p key={id} className="mt-2! rounded-2xl bg-gold/20 px-4 py-2 text-xs font-extrabold text-forest">
                    Шинэ тэмдэг: {b.nameMn}
                  </p>
                ) : null
              })}

              <div className="mt-5 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => startRound(round.mode)}
                  className="rounded-2xl bg-forest py-3.5 text-sm font-extrabold text-cream transition-transform active:scale-[0.97]"
                >
                  Дахин тоглох
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.tap()
                    navigate(`/seek/${nextScene.id}`)
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gold py-3.5 text-sm font-extrabold text-forest-dark transition-transform active:scale-[0.97]"
                >
                  {nextScene.nameMn} руу <ArrowRight size={16} />
                </button>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      sound.tap()
                      setResult(null)
                      setRound(null)
                    }}
                    className="flex-1 rounded-2xl border-2 border-forest/15 py-3 text-[13px] font-extrabold text-forest transition-transform active:scale-[0.97]"
                  >
                    Өөр горим
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.tap()
                      navigate('/seek')
                    }}
                    className="flex-1 rounded-2xl border-2 border-forest/15 py-3 text-[13px] font-extrabold text-forest transition-transform active:scale-[0.97]"
                  >
                    Бүх газар
                  </button>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
