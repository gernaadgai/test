import { useState } from 'react'
import { Repeat, Coins } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { AnimalIcon } from '../components/AnimalIcon'
import { CHARACTERS } from '../data/characters'
import { useCollectionStore } from '../store/useCollectionStore'
import { sound } from '../lib/sound'

export function ExchangeScreen() {
  const duplicates = useCollectionStore((s) => s.duplicates)
  const exchangeDuplicate = useCollectionStore((s) => s.exchangeDuplicate)
  const [justExchanged, setJustExchanged] = useState<string | null>(null)

  const entries = Object.entries(duplicates).filter(([, count]) => count > 0)

  function handleExchange(characterId: string) {
    exchangeDuplicate(characterId)
    sound.success()
    setJustExchanged(characterId)
    setTimeout(() => setJustExchanged(null), 1200)
  }

  return (
    <div>
      <ScreenHeader titleMn="Халтаас Солилцох" titleEn="Exchange Duplicates" back />

      <div className="px-5">
        <p className="text-sm font-medium text-ink-soft/70 mb-1">
          Заримдаа хайрцагт чиний өмнө нь авсан амьтан гарч болно. Халтаасаа NAADGAI онооноор солиорой — тоглогч хоорондын арилжаа одоохондоо байхгүй.
        </p>
        <p className="text-xs text-ink-soft/40 mb-4">Exchange spares for NAADGAI points — no trading with other players yet.</p>

        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-forest/20 p-8 text-center">
            <p className="text-sm text-ink-soft/50">Одоохондоо халтаас алга. Скандаж үргэлжлүүл!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {entries.map(([characterId, count]) => {
              const character = CHARACTERS.find((c) => c.id === characterId)
              if (!character) return null
              return (
                <div key={characterId} className="rounded-2xl bg-paper border border-forest/10 p-4 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${character.accent}18` }}>
                    <AnimalIcon animal={character.animal} className="w-9 h-9" lineColor={character.accent} bodyColor="#FFFEFA" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-extrabold text-sm">{character.nameMn}</p>
                    <p className="text-xs text-ink-soft/50">{count} халтаас</p>
                  </div>
                  <button
                    onClick={() => handleExchange(characterId)}
                    className="shrink-0 flex items-center gap-1.5 rounded-full bg-forest text-cream text-xs font-bold px-3 py-2 active:scale-[0.95] transition-transform"
                  >
                    {justExchanged === characterId ? (
                      <>
                        <Coins size={13} /> +40
                      </>
                    ) : (
                      <>
                        <Repeat size={13} /> Солих
                      </>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <div className="rounded-2xl bg-sky/10 p-4 text-center mb-6">
          <p className="text-xs font-medium text-ink-soft/70">Бүх солилцоо платформоор хянагдана. Ирээдүйд эцэг эхийн зөвшөөрөл болон бусад цуглуулгатай арилжих боломж нэмэгдэнэ.</p>
        </div>
      </div>
    </div>
  )
}
