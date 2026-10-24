import { Link } from 'react-router-dom'
import { Sparkles, ChevronRight, Search, Star } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { MiniGameCard } from '../components/MiniGameCard'
import { GAMES } from '../data/games'
import { SEEK_SCENES } from '../data/seek'
import { getIllustration } from '../lib/illustrations'
import { useCollectionStore, isGameUnlocked } from '../store/useCollectionStore'

export function PlayScreen() {
  const unlockedIds = useCollectionStore((s) => s.unlockedCharacterIds)
  const completedGameIds = useCollectionStore((s) => s.completedGameIds)
  const seekStars = useCollectionStore((s) => s.seekStars)
  const seekEarned = SEEK_SCENES.reduce((n, sc) => n + (seekStars[sc.id] ?? 0), 0)
  const seekArt = getIllustration('seek-gobi')

  const unlocked = GAMES.filter((g) => isGameUnlocked(g.id, unlockedIds))
  const locked = GAMES.filter((g) => !isGameUnlocked(g.id, unlockedIds))

  return (
    <div>
      <ScreenHeader titleMn="Тоглоом" titleEn="Play" />
      <div className="px-5 flex flex-col gap-5">
        <section>
          <Link
            to="/seek"
            className="flex items-center gap-3 overflow-hidden rounded-2xl bg-forest p-3 pr-4 text-cream shadow-[var(--shadow-card)] transition-transform active:scale-[0.98]"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
              {seekArt && <img src={seekArt} alt="" className="h-full w-full object-cover" style={{ objectPosition: '55% 60%' }} />}
              <span className="absolute inset-0 flex items-center justify-center bg-forest-dark/30">
                <Search size={24} className="text-gold-light" />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-extrabold">Хайж ол</p>
              <p className="text-[10.5px] font-semibold uppercase tracking-wide text-cream/60">Seek &amp; Find</p>
              <p className="mt-0.5! text-[11px] text-cream/85">{SEEK_SCENES.length} зураг · зургаар, нэрээр, оньсогоор</p>
            </div>
            <span className="flex shrink-0 items-center gap-1 font-display text-sm font-extrabold text-gold">
              <Star size={15} className="fill-gold" /> {seekEarned}/{SEEK_SCENES.length * 3}
            </span>
            <ChevronRight size={18} className="shrink-0 text-cream/50" />
          </Link>
        </section>

        <section>
          <Link
            to="/play/quiz"
            className="flex items-center gap-3 rounded-2xl p-4 border border-gold/30 bg-gradient-to-br from-gold/20 to-terracotta/10 active:scale-[0.98] transition-transform"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-gold/25">
              <Sparkles size={26} className="text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-extrabold text-sm text-ink">Амьтан Таних</p>
              <p className="text-[10.5px] text-ink-soft/45">Animal Quiz</p>
              <p className="text-[11px] text-ink-soft/60 mt-0.5">Хэзээ ч тоглоход бэлэн</p>
            </div>
            <ChevronRight size={18} className="text-ink-soft/40" />
          </Link>
        </section>

        {unlocked.length > 0 && (
          <section>
            <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft/50 mb-2">Тоглоход бэлэн</p>
            <div className="flex flex-col gap-2.5">
              {unlocked.map((g) => (
                <MiniGameCard key={g.id} game={g} unlocked completed={completedGameIds.includes(g.id)} />
              ))}
            </div>
          </section>
        )}

        {locked.length > 0 && (
          <section>
            <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft/50 mb-2">Удахгүй</p>
            <div className="flex flex-col gap-2.5">
              {locked.map((g) => (
                <MiniGameCard key={g.id} game={g} unlocked={false} completed={false} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
