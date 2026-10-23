import { useState } from 'react'
import { motion, useReducedMotion, type TargetAndTransition, type Transition } from 'framer-motion'
import type { AnimalId } from '../types'
import { getIllustration } from '../lib/illustrations'
import { AnimalIcon } from './AnimalIcon'
import { sound } from '../lib/sound'

/**
 * One character, five personalities. Every animal shares the same rendered artwork system but moves
 * differently at rest and answers a tap in its own way — timing and shape are never copy-pasted.
 */
interface Personality {
  idle: TargetAndTransition
  idleTransition: Transition
  tap: TargetAndTransition
  tapTransition: Transition
  origin: string
}

const PERSONALITY: Partial<Record<AnimalId, Personality>> = {
  // horse: shifts its weight, and rears a little when greeted
  horse: {
    idle: { rotate: [0, -0.8, 0.5, 0], y: [0, -1, 0, 0] },
    idleTransition: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' },
    tap: { rotate: [0, -9, -3, 0], y: [0, -16, -4, 0], scaleY: [1, 1.03, 0.97, 1] },
    tapTransition: { duration: 0.8, ease: 'easeOut' },
    origin: '30% 100%',
  },
  // camel: slow, tall sway — unhurried
  camel: {
    idle: { rotate: [-1.4, 1.4, -1.4] },
    idleTransition: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
    tap: { rotate: [0, 5, -5, 3, 0], y: [0, -4, 0, -2, 0] },
    tapTransition: { duration: 1.1, ease: 'easeInOut' },
    origin: '50% 100%',
  },
  // sheep: soft bouncy breathing, hops twice
  sheep: {
    idle: { scaleY: [1, 1.025, 1], scaleX: [1, 0.99, 1] },
    idleTransition: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' },
    tap: { y: [0, -18, 0, -11, 0], scaleY: [1, 1.05, 0.93, 1.03, 1] },
    tapTransition: { duration: 0.85, ease: 'easeOut' },
    origin: '50% 100%',
  },
  // goat: restless — a quick head toss, then a playful jump with a twist
  goat: {
    idle: { rotate: [0, 0, -2.2, 2.2, 0, 0] },
    idleTransition: { duration: 4.4, repeat: Infinity, ease: 'easeInOut' },
    tap: { y: [0, -30, 0], rotate: [0, -10, 8, 0], scaleY: [1, 1.06, 0.92, 1] },
    tapTransition: { duration: 0.7, ease: 'easeOut' },
    origin: '50% 100%',
  },
  // cow: slow grazing nod, answers with a big friendly nod
  cow: {
    idle: { y: [0, 2.5, 0], rotate: [0, 0.7, 0] },
    idleTransition: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
    tap: { rotate: [0, 6, 0, 6, 0], y: [0, 5, 0, 5, 0] },
    tapTransition: { duration: 1, ease: 'easeInOut' },
    origin: '50% 100%',
  },
}

const FALLBACK: Personality = PERSONALITY.sheep as Personality

export type CharacterMood = 'idle' | 'celebrate'

interface Props {
  animal: AnimalId
  /** the character id — lets a special edition (e.g. sheep-2027) use its own artwork, falling back to the animal's */
  artKey?: string
  className?: string
  /** make it respond to a tap (detail view); cards leave this off */
  interactive?: boolean
  mood?: CharacterMood
  /** called when the child taps the character */
  onReact?: () => void
  /** extra delay (s) so a gallery of characters never breathes in unison */
  phase?: number
}

export function CharacterArt({ animal, artKey, className, interactive = false, mood = 'idle', onReact, phase = 0 }: Props) {
  const reduceMotion = !!useReducedMotion()
  const art = (artKey && getIllustration(artKey)) || getIllustration(animal)
  const p = PERSONALITY[animal] ?? FALLBACK
  const [reactKey, setReactKey] = useState(0)
  const reacting = reactKey > 0

  const react = () => {
    if (!interactive) return
    setReactKey((k) => k + 1)
    sound.pop()
    onReact?.()
  }

  const animate: TargetAndTransition | undefined = reduceMotion
    ? undefined
    : mood === 'celebrate'
      ? { y: [0, -22, 0, -12, 0], rotate: [0, -4, 4, -2, 0] }
      : reacting
        ? p.tap
        : p.idle
  const transition: Transition = mood === 'celebrate'
    ? { duration: 0.9, repeat: Infinity, repeatDelay: 0.5, ease: 'easeOut' }
    : reacting
      ? p.tapTransition
      : { ...p.idleTransition, delay: phase }

  const image = art ? (
    <motion.img
      key={`${reactKey}-${mood}`}
      src={art}
      alt=""
      draggable={false}
      className="h-full w-full select-none object-contain"
      style={{ transformOrigin: p.origin }}
      animate={animate}
      transition={transition}
      onAnimationComplete={() => {
        if (reacting) setReactKey(0) // reaction finished — settle back into the idle loop
      }}
    />
  ) : (
    <AnimalIcon animal={animal} className="h-full w-full" />
  )

  if (!interactive) return <div className={className}>{image}</div>

  return (
    <button
      type="button"
      onClick={react}
      aria-label="Хариу үйлдэл харах / Tap to say hello"
      className={`${className ?? ''} cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-deepblue/50 rounded-3xl`}
    >
      {image}
    </button>
  )
}
