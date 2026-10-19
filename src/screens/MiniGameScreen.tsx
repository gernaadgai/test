import { useEffect, useRef, useState } from 'react'
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star } from 'lucide-react'
import { getGame } from '../data/games'
import { getCharacter } from '../data/characters'
import { AnimalIcon } from '../components/AnimalIcon'
import { CharacterBuddy } from '../components/CharacterBuddy'
import { ConfettiBurst } from '../components/ConfettiBurst'
import { SceneBackdrop } from '../components/SceneBackdrop'
import { ShagaiIcon } from '../components/ShagaiIcon'
import { ShagaiReward } from '../components/ShagaiReward'
import { getBadge } from '../data/badges'
import { useCollectionStore, isGameUnlocked } from '../store/useCollectionStore'
import { sound } from '../lib/sound'

type Phase = 'ready' | 'playing' | 'result'
interface Target { id: number; x: number; y: number }

export function MiniGameScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const unlockedIds = useCollectionStore((s) => s.unlockedCharacterIds)
  const completeGame = useCollectionStore((s) => s.completeGame)

  const game = id ? getGame(id) : undefined
  const unlocked = game ? isGameUnlocked(game.id, unlockedIds) : false
  const character = game ? getCharacter(game.characterId) : undefined

  const [phase, setPhase] = useState<Phase>('ready')
  const [timeLeft, setTimeLeft] = useState(game?.timeLimit ?? 0)
  const [hits, setHits] = useState(0)
  const [targets, setTargets] = useState<Target[]>([])
  const [newBadges, setNewBadges] = useState<string[]>([])
  const nextId = useRef(0)
  const spawnRef = useRef<number | null>(null)
  const timerRef = useRef<number | null>(null)

  function start() {
    if (!game) return
    setPhase('playing')
    setTimeLeft(game.timeLimit)
    setHits(0)
    setTargets([])

    spawnRef.current = window.setInterval(() => {
      const id = nextId.current++
      const x = 12 + Math.random() * 70
      const y = 12 + Math.random() * 62
      setTargets((t) => [...t, { id, x, y }])
      window.setTimeout(() => setTargets((t) => t.filter((tg) => tg.id !== id)), 1000)
    }, 800)

    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (spawnRef.current) clearInterval(spawnRef.current)
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  useEffect(() => {
    if (game && phase === 'playing' && timeLeft === 0) {
      const result = completeGame(game.id)
      setNewBadges(result.newBadges)
      setPhase('result')
      sound.success()
    }
  }, [timeLeft, phase, completeGame, game])

  useEffect(() => {
    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  if (!game || !unlocked) {
    return <Navigate to="/play" replace />
  }

  function hitTarget(targetId: number) {
    setTargets((t) => t.filter((tg) => tg.id !== targetId))
    setHits((h) => h + 1)
    sound.pop()
  }

  const stars = hits >= game.goal ? 3 : hits >= game.goal * 0.6 ? 2 : 1
  const resultBuddyState = stars === 3 ? 'celebrating' : stars === 2 ? 'happy' : 'thinking'
  const resultTitle = stars === 3 ? 'Мундаг байна! ⭐' : stars === 2 ? 'Сайн байна!' : 'Бараг боллоо!'
  const resultSub =
    stars === 3
      ? `${character?.nameMn}-тэй хамт ${hits} оноо цуглууллаа!`
      : stars === 2
        ? `${character?.nameMn}-тэй ${hits} оноо авлаа. Гоё байна!`
        : `${hits} оноо авлаа. Дахин оролдоод, илүү сайжруулаарай!`

  return (
    <div className="relative min-h-dvh flex flex-col overflow-hidden" style={{ background: 'var(--color-cream)' }}>
      <SceneBackdrop tint={`${game.accent}33`} />

      <div className="relative z-10 flex items-center justify-between px-5 pt-6">
        <div>
          <p className="font-display font-extrabold text-base" style={{ color: game.accent }}>{game.nameMn}</p>
          <p className="text-[10.5px] text-ink-soft/45">{game.nameEn}</p>
        </div>
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-paper border border-forest/10 flex items-center justify-center">
          <X size={18} />
        </button>
      </div>

      {phase === 'ready' && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
          {character && (
            <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ backgroundColor: `${game.accent}22` }}>
              <CharacterBuddy animal={character.animal} state="idle" size={104} lineColor={game.accent} />
            </div>
          )}
          <p className="text-sm font-medium text-ink-soft/70">{game.descriptionMn}</p>
          <p className="text-xs text-ink-soft/40">{game.description}</p>
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft/50">{game.instructionMn}</p>
          <button
            onClick={start}
            className="mt-2 rounded-2xl px-8 py-4 font-display font-extrabold text-cream shadow-[var(--shadow-pop)] active:scale-[0.98] transition-transform"
            style={{ backgroundColor: game.accent }}
          >
            ЭХЛЭХ · {game.durationLabel}
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="relative z-10 flex-1 flex flex-col px-5">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 font-display font-extrabold text-sm" style={{ color: game.accent }}>
              <ShagaiIcon size={18} /> {hits}
            </span>
            <span className="font-display font-extrabold text-sm text-ink-soft/60">{timeLeft}с</span>
          </div>
          <div className="relative flex-1 rounded-3xl border-2 border-dashed overflow-hidden bg-paper/40" style={{ borderColor: `${game.accent}44`, minHeight: 320 }}>
            <AnimatePresence>
              {targets.map((t) => (
                <motion.button
                  key={t.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={() => hitTarget(t.id)}
                  className="absolute w-14 h-14 rounded-full flex items-center justify-center shadow-md"
                  style={{ left: `${t.x}%`, top: `${t.y}%`, backgroundColor: `${game.accent}cc` }}
                >
                  {character && <AnimalIcon animal={character.animal} className="w-9 h-9" lineColor="#FFFDF9" bodyColor={game.accent} />}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center gap-3">
          {stars === 3 && <ConfettiBurst colors={[game.accent, '#E8BB62', '#FFFDF9']} />}
          {character && (
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-1" style={{ backgroundColor: `${game.accent}22` }}>
              <CharacterBuddy animal={character.animal} state={resultBuddyState} size={80} lineColor={game.accent} />
            </div>
          )}
          <div className="flex gap-1">
            {[1, 2, 3].map((n) => (
              <motion.span
                key={n}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15 + n * 0.1, type: 'spring', stiffness: 260, damping: 14 }}
              >
                <Star size={28} className={n <= stars ? 'text-gold fill-gold' : 'text-ink-soft/20'} />
              </motion.span>
            ))}
          </div>
          <h2 className="font-display font-extrabold text-xl text-forest">{resultTitle}</h2>
          <p className="text-sm font-medium text-ink-soft/70">{resultSub}</p>

          <ShagaiReward count={stars} />

          {newBadges.length > 0 && (
            <div className="flex gap-3 mt-2">
              {newBadges.map((bid) => {
                const badge = getBadge(bid)
                if (!badge) return null
                return (
                  <div key={bid} className="flex flex-col items-center gap-1 bg-paper rounded-2xl px-4 py-3 border border-gold/40">
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="text-[10px] font-bold text-forest">{badge.nameMn}</span>
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex gap-3 w-full mt-4">
            <button
              onClick={start}
              className="flex-1 rounded-2xl py-3.5 font-display font-extrabold text-sm border-2 border-forest/15 text-forest active:scale-[0.98] transition-transform"
            >
              Дахин тоглох
            </button>
            <Link
              to="/play"
              className="flex-1 rounded-2xl py-3.5 font-display font-extrabold text-sm text-cream text-center active:scale-[0.98] transition-transform"
              style={{ backgroundColor: game.accent }}
            >
              Болсон
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
