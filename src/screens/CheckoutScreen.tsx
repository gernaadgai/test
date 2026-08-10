import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Truck, CreditCard, ShieldCheck, X } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { getProduct } from '../data/products'
import { useMarketStore, cartTotal, formatMnt } from '../store/useMarketStore'
import { sound } from '../lib/sound'

const PAYMENT_METHODS = [
  { id: 'cod', labelMn: 'Хүргэлтээр төлөх', labelEn: 'Cash on Delivery', icon: Truck },
  { id: 'card', labelMn: 'Карт •••• 4821 (хадгалсан)', labelEn: 'Bank Card on file', icon: CreditCard },
]

export function CheckoutScreen() {
  const navigate = useNavigate()
  const cart = useMarketStore((s) => s.cart)
  const placeOrder = useMarketStore((s) => s.placeOrder)
  const [method, setMethod] = useState('cod')
  const [approvalOpen, setApprovalOpen] = useState(false)
  const [placing, setPlacing] = useState(false)
  const total = cartTotal(cart)

  if (cart.length === 0 && !placing) return <Navigate to="/market" replace />

  function approve() {
    setPlacing(true)
    setApprovalOpen(false)
    sound.complete()
    placeOrder()
    navigate('/market/order-confirmed')
  }

  return (
    <div>
      <ScreenHeader titleMn="Тооцоо" titleEn="Checkout" back />

      <div className="px-5">
        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft/50 mb-2">Захиалгын дэлгэрэнгүй</p>
        <div className="rounded-2xl bg-paper border border-forest/10 p-4 flex flex-col gap-2 mb-5">
          {cart.map((item) => {
            const product = getProduct(item.productId)
            if (!product) return null
            return (
              <div key={item.productId} className="flex items-center justify-between text-sm">
                <span className="text-ink-soft/80">
                  {product.nameMn} × {item.qty}
                </span>
                <span className="font-bold">{formatMnt(product.priceMnt * item.qty)}</span>
              </div>
            )
          })}
          <div className="border-t border-forest/10 mt-1 pt-2 flex items-center justify-between">
            <span className="font-display font-extrabold text-sm">Нийт дүн</span>
            <span className="font-display font-extrabold text-base text-forest">{formatMnt(total)}</span>
          </div>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft/50 mb-2">Хүргэлт</p>
        <div className="rounded-2xl bg-paper border border-forest/10 p-4 flex items-center gap-3 mb-5">
          <Truck size={18} className="text-forest shrink-0" />
          <p className="text-sm text-ink-soft/70">Энгийн хүргэлт, 3–5 хоног · Улаанбаатар</p>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft/50 mb-2">Төлбөрийн арга</p>
        <div className="flex flex-col gap-2 mb-6">
          {PAYMENT_METHODS.map(({ id, labelMn, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMethod(id)}
              className={`flex items-center gap-3 rounded-2xl p-4 border-2 text-left transition-colors ${
                method === id ? 'border-terracotta bg-terracotta/10' : 'border-forest/10 bg-paper'
              }`}
            >
              <Icon size={18} className="text-ink-soft/70 shrink-0" />
              <span className="text-sm font-semibold flex-1">{labelMn}</span>
              <span className={`w-4 h-4 rounded-full border-2 ${method === id ? 'border-terracotta bg-terracotta' : 'border-ink-soft/30'}`} />
            </button>
          ))}
          <p className="text-[11px] text-ink-soft/40 px-1">Энэ бол загвар төлбөр — бодит гүйлгээ хийгдэхгүй.</p>
        </div>

        <button
          onClick={() => setApprovalOpen(true)}
          className="w-full rounded-2xl bg-forest text-cream font-display font-extrabold py-4 shadow-[var(--shadow-pop)] active:scale-[0.98] transition-transform mb-6"
        >
          ЭЦЭГ ЭХИЙН ЗӨВШӨӨРӨЛ ХҮСЭХ
        </button>
      </div>

      <AnimatePresence>
        {approvalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/50 flex items-end justify-center z-50"
          >
            <motion.div
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              className="w-full max-w-[480px] bg-paper rounded-t-[28px] p-6 pb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-forest" />
                  <p className="font-display font-extrabold text-base">Эцэг эхийн зөвшөөрөл</p>
                </div>
                <button onClick={() => setApprovalOpen(false)} className="w-8 h-8 rounded-full bg-cream-dark flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-ink-soft/70 leading-relaxed mb-1 font-medium">
                Энэ <strong>{formatMnt(total)}</strong> үнийн худалдан авалтыг эцэг эх зөвшөөрөх шаардлагатай.
              </p>
              <p className="text-[11px] text-ink-soft/40 mb-5">Загвар симуляц — бодит хувилбарт эцэг эхийн нэвтрэлт ашиглана.</p>
              <button
                onClick={approve}
                className="w-full rounded-2xl bg-forest text-cream font-display font-extrabold py-4 active:scale-[0.98] transition-transform"
              >
                Би эцэг эх мөн — Зөвшөөрөх
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
