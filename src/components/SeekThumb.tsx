import { getIllustration } from '../lib/illustrations'
import { SEEK_H, SEEK_W, type SeekItem, type SeekScene } from '../data/seek'

interface Props {
  scene: SeekScene
  item: SeekItem
  /** CSS size of the square, e.g. 56 or '100%' */
  size?: number | string
  className?: string
}

/** A square close-up of one thing, cropped straight out of the scene painting. */
export function SeekThumb({ scene, item, size = 56, className = '' }: Props) {
  const art = getIllustration(scene.art)
  const ar = item.areas[0]
  const side = Math.min(SEEK_W, Math.max(ar.rx, ar.ry) * 2 * 1.2 + 24)
  const x0 = Math.min(SEEK_W - side, Math.max(0, ar.cx - side / 2))
  const y0 = Math.min(SEEK_H - side, Math.max(0, ar.cy - side / 2))
  const px = SEEK_W - side > 0 ? (x0 / (SEEK_W - side)) * 100 : 0
  const py = SEEK_H - side > 0 ? (y0 / (SEEK_H - side)) * 100 : 0

  return (
    <div
      aria-hidden
      className={`aspect-square shrink-0 overflow-hidden bg-cream-dark ${className}`}
      style={{
        width: size,
        backgroundImage: art ? `url(${art})` : undefined,
        backgroundSize: `${(SEEK_W / side) * 100}% auto`,
        backgroundPosition: `${px}% ${py}%`,
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}
