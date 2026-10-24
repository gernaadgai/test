import { NavLink, useLocation } from 'react-router-dom'
import { Mountain, Tent, LayoutGrid, Gamepad2, ScanLine } from 'lucide-react'
import { sound } from '../lib/sound'
import { useTranslate } from '../i18n/useTranslate'
import type { DictKey } from '../i18n/dictionary'

const TABS: Array<{ to: string; key: DictKey; icon: typeof Mountain }> = [
  { to: '/', key: 'nav_world', icon: Mountain },
  { to: '/ger', key: 'nav_ger', icon: Tent },
  { to: '/collection', key: 'nav_collection', icon: LayoutGrid },
  { to: '/play', key: 'nav_play', icon: Gamepad2 },
  { to: '/scan', key: 'nav_scan', icon: ScanLine },
]

/** A light floating dock — five places, one icon family, never covers the story art. */
export function NavigationBar() {
  const t = useTranslate()
  const { pathname } = useLocation()
  return (
    <nav
      aria-label="Үндсэн цэс"
      className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-[480px] -translate-x-1/2 rounded-[26px] border border-forest/10 bg-paper/92 px-1.5 py-1 shadow-[var(--shadow-pop)] backdrop-blur-md"
    >
      <ul className="flex items-stretch justify-between">
        {TABS.map(({ to, key, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              onClick={() => sound.tap()}
              className={({ isActive }) =>
                `flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-[20px] py-1.5 transition-colors ${
                  isActive || (to === '/play' && pathname.startsWith('/seek')) ? 'bg-forest text-cream' : 'text-ink-soft hover:text-forest'
                }`
              }
            >
              <Icon size={21} strokeWidth={2.3} aria-hidden />
              <span className="text-[10px] font-bold tracking-wide">{t(key)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
