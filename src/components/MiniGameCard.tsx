import { Link } from 'react-router-dom'
import { Lock, CheckCircle2, Play } from 'lucide-react'
import type { MiniGame } from '../types'
import { AnimalIcon } from './AnimalIcon'
import { getCharacter } from '../data/characters'

export function MiniGameCard({ game, unlocked, completed }: { game: MiniGame; unlocked: boolean; completed: boolean }) {
  const character = getCharacter(game.characterId)

  const inner = (
    <div
      className={`rounded-2xl p-4 flex items-center gap-3 border ${
        unlocked ? 'bg-paper border-forest/10 shadow-[var(--shadow-card)] active:scale-[0.98]' : 'bg-cream-dark/40 border-forest/5'
      } transition-transform`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${unlocked ? '' : 'grayscale opacity-40'}`}
        style={{ backgroundColor: unlocked ? `${game.accent}1f` : '#E4D9BE' }}
      >
        {character && <AnimalIcon animal={character.animal} className="w-9 h-9" lineColor={game.accent} bodyColor="#FFF9ED" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-display font-extrabold text-sm ${unlocked ? 'text-ink' : 'text-ink-soft/40'}`}>{game.nameMn}</p>
        <p className="text-[10.5px] text-ink-soft/40">{game.nameEn}</p>
        {unlocked ? (
          <p className="text-[11px] text-ink-soft/50 mt-0.5">{game.durationLabel}</p>
        ) : (
          <p className="text-[11px] text-ink-soft/40 mt-0.5">{character?.nameMn}-г цуглуулбал нээгдэнэ</p>
        )}
      </div>
      {unlocked ? (
        completed ? <CheckCircle2 size={20} className="text-forest shrink-0" /> : <Play size={18} className="text-terracotta shrink-0" />
      ) : (
        <Lock size={18} className="text-ink-soft/30 shrink-0" />
      )}
    </div>
  )

  if (!unlocked) return inner
  return <Link to={`/play/${game.id}`}>{inner}</Link>
}
