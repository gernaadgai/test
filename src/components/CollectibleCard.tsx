import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { KeyRound, Sparkles } from 'lucide-react'
import type { Character } from '../types'
import { CharacterArt } from './CharacterArt'

interface Props {
  character: Character
  unlocked: boolean
  /** position in the gallery — drives the staggered entrance and offsets idle motion */
  index?: number
  /** the wide, gold "special edition" presentation */
  featured?: boolean
}

export function CollectibleCard({ character, unlocked, index = 0, featured = false }: Props) {
  const reduceMotion = !!useReducedMotion()
  const isSpecial = character.collectionId === 'sheep-2027'
  const number = String(character.number).padStart(2, '0')
  const accent = character.accent

  const card = (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, type: 'spring', stiffness: 220, damping: 24 }}
      whileTap={{ scale: 0.97 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      className={`relative flex overflow-hidden rounded-[22px] ${featured ? 'flex-row items-center gap-2 pr-5' : 'flex-col'}`}
      style={{
        background: unlocked
          ? `radial-gradient(120% 90% at 50% 18%, ${accent}30 0%, ${accent}0f 48%, var(--color-paper) 100%)`
          : `radial-gradient(120% 90% at 50% 18%, ${accent}16 0%, var(--color-cream-dark) 100%)`,
        boxShadow:
          isSpecial && unlocked
            ? '0 0 0 2px #E8BB62, 0 16px 34px -14px rgba(232,187,98,0.65)'
            : unlocked
              ? 'var(--shadow-card)'
              : 'inset 0 0 0 1.5px rgba(24,63,53,0.07)',
      }}
    >
      {/* one soft light sweep across unlocked cards, so the artwork reads as a material object */}
      {unlocked && !reduceMotion && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 z-20 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent"
          initial={{ x: '0%' }}
          animate={{ x: '520%' }}
          transition={{ delay: 0.5 + 0.12 * index, duration: 1.1, ease: 'easeInOut' }}
        />
      )}

      <div className={`relative ${featured ? 'h-36 w-40 shrink-0' : 'aspect-[1/1.02] w-full'}`}>
        <span className="absolute left-3 top-3 z-10 text-[10px] font-extrabold tracking-[0.12em] text-ink-soft">№{number}</span>

        {isSpecial && (
          <span className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-extrabold text-forest-dark">
            <Sparkles size={11} /> 2027
          </span>
        )}

        {/* ground shadow */}
        <div
          aria-hidden
          className="absolute bottom-[9%] left-1/2 h-[7%] w-[56%] -translate-x-1/2 rounded-[50%] bg-forest-dark/20 blur-[3px]"
          style={{ opacity: unlocked ? 1 : 0.4 }}
        />

        <div
          className="absolute inset-x-[8%] bottom-[10%] top-[12%]"
          style={unlocked ? undefined : { filter: 'grayscale(0.85) blur(2.5px) brightness(1.05)', opacity: 0.5 }}
        >
          <CharacterArt animal={character.animal} artKey={character.id} className="h-full w-full" phase={(index % 5) * 0.55} />
        </div>

        {!unlocked && (
          <span className="absolute bottom-[14%] left-1/2 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-paper text-forest shadow-[var(--shadow-soft)]">
            <KeyRound size={17} />
          </span>
        )}
      </div>

      <div className={`relative px-3.5 pb-3.5 ${featured ? 'flex-1 pt-0' : 'pt-1'}`}>
        {unlocked ? (
          <>
            <h3 className="font-display text-[17px] font-extrabold leading-tight tracking-wide" style={{ color: accent }}>
              {character.nameMn}
            </h3>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{character.nameEn}</p>
            {featured && <p className="mt-1.5 text-xs font-medium leading-snug text-ink">{character.taglineMn}</p>}
          </>
        ) : (
          <>
            <h3 className="font-display text-[15px] font-extrabold leading-tight text-ink-soft">Хайрцагт хүлээж байна</h3>
            <p className="text-[11px] font-medium text-ink-soft/80">Кодоо скан хийж нээ</p>
          </>
        )}
      </div>
    </motion.article>
  )

  return unlocked ? (
    <Link
      to={`/collection/${character.id}`}
      aria-label={`${character.nameMn} — дэлгэрэнгүй`}
      className="block rounded-[22px] outline-none focus-visible:ring-4 focus-visible:ring-deepblue/50"
    >
      {card}
    </Link>
  ) : (
    <Link
      to="/scan"
      aria-label={`№${number} — хайрцгийн кодоор нээх`}
      className="block rounded-[22px] outline-none focus-visible:ring-4 focus-visible:ring-deepblue/50"
    >
      {card}
    </Link>
  )
}
