import { useState } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { Sparkles, Shirt, Gift, Check } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { AnimalIcon } from '../components/AnimalIcon'
import { getProduct } from '../data/products'
import { getCharacter } from '../data/characters'
import { useMarketStore, formatMnt } from '../store/useMarketStore'
import { sound } from '../lib/sound'

const ACCESSORY_ICON: Record<string, typeof Sparkles> = { sparkle: Sparkles, shirt: Shirt, candy: Gift }

export function ProductDetailScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = id ? getProduct(id) : undefined
  const addToCart = useMarketStore((s) => s.addToCart)
  const [added, setAdded] = useState(false)

  if (!product) return <Navigate to="/market" replace />

  const character = product.characterId ? getCharacter(product.characterId) : undefined
  const Icon = product.icon ? ACCESSORY_ICON[product.icon] : undefined
  const soldOut = product.availability === 'sold-out'

  function handleAdd() {
    if (!product) return
    addToCart(product.id)
    sound.success()
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div>
      <ScreenHeader titleMn={product.nameMn} titleEn={product.nameEn} back accent={product.accent} />

      <div className="px-5">
        <div className="rounded-3xl py-10 flex flex-col items-center gap-2" style={{ background: `${product.accent}14` }}>
          {product.availability !== 'in-stock' && (
            <span
              className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full text-white mb-1 ${
                soldOut ? 'bg-ink-soft/60' : 'bg-terracotta'
              }`}
            >
              {soldOut ? 'Дууссан' : 'Хязгаарлагдмал'}
            </span>
          )}
          <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ backgroundColor: `${product.accent}22` }}>
            {character ? (
              <AnimalIcon animal={character.animal} className="w-24 h-24" lineColor={product.accent} bodyColor="#FEFDFA" />
            ) : Icon ? (
              <Icon size={56} style={{ color: product.accent }} />
            ) : (
              <Gift size={56} style={{ color: product.accent }} />
            )}
          </div>
          <h2 className="font-display font-extrabold text-2xl text-center px-4 mt-2" style={{ color: product.accent }}>
            {product.nameMn}
          </h2>
          <p className="text-xs text-ink-soft/50">{product.nameEn}</p>
          <p className="font-display font-extrabold text-xl mt-1">{formatMnt(product.priceMnt)}</p>
        </div>

        <div className="mt-5">
          <p className="text-sm leading-relaxed text-ink-soft font-medium">{product.descriptionMn}</p>
          <p className="text-xs leading-relaxed mt-2 text-ink-soft/45">{product.descriptionEn}</p>
        </div>

        <div className="mt-6 mb-6">
          <button
            onClick={handleAdd}
            disabled={soldOut}
            className={`w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-display font-extrabold text-cream shadow-[var(--shadow-pop)] active:scale-[0.98] transition-transform ${
              soldOut ? 'bg-ink-soft/30 cursor-not-allowed' : ''
            }`}
            style={soldOut ? {} : { backgroundColor: added ? '#275A4D' : product.accent }}
          >
            {added ? (
              <>
                <Check size={18} /> Сагсанд нэмэгдлээ
              </>
            ) : soldOut ? (
              'Дууссан'
            ) : (
              'САГСАНД НЭМЭХ'
            )}
          </button>
          {!soldOut && (
            <button
              onClick={() => navigate('/market/cart')}
              className="w-full mt-3 rounded-2xl py-3.5 font-display font-extrabold text-sm border-2 border-forest/15 text-forest active:scale-[0.98] transition-transform"
            >
              Сагс харах
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
