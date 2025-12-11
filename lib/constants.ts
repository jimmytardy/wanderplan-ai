/**
 * Constantes de l'application
 */

// Durées de cache Redis (en secondes)
export const CACHE_TTL = {
  TRAVEL_PLAN: 86400, // 24 heures
  CUSTOM_CONTENT: 43200, // 12 heures
  DESTINATIONS: 3600, // 1 heure
  RESTAURANTS: 3600, // 1 heure
  ACTIVITIES: 3600, // 1 heure
} as const

// Limites par défaut pour la pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  DEFAULT_OFFSET: 0,
} as const

// Durées de voyage
export const TRAVEL_DURATION = {
  MIN: 1,
  MAX: 30,
} as const

// Notes de feedback
export const FEEDBACK_RATING = {
  MIN: 1,
  MAX: 5,
} as const

