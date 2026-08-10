import type { ZodiacYear } from '../types'

/** The active launch year for the platform. Change this one value to roll the whole app forward a year. */
export const CURRENT_YEAR = 2027

export const ZODIAC_CYCLE: ZodiacYear[] = [
  { year: 2026, animal: 'horse', animalMn: 'МОРЬ', animalEn: 'Horse', status: 'locked' },
  { year: 2027, animal: 'sheep', animalMn: 'ХОНЬ', animalEn: 'Sheep', characterId: 'sheep-2027', collectionId: 'sheep-2027', status: 'active' },
  { year: 2028, animal: 'monkey', animalMn: 'БИЧ', animalEn: 'Monkey', status: 'locked' },
  { year: 2029, animal: 'rooster', animalMn: 'ТАХИА', animalEn: 'Rooster', status: 'locked' },
  { year: 2030, animal: 'dog', animalMn: 'НОХОЙ', animalEn: 'Dog', status: 'locked' },
  { year: 2031, animal: 'pig', animalMn: 'ГАХАЙ', animalEn: 'Pig', status: 'locked' },
  { year: 2032, animal: 'mouse', animalMn: 'ХУЛГАНА', animalEn: 'Mouse', status: 'locked' },
  { year: 2033, animal: 'ox', animalMn: 'ҮХЭР', animalEn: 'Ox', status: 'locked' },
  { year: 2034, animal: 'tiger', animalMn: 'БАР', animalEn: 'Tiger', status: 'locked' },
  { year: 2035, animal: 'rabbit', animalMn: 'ТУУЛАЙ', animalEn: 'Rabbit', status: 'locked' },
  { year: 2036, animal: 'dragon', animalMn: 'ЛУУ', animalEn: 'Dragon', status: 'locked' },
  { year: 2037, animal: 'snake', animalMn: 'МОГОЙ', animalEn: 'Snake', status: 'locked' },
]

export function getCurrentZodiacYear(): ZodiacYear {
  return ZODIAC_CYCLE.find((z) => z.year === CURRENT_YEAR) ?? ZODIAC_CYCLE[0]
}
