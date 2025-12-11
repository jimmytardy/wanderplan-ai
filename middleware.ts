/**
 * Middleware pour la détection de la langue
 */
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  // Liste des locales supportées
  locales,
  
  // Locale par défaut
  defaultLocale,
  
  // Détection automatique de la langue du navigateur
  localeDetection: true,
  
  // Préfixe de locale dans l'URL (optionnel, peut être 'always', 'as-needed', ou 'never')
  localePrefix: 'as-needed',
})

export const config = {
  // Matcher toutes les routes sauf les fichiers statiques et les API routes
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}

