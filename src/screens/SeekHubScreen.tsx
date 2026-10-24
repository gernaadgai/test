import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Search, Star } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { SEEK_SCENES } from '../data/seek'
import { getIllustration } from '../lib/illustrations'
import { useCollectionStore } from '../store/useCollectionStore'
import { sound } from '../lib/sound'

/** "Хайж ол" — a shelf of painted scenes, each with something new hiding in it. */
export function SeekHubScreen() {
  const reduceMotion = !!useReducedMotion()
  const seekStars = useCollectionStore((s) => s.seekStars)
  const earned = SEEK_SCENES.reduce((n, s) => n + (seekStars[s.id] ?? 0), 0)
  const max = SEEK_SCENES.length * 3

  return (
    <div className="pb-4">
      <ScreenHeader titleMn="Хайж ол" titleEn="Seek & Find" back />

      <div className="px-5">
        <section className="flex items-center gap-3 rounded-[22px] bg-forest px-4 py-3.5 text-cream shadow-[var(--shadow-card)]">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream/15">
            <Search size={22} className="text-gold-light" />
          </span>
          <p className="flex-1 text-[13px] font-medium leading-snug">Зураг дотор нуугдсан зүйлсийг ол. Тоглох бүрт өөр өөр 6 зүйл гарна!</p>
          <span className="flex shrink-0 items-center gap-1 font-display text-lg font-extrabold text-gold" aria-label={`Нийт ${earned} / ${max} од`}>
            <Star size={18} className="fill-gold" /> {earned}
            <span className="text-sm text-cream/60">/{max}</span>
          </span>
        </section>

        <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SEEK_SCENES.map((scene, i) => {
            const art = getIllustration(scene.art)
            const stars = seekStars[scene.id] ?? 0
            return (
              <motion.li
                key={scene.id}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i, type: 'spring', stiffness: 220, damping: 24 }}
              >
                <Link
                  to={`/seek/${scene.id}`}
                  onClick={() => sound.tap()}
                  aria-label={`${scene.nameMn} — ${stars} / 3 од`}
                  className="block overflow-hidden rounded-[24px] bg-paper shadow-[var(--shadow-card)] outline-none transition-transform active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-deepblue/50"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-cream-dark">
                    {art && <img src={art} alt="" loading="lazy" draggable={false} className="h-full w-full object-cover" style={{ objectPosition: scene.thumbPos }} />}
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/55 via-transparent to-transparent" />
                    <span className="absolute bottom-2.5 left-3.5 flex items-center gap-0.5 rounded-full bg-paper/92 px-2 py-1" aria-hidden>
                      {[1, 2, 3].map((n) => (
                        <Star key={n} size={15} strokeWidth={2} className={n <= stars ? 'fill-gold text-gold' : 'fill-transparent text-ink-soft/30'} />
                      ))}
                    </span>
                  </div>
                  <div className="px-4 pb-3.5 pt-3">
                    <h2 className="font-display text-lg font-extrabold leading-tight" style={{ color: scene.accent }}>
                      {scene.nameMn}
                    </h2>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{scene.nameEn}</p>
                    <p className="mt-1! text-xs font-medium text-ink">{scene.taglineMn}</p>
                  </div>
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
