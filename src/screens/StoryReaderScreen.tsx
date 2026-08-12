import { useState } from 'react'
import { useParams, Navigate, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Volume2, ChevronRight, BookOpen, Gamepad2 } from 'lucide-react'
import { getStory } from '../data/stories'
import { getCharacter } from '../data/characters'
import { AnimalIcon } from '../components/AnimalIcon'
import { useCollectionStore, isStoryUnlocked } from '../store/useCollectionStore'
import { ShareButton } from '../components/ShareButton'
import type { ShareCardConfig } from '../lib/shareCard'

export function StoryReaderScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const unlockedIds = useCollectionStore((s) => s.unlockedCharacterIds)
  const completeStory = useCollectionStore((s) => s.completeStory)

  const story = id ? getStory(id) : undefined
  const [page, setPage] = useState(0)
  const [finished, setFinished] = useState(false)
  const [narrating, setNarrating] = useState(false)

  if (!story || !isStoryUnlocked(unlockedIds, story.requiredCollectionId, story.characterId)) {
    return <Navigate to="/stories" replace />
  }

  const character = story.characterId ? getCharacter(story.characterId) : undefined
  const isLast = page === story.pages.length - 1

  function next() {
    if (!story) return
    if (isLast) {
      completeStory(story.id)
      setFinished(true)
    } else {
      setPage((p) => p + 1)
      setNarrating(false)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: `${story.accent}0d` }}>
      <div className="flex items-center justify-between px-5 pt-6">
        <p className="text-xs font-bold text-ink-soft/50">{finished ? '' : `${page + 1} / ${story.pages.length}`}</p>
        <button onClick={() => navigate('/stories')} className="w-9 h-9 rounded-full bg-paper border border-forest/10 flex items-center justify-center">
          <X size={18} />
        </button>
      </div>

      {!finished && (
        <>
          <div className="px-5 mt-1">
            <div className="flex gap-1.5">
              {story.pages.map((_, i) => (
                <div key={i} className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: i <= page ? story.accent : `${story.accent}25` }} />
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
                className="w-full flex flex-col items-center text-center gap-5"
              >
                <div className="w-40 h-40 rounded-3xl flex items-center justify-center" style={{ backgroundColor: `${story.accent}18` }}>
                  {character ? (
                    <AnimalIcon animal={character.animal} className="w-28 h-28" lineColor={story.accent} bodyColor="#FFFEFA" />
                  ) : (
                    <BookOpen size={64} style={{ color: story.accent }} />
                  )}
                </div>
                <div>
                  <h2 className="font-display font-extrabold text-lg" style={{ color: story.accent }}>{story.titleMn}</h2>
                  <p className="text-xs text-ink-soft/45 mt-0.5">{story.titleEn}</p>
                </div>
                <p className="text-sm leading-relaxed text-ink-soft">{story.pages[page].text}</p>
                {story.pages[page].caption && <p className="text-[11px] uppercase tracking-wide text-ink-soft/40 font-bold">{story.pages[page].caption}</p>}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="px-5 pb-8 flex items-center gap-3">
            <button
              onClick={() => setNarrating((n) => !n)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 shrink-0 transition-colors ${
                narrating ? 'text-cream' : 'border-forest/15 text-forest'
              }`}
              style={narrating ? { backgroundColor: story.accent, borderColor: story.accent } : {}}
            >
              <Volume2 size={20} />
            </button>
            <button
              onClick={next}
              className="flex-1 rounded-2xl py-4 font-display font-extrabold text-cream flex items-center justify-center gap-1.5 shadow-[var(--shadow-pop)] active:scale-[0.98] transition-transform"
              style={{ backgroundColor: story.accent }}
            >
              {isLast ? 'Үлгэрээ дуусга' : 'Дараах'} <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}

      {finished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-3"
        >
          <p className="text-4xl">📖</p>
          <h2 className="font-display font-extrabold text-2xl text-forest">Үлгэр Дууслаа!</h2>
          <p className="text-sm font-medium text-ink-soft/70">"{story.titleMn}" үлгэрийг дуусгалаа.</p>
          {story.id === 'story-erkhii-mergen' && (
            <div className="mt-2 rounded-2xl bg-paper border border-gold/40 px-5 py-4 flex items-center gap-3">
              <Gamepad2 size={22} className="text-terracotta" />
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft/50">НЭЭГДЛЭЭ</p>
                <p className="font-display font-extrabold text-sm text-forest">Сур Харваа Тоглоом</p>
              </div>
            </div>
          )}
          <div className="w-full mt-4">
            <ShareButton
              variant="solid"
              accent={story.accent}
              label="Үлгэрээ Хуваалц"
              className="w-full"
              config={
                {
                  kind: 'story-unlocked',
                  accent: story.accent,
                  animal: character?.animal,
                  badgeMn: 'Үлгэр дууслаа',
                  titleMn: story.titleMn,
                  titleEn: story.titleEn,
                } satisfies ShareCardConfig
              }
            />
          </div>
          <div className="flex gap-3 w-full mt-3">
            <Link to="/stories" className="flex-1 rounded-2xl py-3.5 font-display font-extrabold text-sm border-2 border-forest/15 text-forest text-center">
              Үлгэр рүү буцах
            </Link>
            <Link to="/" className="flex-1 rounded-2xl py-3.5 font-display font-extrabold text-sm text-cream text-center" style={{ backgroundColor: story.accent }}>
              Нүүр
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}
