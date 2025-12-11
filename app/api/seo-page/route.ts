/**
 * POST /api/seo-page
 * Génère une page SEO à partir d'un programme validé
 * Accessible en public (mais peut nécessiter un programme validé)
 */
import { NextRequest, NextResponse } from 'next/server'
import { generateSeoPage } from '@/lib/ai'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

// Schéma de validation
const seoPageSchema = z.object({
  travelPlanId: z.string().min(1, 'travelPlanId requis'),
  slug: z.string().optional(),
  save: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = seoPageSchema.parse(body)

    const { travelPlanId, slug, save } = validatedData

    // Récupérer le programme
    const travelPlan = await prisma.travelPlan.findUnique({
      where: { id: travelPlanId },
      include: {
        destination: true,
      },
    })

    if (!travelPlan) {
      return NextResponse.json(
        {
          success: false,
          error: 'Programme de voyage introuvable',
        },
        { status: 404 }
      )
    }

    // Préparer les données pour la génération SEO
    const planData = {
      title: travelPlan.title,
      destination: travelPlan.destination,
      duration: travelPlan.duration,
      budget: travelPlan.budget,
      season: travelPlan.season,
      program: travelPlan.program,
    }

    // Générer la page SEO
    logger.info('Generating SEO page', { travelPlanId })
    const htmlContent = await generateSeoPage(planData)

    // Si demandé, sauvegarder la page
    let seoPageId: string | null = null
    if (save && slug) {
      const seoPage = await prisma.seoPage.create({
        data: {
          slug: slug,
          title: travelPlan.title,
          content: htmlContent,
          metaDescription: `Programme de voyage ${travelPlan.duration} jours à ${travelPlan.destination.name}`,
          travelPlanId: travelPlan.id,
        },
      })

      seoPageId = seoPage.id
      logger.info('SEO page saved', { seoPageId, slug })
    }

    return NextResponse.json({
      success: true,
      data: {
        htmlContent,
        seoPageId,
        travelPlan: {
          id: travelPlan.id,
          title: travelPlan.title,
        },
      },
    })
  } catch (error: any) {
    logger.error('Error generating SEO page', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erreur lors de la génération de la page SEO',
      },
      { status: 500 }
    )
  }
}

