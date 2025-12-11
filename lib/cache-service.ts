/**
 * Service de cache pour vérifier si un programme similaire existe déjà en BDD
 * Évite de régénérer avec l'IA si une recherche similaire a déjà été faite
 */
import { prisma } from './prisma'
import { logger } from './logger'

interface SearchCriteria {
  destinationId: string
  duration: number
  travelType?: string
  theme?: string
  travelStyle?: string
  startDate?: string
  budget?: string
  locale?: string
}

/**
 * Trouve un programme similaire en BDD basé sur les critères de recherche
 * Retourne le programme le plus récent qui correspond aux critères principaux
 */
export async function findSimilarTravelPlan(
  criteria: SearchCriteria
): Promise<any | null> {
  try {
    const { destinationId, duration, travelType, theme, travelStyle, startDate, budget, locale } =
      criteria

    // Recherche basée sur les critères principaux
    const where: any = {
      destinationId,
      duration,
    }

    // Rechercher les programmes correspondants
    const similarPlans = await prisma.travelPlan.findMany({
      where,
      include: {
        destination: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Limiter à 10 résultats pour la comparaison
    })

    if (similarPlans.length === 0) {
      return null
    }

    // Filtrer par critères additionnels si disponibles
    let bestMatch = similarPlans[0]

    // Si on a des critères additionnels, chercher le meilleur match
    if (travelType || theme || travelStyle || budget || locale) {
      for (const plan of similarPlans) {
        let score = 0

        // Vérifier la langue (priorité haute - même langue = meilleur match)
        if (locale && plan.program && typeof plan.program === 'object') {
          const program = plan.program as any
          const programLocale = program.locale || 'fr'
          if (programLocale === locale) {
            score += 5 // Très important pour le matching
          }
        }

        // Vérifier le thème dans le programme JSON
        if (theme && plan.program && typeof plan.program === 'object') {
          const program = plan.program as any
          const programTheme = program.theme || program.title?.toLowerCase()
          if (programTheme?.includes(theme)) {
            score += 2
          }
        }

        // Vérifier le style de voyage (classique/original/atypique)
        if (travelStyle && plan.program && typeof plan.program === 'object') {
          const program = plan.program as any
          const programStyle = program.travelStyle || program.style || ''
          if (programStyle.toLowerCase().includes(travelStyle.toLowerCase())) {
            score += 3 // Plus important pour le matching
          }
        }

        // Vérifier le budget
        if (budget && plan.budget) {
          if (plan.budget.toLowerCase().includes(budget.toLowerCase())) {
            score += 1
          }
        }

        // Si le score est meilleur, c'est notre match
        if (score > 0) {
          bestMatch = plan
          break
        }
      }
    }

    // Si on a une date de début, vérifier la saison
    if (startDate) {
      const date = new Date(startDate)
      const month = date.getMonth() + 1 // 1-12
      const season =
        month >= 3 && month <= 5
          ? 'printemps'
          : month >= 6 && month <= 8
          ? 'été'
          : month >= 9 && month <= 11
          ? 'automne'
          : 'hiver'

      if (
        bestMatch.season &&
        bestMatch.season.toLowerCase().includes(season)
      ) {
        logger.info('Found matching season', { season, planId: bestMatch.id })
      }
    }

    logger.info('Found similar travel plan', {
      planId: bestMatch.id,
      criteria,
    })

    return bestMatch
  } catch (error) {
    logger.error('Error finding similar travel plan', error)
    return null
  }
}
