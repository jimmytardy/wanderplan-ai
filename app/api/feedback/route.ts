/**
 * POST /api/feedback
 * Collecte les avis utilisateur (public)
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

// Schéma de validation
const feedbackSchema = z.object({
  travelPlanId: z.string().min(1, 'travelPlanId requis'),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = feedbackSchema.parse(body)

    const { travelPlanId, rating, comment, email } = validatedData

    // Vérifier que le programme existe
    const travelPlan = await prisma.travelPlan.findUnique({
      where: { id: travelPlanId },
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

    // Créer le feedback
    const feedback = await prisma.feedback.create({
      data: {
        travelPlanId,
        rating,
        comment: comment || null,
        email: email || null,
      },
    })

    logger.info('Feedback created', { feedbackId: feedback.id, travelPlanId })

    return NextResponse.json(
      {
        success: true,
        data: {
          id: feedback.id,
          rating: feedback.rating,
          createdAt: feedback.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    logger.error('Error creating feedback', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erreur lors de la création du feedback',
      },
      { status: 500 }
    )
  }
}

