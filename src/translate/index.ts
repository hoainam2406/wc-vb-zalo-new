import { vi } from './vi'
import { en } from './en'

export type TranslationKey = keyof typeof vi
export type Locale = 'vi' | 'en'

export const translations = {
  vi,
  en,
} as const

export const getTranslation = (locale: Locale = 'vi') => {
  return translations[locale] || translations.vi
}
