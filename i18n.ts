/**
 * Configuration i18n pour next-intl
 */
import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['fr', 'en', 'pt', 'es', 'it'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'fr'

export default getRequestConfig(async ({ locale }) => {
  // Valider que la locale est supportée
  if (!locales.includes(locale as Locale)) notFound()

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})

