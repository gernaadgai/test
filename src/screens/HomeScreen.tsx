import { Link } from 'react-router-dom'
import { ScanLine, ChevronRight, UserRound, ShoppingBag } from 'lucide-react'
import { GerScene } from '../components/GerScene'
import { ProgressRing } from '../components/ProgressRing'
import { useCollectionStore, collectionProgress, totalCollectibles } from '../store/useCollectionStore'
import { CHARACTERS } from '../data/characters'
import { getCurrentZodiacYear } from '../data/zodiac'
import { useTranslate } from '../i18n/useTranslate'

export function HomeScreen() {
  const t = useTranslate()
  const unlockedIds = useCollectionStore((s) => s.unlockedCharacterIds)
  const completedStories = useCollectionStore((s) => s.completedStoryIds)
  const avatar = useCollectionStore((s) => s.avatar)
  const collectorName = useCollectionStore((s) => s.collectorName)

  const companions = unlockedIds
    .map((id) => CHARACTERS.find((c) => c.id === id)?.animal)
    .filter((a): a is NonNullable<typeof a> => Boolean(a))

  const five = collectionProgress('five-treasures', unlockedIds)
  const year = getCurrentZodiacYear()
  const total = totalCollectibles()

  return (
    <div>
      <div className="flex items-center justify-between px-5 pt-6">
        <div>
          <p className="font-display font-extrabold text-lg tracking-wide text-forest">GER NAADGAI</p>
          <p className="text-[11px] uppercase tracking-[0.14em] text-ink-soft/60 font-semibold">{t('home_world')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/market"
            className="w-11 h-11 rounded-full bg-paper border border-forest/10 shadow-sm flex items-center justify-center"
          >
            <ShoppingBag size={18} className="text-forest" />
          </Link>
          <Link
            to="/profile"
            className="w-11 h-11 rounded-full bg-paper border border-forest/10 shadow-sm flex items-center justify-center text-xl"
          >
            {avatar || <UserRound size={20} />}
          </Link>
        </div>
      </div>

      <div className="px-5 mt-4">
        <GerScene companions={companions} hasStories={completedStories.length > 0} hasZodiac={unlockedIds.includes('sheep-2027')} />
      </div>

      <div className="px-5 mt-4">
        <p className="text-sm font-medium text-ink-soft/80">
          {t('home_welcome')}, <span className="font-bold text-ink">{collectorName}</span> — {unlockedIds.length}/{total} {t('home_collected_so_far')}.
        </p>
      </div>

      {/* current year card */}
      <div className="px-5 mt-4">
        <Link
          to="/journey"
          className="block rounded-3xl p-5 relative overflow-hidden shadow-[var(--shadow-pop)]"
          style={{ background: 'linear-gradient(135deg,#C97056,#A94B35)' }}
        >
          <div className="relative z-10 text-cream">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] opacity-80">{year.year} · Хязгаарлагдмал</p>
            <h2 className="font-display font-extrabold text-2xl mt-1">{year.animalMn} ЖИЛ</h2>
            <p className="text-xs mt-0.5 opacity-75">Year of the {year.animalEn}</p>
            <p className="text-sm mt-3 opacity-95 font-medium">{t('home_journey_begins')}</p>
            <div className="inline-flex items-center gap-1 mt-4 text-xs font-bold bg-cream/20 rounded-full px-3 py-1.5">
              {t('home_view_journey')} <ChevronRight size={14} />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 text-[110px] opacity-20 select-none">🐑</div>
        </Link>
      </div>

      {/* five treasures progress */}
      <div className="px-5 mt-4">
        <Link to="/collection" className="flex items-center gap-4 rounded-3xl bg-paper border border-forest/10 shadow-[var(--shadow-card)] p-4">
          <ProgressRing progress={five.collected / five.total} color="#4C7A3A">
            <span className="font-display font-extrabold text-sm text-forest">
              {five.collected}/{five.total}
            </span>
          </ProgressRing>
          <div className="flex-1 min-w-0">
            <p className="font-display font-extrabold text-sm text-forest">ТАВАН ХОШУУ МАЛ</p>
            <p className="text-[11px] text-ink-soft/45">Five Treasures</p>
            <p className="text-xs text-ink-soft/60 mt-0.5 font-medium">{five.collected}/{five.total} цугласан</p>
          </div>
          <ChevronRight size={18} className="text-ink-soft/40" />
        </Link>
      </div>

      {/* CTA */}
      <div className="px-5 mt-5 mb-2">
        <Link
          to="/scan"
          className="flex items-center justify-center gap-2 w-full rounded-2xl bg-forest text-cream font-display font-extrabold text-base py-4 shadow-[var(--shadow-pop)] active:scale-[0.98] transition-transform"
        >
          <ScanLine size={20} />
          {t('home_continue')}
        </Link>
        <p className="text-center text-[11px] text-ink-soft/50 mt-2">{t('home_footer_note')}</p>
      </div>
    </div>
  )
}
