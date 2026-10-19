import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { QuestionCard } from '../components/QuestionCard'
import { AnswerCard, type AnswerState } from '../components/AnswerCard'
import { CharacterBuddy, type BuddyState } from '../components/CharacterBuddy'
import { ShagaiReward } from '../components/ShagaiReward'
import { ConfettiBurst } from '../components/ConfettiBurst'
import { ShagaiIcon } from '../components/ShagaiIcon'
import { CHARACTERS } from '../data/characters'
import { sound } from '../lib/sound'

const POOL = CHARACTERS.filter((c) => ['horse', 'camel', 'sheep', 'goat', 'cow'].includes(c.id))
const TOTAL = 8

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickQuestion() {
  const target = POOL[Math.floor(Math.random() * POOL.length)]
  const distractors = shuffle(POOL.filter((c) => c.id !== target.id)).slice(0, 3)
  const options = shuffle([target, ...distractors])
  return { target, options }
}

type Phase = 'playing' | 'done'

export function QuizScreen() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [shagai, setShagai] = useState(0)
  const [question, setQuestion] = useState(pickQuestion)
  const [answered, setAnswered] = useState<string | null>(null)
  const [buddyState, setBuddyState] = useState<BuddyState>('idle')
  const [phase, setPhase] = useState<Phase>('playing')

  const progress = index / TOTAL

  function next() {
    if (index + 1 >= TOTAL) {
      setPhase('done')
      sound.complete()
      return
    }
    setIndex((i) => i + 1)
    setQuestion(pickQuestion())
    setAnswered(null)
    setBuddyState('idle')
  }

  function choose(optionId: string) {
    if (answered) return
    if (optionId === question.target.id) {
      setAnswered(optionId)
      setBuddyState('celebrating')
      setShagai((s) => s + 1)
      sound.success()
      window.setTimeout(next, 1100)
    } else {
      setAnswered(optionId)
      setBuddyState('thinking')
      sound.pop()
      window.setTimeout(() => {
        setAnswered(null)
        setBuddyState('idle')
      }, 700)
    }
  }

  const answerState = (optionId: string): AnswerState => {
    if (!answered) return 'idle'
    if (optionId === question.target.id) return answered === optionId ? 'correct' : 'disabled'
    return answered === optionId ? 'wrong' : 'disabled'
  }

  const ENCOURAGEMENTS = ['Дахиад нэг бодоод үзье!', 'Бараг байлаа!', 'Дахин оролдоорой!']
  const encouraging = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]

  return (
    <div className="min-h-dvh flex flex-col px-5">
      <div className="flex items-center justify-between pt-6 pb-4">
        <div>
          <p className="font-display font-extrabold text-base text-forest">Амьтан Таних</p>
          <p className="text-[10.5px] text-ink-soft/45">Animal Quiz</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-display font-extrabold text-sm text-ink">
            <ShagaiIcon size={18} /> {shagai}
          </span>
          <button onClick={() => navigate('/play')} className="w-9 h-9 rounded-full bg-paper border border-forest/10 flex items-center justify-center">
            <X size={18} />
          </button>
        </div>
      </div>

      {phase === 'playing' && (
        <div className="flex-1 flex flex-col">
          <div className="h-2 rounded-full bg-cream-dark overflow-hidden mb-5">
            <motion.div
              className="h-full rounded-full bg-forest"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft/50 mb-2">
            {index + 1} / {TOTAL}
          </p>

          <QuestionCard animal={question.target.animal} accent={question.target.accent} questionMn="Энэ ямар амьтан бэ?" buddyState={buddyState} />

          {answered && answered !== question.target.id && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm font-bold text-terracotta mt-4"
            >
              {encouraging}
            </motion.p>
          )}
          {answered === question.target.id && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm font-bold text-forest mt-4">
              Маш сайн! +1 Шагай
            </motion.p>
          )}

          <div className="grid grid-cols-2 gap-3 mt-4">
            {question.options.map((opt) => (
              <AnswerCard key={opt.id} animal={opt.animal} labelMn={opt.nameMn} accent={opt.accent} state={answerState(opt.id)} onClick={() => choose(opt.id)} />
            ))}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="relative flex-1 flex flex-col items-center justify-center text-center gap-3">
          <ConfettiBurst colors={['#E8BB62', '#C45A3C', '#FFFDF9']} />
          <CharacterBuddy animal={question.target.animal} state="celebrating" size={100} lineColor="#C45A3C" />
          <h2 className="font-display font-extrabold text-xl text-forest">Баяр хүргэе!</h2>
          <p className="text-sm font-medium text-ink-soft/70">Чи Монголын амьтдыг сайн мэддэг юм байна!</p>
          <ShagaiReward count={shagai} />
          <div className="flex gap-3 w-full mt-4">
            <button
              onClick={() => {
                setIndex(0)
                setShagai(0)
                setQuestion(pickQuestion())
                setAnswered(null)
                setBuddyState('idle')
                setPhase('playing')
              }}
              className="flex-1 rounded-2xl py-3.5 font-display font-extrabold text-sm border-2 border-forest/15 text-forest active:scale-[0.98] transition-transform"
            >
              Дахин тоглох
            </button>
            <Link
              to="/play"
              className="flex-1 rounded-2xl py-3.5 font-display font-extrabold text-sm text-cream text-center active:scale-[0.98] transition-transform bg-forest"
            >
              Болсон
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
