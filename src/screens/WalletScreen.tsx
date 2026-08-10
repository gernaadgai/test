import { Link } from 'react-router-dom'
import { Coins, Wallet, Lock, Gamepad2, BookOpen, ScanLine, Trophy } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { useCollectionStore } from '../store/useCollectionStore'
import { useMarketStore, formatMnt } from '../store/useMarketStore'

const EARN_WAYS = [
  { icon: ScanLine, label: 'Шинэ цуглуулга скандах', amount: '+50' },
  { icon: BookOpen, label: 'Үлгэрээ дуусгах', amount: '+30' },
  { icon: Gamepad2, label: 'Тоглоом дуусгах', amount: '+20' },
  { icon: Trophy, label: 'Цуглуулгаа гүйцээх', amount: '+150' },
]

export function WalletScreen() {
  const points = useCollectionStore((s) => s.naadgaiPoints)
  const parentWalletMnt = useMarketStore((s) => s.parentWalletMnt)
  const childAllowanceMnt = useMarketStore((s) => s.childAllowanceMnt)

  return (
    <div>
      <ScreenHeader titleMn="Хэтэвч" titleEn="Wallet" back />

      <div className="px-5">
        <div className="rounded-3xl p-6 bg-gradient-to-br from-gold/30 to-terracotta/15 flex flex-col items-center text-center mb-3">
          <Coins size={28} className="text-gold mb-2" />
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft/60">NAADGAI ОНОО</p>
          <p className="font-display font-extrabold text-4xl text-ink mt-1">⭐ {points.toLocaleString()}</p>
          <p className="text-xs font-medium text-ink-soft/60 mt-2">Апп доторх урамшууллын оноо — бодит мөнгө биш, бэлнээр солигдохгүй.</p>
          <p className="text-[10px] text-ink-soft/40 mt-1">In-app reward points — not real money, cannot be exchanged for cash.</p>
        </div>

        <div className="rounded-2xl bg-paper border border-forest/10 p-4 mb-6">
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft/50 mb-3">Хэрхэн олох вэ</p>
          <div className="flex flex-col gap-2.5">
            {EARN_WAYS.map(({ icon: Icon, label, amount }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-forest" />
                </div>
                <span className="text-sm text-ink-soft/80 flex-1">{label}</span>
                <span className="text-sm font-display font-extrabold text-gold">{amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl p-6 bg-cream-dark/50 border border-forest/10 flex flex-col items-center text-center mb-3 relative overflow-hidden">
          <Lock size={16} className="absolute top-4 right-4 text-ink-soft/30" />
          <Wallet size={28} className="text-ink-soft/40 mb-2" />
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft/50">ЭЦЭГ ЭХИЙН ХЭТЭВЧ</p>
          <p className="font-display font-extrabold text-3xl text-ink-soft/70 mt-1">{formatMnt(parentWalletMnt)}</p>
          <p className="text-xs font-medium text-ink-soft/60 mt-1">Таны зарцуулах эрх: {formatMnt(childAllowanceMnt)}</p>
          <p className="text-[11px] text-ink-soft/40 mt-2 max-w-xs">
            Бодит мөнгөний баланс, эцэг эхээр удирддаг. Загварчлагдсан — бодит төлбөрийн систем холбогдоогүй.
          </p>
        </div>

        <Link
          to="/parent"
          className="block text-center rounded-2xl border-2 border-forest/15 text-forest font-display font-extrabold text-sm py-3.5 mb-6"
        >
          Эцэг эхийн хяналт руу очих
        </Link>
      </div>
    </div>
  )
}
