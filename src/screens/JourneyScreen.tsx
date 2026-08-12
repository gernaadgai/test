import { Link } from 'react-router-dom'
import { Lock, Sparkles } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { AnimalIcon } from '../components/AnimalIcon'
import { SceneBackdrop } from '../components/SceneBackdrop'
import { ZODIAC_CYCLE } from '../data/zodiac'
import { useCollectionStore } from '../store/useCollectionStore'
import { ShareButton } from '../components/ShareButton'
import type { ShareCardConfig } from '../lib/shareCard'

export function JourneyScreen() {
  const unlockedIds = useCollectionStore((s) => s.unlockedCharacterIds)
  const journeyProgress = ZODIAC_CYCLE.filter((z) => z.characterId && unlockedIds.includes(z.characterId)).length

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-64 overflow-hidden opacity-70">
        <SceneBackdrop />
      </div>

      <div className="relative z-10">
        <ScreenHeader titleMn="12 Жилийн Аялал" titleEn="12-Year Journey" />

        <div className="px-5 mb-5">
          <div className="rounded-3xl p-5 bg-forest text-cream text-center">
            <Sparkles size={22} className="mx-auto mb-1.5 text-gold" />
            <p className="font-display font-extrabold text-base">Аялал чинь эндээс эхэллээ.</p>
            <p className="text-xs opacity-75 mt-1">12 жил. 12 амьтан. Нэг Монгол түүх.</p>
          </div>
        </div>
      </div>

      <div className="px-5 relative">
        <div className="absolute left-[35px] top-2 bottom-2 w-0.5 bg-forest/15" />
        <ul className="flex flex-col gap-5">
          {ZODIAC_CYCLE.map((z) => {
            const isActive = z.status === 'active'
            const isCollected = Boolean(z.characterId && unlockedIds.includes(z.characterId))
            const canOpen = isActive

            const node = (
              <div className="flex items-center gap-4 relative">
                <div
                  className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 border-4 z-10 ${
                    isActive ? 'border-terracotta bg-paper' : isCollected ? 'border-forest bg-paper' : 'border-cream-dark bg-cream-dark/60'
                  }`}
                >
                  {isActive || isCollected ? (
                    <AnimalIcon animal={z.animal} className="w-8 h-8" lineColor={isActive ? '#B85C45' : '#5C7C3E'} bodyColor="#FFF9ED" />
                  ) : (
                    <Lock size={18} className="text-ink-soft/30" />
                  )}
                </div>
                <div
                  className={`flex-1 rounded-2xl p-3.5 border ${
                    isActive ? 'bg-terracotta/10 border-terracotta/30' : 'bg-paper border-forest/10'
                  } ${!isActive ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-display font-extrabold text-sm">{z.year}</p>
                    {isActive && (
                      <span className="text-[9px] font-bold uppercase tracking-wide bg-terracotta text-cream px-2 py-0.5 rounded-full">Идэвхтэй</span>
                    )}
                    {!isActive && (
                      <span className="text-[9px] font-bold uppercase tracking-wide text-ink-soft/40">Удахгүй</span>
                    )}
                  </div>
                  <p className="font-display font-extrabold text-sm mt-0.5" style={{ color: isActive ? '#B85C45' : undefined }}>
                    {isActive || isCollected ? z.animalMn : '???'}
                  </p>
                  <p className="text-[10.5px] text-ink-soft/40">{isActive || isCollected ? z.animalEn : ''}</p>
                </div>
              </div>
            )

            return (
              <li key={z.year}>
                {canOpen ? <Link to="/collection">{node}</Link> : node}
              </li>
            )
          })}
        </ul>
      </div>

      <div className="px-5 mt-6 mb-6">
        <ShareButton
          variant="outline"
          accent="#5C7C3E"
          label="Аяллаа Хуваалц"
          config={
            {
              kind: 'journey',
              accent: '#5C7C3E',
              animal: 'sheep',
              badgeMn: 'Миний Аялал',
              titleMn: `${journeyProgress} / 12 ЖИЛ`,
              titleEn: `${journeyProgress} / 12 Years`,
              metaMn: '12 жилийн аяллын нэг хэсэг',
            } satisfies ShareCardConfig
          }
          className="w-full"
        />
      </div>
    </div>
  )
}
