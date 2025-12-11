/**
 * POST /api/generate-plan
 * Génère un programme de voyage via IA et l'enregistre automatiquement en BDD
 * Vérifie d'abord si un programme similaire existe déjà en BDD
 * Endpoint public
 */
import { NextRequest, NextResponse } from 'next/server'
import { generateTravelPlan } from '@/lib/ai'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { shouldPublishForSeo, markAsSeoExample } from '@/lib/seo-service'
import { findSimilarTravelPlan } from '@/lib/cache-service'
import { z } from 'zod'

// Schéma de validation complet avec tous les critères
const generatePlanSchema = z.object({
  // Critères de base
  destinationId: z.string().min(1, 'Destination requise'),
  duration: z.number().int().min(1).max(30),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  travelType: z.enum(['familial', 'romantique', 'entre-amis', 'solo', 'business']).optional(),
  theme: z.enum(['culture', 'nature', 'sport', 'gastronomie', 'luxe', 'detente']).optional(),
  
  // Critères activités
  preferredActivities: z.array(z.string()).optional(),
  activitiesToAvoid: z.array(z.string()).optional(),
  activityIntensity: z.enum(['relax', 'modere', 'intense']).optional(),
  activityBudget: z.enum(['gratuit', 'economique', 'moyen', 'premium']).optional(),
  accessibility: z.object({
    handicap: z.boolean().optional(),
    enfants: z.boolean().optional(),
    animaux: z.boolean().optional(),
  }).optional(),
  
  // Critères restauration
  restaurantType: z.array(z.enum(['local', 'international', 'vegan', 'gastronomique', 'street-food'])).optional(),
  mealBudget: z.enum(['petit', 'moyen', 'eleve']).optional(),
  dietaryPreferences: z.array(z.enum(['vegetarien', 'halal', 'casher', 'sans-gluten', 'sans-lactose'])).optional(),
  restaurantAmbiance: z.enum(['familiale', 'romantique', 'animee', 'calme']).optional(),
  
  // Critères logistiques
  transport: z.array(z.enum(['velo', 'voiture', 'marche', 'transports-communs'])).optional(),
  maxDistance: z.number().optional(), // en km
  preferredTime: z.array(z.enum(['matin', 'apres-midi', 'soir', 'journee-complete'])).optional(),
  weatherPreference: z.enum(['ensoleille', 'pluie-possible', 'neige']).optional(),
  
  // Budget global
  budget: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation
    const validatedData = generatePlanSchema.parse(body)
    const {
      destinationId,
      duration,
      startDate,
      endDate,
      travelType,
      theme,
      preferredActivities,
      activitiesToAvoid,
      activityIntensity,
      activityBudget,
      accessibility,
      restaurantType,
      mealBudget,
      dietaryPreferences,
      restaurantAmbiance,
      transport,
      maxDistance,
      preferredTime,
      weatherPreference,
      budget,
    } = validatedData

    logger.info('Generating travel plan', { destinationId, duration })

    // Vérifier d'abord si un programme similaire existe déjà
    const existingPlan = await findSimilarTravelPlan({
      destinationId,
      duration,
      travelType,
      theme,
      startDate,
      budget,
    })

    if (existingPlan) {
      logger.info('Returning existing travel plan from cache', {
        travelPlanId: existingPlan.id,
      })
      
      return NextResponse.json({
        success: true,
        data: {
          id: existingPlan.id,
          title: existingPlan.title,
          program: existingPlan.program,
          isPublished: existingPlan.isPublished,
          fromCache: true, // Indique que c'est depuis le cache
        },
      })
    }

    // Récupérer la destination
    const destinationRecord = await prisma.destination.findUnique({
      where: { id: destinationId },
    })

    if (!destinationRecord) {
      return NextResponse.json(
        {
          success: false,
          error: 'Destination introuvable',
        },
        { status: 404 }
      )
    }

    // Construire le prompt détaillé pour l'IA avec tous les critères
    let prompt = `Crée un programme de voyage détaillé de ${duration} jours pour ${destinationRecord.name} (${destinationRecord.country}).`
    
    if (startDate) {
      prompt += ` Dates: du ${startDate}${endDate ? ` au ${endDate}` : ''}.`
    }
    
    if (travelType) {
      const typeMap: Record<string, string> = {
        familial: 'voyage en famille',
        romantique: 'voyage romantique',
        'entre-amis': 'voyage entre amis',
        solo: 'voyage solo',
        business: 'voyage d\'affaires',
      }
      prompt += ` Type de voyage: ${typeMap[travelType] || travelType}.`
    }
    
    if (theme) {
      prompt += ` Thème: ${theme}.`
    }
    
    if (budget) {
      prompt += ` Budget global: ${budget}.`
    }
    
    if (preferredActivities && preferredActivities.length > 0) {
      prompt += ` Activités préférées: ${preferredActivities.join(', ')}.`
    }
    
    if (activitiesToAvoid && activitiesToAvoid.length > 0) {
      prompt += ` Activités à éviter: ${activitiesToAvoid.join(', ')}.`
    }
    
    if (activityIntensity) {
      prompt += ` Niveau d'intensité: ${activityIntensity}.`
    }
    
    if (activityBudget) {
      prompt += ` Budget par activité: ${activityBudget}.`
    }
    
    if (accessibility) {
      const needs = []
      if (accessibility.handicap) needs.push('accessibilité handicap')
      if (accessibility.enfants) needs.push('adapté aux enfants')
      if (accessibility.animaux) needs.push('animaux acceptés')
      if (needs.length > 0) {
        prompt += ` Accessibilité: ${needs.join(', ')}.`
      }
    }
    
    if (restaurantType && restaurantType.length > 0) {
      prompt += ` Type de restaurants: ${restaurantType.join(', ')}.`
    }
    
    if (mealBudget) {
      prompt += ` Budget par repas: ${mealBudget}.`
    }
    
    if (dietaryPreferences && dietaryPreferences.length > 0) {
      prompt += ` Préférences alimentaires: ${dietaryPreferences.join(', ')}.`
    }
    
    if (restaurantAmbiance) {
      prompt += ` Ambiance restaurant: ${restaurantAmbiance}.`
    }
    
    if (transport && transport.length > 0) {
      prompt += ` Transport préféré: ${transport.join(', ')}.`
    }
    
    if (maxDistance) {
      prompt += ` Distance maximale entre activités: ${maxDistance}km.`
    }
    
    if (preferredTime && preferredTime.length > 0) {
      prompt += ` Horaires préférés: ${preferredTime.join(', ')}.`
    }
    
    if (weatherPreference) {
      prompt += ` Météo préférée: ${weatherPreference}.`
    }
    
    prompt += ` Inclus des activités variées, des restaurants recommandés, et des conseils pratiques pour chaque jour.`

    // Générer le programme via IA
    const aiResponse = await generateTravelPlan(prompt)
    let programData: any

    try {
      programData = JSON.parse(aiResponse)
    } catch (parseError) {
      // Si le JSON n'est pas valide, essayer d'extraire le JSON du texte
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        programData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Réponse IA invalide: format JSON attendu')
      }
    }

    // Enregistrer le programme en BDD
    const travelPlan = await prisma.travelPlan.create({
      data: {
        title: programData.title || `Voyage à ${destinationRecord.name}`,
        destinationId: destinationRecord.id,
        program: programData,
        duration: duration,
        budget: budget || programData.budget || null,
        season: programData.season || null,
        isPublished: false,
        isExample: false,
      },
    })

    // Décider si on doit publier pour SEO
    const shouldPublish = await shouldPublishForSeo(programData)
    if (shouldPublish) {
      await markAsSeoExample(travelPlan.id)
      logger.info(`Travel plan ${travelPlan.id} auto-published for SEO`)
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: travelPlan.id,
          title: travelPlan.title,
          program: programData,
          isPublished: shouldPublish,
          fromCache: false,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    logger.error('Error generating travel plan', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erreur lors de la génération du programme',
      },
      { status: 500 }
    )
  }
}

