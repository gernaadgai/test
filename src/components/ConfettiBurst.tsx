import { motion } from 'framer-motion'

const COLORS = ['#A94B35', '#E8B85C', '#8FBF72', '#C97056', '#5B96B0']

interface Props {
  count?: number
  colors?: string[]
}

/** A short-lived radial burst of tiny shapes — used for unlock and completion moments. */
export function ConfettiBurst({ count = 18, colors = COLORS }: Props) {
  const pieces = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4
    const distance = 90 + Math.random() * 70
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance - 20
    const color = colors[i % colors.length]
    const size = 5 + Math.random() * 5
    const rotate = Math.random() * 360
    const isCircle = i % 2 === 0
    return { id: i, x, y, color, size, rotate, isCircle }
  })

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-20">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate, scale: 1 }}
          transition={{ duration: 0.9 + Math.random() * 0.4, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}
