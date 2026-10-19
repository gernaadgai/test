import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Compass, UserRound, BookOpen, Sparkles, ShoppingBag, Volume2, VolumeX } from 'lucide-react'
import { WorldScene } from '../components/WorldScene'
import { DiscoverySheet } from '../components/DiscoverySheet'
import { WORLD_DISCOVERIES, type Discovery } from '../data/discoveries'
import { useCollectionStore } from '../store/useCollectionStore'
import { useSettingsStore } from '../store/useSettingsStore'
import { sound } from '../lib/sound'

const MENU: Array<{ to: string; label: string; sub: string; icon: typeof UserRound }> = [
  { to: '/profile', label: 'Миний профайл', sub: 'Profile & badges', icon: UserRound },
  { to: '/stories', label: 'Үлгэр', sub: 'Stories', icon: BookOpen },
  { to: '/journey', label: '12 жилийн аялал', sub: '12-Year Journey', icon: Sparkles },
  { to: '/market', label: 'Дэлгүүр', sub: 'Market', icon: ShoppingBag },
]

/** The home screen IS the world: a living Mongolian landscape with the ger as its door. */
export function HomeScreen() {
  const navigate = useNavigate()
  const discoveredIds = useCollectionStore((s) => s.discoveredIds)
  const discover = useCollectionStore((s) => s.discover)
  const soundEnabled = useSettingsStore((s) => s.soundEnabled)
  const toggleSound = useSettingsStore((s) => s.toggleSound)

  const [sheet, setSheet] = useState<{ item: Discovery; isNew: boolean } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [entering, setEntering] = useState(false)
  const timer = useRef<number>(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const worldFound = WORLD_DISCOVERIES.filter((d) => discoveredIds.includes(d.id)).length

  const onSelect = useCallback(
    (id: string) => {
      const item = WORLD_DISCOVERIES.find((d) => d.id === id)
      if (!item || entering) return
      const { isNew } = discover(id)
      if (isNew) sound.unlock()
      else sound.tap()
      setSheet({ item, isNew })
    },
    [discover, entering],
  )

  const enterGer = useCallback(() => {
    if (entering) return
    setEntering(true)
    sound.pop()
    timer.current = window.setTimeout(() => navigate('/ger'), 780)
  }, [entering, navigate])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-cream">
      <WorldScene discoveredIds={discoveredIds} onSelect={onSelect} onEnterGer={enterGer} entering={entering} />

      {/* HUD — never covers the ger or the animals */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-8 md:pt-6">
        <div className="rounded-2xl bg-paper/80 px-3.5 py-2 shadow-[var(--shadow-soft)] backdrop-blur-sm">
          <p className="font-display text-base font-extrabold leading-tight tracking-wide text-forest md:text-lg">ГЭР НААДГАЙ</p>
          <p className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft sm:block md:text-xs">Монголын наадгайгаар аялцгаая</p>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <span
            className="flex h-11 items-center gap-1.5 rounded-full bg-paper/85 px-3 text-xs font-extrabold text-forest shadow-[var(--shadow-soft)] backdrop-blur-sm"
            aria-label={`Нээлт ${worldFound} / ${WORLD_DISCOVERIES.length}`}
          >
            <Compass size={16} /> {worldFound}/{WORLD_DISCOVERIES.length}
          </span>
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Дууг хаах / Mute' : 'Дууг асаах / Unmute'}
            aria-pressed={!soundEnabled}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-paper/85 text-forest shadow-[var(--shadow-soft)] backdrop-blur-sm transition-transform active:scale-95"
          >
            {soundEnabled ? <Volume2 size={19} /> : <VolumeX size={19} />}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Цэс / Menu"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-paper/85 text-forest shadow-[var(--shadow-soft)] backdrop-blur-sm transition-transform active:scale-95"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* the clear invitation — the ger itself is also a button */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-20 flex flex-col items-center gap-2 px-4 md:bottom-28">
        {worldFound === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="rounded-full bg-paper/85 px-3.5 py-1.5 text-[11px] font-bold text-forest shadow-[var(--shadow-soft)] backdrop-blur-sm"
          >
            Алтан одтой зүйлсийг товшоод нээгээрэй
          </motion.p>
        )}
        <motion.button
          type="button"
          onClick={enterGer}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-gold px-7 py-3.5 text-sm font-extrabold text-forest-dark shadow-[var(--shadow-pop)] md:text-base"
        >
          НААДЪЯ <span aria-hidden>→</span>
        </motion.button>
      </div>

      {/* cream wash that carries the child through the door */}
      <AnimatePresence>
        {entering && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-30 bg-cream"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25, ease: 'easeIn' }}
          />
        )}
      </AnimatePresence>

      <DiscoverySheet item={sheet?.item ?? null} isNew={sheet?.isNew ?? false} onClose={() => setSheet(null)} />

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="fixed inset-0 z-[60] flex items-start justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" aria-label="Хаах / Close" onClick={() => setMenuOpen(false)} className="absolute inset-0 cursor-default bg-forest-dark/40 backdrop-blur-[2px]" />
            <motion.nav
              aria-label="Цэс"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              className="relative m-4 w-[min(320px,calc(100%-2rem))] rounded-3xl bg-paper p-3 shadow-[var(--shadow-pop)]"
            >
              <div className="flex items-center justify-between px-3 pb-2 pt-1">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft">Цэс</p>
                <button type="button" onClick={() => setMenuOpen(false)} aria-label="Хаах / Close" className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-forest">
                  <X size={20} />
                </button>
              </div>
              <ul className="flex flex-col">
                {MENU.map(({ to, label, sub, icon: Icon }) => (
                  <li key={to}>
                    <Link to={to} onClick={() => sound.tap()} className="flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-cream active:bg-cream-dark/60">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cream text-forest">
                        <Icon size={20} />
                      </span>
                      <span>
                        <span className="block text-sm font-extrabold text-ink">{label}</span>
                        <span className="block text-[11px] font-medium text-ink-soft">{sub}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
