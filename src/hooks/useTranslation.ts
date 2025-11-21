import { useLanguage } from '../contexts/LanguageContext'

/**
 * Convenience hook for translations
 * Usage: const { t } = useTranslation()
 * Then: t('home.hi', { name: 'John' })
 */
export function useTranslation() {
  const { t } = useLanguage()
  return { t }
}

