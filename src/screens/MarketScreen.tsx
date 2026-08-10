import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Coins } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { ProductCard } from '../components/ProductCard'
import { Landscape } from '../components/Landscape'
import { PRODUCTS, CATEGORY_LABELS } from '../data/products'
import { useMarketStore } from '../store/useMarketStore'
import { useCollectionStore } from '../store/useCollectionStore'
import { useTranslate, useLanguage, useDict } from '../i18n/useTranslate'

const CATEGORIES = ['new', 'five-treasures', 'sheep-2027', 'limited-edition', 'collections', 'accessories'] as const

export function MarketScreen() {
  const [category, setCategory] = useState<string>('new')
  const cart = useMarketStore((s) => s.cart)
  const points = useCollectionStore((s) => s.naadgaiPoints)
  const cartCount = cart.reduce((n, i) => n + i.qty, 0)
  const t = useTranslate()
  const dict = useDict()
  const language = useLanguage()

  const products = PRODUCTS.filter((p) => p.category === category)

  return (
    <div>
      <ScreenHeader
        titleMn={dict('market_title').mn}
        titleEn={dict('market_title').en}
        right={
          <Link to="/market/cart" className="relative w-10 h-10 rounded-full bg-paper border border-forest/10 flex items-center justify-center shrink-0">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-terracotta text-cream text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        }
      />

      <div className="px-5 mb-4">
        <div className="relative rounded-3xl overflow-hidden h-28">
          <Landscape variant="steppe" className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent flex items-end p-4">
            <p className="text-cream font-display font-extrabold text-sm drop-shadow">Монголыг цуглуулга бүрээр нээ.</p>
          </div>
        </div>
      </div>

      <div className="px-5 mb-3 flex items-center justify-between">
        <p className="text-xs text-ink-soft/60 max-w-[70%]">{t('market_tagline')}</p>
        <Link to="/wallet" className="flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1.5 shrink-0">
          <Coins size={14} className="text-gold" />
          <span className="text-xs font-display font-extrabold text-ink">{points.toLocaleString()}</span>
        </Link>
      </div>

      <div className="px-5 mb-4 flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
              category === cat ? 'bg-forest text-cream' : 'bg-paper border border-forest/10 text-ink-soft/60'
            }`}
          >
            {CATEGORY_LABELS[cat][language]}
          </button>
        ))}
      </div>

      <div className="px-5">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-forest/20 p-8 text-center">
            <p className="text-sm text-ink-soft/50">Одоохондоо энд юу ч алга.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      <div className="px-5 mt-2 mb-6">
        <div className="rounded-2xl bg-sky/10 p-4 text-center">
          <p className="text-xs font-medium text-ink-soft/70">{dict('market_footer').mn}</p>
          <p className="text-[11px] text-ink-soft/45 mt-1">{dict('market_footer').en}</p>
        </div>
      </div>
    </div>
  )
}
