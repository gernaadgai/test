import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import type { Character } from '../types'
import { AnimalIcon } from './AnimalIcon'

interface Props {
  character: Character
  unlocked: boolean
}

const RARITY_LABEL: Record<Character['rarity'], string> = {
  common: 'Энгийн',
  special: 'Онцгой',
  rare: 'Ховор',
  legendary: 'Домогт',
}

export function CollectibleCard({ character, unlocked }: Props) {
  const content = (
    <div
      className={`relative rounded-2xl p-3 flex flex-col items-center gap-2 border transition-all ${
        unlocked
          ? 'bg-paper border-forest/10 shadow-[var(--shadow-card)] active:scale-[0.97]'
          : 'bg-cream-dark/50 border-forest/5'
      }`}
    >
      <span className="absolute top-2 left-2 text-[10px] font-bold text-ink-soft/50">#{String(character.number).padStart(2, '0')}</span>
      {unlocked && (
        <span
          className="absolute top-2 right-2 text-[8.5px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full text-white"
          style={{ backgroundColor: character.accent }}
        >
          {RARITY_LABEL[character.rarity]}
        </span>
      )}
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mt-2 ${unlocked ? '' : 'grayscale opacity-40'}`}
        style={{ backgroundColor: unlocked ? `${character.accent}1f` : '#E4D9BE' }}
      >
        {unlocked ? (
          <AnimalIcon animal={character.animal} className="w-11 h-11" bodyColor="#FFF9ED" lineColor={character.accent} />
        ) : (
          <Lock size={22} className="text-ink-soft/40" />
        )}
      </div>
      <div className="text-center">
        {unlocked ? (
          <>
            <p className="font-display font-bold text-sm leading-tight">{character.nameMn}</p>
            <p className="text-[10px] text-ink-soft/70 uppercase tracking-wide">{character.nameEn}</p>
          </>
        ) : (
          <>
            <p className="font-display font-bold text-sm text-ink-soft/40">???</p>
            <p className="text-[10px] text-ink-soft/40 uppercase tracking-wide">Хаалттай</p>
          </>
        )}
      </div>
    </div>
  )

  if (!unlocked) return <div>{content}</div>
  return <Link to={`/collection/${character.id}`}>{content}</Link>
}
