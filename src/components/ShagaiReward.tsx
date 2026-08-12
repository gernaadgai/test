import { motion } from 'framer-motion'
import { ShagaiIcon } from './ShagaiIcon'

interface Props {
  count: number
  label?: string
  size?: number
}

/** The "+N Шагай" reward moment — GER NAADGAI's signature collectible currency. */
export function ShagaiReward({ count, label = 'ШАГАЙ', size = 22 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="flex items-center gap-2 rounded-full bg-gold/15 px-4 py-2"
    >
      {Array.from({ length: Math.max(1, Math.min(count, 5)) }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, rotate: -60, y: -14 }}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          transition={{ delay: 0.6 + i * 0.15, type: 'spring', stiffness: 260, damping: 12 }}
        >
          <ShagaiIcon size={size} />
        </motion.span>
      ))}
      <span className="font-display font-extrabold text-sm text-ink">
        +{count} {label}
      </span>
    </motion.div>
  )
}
