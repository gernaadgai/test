import type { Badge } from '../types'

export function BadgeCard({ badge, earned }: { badge: Badge; earned: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1.5 rounded-2xl p-3 border text-center ${earned ? 'bg-paper border-forest/10 shadow-[var(--shadow-card)]' : 'bg-cream-dark/40 border-forest/5'}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${earned ? 'bg-gold/20' : 'bg-ink-soft/10 grayscale opacity-40'}`}>
        {badge.icon}
      </div>
      <p className={`text-[10.5px] font-bold leading-tight ${earned ? 'text-ink' : 'text-ink-soft/40'}`}>{badge.nameEn}</p>
    </div>
  )
}
