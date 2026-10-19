import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import type { Discovery } from '../data/discoveries'
import { getIllustration } from '../lib/illustrations'
import { ConfettiBurst } from './ConfettiBurst'
import { ShagaiReward } from './ShagaiReward'

interface Props {
  item: Discovery | null
  isNew: boolean
  onClose: () => void
  /** optional extra action area (e.g. "Next" in a quest) */
  children?: React.ReactNode
}

/** Bottom sheet that tells a child about the thing they just tapped. Always closable. */
export function DiscoverySheet({ item, isNew, onClose, children }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!item) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [item, onClose])

  const art = item?.art ? getIllustration(item.art) : undefined
  const bg = getIllustration('world-scene')

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Хаах / Close"
            onClick={onClose}
            className="absolute inset-0 bg-forest-dark/45 backdrop-blur-[2px] cursor-default"
          />
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label={`${item.nameMn} — ${item.nameEn}`}
            className="relative w-full max-w-[520px] rounded-t-[28px] bg-paper px-6 pt-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] shadow-[var(--shadow-pop)] sm:mb-6 sm:rounded-[28px]"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Хаах / Close"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-cream text-forest active:scale-95 transition-transform"
            >
              <X size={20} />
            </button>

            {isNew && <ConfettiBurst colors={['#E8BB62', '#C45A3C', '#A7BB82']} count={14} />}

            <div className="flex flex-col items-center text-center">
              {isNew && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 flex items-center gap-1.5 rounded-full bg-gold/25 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-forest"
                >
                  <Sparkles size={13} /> Шинэ нээлт!
                </motion.p>
              )}

              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.05 }}
                className="mb-4 flex h-36 w-52 items-center justify-center overflow-hidden rounded-3xl"
                style={{
                  backgroundColor: 'var(--color-sky-light)',
                  backgroundImage: !art && bg ? `url(${bg})` : undefined,
                  backgroundSize: '300% auto',
                  backgroundPosition: item.bgPos,
                }}
              >
                {art && <img src={art} alt="" className="max-h-full max-w-full object-contain p-1" />}
              </motion.div>

              <h2 className="font-display text-2xl font-extrabold text-forest">{item.nameMn}</h2>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70">{item.nameEn}</p>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-ink">{item.factMn}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-soft/80">{item.factEn}</p>

              {isNew && (
                <div className="mt-4">
                  <ShagaiReward count={1} />
                </div>
              )}

              {children}

              <button
                type="button"
                onClick={onClose}
                className="mt-5 w-full rounded-2xl bg-forest py-3.5 text-sm font-extrabold text-cream shadow-[var(--shadow-card)] transition-transform active:scale-[0.97]"
              >
                Үргэлжлүүлэх
              </button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
