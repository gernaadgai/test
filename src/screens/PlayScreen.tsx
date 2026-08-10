import { ScreenHeader } from '../components/ScreenHeader'
import { MiniGameCard } from '../components/MiniGameCard'
import { GAMES } from '../data/games'
import { useCollectionStore, isGameUnlocked } from '../store/useCollectionStore'

export function PlayScreen() {
  const unlockedIds = useCollectionStore((s) => s.unlockedCharacterIds)
  const completedGameIds = useCollectionStore((s) => s.completedGameIds)

  const unlocked = GAMES.filter((g) => isGameUnlocked(g.id, unlockedIds))
  const locked = GAMES.filter((g) => !isGameUnlocked(g.id, unlockedIds))

  return (
    <div>
      <ScreenHeader titleMn="Тоглоом" titleEn="Play" />
      <div className="px-5 flex flex-col gap-5">
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
