/**
 * GET /api/destinations
 * Liste des destinations disponibles (public)
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const country = searchParams.get('country')

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (country) {
      where.country = { contains: country, mode: 'insensitive' }
    }

    const destinations = await prisma.destination.findMany({
      where,
      include: {
        _count: {
          select: {
            travelPlans: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: destinations,
    })
  } catch (error: any) {
    logger.error('Error fetching destinations', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des destinations',
      },
      { status: 500 }
    )
  }
}

