/**
 * Service interne pour décider si un programme doit être enregistré pour SEO
 */
import { prisma } from './prisma'
import { logger } from './logger'

/**
 * Décide si un programme généré doit être marqué comme exemple pour SEO
 * Critères :
 * - Programme complet (au moins 3 jours)
 * - Destination valide
 * - Contenu structuré correctement
 */
export async function shouldPublishForSeo(program: any): Promise<boolean> {
  try {
    // Vérifier que le programme a une structure valide
    if (!program || !program.days || !Array.isArray(program.days)) {
      return false
    }

    // Au moins 3 jours de programme
    if (program.days.length < 3) {
      return false
    }

    // Vérifier que chaque jour a au moins une activité
    const hasValidDays = program.days.every(
      (day: any) => day.activities && day.activities.length > 0
    )

    if (!hasValidDays) {
      return false
    }

    // Si tous les critères sont remplis, on peut publier pour SEO
    return true
  } catch (error) {
    logger.error('Error checking SEO eligibility', error)
    return false
  }
}

/**
 * Marque un programme comme exemple pour SEO
 */
export async function markAsSeoExample(travelPlanId: string) {
  try {
    await prisma.travelPlan.update({
      where: { id: travelPlanId },
      data: {
        isExample: true,
        isPublished: true,
      },
    })

    logger.info(`Travel plan ${travelPlanId} marked as SEO example`)
  } catch (error) {
    logger.error('Error marking travel plan as SEO example', error)
    throw error
  }
}

