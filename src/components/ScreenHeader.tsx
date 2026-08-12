import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useLanguage } from '../i18n/useTranslate'

interface Props {
  /** Preferred API — pass both languages and the header handles primary/secondary swap. */
  titleMn?: string
  titleEn?: string
  /** Legacy/simple API — used as-is with no language swap when translations aren't available yet. */
  title?: string
  subtitle?: string
  back?: boolean
  accent?: string
  right?: React.ReactNode
}

export function ScreenHeader({ titleMn, titleEn, title, subtitle, back, accent = '#4C7A3A', right }: Props) {
  const navigate = useNavigate()
  const language = useLanguage()

  let primary = title
  let secondary = subtitle
  if (titleMn && titleEn) {
    primary = language === 'mn' ? titleMn : titleEn
    secondary = language === 'mn' ? titleEn : titleMn
  }

  return (
    <header className="flex items-center gap-3 px-5 pt-6 pb-4">
      {back && (
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-paper border border-forest/10 flex items-center justify-center shadow-sm shrink-0"
          aria-label="Back"
        >
          <ChevronLeft size={19} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="font-display font-extrabold text-xl leading-tight truncate" style={{ color: accent }}>
          {primary}
        </h1>
        {secondary && <p className="text-xs text-ink-soft/70 mt-0.5">{secondary}</p>}
      </div>
      {right}
    </header>
  )
}
