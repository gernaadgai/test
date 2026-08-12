import { motion } from 'framer-motion'
import type { AnimalId } from '../types'
import { AnimalIcon } from './AnimalIcon'

export type AnswerState = 'idle' | 'correct' | 'wrong' | 'disabled'

interface Props {
  animal: AnimalId
  labelMn: string
  accent: string
  state: AnswerState
  onClick: () => void
}

const SHAKE = { rotate: [0, -6, 6, -4, 4, 0] }

/** A large, tappable illustrated answer — one of four choices in a recognition quiz. */
export function AnswerCard({ animal, labelMn, accent, state, onClick }: Props) {
  const isCorrect = state === 'correct'
  const isWrong = state === 'wrong'

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={state === 'disabled' || isCorrect}
      animate={isWrong ? SHAKE : undefined}
      whileHover={state === 'idle' ? { scale: 1.02 } : undefined}
      whileTap={state === 'idle' ? { scale: 0.97 } : undefined}
      transition={isWrong ? { duration: 0.45 } : { type: 'spring', stiffness: 400, damping: 20 }}
      className={`flex flex-col items-center gap-2 rounded-2xl py-4 px-3 border-2 bg-paper shadow-[var(--shadow-card)] ${
        state === 'idle' ? 'border-forest/10' : ''
      }`}
      style={{
        borderColor: isCorrect ? accent : isWrong ? 'var(--color-terracotta)' : undefined,
        backgroundColor: isCorrect ? `${accent}18` : isWrong ? '#B85C4518' : undefined,
      }}
    >
      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accent}1f` }}>
        <AnimalIcon animal={animal} size={40} lineColor={accent} bodyColor="#FFFEFA" />
      </div>
      <span className="font-display font-bold text-sm text-ink">{labelMn}</span>
    </motion.button>
  )
}
