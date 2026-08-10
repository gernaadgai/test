import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PackageCheck } from 'lucide-react'
import { ConfettiBurst } from '../components/ConfettiBurst'
import { useMarketStore, formatMnt } from '../store/useMarketStore'

export function OrderConfirmedScreen() {
  const orders = useMarketStore((s) => s.orders)
  const order = orders[0]

  if (!order) return <Navigate to="/market" replace />

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-8 text-center gap-3 relative">
      <div className="relative">
        <ConfettiBurst count={22} />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 220 }}
          className="w-20 h-20 rounded-full bg-forest/10 flex items-center justify-center"
        >
          <PackageCheck size={36} className="text-forest" />
        </motion.div>
      </div>
      <h2 className="font-display font-extrabold text-2xl text-forest mt-2">Захиалга Баталгаажлаа!</h2>
      <p className="text-xs text-ink-soft/50">Order Confirmed</p>
      <p className="text-sm text-ink-soft/70">№{order.id} · {formatMnt(order.totalMnt)}</p>
      <p className="text-xs text-ink-soft/50 max-w-xs">Таны GER NAADGAI цуглуулгууд замдаа явж байна — хайрцаг бүр Монголын шинэ хэсгийг нээнэ.</p>

      <div className="flex gap-3 w-full mt-6">
        <Link to="/market" className="flex-1 rounded-2xl py-3.5 font-display font-extrabold text-sm border-2 border-forest/15 text-forest text-center">
          Дэлгүүр рүү
        </Link>
        <Link to="/" className="flex-1 rounded-2xl py-3.5 font-display font-extrabold text-sm text-cream text-center bg-forest">
          Нүүр
        </Link>
      </div>
    </div>
  )
}
