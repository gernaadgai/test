import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Receipt, ShieldCheck, Bell, Eye, Share2, Clock, LogOut } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { useCollectionStore, totalCollectibles } from '../store/useCollectionStore'
import { useMarketStore, formatMnt } from '../store/useMarketStore'
import { useSettingsStore } from '../store/useSettingsStore'

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${on ? 'bg-forest' : 'bg-ink-soft/20'}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-cream transition-all ${on ? 'left-5' : 'left-0.5'}`} />
    </button>
  )
}

export function ParentDashboardScreen() {
  const navigate = useNavigate()
  const collectorName = useCollectionStore((s) => s.collectorName)
  const unlockedIds = useCollectionStore((s) => s.unlockedCharacterIds)
  const naadgaiPoints = useCollectionStore((s) => s.naadgaiPoints)
  const orders = useMarketStore((s) => s.orders)
  const parentWalletMnt = useMarketStore((s) => s.parentWalletMnt)
  const childAllowanceMnt = useMarketStore((s) => s.childAllowanceMnt)
  const setParentWallet = useMarketStore((s) => s.setParentWallet)
  const setChildAllowance = useMarketStore((s) => s.setChildAllowance)

  const sharingAllowed = useSettingsStore((s) => s.sharingAllowed)
  const setSharingAllowed = useSettingsStore((s) => s.setSharingAllowed)
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled)
  const setNotificationsEnabled = useSettingsStore((s) => s.setNotificationsEnabled)
  const privacyLocked = useSettingsStore((s) => s.privacyLocked)
  const setPrivacyLocked = useSettingsStore((s) => s.setPrivacyLocked)
  const screenTimeMinutes = useSettingsStore((s) => s.screenTimeMinutes)
  const setScreenTimeMinutes = useSettingsStore((s) => s.setScreenTimeMinutes)
  const setParentMode = useSettingsStore((s) => s.setParentMode)

  const total = totalCollectibles()

  function exit() {
    setParentMode(false)
    navigate('/profile')
  }

  return (
    <div>
      <ScreenHeader
        titleMn="Эцэг Эхийн Хяналт"
        titleEn="Parent Control"
        right={
          <button onClick={exit} className="w-10 h-10 rounded-full bg-paper border border-forest/10 flex items-center justify-center shrink-0">
            <LogOut size={16} />
          </button>
        }
      />

      <div className="px-5">
        <div className="rounded-2xl bg-forest text-cream p-4 mb-5 flex items-center gap-3">
          <ShieldCheck size={20} />
          <p className="text-xs leading-relaxed opacity-90">
            Энэ бол эцэг эхийн хяналтын самбарын загвар симуляц. Бодит хувилбарт тусдаа, найдвартай эцэг эхийн нэвтрэлт ашиглана.
          </p>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft/50 mb-2">Хүүхдийн профайл</p>
        <div className="rounded-2xl bg-paper border border-forest/10 p-4 mb-5 flex items-center justify-between">
          <div>
            <p className="font-display font-extrabold text-sm">{collectorName}</p>
            <p className="text-xs text-ink-soft/50 mt-0.5">
              {unlockedIds.length}/{total} цуглуулга · ⭐ {naadgaiPoints} оноо
            </p>
          </div>
          <Link to="/collection" className="text-xs font-bold text-forest">
            Харах →
          </Link>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft/50 mb-2">Хэтэвч ба зарцуулалт</p>
        <div className="rounded-2xl bg-paper border border-forest/10 p-4 mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold">Эцэг эхийн хэтэвчийн үлдэгдэл</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setParentWallet(parentWalletMnt - 10000)} className="w-7 h-7 rounded-full bg-cream-dark flex items-center justify-center">
              <Minus size={13} />
            </button>
            <span className="font-display font-extrabold text-sm w-24 text-center">{formatMnt(parentWalletMnt)}</span>
            <button onClick={() => setParentWallet(parentWalletMnt + 10000)} className="w-7 h-7 rounded-full bg-cream-dark flex items-center justify-center">
              <Plus size={13} />
            </button>
          </div>
        </div>
        <div className="rounded-2xl bg-paper border border-forest/10 p-4 mb-5 flex items-center justify-between">
          <span className="text-sm font-semibold">Хүүхдийн зарцуулах хязгаар</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setChildAllowance(childAllowanceMnt - 5000)} className="w-7 h-7 rounded-full bg-cream-dark flex items-center justify-center">
              <Minus size={13} />
            </button>
            <span className="font-display font-extrabold text-sm w-24 text-center">{formatMnt(childAllowanceMnt)}</span>
            <button onClick={() => setChildAllowance(childAllowanceMnt + 5000)} className="w-7 h-7 rounded-full bg-cream-dark flex items-center justify-center">
              <Plus size={13} />
            </button>
          </div>
        </div>
        <p className="text-[11px] text-ink-soft/40 -mt-3 mb-5 px-1">Бодит мөнгөний баланс, төлбөр зөвхөн загварчлагдсан — лицензтэй төлбөрийн систем холбогдоогүй.</p>

        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft/50 mb-2">Худалдан авалтын түүх</p>
        <div className="rounded-2xl bg-paper border border-forest/10 p-4 mb-5">
          {orders.length === 0 ? (
            <p className="text-xs text-ink-soft/50 flex items-center gap-2">
              <Receipt size={14} /> Захиалга алга байна.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between text-xs">
                  <span className="text-ink-soft/70">{o.id}</span>
                  <span className="font-bold">{formatMnt(o.totalMnt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft/50 mb-2">Хяналтууд</p>
        <div className="flex flex-col gap-2.5 mb-6">
          <div className="rounded-2xl bg-paper border border-forest/10 p-4 flex items-center gap-3">
            <Clock size={18} className="text-forest shrink-0" />
            <span className="flex-1 text-sm font-semibold">Дэлгэцийн цагийн сануулга</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setScreenTimeMinutes(Math.max(10, screenTimeMinutes - 15))} className="w-7 h-7 rounded-full bg-cream-dark flex items-center justify-center">
                <Minus size={13} />
              </button>
              <span className="text-sm font-bold w-14 text-center">{screenTimeMinutes} мин</span>
              <button onClick={() => setScreenTimeMinutes(screenTimeMinutes + 15)} className="w-7 h-7 rounded-full bg-cream-dark flex items-center justify-center">
                <Plus size={13} />
              </button>
            </div>
          </div>
          <div className="rounded-2xl bg-paper border border-forest/10 p-4 flex items-center gap-3">
            <Share2 size={18} className="text-forest shrink-0" />
            <span className="flex-1 text-sm font-semibold">Нийгмийн сүлжээнд хуваалцахыг зөвшөөрөх</span>
            <Toggle on={sharingAllowed} onToggle={() => setSharingAllowed(!sharingAllowed)} />
          </div>
          <div className="rounded-2xl bg-paper border border-forest/10 p-4 flex items-center gap-3">
            <Bell size={18} className="text-forest shrink-0" />
            <span className="flex-1 text-sm font-semibold">Мэдэгдэл</span>
            <Toggle on={notificationsEnabled} onToggle={() => setNotificationsEnabled(!notificationsEnabled)} />
          </div>
          <div className="rounded-2xl bg-paper border border-forest/10 p-4 flex items-center gap-3">
            <Eye size={18} className="text-forest shrink-0" />
            <span className="flex-1 text-sm font-semibold">Нууцлалын түгжээ (хувийн мэдээлэл цуглуулахгүй)</span>
            <Toggle on={privacyLocked} onToggle={() => setPrivacyLocked(!privacyLocked)} />
          </div>
        </div>
      </div>
    </div>
  )
}
