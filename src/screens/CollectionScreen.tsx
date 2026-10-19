import { Link } from 'react-router-dom'
import { ScanLine, Sparkles } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { CollectibleCard } from '../components/CollectibleCard'
import { CharacterArt } from '../components/CharacterArt'
import { useCollectionStore, collectionProgress } from '../store/useCollectionStore'
import { COLLECTIONS } from '../data/collections'
import { CHARACTERS } from '../data/characters'

/** MY COLLECTION — a personal treasure gallery, not a grid of boxes. */
export function CollectionScreen() {
  const unlockedIds = useCollectionStore((s) => s.unlockedCharacterIds)

  const main = COLLECTIONS.find((c) => c.id === 'five-treasures')
  const special = COLLECTIONS.find((c) => c.id === 'sheep-2027')
  const mainCharacters = (main?.characterIds ?? [])
    .map((id) => CHARACTERS.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
  const specialCharacter = special ? CHARACTERS.find((c) => c.id === special.characterIds[0]) : undefined
  const mainProgress = main ? collectionProgress(main.id, unlockedIds) : { collected: 0, total: 0 }
  const complete = mainProgress.total > 0 && mainProgress.collected === mainProgress.total

  return (
    <div className="pb-4">
      <ScreenHeader titleMn="Миний цуглуулга" titleEn="My Collection" />

      <div className="px-5">
        {/* the treasure shelf: five places, filled as you discover them */}
        <section
          aria-label={`Таван хошуу мал: ${mainProgress.collected} / ${mainProgress.total}`}
          className="rounded-[26px] bg-forest px-5 pb-5 pt-4 text-cream shadow-[var(--shadow-pop)]"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-gold-light">Үндсэн цуглуулга</p>
              <h2 className="font-display text-xl font-extrabold tracking-wide">{main?.nameMn}</h2>
            </div>
            <p className="font-display text-3xl font-extrabold leading-none text-gold">
              {mainProgress.collected}
              <span className="text-lg text-cream/60">/{mainProgress.total}</span>
            </p>
          </div>

          <ol className="mt-4 flex items-center justify-between gap-2">
            {mainCharacters.map((c) => {
              const has = unlockedIds.includes(c.id)
              return (
                <li key={c.id} className="flex flex-1 flex-col items-center gap-1.5">
                  <span
                    className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full ring-2 sm:h-16 sm:w-16 max-[400px]:h-12 max-[400px]:w-12"
                    style={{
                      background: has ? 'rgba(250,248,241,0.95)' : 'rgba(250,248,241,0.12)',
                      boxShadow: has ? '0 0 0 2px #E8BB62' : undefined,
                    }}
                  >
                    <span className="block h-[78%] w-[78%]" style={has ? undefined : { filter: 'grayscale(1) brightness(1.7)', opacity: 0.35 }}>
                      <CharacterArt animal={c.animal} className="h-full w-full" />
                    </span>
                  </span>
                  <span className={`text-[10px] font-bold tracking-wide ${has ? 'text-cream' : 'text-cream/45'}`}>{has ? c.nameMn : '???'}</span>
                </li>
              )
            })}
          </ol>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-cream/15">
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-700"
              style={{ width: `${mainProgress.total ? (mainProgress.collected / mainProgress.total) * 100 : 0}%` }}
            />
          </div>
        </section>

        {/* gallery */}
        <h2 className="mb-3 mt-7 font-display text-sm font-extrabold uppercase tracking-[0.14em] text-ink-soft">Бүх дүрүүд</h2>
        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 [&>*:nth-child(even)]:mt-7 md:[&>*:nth-child(even)]:mt-0 md:[&>*:nth-child(3n+2)]:mt-7">
          {mainCharacters.map((c, i) => (
            <CollectibleCard key={c.id} character={c} unlocked={unlockedIds.includes(c.id)} index={i} />
          ))}
        </div>

        {/* the annual special edition, shown on its own */}
        {special && specialCharacter && (
          <section className="mt-9" aria-label={special.nameMn}>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-gold" />
              <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.14em] text-ink-soft">{special.nameMn}</h2>
            </div>
            <CollectibleCard character={specialCharacter} unlocked={unlockedIds.includes(specialCharacter.id)} index={mainCharacters.length} featured />
            <p className="mt-2.5 px-1 text-xs font-medium leading-snug text-ink-soft">{special.subtitle}. Энэ жилийн онцгой дүр тусдаа цуглуулагддаг.</p>
          </section>
        )}

        {complete ? (
          <p className="mt-8 rounded-2xl bg-gold/20 px-4 py-3 text-center text-sm font-extrabold text-forest">Та таван эрдэнийг бүгдийг нь цуглууллаа!</p>
        ) : (
          <Link
            to="/scan"
            className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-3.5 text-sm font-extrabold text-forest-dark shadow-[var(--shadow-card)] transition-transform active:scale-[0.97]"
          >
            <ScanLine size={18} /> Хайрцгийн кодоор шинэ дүр нээх
          </Link>
        )}

        <p className="mt-6 text-center text-[11px] font-medium text-ink-soft">Удахгүй: жил бүр шинэ амьтан нэмэгдэнэ.</p>
      </div>
    </div>
  )
}
