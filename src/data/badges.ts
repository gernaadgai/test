import type { Badge } from '../types'

export const BADGES: Badge[] = [
  { id: 'badge-first-discovery', nameMn: 'НЭЭЛТ', nameEn: 'First Discovery', icon: '✨', description: 'Scanned your very first GER NAADGAI collectible.' },
  { id: 'badge-five-treasures', nameMn: 'ТАВАН ХОШУУ МАЛ', nameEn: 'Five Treasures', icon: '🐎', description: 'Collected all Five Treasures of Mongolia.' },
  { id: 'badge-story-keeper', nameMn: 'ҮЛГЭРИЙН ХҮН', nameEn: 'Story Keeper', icon: '📖', description: 'Completed your first story.' },
  { id: 'badge-game-master', nameMn: 'ТОГЛООМЫН МАСТЕР', nameEn: 'Game Master', icon: '🏆', description: 'Completed 5 mini-games.' },
  { id: 'badge-year-keeper', nameMn: 'ЖИЛИЙН ЭЗЭН', nameEn: 'Year Keeper', icon: '🐑', description: 'Collected the 2027 annual zodiac special edition.' },
  { id: 'badge-explorer', nameMn: 'СУДЛААЧ', nameEn: 'Explorer', icon: '🧭', description: 'Discovered everything in the Mongolian world.' },
  { id: 'badge-ger-keeper', nameMn: 'ГЭРИЙН ЭЗЭН', nameEn: 'Ger Keeper', icon: '🏕', description: 'Found every treasure hidden inside the ger.' },
  { id: 'badge-seeker', nameMn: 'ХАЙГЧ', nameEn: 'Seeker', icon: '🔍', description: 'Finished your first seek-and-find scene.' },
  { id: 'badge-sharp-eye', nameMn: 'ХҮЧИРХЭГ НҮД', nameEn: 'Sharp Eye', icon: '👁', description: 'Earned three stars in three different scenes.' },
  { id: 'badge-seek-master', nameMn: 'ХАЙЖ ОЛОХ ЭЗЭН', nameEn: 'Seek Master', icon: '🧭', description: 'Finished every seek-and-find scene.' },
  { id: 'badge-journey', nameMn: '12 ЖИЛИЙН АЯЛАГЧ', nameEn: '12-Year Journey', icon: '🌟', description: 'Complete the entire zodiac cycle across 12 years.' },
]

export function getBadge(id: string) {
  return BADGES.find((b) => b.id === id)
}
