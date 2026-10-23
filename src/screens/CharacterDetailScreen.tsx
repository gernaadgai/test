import { useEffect, useRef, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Sparkles, Gamepad2, BookOpen, ChevronDown, Hand } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { CharacterArt } from '../components/CharacterArt'
import { getCharacter } from '../data/characters'
import { getCollection } from '../data/collections'
import { useCollectionStore, isStoryUnlocked } from '../store/useCollectionStore'
import { ShareButton } from '../components/ShareButton'
import type { ShareCardConfig } from '../lib/shareCard'

/** Progressive disclosure: one thing open at a time, the rest a single tap away. */
function Panel({
  title,
  icon,
  open,
  onToggle,
  children,
}: {
  title: string
  icon: React.ReactNode
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-[22px] bg-paper shadow-[var(--shadow-soft)] ring-1 ring-forest/10">
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex min-h-14 w-full items-center gap-3 px-4 text-left">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-forest">{icon}</span>
        <span className="flex-1 font-display text-sm font-extrabold uppercase tracking-wide text-forest">{title}</span>
        <ChevronDown size={20} className={`text-ink-soft transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <div className="px-4 pb-4 pt-0.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export function CharacterDetailScreen() {
  const { id } = useParams()
  const reduceMotion = !!useReducedMotion()
  const unlockedIds = useCollectionStore((s) => s.unlockedCharacterIds)
  const character = id ? getCharacter(id) : undefined

  const [open, setOpen] = useState<'story' | 'fact' | null>('story')
  const [hello, setHello] = useState(false)
  const timer = useRef<number>(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  if (!character || !unlockedIds.includes(character.id)) {
    return <Navigate to="/collection" replace />
  }

  const collection = getCollection(character.collectionId)
  const storyReady = character.storyId ? isStoryUnlocked(unlockedIds, undefined, character.id) : false
  const isSpecial = character.collectionId === 'sheep-2027'
  const accent = character.accent

  const greet = () => {
    setHello(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setHello(false), 2200)
  }

  return (
    <div className="pb-6">
      <ScreenHeader titleMn={character.nameMn} titleEn={character.nameEn} back accent={accent} />

      <div className="px-5">
        {/* stage */}
        <div
          className="relative overflow-hidden rounded-[30px] px-4 pb-5 pt-4"
          style={{
            background: `radial-gradient(90% 70% at 50% 38%, ${accent}38 0%, ${accent}12 52%, var(--color-paper) 100%)`,
            boxShadow: isSpecial ? '0 0 0 2px #E8BB62, 0 18px 38px -16px rgba(232,187,98,0.7)' : 'var(--shadow-card)',
          }}
        >
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">
            <span>{collection?.nameMn}</span>
            <span className="flex items-center gap-1">
              {isSpecial && (
                <span className="flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-forest-dark">
                  <Sparkles size={11} /> 2027
                </span>
              )}
              №{String(character.number).padStart(2, '0')}
            </span>
          </div>

          <div className="relative mx-auto mt-2 h-[300px] w-full max-w-[420px]">
            <AnimatePresence>
              {hello && (
                <motion.p
                  key="bubble"
                  initial={{ opacity: 0, y: 8, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute left-1/2 top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-paper px-4 py-2 text-sm font-extrabold shadow-[var(--shadow-pop)]"
                  style={{ color: accent }}
                >
                  {character.taglineMn}
                </motion.p>
              )}
            </AnimatePresence>
            <div aria-hidden className="absolute bottom-[3%] left-1/2 h-[6%] w-[58%] -translate-x-1/2 rounded-[50%] bg-forest-dark/25 blur-[5px]" />
            <motion.div
              initial={reduceMotion ? false : { scale: 0.8, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 16 }}
              className="absolute inset-x-[4%] bottom-[5%] top-[10%]"
            >
              <CharacterArt animal={character.animal} artKey={character.id} interactive onReact={greet} className="h-full w-full" />
            </motion.div>
          </div>

          <p className="mt-1 flex items-center justify-center gap-1.5 text-[11px] font-bold text-ink-soft">
            <Hand size={13} /> Миний дээр товшиж үз
          </p>
          <h2 className="mt-2 text-center font-display text-3xl font-extrabold tracking-wide" style={{ color: accent }}>
            {character.nameMn}
          </h2>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">{character.nameEn}</p>
        </div>

        {/* details, one at a time */}
        <div className="mt-5 flex flex-col gap-3">
          <Panel title="Миний түүх" icon={<BookOpen size={17} />} open={open === 'story'} onToggle={() => setOpen(open === 'story' ? null : 'story')}>
            <p className="text-[15px] font-medium leading-relaxed text-ink">{character.storyMn}</p>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">{character.story}</p>
          </Panel>
          <Panel title="Мэдсэн үү?" icon={<Sparkles size={17} />} open={open === 'fact'} onToggle={() => setOpen(open === 'fact' ? null : 'fact')}>
            <p className="text-[15px] font-medium leading-relaxed text-ink">{character.factMn}</p>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">{character.fact}</p>
          </Panel>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {character.gameId && (
            <Link
              to={`/play/${character.gameId}`}
              className="flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-extrabold text-cream shadow-[var(--shadow-card)] transition-transform active:scale-[0.97]"
              style={{ backgroundColor: accent }}
            >
              <Gamepad2 size={18} />
              {character.nameMn}-тэй тоглох
            </Link>
          )}
          {character.storyId && storyReady && (
            <Link
              to={`/stories/${character.storyId}`}
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-forest/15 py-3.5 text-sm font-extrabold text-forest transition-transform active:scale-[0.97]"
            >
              <BookOpen size={18} />
              Үлгэр унших
            </Link>
          )}
          <ShareButton
            accent={accent}
            config={
              {
                kind: 'discovery',
                accent,
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
