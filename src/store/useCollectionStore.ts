import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { COLLECTIONS } from '../data/collections'
import { CHARACTERS } from '../data/characters'
import { GAMES } from '../data/games'

interface CollectionState {
  collectorName: string
  avatar: string
  unlockedCharacterIds: string[]
  completedStoryIds: string[]
  completedGameIds: string[]
  earnedBadgeIds: string[]
  naadgaiPoints: number
  duplicates: Record<string, number>

  unlockCharacter: (characterId: string) => { newBadges: string[]; completedCollectionId: string | null }
  receiveDuplicate: (characterId: string) => void
  exchangeDuplicate: (characterId: string) => number
  completeStory: (storyId: string) => { newBadges: string[] }
  completeGame: (gameId: string) => { newBadges: string[] }
  spendPoints: (amount: number) => boolean
  setProfile: (name: string, avatar: string) => void
  resetProgress: () => void
}

const POINTS = {
  unlock: 50,
  story: 30,
  game: 20,
  collectionComplete: 150,
  exchange: 40,
}

const initial = {
  collectorName: 'Anujin',
  avatar: '🐑',
  unlockedCharacterIds: [] as string[],
  completedStoryIds: [] as string[],
  completedGameIds: [] as string[],
  earnedBadgeIds: [] as string[],
  naadgaiPoints: 0,
  duplicates: {} as Record<string, number>,
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      ...initial,

      unlockCharacter: (characterId) => {
        const state = get()
        if (state.unlockedCharacterIds.includes(characterId)) {
          return { newBadges: [], completedCollectionId: null }
        }
        const nextUnlocked = [...state.unlockedCharacterIds, characterId]
        const newBadges: string[] = []

        if (state.unlockedCharacterIds.length === 0) {
          newBadges.push('badge-first-discovery')
        }

        const character = CHARACTERS.find((c) => c.id === characterId)
        let completedCollectionId: string | null = null
        if (character) {
          const collection = COLLECTIONS.find((c) => c.id === character.collectionId)
          if (collection) {
            const allUnlocked = collection.characterIds.every((id) => nextUnlocked.includes(id))
            if (allUnlocked) {
              completedCollectionId = collection.id
              newBadges.push(collection.completionReward.badgeId)
            }
          }
        }

        let pointsEarned = POINTS.unlock
        if (completedCollectionId) pointsEarned += POINTS.collectionComplete

        set({
          unlockedCharacterIds: nextUnlocked,
          earnedBadgeIds: Array.from(new Set([...state.earnedBadgeIds, ...newBadges])),
          naadgaiPoints: state.naadgaiPoints + pointsEarned,
        })
        return { newBadges, completedCollectionId }
      },

      receiveDuplicate: (characterId) => {
        const state = get()
        set({ duplicates: { ...state.duplicates, [characterId]: (state.duplicates[characterId] ?? 0) + 1 } })
      },

      exchangeDuplicate: (characterId) => {
        const state = get()
        const count = state.duplicates[characterId] ?? 0
        if (count <= 0) return 0
        const nextDuplicates = { ...state.duplicates, [characterId]: count - 1 }
        set({ duplicates: nextDuplicates, naadgaiPoints: state.naadgaiPoints + POINTS.exchange })
        return POINTS.exchange
      },

      completeStory: (storyId) => {
        const state = get()
        if (state.completedStoryIds.includes(storyId)) return { newBadges: [] }
        const nextCompleted = [...state.completedStoryIds, storyId]
        const newBadges: string[] = []
        if (state.completedStoryIds.length === 0) newBadges.push('badge-story-keeper')
        set({
          completedStoryIds: nextCompleted,
          earnedBadgeIds: Array.from(new Set([...state.earnedBadgeIds, ...newBadges])),
          naadgaiPoints: state.naadgaiPoints + POINTS.story,
        })
        return { newBadges }
      },

      completeGame: (gameId) => {
        const state = get()
        if (state.completedGameIds.includes(gameId)) return { newBadges: [] }
        const nextCompleted = [...state.completedGameIds, gameId]
        const newBadges: string[] = []
        if (nextCompleted.length >= 5 && !state.earnedBadgeIds.includes('badge-game-master')) {
          newBadges.push('badge-game-master')
        }
        set({
          completedGameIds: nextCompleted,
          earnedBadgeIds: Array.from(new Set([...state.earnedBadgeIds, ...newBadges])),
          naadgaiPoints: state.naadgaiPoints + POINTS.game,
        })
        return { newBadges }
      },

      spendPoints: (amount) => {
        const state = get()
        if (state.naadgaiPoints < amount) return false
        set({ naadgaiPoints: state.naadgaiPoints - amount })
        return true
      },

      setProfile: (name, avatar) => set({ collectorName: name, avatar }),
      resetProgress: () => set({ ...initial }),
    }),
    { name: 'ger-naadgai-collector' },
  ),
)

// ---- pure derived helpers — pass the reactive arrays in from a component's own useCollectionStore selector ----

export function collectionProgress(collectionId: string, unlockedIds: string[]) {
  const collection = COLLECTIONS.find((c) => c.id === collectionId)
  if (!collection) return { collected: 0, total: 0 }
  const collected = collection.characterIds.filter((id) => unlockedIds.includes(id)).length
  return { collected, total: collection.characterIds.length }
}

export function isCollectionComplete(collectionId: string, unlockedIds: string[]) {
  const p = collectionProgress(collectionId, unlockedIds)
  return p.total > 0 && p.collected === p.total
}

export function isStoryUnlocked(unlockedIds: string[], requiredCollectionId?: string, characterId?: string) {
  if (requiredCollectionId) return isCollectionComplete(requiredCollectionId, unlockedIds)
  if (characterId) return unlockedIds.includes(characterId)
  return false
}

export function isGameUnlocked(gameId: string, unlockedIds: string[]) {
  const game = GAMES.find((g) => g.id === gameId)
  if (!game) return false
  if (game.id === 'game-archery') return isCollectionComplete('five-treasures', unlockedIds)
  return unlockedIds.includes(game.characterId)
}

export function totalCollectibles() {
  return CHARACTERS.length
}
