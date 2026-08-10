import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { AnimalIcon } from '../components/AnimalIcon'
import { getProduct } from '../data/products'
import { getCharacter } from '../data/characters'
import { useMarketStore, cartTotal, formatMnt } from '../store/useMarketStore'

export function CartScreen() {
  const navigate = useNavigate()
  const cart = useMarketStore((s) => s.cart)
  const setQty = useMarketStore((s) => s.setQty)
  const removeFromCart = useMarketStore((s) => s.removeFromCart)
  const total = cartTotal(cart)

  if (cart.length === 0) {
    return (
      <div>
        <ScreenHeader titleMn="Миний Сагс" titleEn="Your Cart" back />
        <div className="px-5">
          <div className="rounded-3xl border border-dashed border-forest/20 p-10 text-center flex flex-col items-center gap-3">
            <ShoppingBag size={32} className="text-ink-soft/30" />
            <div className="text-center">
              <p className="text-sm font-bold text-ink-soft/60">Сагс хоосон байна.</p>
              <p className="text-xs text-ink-soft/40 mt-0.5">Your cart is empty.</p>
            </div>
            <Link to="/market" className="mt-2 rounded-2xl bg-forest text-cream font-display font-extrabold text-sm px-6 py-3">
              Дэлгүүр үзэх
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <ScreenHeader title="Your Cart" back subtitle="САГС" />

      <div className="px-5 flex flex-col gap-3">
        {cart.map((item) => {
          const product = getProduct(item.productId)
          if (!product) return null
          const character = product.characterId ? getCharacter(product.characterId) : undefined
          return (
            <div key={item.productId} className="rounded-2xl bg-paper border border-forest/10 p-3 flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${product.accent}18` }}>
                {character && <AnimalIcon animal={character.animal} className="w-9 h-9" lineColor={product.accent} bodyColor="#FEFDFA" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-extrabold text-xs truncate">{product.nameEn}</p>
                <p className="text-xs text-ink-soft/60 mt-0.5">{formatMnt(product.priceMnt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setQty(item.productId, item.qty - 1)} className="w-7 h-7 rounded-full bg-cream-dark flex items-center justify-center">
                  <Minus size={13} />
                </button>
                <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                <button onClick={() => setQty(item.productId, item.qty + 1)} className="w-7 h-7 rounded-full bg-cream-dark flex items-center justify-center">
                  <Plus size={13} />
                </button>
              </div>
              <button onClick={() => removeFromCart(item.productId)} className="text-ink-soft/40 shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          )
        })}
      </div>

      <div className="px-5 mt-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="font-display font-extrabold text-sm text-ink-soft/70">Нийт дүн</span>
          <span className="font-display font-extrabold text-xl text-forest">{formatMnt(total)}</span>
        </div>
        <button
          onClick={() => navigate('/market/checkout')}
          className="w-full rounded-2xl bg-forest text-cream font-display font-extrabold py-4 shadow-[var(--shadow-pop)] active:scale-[0.98] transition-transform"
        >
          ТООЦОО ХИЙХ
        </button>
      </div>
    </div>
  )
}
