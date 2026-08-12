import { Link } from 'react-router-dom'
import { Sparkles, Shirt, Gift } from 'lucide-react'
import type { Product } from '../types'
import { AnimalIcon } from './AnimalIcon'
import { getCharacter } from '../data/characters'
import { formatMnt } from '../store/useMarketStore'

const ACCESSORY_ICON: Record<string, typeof Sparkles> = {
  sparkle: Sparkles,
  shirt: Shirt,
  candy: Gift,
}

export function ProductCard({ product }: { product: Product }) {
  const character = product.characterId ? getCharacter(product.characterId) : undefined
  const Icon = product.icon ? ACCESSORY_ICON[product.icon] : undefined

  return (
    <Link
      to={`/market/${product.id}`}
      className="rounded-2xl bg-paper border border-forest/10 shadow-[var(--shadow-card)] p-3 flex flex-col gap-2 active:scale-[0.98] transition-transform"
    >
      <div className="relative">
        {product.availability === 'limited' && (
          <span className="absolute top-0 left-0 text-[8.5px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full text-white bg-terracotta z-10">
            Хязгаарлагдмал
          </span>
        )}
        {product.availability === 'sold-out' && (
          <span className="absolute top-0 left-0 text-[8.5px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full text-white bg-ink-soft/60 z-10">
            Дууссан
          </span>
        )}
        <div
          className={`w-full aspect-square rounded-xl flex items-center justify-center ${product.availability === 'sold-out' ? 'opacity-40 grayscale' : ''}`}
          style={{ backgroundColor: `${product.accent}18` }}
        >
          {character ? (
            <AnimalIcon animal={character.animal} className="w-14 h-14" lineColor={product.accent} bodyColor="#FFFCF4" />
          ) : Icon ? (
            <Icon size={36} style={{ color: product.accent }} />
          ) : (
            <Gift size={36} style={{ color: product.accent }} />
          )}
        </div>
      </div>
      <div>
        <p className="font-display font-extrabold text-xs leading-tight truncate">{product.nameMn}</p>
        <p className="text-[9.5px] text-ink-soft/45 truncate">{product.nameEn}</p>
      </div>
      <p className="font-display font-extrabold text-sm" style={{ color: product.accent }}>
        {formatMnt(product.priceMnt)}
      </p>
    </Link>
  )
}
