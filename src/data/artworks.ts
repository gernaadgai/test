import type { LandscapeVariant } from '../components/Landscape'

export interface Artwork {
  id: string
  variant: LandscapeVariant
  titleMn: string
  titleEn: string
  unlockHintMn: string
  unlockHintEn: string
  isUnlocked: (ctx: { unlockedCount: number; fiveTreasuresComplete: boolean; sheep2027Collected: boolean; completedStories: number }) => boolean
}

export const ARTWORKS: Artwork[] = [
  {
    id: 'art-first-steppe',
    variant: 'steppe',
    titleMn: 'АНХНЫ ТАЛ',
    titleEn: 'The First Steppe',
    unlockHintMn: 'Анхны амьтнаа нээ',
    unlockHintEn: 'Discover your first collectible',
    isUnlocked: ({ unlockedCount }) => unlockedCount >= 1,
  },
  {
    id: 'art-gobi-journey',
    variant: 'gobi',
    titleMn: 'ГОВИЙН АЯЛАЛ',
    titleEn: 'Gobi Journey',
    unlockHintMn: '3 амьтан цуглуул',
    unlockHintEn: 'Collect 3 characters',
    isUnlocked: ({ unlockedCount }) => unlockedCount >= 3,
  },
  {
    id: 'art-altai-morning',
    variant: 'altai',
    titleMn: 'АЛТАЙН ӨГЛӨӨ',
    titleEn: 'Altai Morning',
    unlockHintMn: 'Таван хошуу малаа гүйцээ',
    unlockHintEn: 'Complete the Five Treasures',
    isUnlocked: ({ fiveTreasuresComplete }) => fiveTreasuresComplete,
  },
  {
    id: 'art-tsagaan-sar',
    variant: 'winter',
    titleMn: 'ЦАГААН САРЫН ШӨНӨ',
    titleEn: 'Tsagaan Sar Night',
    unlockHintMn: '2027 Хонь жилийг цуглуул',
    unlockHintEn: 'Collect the 2027 Year of the Sheep',
    isUnlocked: ({ sheep2027Collected }) => sheep2027Collected,
  },
  {
    id: 'art-steppe-sky',
    variant: 'night',
    titleMn: 'ТАЛЫН ОДТОЙ ШӨНӨ',
    titleEn: 'Night Under the Steppe Sky',
    unlockHintMn: '3 үлгэр уншиж дуусга',
    unlockHintEn: 'Finish 3 stories',
    isUnlocked: ({ completedStories }) => completedStories >= 3,
  },
]

export function getArtwork(id: string) {
  return ARTWORKS.find((a) => a.id === id)
}
