import { useParams, Navigate, Link } from 'react-router-dom'
import { Sparkles, Gamepad2, BookOpen } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { CharacterBuddy } from '../components/CharacterBuddy'
import { getCharacter } from '../data/characters'
import { getCollection } from '../data/collections'
import { useCollectionStore, isStoryUnlocked } from '../store/useCollectionStore'
import { ShareButton } from '../components/ShareButton'
import type { ShareCardConfig } from '../lib/shareCard'

export function CharacterDetailScreen() {
  const { id } = useParams()
  const unlockedIds = useCollectionStore((s) => s.unlockedCharacterIds)
  const character = id ? getCharacter(id) : undefined

  if (!character || !unlockedIds.includes(character.id)) {
    return <Navigate to="/collection" replace />
  }

  const collection = getCollection(character.collectionId)
  const storyReady = character.storyId ? isStoryUnlocked(unlockedIds, undefined, character.id) : false

  return (
    <div>
      <ScreenHeader titleMn={character.nameMn} titleEn={character.nameEn} back accent={character.accent} />

      <div className="px-5">
        <div
          className="rounded-3xl py-8 flex flex-col items-center gap-2"
          style={{ background: `${character.accent}14` }}
        >
          <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ backgroundColor: `${character.accent}22` }}>
            <CharacterBuddy animal={character.animal} state="happy" size={104} lineColor={character.accent} />
          </div>
          <h2 className="font-display font-extrabold text-2xl mt-2" style={{ color: character.accent }}>
            {character.nameMn}
          </h2>
          <p className="text-xs text-ink-soft/50">{character.nameEn}</p>
          <p className="text-xs font-medium text-ink-soft/60">{character.taglineMn}</p>
          {collection && (
            <div className="flex items-center gap-2 mt-2 text-[11px] font-bold uppercase tracking-wide text-ink-soft/60">
              <span>{collection.nameMn}</span>
              <span>·</span>
              <span>#{String(character.number).padStart(2, '0')}</span>
            </div>
          )}
        </div>

        <div className="mt-5">
          <p className="font-display font-extrabold text-sm text-forest uppercase tracking-wide">НЭЭ</p>
          <p className="text-sm leading-relaxed mt-2 text-ink-soft font-medium">{character.storyMn}</p>
          <p className="text-xs leading-relaxed mt-2 text-ink-soft/45">{character.story}</p>
        </div>

        <div className="mt-5 rounded-2xl bg-gold/15 p-4 flex gap-3">
          <Sparkles size={18} className="text-gold shrink-0 mt-0.5" />
          <div>
            <p className="font-display font-extrabold text-xs uppercase tracking-wide text-ink">МЭДСЭН ҮҮ?</p>
            <p className="text-sm text-ink-soft mt-1 leading-relaxed font-medium">{character.factMn}</p>
            <p className="text-xs text-ink-soft/45 mt-1 leading-relaxed">{character.fact}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 mb-6">
          {character.gameId && (
            <Link
              to={`/play/${character.gameId}`}
              className="flex items-center justify-center gap-2 rounded-2xl py-3.5 font-display font-extrabold text-sm text-cream shadow-[var(--shadow-card)] active:scale-[0.98] transition-transform"
              style={{ backgroundColor: character.accent }}
            >
              <Gamepad2 size={18} />
              {character.nameMn}-тэй тоглох
            </Link>
          )}
          {character.storyId && storyReady && (
            <Link
              to={`/stories/${character.storyId}`}
              className="flex items-center justify-center gap-2 rounded-2xl py-3.5 font-display font-extrabold text-sm border-2 border-forest/15 text-forest active:scale-[0.98] transition-transform"
            >
              <BookOpen size={18} />
              Үлгэр унших
            </Link>
          )}
          <ShareButton
            accent={character.accent}
            config={
              {
                kind: 'discovery',
                accent: character.accent,
                animal: character.animal,
                badgeMn: 'Миний Цуглуулга',
                titleMn: character.nameMn,
                titleEn: character.nameEn,
                metaMn: collection?.nameMn,
              } satisfies ShareCardConfig
            }
          />
        </div>
      </div>
    </div>
  )
}
