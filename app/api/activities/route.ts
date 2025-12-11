/**
 * GET /api/activities
 * Suggestions activités pour une destination et période (public)
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const destinationId = searchParams.get('destinationId')
    const type = searchParams.get('type')
    const season = searchParams.get('season')

    if (!destinationId) {
      return NextResponse.json(
        {
          success: false,
          error: 'destinationId est requis',
        },
        { status: 400 }
      )
    }

    const where: any = {
      destinationId,
    }

    if (type) {
      where.type = { contains: type, mode: 'insensitive' }
    }

    if (season) {
      where.season = { contains: season, mode: 'insensitive' }
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: activities,
    })
  } catch (error: any) {
    logger.error('Error fetching activities', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des activités',
      },
      { status: 500 }
    )
  }
}

