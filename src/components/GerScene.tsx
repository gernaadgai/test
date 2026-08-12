import { motion } from 'framer-motion'
import type { AnimalId } from '../types'
import { AnimalIcon } from './AnimalIcon'

interface Props {
  companions?: AnimalId[]
  hasStories?: boolean
  hasZodiac?: boolean
  season?: Season
}

const GRASS_X = [24, 66, 108, 252, 294, 336, 150, 190]

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export function currentSeason(): Season {
  const month = new Date().getMonth() // 0-11
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'autumn'
  return 'winter'
}

const SEASON_TINT: Record<Season, string> = {
  spring: '#8FBF72',
  summer: 'transparent',
  autumn: '#E8B85C',
  winter: '#8FD8F2',
}

/** The player's digital ger — the emotional home screen centerpiece. Grows richer as the collection grows. */
export function GerScene({ companions = [], hasStories = false, hasZodiac = false, season }: Props) {
  const activeSeason = season ?? currentSeason()
  const isWinter = activeSeason === 'winter'
  const spots: Array<{ x: number; y: number; scale: number }> = [
    { x: 42, y: 268, scale: 1 },
    { x: 320, y: 272, scale: 0.95 },
    { x: 60, y: 232, scale: 0.8 },
    { x: 300, y: 226, scale: 0.8 },
    { x: 200, y: 288, scale: 0.9 },
    { x: 160, y: 240, scale: 0.7 },
  ]

  return (
    <div className="relative w-full aspect-[360/300] overflow-hidden rounded-[28px] bg-gradient-to-b from-sky-light/50 via-cream to-cream-dark/60">
      <svg viewBox="0 0 360 300" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* seasonal tint wash */}
        {activeSeason !== 'summer' && <rect width="360" height="300" fill={SEASON_TINT[activeSeason]} opacity="0.06" />}

        {/* sky + sun */}
        <circle cx="300" cy="46" r="26" fill="#F3D48F" opacity="0.55" />
        <circle cx="300" cy="46" r="16" fill="#EFC589" opacity="0.85" />

        {/* stars, twinkling */}
        {[...Array(6)].map((_, i) => (
          <circle key={i} cx={30 + i * 55} cy={20 + (i % 3) * 12} r="1.8" fill="#E8B85C" className="animate-twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
        ))}

        {/* far mountains */}
        <path d="M0 150 L50 105 L95 140 L150 90 L210 145 L260 110 L320 148 L360 130 L360 200 L0 200 Z" fill="#8FD8F2" opacity="0.55" />
        {/* near mountains */}
        <path d="M0 175 L60 130 L120 168 L180 120 L230 165 L300 135 L360 170 L360 210 L0 210 Z" fill="#8FBF72" opacity="0.85" />

        {/* clouds — slow parallax drift */}
        <motion.g
          opacity="0.9"
          animate={{ x: [0, 26, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        >
          <g transform="translate(20,60)">
            <ellipse cx="0" cy="0" rx="26" ry="12" fill="#FFFCF4" />
            <ellipse cx="20" cy="-4" rx="18" ry="10" fill="#FFFCF4" />
            <ellipse cx="-18" cy="4" rx="16" ry="9" fill="#FFFCF4" />
          </g>
        </motion.g>
        <motion.g
          opacity="0.9"
          animate={{ x: [0, -20, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
        >
          <g transform="translate(230,32)">
            <ellipse cx="0" cy="0" rx="22" ry="10" fill="#FFFCF4" />
            <ellipse cx="16" cy="-3" rx="14" ry="8" fill="#FFFCF4" />
          </g>
        </motion.g>

        {/* ground */}
        <path d="M0 200 Q180 178 360 200 L360 300 L0 300 Z" fill={isWinter ? '#FBF3E1' : '#E8B85C'} opacity={isWinter ? 0.5 : 0.18} />
        <path d="M0 210 Q180 190 360 210 L360 300 L0 300 Z" fill="#4C7A3A" opacity="0.14" />

        {isWinter &&
          [...Array(16)].map((_, i) => (
            <circle key={i} cx={(i * 47 + 12) % 360} cy={210 + ((i * 29) % 80)} r={i % 3 === 0 ? 2 : 1.2} fill="#FFFCF4" opacity="0.85" />
          ))}

        {/* swaying grass tufts */}
        {GRASS_X.map((x, i) => (
          <motion.g
            key={x}
            transform={`translate(${x}, ${228 + (i % 3) * 24})`}
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ duration: 2.4 + (i % 4) * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
            style={{ transformOrigin: '0px 10px' }}
          >
            <path d="M0 10 Q-3 2 -1 -8 M0 10 Q0 0 0 -10 M0 10 Q3 2 1 -8" stroke="#8FBF72" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.55" />
          </motion.g>
        ))}

        {/* zodiac constellation marker (appears once first zodiac year unlocked) */}
        {hasZodiac && (
          <g transform="translate(48,50)" opacity="0.9">
            <path d="M0 10 L4 0 L8 10 L18 10 L10 16 L13 26 L4 20 L-5 26 L-2 16 L-10 10 Z" fill="#E8B85C" />
          </g>
        )}

        {/* storybook (appears once a story unlocked) */}
        {hasStories && (
          <g transform="translate(268,208)">
            <rect x="0" y="0" width="26" height="19" rx="2" fill="#A94B35" />
            <rect x="2" y="2" width="22" height="15" rx="1.4" fill="#FFFCF4" />
            <line x1="13" y1="2" x2="13" y2="17" stroke="#A94B35" strokeWidth="1.4" />
          </g>
        )}

        {/* ================= GER ================= */}
        <g transform="translate(180,190)">
          {/* shadow */}
          <ellipse cx="0" cy="74" rx="78" ry="10" fill="#4C7A3A" opacity="0.15" />

          {/* smoke wisp — signs of life inside */}
          <motion.g
            animate={{ y: [-2, -22, -2], opacity: [0, 0.5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeOut' }}
          >
            <path d="M0 -64 Q6 -74 0 -82 Q-6 -90 2 -98" fill="none" stroke="#8FD8F2" strokeWidth="3" strokeLinecap="round" />
          </motion.g>

          {/* roof */}
          <path d="M-64 8 L0 -46 L64 8 Z" fill="#C97056" />
          <path d="M-64 8 L0 -46 L64 8 L64 16 L0 -36 L-64 16 Z" fill="#7C3A26" />
          {/* roof spokes */}
          {[-40, -20, 0, 20, 40].map((x) => (
            <line key={x} x1={x * 0.94} y1={8} x2="0" y2="-40" stroke="#7C3A26" strokeWidth="1.6" opacity="0.5" />
          ))}
          {/* toono crown */}
          <circle cx="0" cy="-40" r="9" fill="#E8B85C" />
          <circle cx="0" cy="-40" r="5.5" fill="#4C7A3A" />
          {/* wind poles */}
          <line x1="-4" y1="-49" x2="-4" y2="-64" stroke="#7C3A26" strokeWidth="2" />
          <line x1="4" y1="-49" x2="4" y2="-64" stroke="#7C3A26" strokeWidth="2" />
          <path d="M-4 -64 Q2 -70 8 -62" fill="none" stroke="#A94B35" strokeWidth="2.4" strokeLinecap="round" />

          {/* wall band */}
          <rect x="-70" y="8" width="140" height="54" rx="6" fill="#FBF3E1" stroke="#4C7A3A" strokeWidth="2" />
          {/* pattern strip */}
          {[...Array(9)].map((_, i) => (
            <path key={i} d={`M${-64 + i * 16} 8 q4 8 0 16`} stroke="#E8B85C" strokeWidth="2.2" fill="none" opacity="0.7" />
          ))}
          {/* door */}
          <rect x="-14" y="32" width="28" height="30" rx="3" fill="#A94B35" />
          <rect x="-14" y="32" width="28" height="30" rx="3" fill="none" stroke="#7C3A26" strokeWidth="2" />
          <circle cx="8" cy="47" r="1.6" fill="#F3D48F" />
        </g>

        {/* companions collected so far, scattered on the grass — gentle idle bob */}
        {companions.slice(0, spots.length).map((animal, i) => {
          const spot = spots[i]
          return (
            <motion.g
              key={animal + i}
              transform={`translate(${spot.x - 20 * spot.scale}, ${spot.y - 20 * spot.scale}) scale(${spot.scale})`}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.6 + (i % 3) * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
            >
              <circle cx="20" cy="20" r="21" fill="#FFFCF4" stroke="#4C7A3A" strokeWidth="2" opacity="0.95" />
              <g transform="translate(4,4) scale(0.35)">
                <AnimalIcon animal={animal} bodyColor="#FBF3E1" lineColor="#4C7A3A" />
              </g>
            </motion.g>
          )
        })}
      </svg>

      <motion.div
        className="absolute top-6 left-6 w-9 h-9 rounded-full bg-paper/70 backdrop-blur flex items-center justify-center text-lg"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        ☁️
      </motion.div>
    </div>
  )
}
