import { useLanguage } from '../i18n/useTranslate'

interface Props {
  mn: string
  en: string
  as?: 'h1' | 'h2' | 'p' | 'span'
  size?: 'lg' | 'md' | 'sm'
  color?: string
  className?: string
  stacked?: boolean
}

const SIZE_PRIMARY: Record<string, string> = {
  lg: 'text-2xl',
  md: 'text-base',
  sm: 'text-sm',
}
const SIZE_SECONDARY: Record<string, string> = {
  lg: 'text-xs',
  md: 'text-[11px]',
  sm: 'text-[10px]',
}

/** Renders a name/title bilingually — Mongolian-first by default, primary language swaps with the language setting. */
export function Bi({ mn, en, as: As = 'p', size = 'md', color, className = '', stacked = true }: Props) {
  const language = useLanguage()
  const primary = language === 'mn' ? mn : en
  const secondary = language === 'mn' ? en : mn

  return (
    <span className={stacked ? 'block' : 'inline-flex items-baseline gap-1.5'}>
      <As className={`font-display font-extrabold leading-tight ${SIZE_PRIMARY[size]} ${className}`} style={color ? { color } : undefined}>
        {primary}
      </As>
      <span className={`block text-ink-soft/50 font-medium ${SIZE_SECONDARY[size]}`}>{secondary}</span>
    </span>
  )
}
