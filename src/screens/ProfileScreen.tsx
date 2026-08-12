import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Volume2, VolumeX, Coins, ShoppingBag, Repeat, ShieldCheck, ChevronRight, Image, Languages } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { ProgressRing } from '../components/ProgressRing'
import { BadgeCard } from '../components/BadgeCard'
import { BADGES } from '../data/badges'
import { STORIES } from '../data/stories'
import { useCollectionStore, collectionProgress, totalCollectibles } from '../store/useCollectionStore'
import { useSettingsStore } from '../store/useSettingsStore'
import { useTranslate, useDict } from '../i18n/useTranslate'

const AVATARS = ['🐑', '🐴', '🐫', '🐐', '🐄', '🐯', '🐉']

export function ProfileScreen() {
  const navigate = useNavigate()
  const t = useTranslate()
  const dict = useDict()
  const collectorName = useCollectionStore((s) => s.collectorName)
  const avatar = useCollectionStore((s) => s.avatar)
  const unlockedIds = useCollectionStore((s) => s.unlockedCharacterIds)
  const completedStoryIds = useCollectionStore((s) => s.completedStoryIds)
  const completedGameIds = useCollectionStore((s) => s.completedGameIds)
  const earnedBadgeIds = useCollectionStore((s) => s.earnedBadgeIds)
  const setProfile = useCollectionStore((s) => s.setProfile)
  const naadgaiPoints = useCollectionStore((s) => s.naadgaiPoints)
  const duplicates = useCollectionStore((s) => s.duplicates)

  const [name, setName] = useState(collectorName)
  const [pickerOpen, setPickerOpen] = useState(false)
  const soundEnabled = useSettingsStore((s) => s.soundEnabled)
  const toggleSound = useSettingsStore((s) => s.toggleSound)
  const setParentMode = useSettingsStore((s) => s.setParentMode)
  const language = useSettingsStore((s) => s.language)
  const setLanguage = useSettingsStore((s) => s.setLanguage)

  const duplicateCount = Object.values(duplicates).reduce((n, c) => n + c, 0)

  const total = totalCollectibles()
  const five = collectionProgress('five-treasures', unlockedIds)
  const sheep2027 = collectionProgress('sheep-2027', unlockedIds)

  return (
    <div>
      <ScreenHeader titleMn={dict('profile_title').mn} titleEn={dict('profile_title').en} />

      <div className="px-5">
        <div className="rounded-3xl bg-forest text-cream p-6 flex flex-col items-center text-center relative">
          <button
            onClick={() => setPickerOpen((o) => !o)}
            className="w-20 h-20 rounded-full bg-cream/15 flex items-center justify-center text-4xl border-2 border-cream/30"
          >
            {avatar}
          </button>
          {pickerOpen && (
            <div className="absolute top-24 bg-paper rounded-2xl p-2 flex gap-1.5 shadow-[var(--shadow-pop)] z-10">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    setProfile(name, a)
                    setPickerOpen(false)
                  }}
                  className="text-2xl w-9 h-9 flex items-center justify-center rounded-full hover:bg-forest/10"
                >
                  {a}
                </button>
              ))}
            </div>
          )}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setProfile(name || 'Collector', avatar)}
            className="mt-3 bg-transparent text-center font-display font-extrabold text-lg outline-none border-b border-cream/0 focus:border-cream/40 w-40"
          />
          <p className="text-[11px] uppercase tracking-[0.14em] opacity-70 font-semibold">{t('profile_collector')}</p>
        </div>
      </div>

      <div className="px-5 mt-5 grid grid-cols-3 gap-3">
        <StatCard ring={unlockedIds.length / total} labelMn="Цуглуулга" labelEn="Collection" value={`${unlockedIds.length}/${total}`} color="#5C7C3E" />
        <StatCard ring={five.collected / five.total} labelMn="Таван Хошуу" labelEn="Five Treasures" value={`${five.collected}/${five.total}`} color="#B85C45" />
        <StatCard ring={sheep2027.collected / sheep2027.total} labelMn="2027 Хонь" labelEn="2027 Sheep" value={`${sheep2027.collected}/${sheep2027.total}`} color="#D2836F" />
      </div>

      <div className="px-5 mt-3 grid grid-cols-2 gap-3">
        <StatCard ring={completedStoryIds.length / STORIES.length} labelMn="Үлгэр" labelEn="Stories" value={`${completedStoryIds.length}/${STORIES.length}`} color="#6DB8D4" />
        <StatCard ring={Math.min(1, completedGameIds.length / 5)} labelMn="Тоглосон" labelEn="Games Played" value={`${completedGameIds.length}`} color="#E7B85C" />
      </div>

      <div className="px-5 mt-6 mb-6">
        <p className="font-display font-extrabold text-sm text-forest uppercase tracking-wide mb-3">{t('profile_badges')}</p>
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map((b) => (
            <BadgeCard key={b.id} badge={b} earned={earnedBadgeIds.includes(b.id)} />
          ))}
        </div>
      </div>

      <div className="px-5 mb-6">
        <p className="font-display font-extrabold text-sm text-forest uppercase tracking-wide mb-3">{t('profile_market_wallet')}</p>
        <div className="flex flex-col gap-2.5">
          <Link to="/wallet" className="flex items-center gap-3 rounded-2xl bg-paper border border-forest/10 shadow-[var(--shadow-card)] p-4">
            <Coins size={19} className="text-gold shrink-0" />
            <span className="flex-1 font-display font-extrabold text-sm">{t('profile_wallet')}</span>
            <span className="text-xs font-bold text-ink-soft/50">⭐ {naadgaiPoints}</span>
            <ChevronRight size={16} className="text-ink-soft/30" />
          </Link>
          <Link to="/market" className="flex items-center gap-3 rounded-2xl bg-paper border border-forest/10 shadow-[var(--shadow-card)] p-4">
            <ShoppingBag size={19} className="text-forest shrink-0" />
            <span className="flex-1 font-display font-extrabold text-sm">{t('profile_market')}</span>
            <ChevronRight size={16} className="text-ink-soft/30" />
          </Link>
          <Link to="/gallery" className="flex items-center gap-3 rounded-2xl bg-paper border border-forest/10 shadow-[var(--shadow-card)] p-4">
            <Image size={19} className="text-forest shrink-0" />
            <span className="flex-1 font-display font-extrabold text-sm">{t('profile_gallery')}</span>
            <ChevronRight size={16} className="text-ink-soft/30" />
          </Link>
          {duplicateCount > 0 && (
            <Link to="/market/exchange" className="flex items-center gap-3 rounded-2xl bg-terracotta/10 border border-terracotta/20 p-4">
              <Repeat size={19} className="text-terracotta shrink-0" />
              <span className="flex-1 font-display font-extrabold text-sm text-terracotta">{t('profile_exchange')}</span>
              <span className="text-xs font-bold text-terracotta">{duplicateCount}</span>
              <ChevronRight size={16} className="text-terracotta/50" />
            </Link>
          )}
          <button
            onClick={() => {
              setParentMode(true)
              navigate('/parent')
            }}
            className="flex items-center gap-3 rounded-2xl bg-paper border border-forest/10 shadow-[var(--shadow-card)] p-4"
          >
            <ShieldCheck size={19} className="text-forest shrink-0" />
            <span className="flex-1 text-left font-display font-extrabold text-sm">{t('profile_parent')}</span>
            <ChevronRight size={16} className="text-ink-soft/30" />
          </button>
        </div>
      </div>

      <div className="px-5 mb-6">
        <p className="font-display font-extrabold text-sm text-forest uppercase tracking-wide mb-3">{t('profile_settings')}</p>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={toggleSound}
            className="w-full flex items-center gap-3 rounded-2xl bg-paper border border-forest/10 shadow-[var(--shadow-card)] p-4"
          >
            {soundEnabled ? <Volume2 size={20} className="text-forest" /> : <VolumeX size={20} className="text-ink-soft/40" />}
            <span className="flex-1 text-left font-display font-extrabold text-sm">{t('profile_sound')}</span>
            <span className={`w-11 h-6 rounded-full relative transition-colors ${soundEnabled ? 'bg-forest' : 'bg-ink-soft/20'}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-cream transition-all ${soundEnabled ? 'left-5' : 'left-0.5'}`} />
            </span>
          </button>

          <div className="w-full flex items-center gap-3 rounded-2xl bg-paper border border-forest/10 shadow-[var(--shadow-card)] p-4">
            <Languages size={20} className="text-forest shrink-0" />
            <span className="flex-1 text-left font-display font-extrabold text-sm">{t('profile_language')}</span>
            <div className="flex rounded-full bg-cream-dark p-1 gap-1">
              <button
                onClick={() => setLanguage('mn')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${language === 'mn' ? 'bg-forest text-cream' : 'text-ink-soft/50'}`}
              >
                🇲🇳 Монгол
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${language === 'en' ? 'bg-forest text-cream' : 'text-ink-soft/50'}`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mb-6">
        <div className="rounded-2xl bg-sky/10 p-4 text-center">
          <p className="text-xs font-medium text-ink-soft/70">{dict('profile_parent_note').mn}</p>
          <p className="text-[11px] text-ink-soft/45 mt-1.5">{dict('profile_parent_note').en}</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ ring, labelMn, labelEn, value, color }: { ring: number; labelMn: string; labelEn: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl bg-paper border border-forest/10 shadow-[var(--shadow-card)] p-3 flex flex-col items-center gap-1.5">
      <ProgressRing progress={ring} size={44} stroke={5} color={color}>
        <span className="text-[10px] font-display font-extrabold" style={{ color }}>{value}</span>
      </ProgressRing>
      <p className="text-[10px] font-bold text-ink-soft/60 uppercase tracking-wide text-center leading-tight">{labelMn}</p>
      <p className="text-[9px] text-ink-soft/35 text-center leading-tight -mt-1">{labelEn}</p>
    </div>
  )
}
