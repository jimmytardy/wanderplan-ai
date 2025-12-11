/**
 * Types partagés pour l'application
 */

// Structure d'un programme de voyage généré par l'IA
export interface TravelPlanProgram {
  title: string
  days: TravelDay[]
  budget?: string
  season?: string
  tips?: string[]
}

export interface TravelDay {
  day: number
  date?: string
  activities: Activity[]
  restaurants: Restaurant[]
}

export interface Activity {
  name: string
  time: string
  duration: string
  description?: string
  location?: string
}

export interface Restaurant {
  name: string
  time: string
  cuisine?: string
  priceRange?: string
  address?: string
}

// Réponse API standard
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  details?: any
}

// Pagination
export interface Pagination {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

