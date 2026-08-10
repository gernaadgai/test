import { Lock } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { Landscape } from '../components/Landscape'
import { ARTWORKS } from '../data/artworks'
import { useCollectionStore, collectionProgress } from '../store/useCollectionStore'

export function GalleryScreen() {
  const unlockedIds = useCollectionStore((s) => s.unlockedCharacterIds)
  const completedStoryIds = useCollectionStore((s) => s.completedStoryIds)

  const five = collectionProgress('five-treasures', unlockedIds)
  const sheep = collectionProgress('sheep-2027', unlockedIds)
  const ctx = {
    unlockedCount: unlockedIds.length,
    fiveTreasuresComplete: five.collected === five.total,
    sheep2027Collected: sheep.collected === sheep.total,
    completedStories: completedStoryIds.length,
  }

  return (
    <div>
      <ScreenHeader titleMn="Зургийн Цуглуулга" titleEn="Collectible Art" back />
      <div className="px-5 mb-4">
        <p className="text-sm text-ink-soft/70 font-medium">Монголыг судлах тусам жинхэнэ зураг нээгдэнэ — бүгд чиний дижитал гэрт үлдэнэ.</p>
        <p className="text-xs text-ink-soft/50 mt-1">Original GER NAADGAI landscape artwork, unlocked as you explore Mongolia.</p>
      </div>

      <div className="px-5 flex flex-col gap-4 mb-6">
        {ARTWORKS.map((art) => {
          const unlocked = art.isUnlocked(ctx)
          return (
            <div key={art.id} className="rounded-3xl overflow-hidden border border-forest/10 bg-paper shadow-[var(--shadow-card)]">
              <div className={`relative aspect-[16/9] ${unlocked ? '' : 'grayscale opacity-50'}`}>
                <Landscape variant={art.variant} className="w-full h-full" />
                {!unlocked && (
                  <div className="absolute inset-0 bg-ink/20 flex items-center justify-center">
                    <Lock size={26} className="text-cream" />
                  </div>
                )}
              </div>
              <div className="p-4">
                {unlocked ? (
                  <>
                    <p className="font-display font-extrabold text-base text-forest">{art.titleMn}</p>
                    <p className="text-xs text-ink-soft/50">{art.titleEn}</p>
                  </>
                ) : (
                  <>
                    <p className="font-display font-extrabold text-base text-ink-soft/50">Хаалттай зураг</p>
                    <p className="text-xs text-ink-soft/50 mt-0.5">{art.unlockHintMn}</p>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
