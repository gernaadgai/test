import type { Collection } from '../types'

export const COLLECTIONS: Collection[] = [
  {
    id: 'five-treasures',
    nameMn: 'ТАВАН ХОШУУ МАЛ',
    nameEn: 'Five Treasures of Mongolia',
    subtitle: 'Үндсэн цуглуулга',
    description:
      'The five animals that have carried Mongolian nomadic life for thousands of years. Collect all five to unlock the secret of the steppe.',
    accent: '#183F35',
    characterIds: ['horse', 'camel', 'sheep', 'goat', 'cow'],
    completionReward: {
      titleMn: 'ТАВАН ХОШУУ МАЛ',
      titleEn: 'You found all Five Treasures!',
      description: 'Гэр дээр чинь нууц чимэглэл гарч ирлээ, шинэ домог нээгдэж, тусгай тоглоом хүлээж байна.',
      badgeId: 'badge-five-treasures',
      unlockStoryId: 'story-erkhii-mergen',
      unlockGameId: 'game-archery',
    },
  },
  {
    id: 'sheep-2027',
    nameMn: '2027 ХОНЬ ЖИЛ',
    nameEn: '2027 Special Edition — Year of the Sheep',
    subtitle: 'Жил тутмын хязгаарлагдмал хэвлэл',
    description:
      'The first chapter of the 12-Year Journey. A rare, once-a-year collection that only appears in 2027.',
    accent: '#C0553A',
    characterIds: ['sheep-2027'],
    completionReward: {
      titleMn: 'ХОНЬ ЖИЛИЙН ЭЗЭН',
      titleEn: 'Keeper of the Year',
      description: 'Жилийн Эзэн тэмдэг чинь олдлоо — 12 жилийн аяллын анхны тамга.',
      badgeId: 'badge-year-keeper',
    },
  },
]

export function getCollection(id: string) {
  return COLLECTIONS.find((c) => c.id === id)
}
