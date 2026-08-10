import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'mn' | 'en'

interface SettingsState {
  soundEnabled: boolean
  language: Language
  sharingAllowed: boolean
  parentMode: boolean
  screenTimeMinutes: number
  notificationsEnabled: boolean
  privacyLocked: boolean
  toggleSound: () => void
  setLanguage: (lang: Language) => void
  setSharingAllowed: (allowed: boolean) => void
  setParentMode: (on: boolean) => void
  setScreenTimeMinutes: (min: number) => void
  setNotificationsEnabled: (on: boolean) => void
  setPrivacyLocked: (on: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      language: 'mn',
      sharingAllowed: true,
      parentMode: false,
      screenTimeMinutes: 45,
      notificationsEnabled: true,
      privacyLocked: true,
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setLanguage: (language) => set({ language }),
      setSharingAllowed: (sharingAllowed) => set({ sharingAllowed }),
      setParentMode: (parentMode) => set({ parentMode }),
      setScreenTimeMinutes: (screenTimeMinutes) => set({ screenTimeMinutes }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setPrivacyLocked: (privacyLocked) => set({ privacyLocked }),
    }),
    { name: 'ger-naadgai-settings' },
  ),
)
