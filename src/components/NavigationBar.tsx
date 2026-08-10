import { NavLink } from 'react-router-dom'
import { Home, LayoutGrid, Gamepad2, BookOpen, Sparkles, UserRound } from 'lucide-react'
import { sound } from '../lib/sound'
import { useTranslate } from '../i18n/useTranslate'
import type { DictKey } from '../i18n/dictionary'

const TABS: Array<{ to: string; key: DictKey; icon: typeof Home }> = [
  { to: '/', key: 'nav_home', icon: Home },
  { to: '/collection', key: 'nav_collection', icon: LayoutGrid },
  { to: '/play', key: 'nav_play', icon: Gamepad2 },
  { to: '/stories', key: 'nav_stories', icon: BookOpen },
  { to: '/journey', key: 'nav_journey', icon: Sparkles },
  { to: '/profile', key: 'nav_profile', icon: UserRound },
]

export function NavigationBar() {
  const t = useTranslate()
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-paper/95 backdrop-blur border-t border-forest/10 px-1 pb-[env(safe-area-inset-bottom)] z-40">
      <ul className="flex items-stretch justify-between">
        {TABS.map(({ to, key, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              onClick={() => sound.tap()}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
                  isActive ? 'text-terracotta' : 'text-ink-soft/60'
                }`
              }
            >
              <Icon size={20} strokeWidth={2.3} />
              <span className="text-[9.5px] font-semibold tracking-wide">{t(key)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
