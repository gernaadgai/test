import { Link } from 'react-router-dom'
import { Lock, BookOpen, CheckCircle2 } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { AnimalIcon } from '../components/AnimalIcon'
import { STORIES } from '../data/stories'
import { getCharacter } from '../data/characters'
import { useCollectionStore, isStoryUnlocked } from '../store/useCollectionStore'

export function StoriesScreen() {
  const unlockedIds = useCollectionStore((s) => s.unlockedCharacterIds)
  const completedStoryIds = useCollectionStore((s) => s.completedStoryIds)

  return (
    <div>
      <ScreenHeader titleMn="Үлгэр" titleEn="Stories" />
      <div className="px-5 flex flex-col gap-2.5">
        {STORIES.map((story) => {
          const unlocked = isStoryUnlocked(unlockedIds, story.requiredCollectionId, story.characterId)
          const completed = completedStoryIds.includes(story.id)
          const character = story.characterId ? getCharacter(story.characterId) : undefined

          const card = (
            <div
              className={`rounded-2xl p-4 flex items-center gap-3 border ${
                unlocked ? 'bg-paper border-forest/10 shadow-[var(--shadow-card)] active:scale-[0.98]' : 'bg-cream-dark/40 border-forest/5'
              } transition-transform`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${unlocked ? '' : 'grayscale opacity-40'}`}
                style={{ backgroundColor: unlocked ? `${story.accent}1f` : '#E7D6B7' }}
              >
                {character ? (
                  <AnimalIcon animal={character.animal} className="w-9 h-9" lineColor={story.accent} bodyColor="#FAF8F1" />
                ) : (
                  <BookOpen size={22} style={{ color: unlocked ? story.accent : undefined }} className={unlocked ? '' : 'text-ink-soft/40'} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-display font-extrabold text-sm ${unlocked ? 'text-ink' : 'text-ink-soft/40'}`}>{unlocked ? story.titleMn : 'Хаалттай үлгэр'}</p>
                {unlocked && <p className="text-[10.5px] text-ink-soft/40">{story.titleEn}</p>}
                <p className="text-[11px] text-ink-soft/50 mt-0.5">
                  {unlocked ? `${story.pages.length} хуудас` : story.requiredCollectionId ? 'Таван хошуу малаа гүйцээвэл нээгдэнэ' : 'QR код скандаж нээ'}
                </p>
              </div>
              {unlocked ? (
                completed ? <CheckCircle2 size={20} className="text-forest shrink-0" /> : <BookOpen size={18} className="text-terracotta shrink-0" />
              ) : (
                <Lock size={18} className="text-ink-soft/30 shrink-0" />
              )}
            </div>
          )

          return unlocked ? (
            <Link to={`/stories/${story.id}`} key={story.id}>{card}</Link>
          ) : (
            <div key={story.id}>{card}</div>
          )
        })}
      </div>
    </div>
  )
}
