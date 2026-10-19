import { motion } from 'framer-motion'
import type { AnimalId } from '../types'
import { CharacterBuddy, type BuddyState } from './CharacterBuddy'
import { SceneBackdrop } from './SceneBackdrop'
import { getIllustration } from '../lib/illustrations'

interface Props {
  animal: AnimalId
  accent: string
  questionMn: string
  buddyState?: BuddyState
}

/** The illustrated subject + question — the dominant element of a quiz screen. */
export function QuestionCard({ animal, accent, questionMn, buddyState = 'idle' }: Props) {
  const art = getIllustration(animal)
  return (
    <div className="relative rounded-[28px] overflow-hidden py-8 flex flex-col items-center gap-3" style={{ backgroundColor: `${accent}14` }}>
      <SceneBackdrop tint={`${accent}33`} />
      <motion.div
        key={animal}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className={`relative z-10 flex items-center justify-center ${art ? 'h-44 w-60' : 'h-32 w-32 rounded-full border-4'}`}
        style={art ? undefined : { backgroundColor: `${accent}22`, borderColor: `${accent}30` }}
      >
        {art ? (
          <motion.img
            src={art}
            alt=""
            className="max-h-full max-w-full object-contain drop-shadow-[0_10px_14px_rgba(24,63,53,0.22)]"
            animate={buddyState === 'celebrating' ? { y: [0, -14, 0], rotate: [0, -3, 3, 0] } : buddyState === 'thinking' ? { rotate: [-2, 2, -2] } : { y: [0, -3, 0] }}
            transition={{ duration: buddyState === 'celebrating' ? 0.6 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : (
          <CharacterBuddy animal={animal} state={buddyState} size={104} lineColor={accent} />
        )}
      </motion.div>
      <p className="relative z-10 font-display font-extrabold text-xl text-ink text-center px-6">{questionMn}</p>
    </div>
  )
}
