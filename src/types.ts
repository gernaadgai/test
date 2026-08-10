export type AnimalId =
  | 'horse' | 'camel' | 'sheep' | 'goat' | 'cow'
  | 'mouse' | 'ox' | 'tiger' | 'rabbit' | 'dragon' | 'snake'
  | 'monkey' | 'rooster' | 'dog' | 'pig'

export type Rarity = 'common' | 'special' | 'rare' | 'legendary'

export interface Character {
  id: string
  animal: AnimalId
  nameMn: string
  nameEn: string
  collectionId: string
  number: number
  rarity: Rarity
  accent: string
  tagline: string
  taglineMn: string
  story: string
  storyMn: string
  fact: string
  factMn: string
  storyId?: string
  gameId?: string
  qrCode: string
}

export interface Collection {
  id: string
  nameMn: string
  nameEn: string
  subtitle: string
  description: string
  accent: string
  characterIds: string[]
  completionReward: {
    titleMn: string
    titleEn: string
    description: string
    badgeId: string
    unlockStoryId?: string
    unlockGameId?: string
  }
}

export type ZodiacStatus = 'active' | 'unlocked' | 'locked'

export interface ZodiacYear {
  year: number
  animal: AnimalId
  animalMn: string
  animalEn: string
  characterId?: string
  collectionId?: string
  status: ZodiacStatus
}

export interface StoryPage {
  text: string
  caption?: string
}

export interface Story {
  id: string
  titleMn: string
  titleEn: string
  characterId?: string
  accent: string
  requiredCollectionId?: string
  pages: StoryPage[]
}

export interface MiniGame {
  id: string
  nameMn: string
  nameEn: string
  characterId: string
  accent: string
  description: string
  descriptionMn: string
  durationLabel: string
  instruction: string
  instructionMn: string
  goal: number
  timeLimit: number
}

export interface Badge {
  id: string
  nameMn: string
  nameEn: string
  icon: string
  description: string
}

export type ProductCategory = 'new' | 'five-treasures' | 'sheep-2027' | 'limited-edition' | 'collections' | 'accessories'
export type Availability = 'in-stock' | 'limited' | 'sold-out'

export interface Product {
  id: string
  nameMn: string
  nameEn: string
  category: ProductCategory
  characterId?: string
  accent: string
  rarity: Rarity
  priceMnt: number
  availability: Availability
  descriptionMn: string
  descriptionEn: string
  icon?: string
}

export interface CartItem {
  productId: string
  qty: number
}

export interface Order {
  id: string
  items: CartItem[]
  totalMnt: number
  placedAt: string
  status: 'pending-approval' | 'approved' | 'confirmed'
}
