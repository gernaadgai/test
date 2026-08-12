import { motion } from 'framer-motion'
import type { AnimalId } from '../types'
import { CharacterBuddy, type BuddyState } from './CharacterBuddy'
import { SceneBackdrop } from './SceneBackdrop'

interface Props {
  animal: AnimalId
  accent: string
  questionMn: string
  buddyState?: BuddyState
}

/** The illustrated subject + question — the dominant element of a quiz screen. */
export function QuestionCard({ animal, accent, questionMn, buddyState = 'idle' }: Props) {
  return (
    <div className="relative rounded-[28px] overflow-hidden py-8 flex flex-col items-center gap-3" style={{ backgroundColor: `${accent}14` }}>
      <SceneBackdrop tint={`${accent}33`} />
      <motion.div
        key={animal}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="relative z-10 w-32 h-32 rounded-full flex items-center justify-center border-4"
        style={{ backgroundColor: `${accent}22`, borderColor: `${accent}30` }}
      >
        <CharacterBuddy animal={animal} state={buddyState} size={104} lineColor={accent} />
      </motion.div>
      <p className="relative z-10 font-display font-extrabold text-xl text-ink text-center px-6">{questionMn}</p>
    </div>
  )
}
