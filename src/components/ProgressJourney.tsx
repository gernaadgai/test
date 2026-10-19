import { motion, useReducedMotion } from 'framer-motion'
import { House, Sprout, Footprints, Music2, Target, Star } from 'lucide-react'

interface Props {
  current: number
  total: number
}

const STOPS = [
  { label: 'Гэр', icon: House },
  { label: 'Тал', icon: Sprout },
  { label: 'Мөр', icon: Footprints },
  { label: 'Хуур', icon: Music2 },
  { label: 'Наадам', icon: Target },
  { label: 'Од', icon: Star },
]

/** A child's progress reads as a little journey across Mongolia, not a spreadsheet bar. */
export function ProgressJourney({ current, total }: Props) {
  const reduceMotion = useReducedMotion()
  const activeStop = Math.min(STOPS.length - 1, Math.floor((current / Math.max(total - 1, 1)) * STOPS.length))
  const progress = Math.min(100, ((current + 1) / total) * 100)

  return (
    <section aria-label={`Аяллын явц: ${current + 1} / ${total}`} className="mb-5 rounded-2xl bg-paper/72 p-3.5 shadow-[var(--shadow-soft)] border border-ink/5">
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-soft/70">Монгол аялал</p>
        <p className="text-xs font-extrabold text-forest">{current + 1} / {total}</p>
      </div>
      <div className="relative grid grid-cols-6 items-center">
        <div className="absolute left-[8%] right-[8%] top-4 h-1 rounded-full bg-cream-dark" aria-hidden />
        <motion.div
          className="absolute left-[8%] top-4 h-1 rounded-full bg-terracotta"
          style={{ width: `${Math.max(0, progress - 16)}%` }}
          initial={false}
          animate={reduceMotion ? undefined : { scaleX: [0.96, 1] }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          aria-hidden
        />
        {STOPS.map(({ label, icon: Icon }, index) => {
          const reached = index <= activeStop
          const active = index === activeStop
          return (
            <div key={label} className="relative z-10 flex flex-col items-center gap-1">
              <motion.div
                animate={active && !reduceMotion ? { y: [0, -3, 0] } : undefined}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${reached ? 'border-terracotta bg-terracotta text-paper shadow-sm' : 'border-cream-dark bg-paper text-ink-soft/40'}`}
              >
                <Icon size={14} strokeWidth={2.5} aria-hidden />
              </motion.div>
              <span className={`text-[8px] font-bold ${active ? 'text-terracotta' : 'text-ink-soft/50'}`}>{label}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
