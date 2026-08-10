import { ScreenHeader } from '../components/ScreenHeader'
import { CollectibleCard } from '../components/CollectibleCard'
import { ProgressRing } from '../components/ProgressRing'
import { useCollectionStore, collectionProgress } from '../store/useCollectionStore'
import { COLLECTIONS } from '../data/collections'
import { CHARACTERS } from '../data/characters'

export function CollectionScreen() {
  const unlockedIds = useCollectionStore((s) => s.unlockedCharacterIds)

  return (
    <div>
      <ScreenHeader titleMn="Миний Цуглуулга" titleEn="My Collection" />

      <div className="px-5 flex flex-col gap-8">
        {COLLECTIONS.map((collection) => {
          const progress = collectionProgress(collection.id, unlockedIds)
          const characters = collection.characterIds
            .map((id) => CHARACTERS.find((c) => c.id === id))
            .filter((c): c is NonNullable<typeof c> => Boolean(c))

          return (
            <section key={collection.id}>
              <div
                className="rounded-3xl p-4 mb-3 flex items-center gap-4"
                style={{ background: `${collection.accent}14` }}
              >
                <ProgressRing progress={progress.collected / progress.total} color={collection.accent}>
                  <span className="font-display font-extrabold text-xs" style={{ color: collection.accent }}>
                    {progress.collected}/{progress.total}
                  </span>
                </ProgressRing>
                <div className="min-w-0">
                  <p className="font-display font-extrabold text-base" style={{ color: collection.accent }}>
                    {collection.nameMn}
                  </p>
                  <p className="text-[11px] text-ink-soft/45">{collection.nameEn}</p>
                  <p className="text-[11px] text-ink-soft/60 mt-0.5">{collection.subtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {characters.map((character) => (
                  <CollectibleCard key={character.id} character={character} unlocked={unlockedIds.includes(character.id)} />
                ))}
              </div>
            </section>
          )
        })}

        <section>
          <div className="rounded-3xl p-5 border border-dashed border-forest/20 text-center">
            <p className="font-display font-extrabold text-sm text-forest/70">Удахгүй шинэ цуглуулга</p>
            <p className="text-xs text-ink-soft/50 mt-1">12 жилийн аяллын жил бүр шинэ зэрлэг цуглуулга ирнэ.</p>
          </div>
        </section>
      </div>
    </div>
  )
}
