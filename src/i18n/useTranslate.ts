import { useSettingsStore } from '../store/useSettingsStore'
import { DICTIONARY, type DictKey } from './dictionary'

/** Returns the string in the current language (mn by default). */
export function useTranslate() {
  const language = useSettingsStore((s) => s.language)
  return (key: DictKey) => DICTIONARY[key][language]
}

/** Returns { primary, secondary } — primary follows the language setting, secondary is the other language. */
export function useBiText() {
  const language = useSettingsStore((s) => s.language)
  return (key: DictKey) => {
    const entry = DICTIONARY[key]
    return language === 'mn' ? { primary: entry.mn, secondary: entry.en } : { primary: entry.en, secondary: entry.mn }
  }
}

export function useLanguage() {
  return useSettingsStore((s) => s.language)
}

/** Raw { mn, en } lookup, ignoring the language setting — for spots that always show both languages
 * (e.g. feeding ScreenHeader's titleMn/titleEn, which does its own primary/secondary swap). */
export function useDict() {
  return (key: DictKey) => DICTIONARY[key]
}
