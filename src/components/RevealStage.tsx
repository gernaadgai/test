import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import type { Character } from '../types'
import { CharacterArt } from './CharacterArt'

interface Props {
  character: Character
  collectionName?: string
  /** headline above the card, e.g. "ШИНЭ НЭЭЛТ!" */
  headline: string
  /** show the card's "added" stamp and let the character celebrate */
  added: boolean
  /** hide the fact line (used for duplicates) */
  showFact: boolean
  /** action area rendered inside the card once the reveal has settled */
  children: React.ReactNode
}

/** Reveal timeline in ms. Short on purpose — it plays every time a child unlocks something. */
const T = { card: 250, character: 700, name: 1250, details: 1800 }

/**
 * The collectible reveal: the world darkens to a focused warm scene, the card rises, the animal
 * arrives and settles, its name appears letter by letter, then the details and actions follow.
 * Tap anywhere to skip to the finished card.
 */
export function RevealStage({ character, collectionName, headline, added, showFact, children }: Props) {
  const reduceMotion = !!useReducedMotion()
  const [step, setStep] = useState(reduceMotion ? 4 : 0)
  const isSpecial = character.collectionId === 'sheep-2027'
  const accent = character.accent

  useEffect(() => {
    if (reduceMotion) return
    const timers = [T.card, T.character, T.name, T.details].map((ms, i) => window.setTimeout(() => setStep((s) => Math.max(s, i + 1)), ms))
    return () => timers.forEach(window.clearTimeout)
  }, [reduceMotion])

  const skip = () => setStep(4)

  // a handful of slow, warm motes — deterministic so they don't jump on re-render
  const motes = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        left: 12 + ((i * 37) % 76),
        size: 4 + ((i * 5) % 5),
        delay: (i % 5) * 0.35,
        dur: 3.6 + (i % 4) * 0.6,
      })),
    [],
  )

  const letters = Array.from(character.nameMn)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-5 py-8"
      style={{ background: 'radial-gradient(120% 90% at 50% 8%, #2E6350 0%, #183F35 46%, #0F2A23 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      onClick={() => step < 4 && skip()}
    >
      {/* a column of warm light falls from the top and settles */}
      {!reduceMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[78%] w-[88%] max-w-[560px] -translate-x-1/2"
          style={{ background: 'linear-gradient(180deg, rgba(243,214,143,0.55) 0%, rgba(243,214,143,0.12) 60%, transparent 100%)', clipPath: 'polygon(38% 0, 62% 0, 100% 100%, 0 100%)' }}
          initial={{ opacity: 0, scaleY: 0.4 }}
          animate={{ opacity: step >= 1 ? [0.9, 0.5] : 0, scaleY: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      )}

      {!reduceMotion &&
        step >= 2 &&
        motes.map((m, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="pointer-events-none absolute bottom-[18%] rounded-full bg-gold-light"
            style={{ left: `${m.left}%`, width: m.size, height: m.size }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.85, 0], y: -180 }}
            transition={{ duration: m.dur, delay: m.delay, ease: 'easeOut' }}
          />
        ))}

      <div className="relative w-full max-w-[400px]" onClick={(e) => e.stopPropagation()}>
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : -8 }}
          transition={{ duration: 0.4 }}
          className="mb-3 flex items-center justify-center gap-1.5 text-center text-xs font-extrabold uppercase tracking-[0.18em] text-gold-light"
        >
          <Sparkles size={14} /> {headline}
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 90, scale: 0.92 }}
          animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 90, scale: step >= 1 ? 1 : 0.92 }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          className="relative overflow-hidden rounded-[30px]"
          style={{
            backgroundColor: '#FFFDF9',
            backgroundImage: `radial-gradient(100% 70% at 50% 24%, ${accent}33 0%, ${accent}0d 55%, transparent 100%)`,
            boxShadow: isSpecial ? '0 0 0 3px #E8BB62, 0 30px 60px -20px rgba(0,0,0,0.6)' : '0 30px 60px -20px rgba(0,0,0,0.6)',
          }}
        >
          {/* one glint across the finished card */}
          {!reduceMotion && step >= 3 && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-1/3 z-20 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              initial={{ x: '0%' }}
              animate={{ x: '600%' }}
              transition={{ duration: 0.95, ease: 'easeInOut' }}
            />
          )}

          <div className="flex items-center justify-between px-5 pt-4 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">
            <span>GER NAADGAI</span>
            <span>
              {collectionName ? `${collectionName} · ` : ''}№{String(character.number).padStart(2, '0')}
            </span>
          </div>

          <div className="relative mx-auto h-[250px] w-[78%]">
            <motion.div
              aria-hidden
              className="absolute bottom-[4%] left-1/2 h-[6%] -translate-x-1/2 rounded-[50%] bg-forest-dark/30 blur-[5px]"
              initial={{ width: '10%', opacity: 0 }}
              animate={{ width: step >= 2 ? '58%' : '10%', opacity: step >= 2 ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
            {/* the character drops in and lands with a small squash */}
            <motion.div
              className="absolute inset-x-0 bottom-[6%] top-[4%]"
              style={{ transformOrigin: '50% 100%' }}
              initial={reduceMotion ? false : { opacity: 0, y: -120, scale: 0.55 }}
              animate={
                step >= 2
                  ? { opacity: 1, y: 0, scale: 1, scaleY: [1, 0.9, 1.03, 1] }
                  : { opacity: 0, y: -120, scale: 0.55 }
              }
              transition={{ y: { type: 'spring', stiffness: 170, damping: 13 }, opacity: { duration: 0.25 }, scaleY: { duration: 0.5, delay: 0.32 } }}
            >
              <CharacterArt animal={character.animal} mood={added ? 'celebrate' : 'idle'} className="h-full w-full" />
            </motion.div>
          </div>

          <div className="px-6 pb-6 text-center">
            <h2 aria-label={character.nameMn} className="font-display text-[34px] font-extrabold leading-none tracking-wide" style={{ color: accent }}>
              {letters.map((ch, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="inline-block whitespace-pre"
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : 14 }}
                  transition={{ delay: step >= 3 ? i * 0.055 : 0, duration: 0.28 }}
                >
                  {ch}
                </motion.span>
              ))}
            </h2>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: step >= 3 ? 1 : 0 }}
              transition={{ delay: 0.35 }}
              className="mt-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft"
            >
              {character.nameEn}
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: step >= 4 ? 1 : 0, y: step >= 4 ? 0 : 10 }}
              transition={{ duration: 0.35 }}
              style={{ pointerEvents: step >= 4 ? 'auto' : 'none' }}
            >
              {showFact && <p className="mx-auto mt-4 max-w-[300px] text-sm font-medium leading-relaxed text-ink">{character.factMn}</p>}
              {added && (
                <motion.p
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-3 inline-block rounded-full bg-gold/25 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-forest"
                >
                  ✦ Цуглуулгад нэмэгдлээ ✦
                </motion.p>
              )}
              <div className="mt-5">{children}</div>
            </motion.div>
          </div>
        </motion.div>

        {step < 4 && <p className="mt-4 text-center text-[11px] font-medium text-cream/60">Товшиж алгасах</p>}
      </div>
    </motion.div>
  )
}
