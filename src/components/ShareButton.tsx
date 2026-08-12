import { useState } from 'react'
import { Share2, Lock } from 'lucide-react'
import { ShareSheet } from './ShareSheet'
import type { ShareCardConfig } from '../lib/shareCard'
import { useSettingsStore } from '../store/useSettingsStore'
import { sound } from '../lib/sound'

interface Props {
  config: ShareCardConfig
  label?: string
  variant?: 'solid' | 'outline'
  accent?: string
  className?: string
}

export function ShareButton({ config, label = 'Нээлтээ Хуваалц', variant = 'outline', accent = '#4C7A3A', className = '' }: Props) {
  const [open, setOpen] = useState(false)
  const sharingAllowed = useSettingsStore((s) => s.sharingAllowed)

  if (!sharingAllowed) {
    return (
      <div className={`flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-display font-extrabold text-ink-soft/40 bg-cream-dark/50 ${className}`}>
        <Lock size={16} /> Хуваалцах хаалттай
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => {
          sound.tap()
          setOpen(true)
        }}
        className={`flex items-center justify-center gap-2 rounded-2xl py-3.5 font-display font-extrabold text-sm active:scale-[0.98] transition-transform ${
          variant === 'solid' ? 'text-cream' : 'border-2'
        } ${className}`}
        style={variant === 'solid' ? { backgroundColor: accent } : { borderColor: `${accent}30`, color: accent }}
      >
        <Share2 size={17} /> {label}
      </button>
      <ShareSheet open={open} onClose={() => setOpen(false)} config={config} />
    </>
  )
}
