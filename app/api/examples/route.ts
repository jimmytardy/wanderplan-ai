/**
 * GET /api/examples
 * Récupère la liste des programmes validés pour SEO (public)
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const destinationId = searchParams.get('destinationId')

    // Construire la requête
    const where: any = {
      isPublished: true,
      isExample: true,
    }

    if (destinationId) {
      where.destinationId = destinationId
    }

    // Récupérer les exemples
    const [examples, total] = await Promise.all([
      prisma.travelPlan.findMany({
        where,
        include: {
          destination: {
            select: {
              id: true,
              name: true,
              country: true,
              city: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.travelPlan.count({ where }),
    ])

    // Formater la réponse (sans le programme complet pour alléger)
    const formattedExamples = examples.map((plan) => ({
      id: plan.id,
      title: plan.title,
      duration: plan.duration,
      budget: plan.budget,
      season: plan.season,
      destination: plan.destination,
      createdAt: plan.createdAt,
      // Extraire un résumé du programme (premier jour)
      summary: plan.program && typeof plan.program === 'object' && 'days' in plan.program
        ? {
            firstDay: (plan.program as any).days?.[0] || null,
          }
        : null,
    }))

    return NextResponse.json({
      success: true,
      data: {
        examples: formattedExamples,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
    })
  } catch (error: any) {
    logger.error('Error fetching examples', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des exemples',
      },
      { status: 500 }
    )
  }
}

