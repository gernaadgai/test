import { motion } from 'framer-motion'
import type { AnimalId } from '../types'

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
export function AnswerCard({ labelMn, accent, state, onClick }: Props) {
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
      className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl py-5 px-3 border-2 bg-paper shadow-[var(--shadow-card)] ${
        state === 'idle' ? 'border-forest/10' : ''
      }`}
      style={{
        borderColor: isCorrect ? accent : isWrong ? 'var(--color-terracotta)' : undefined,
        backgroundColor: isCorrect ? `${accent}18` : isWrong ? '#C45A3C18' : undefined,
      }}
    >
      <span className="font-display text-lg font-extrabold tracking-wide text-ink">{labelMn}</span>
    </motion.button>
  )
}
