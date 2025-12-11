/**
 * GET /api/restaurants
 * Suggestions restaurants pour une destination (public)
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const destinationId = searchParams.get('destinationId')
    const cuisine = searchParams.get('cuisine')
    const priceRange = searchParams.get('priceRange')

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

    if (cuisine) {
      where.cuisine = { contains: cuisine, mode: 'insensitive' }
    }

    if (priceRange) {
      where.priceRange = priceRange
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      orderBy: [
        { rating: 'desc' },
        { name: 'asc' },
      ],
    })

    return NextResponse.json({
      success: true,
      data: restaurants,
    })
  } catch (error: any) {
    logger.error('Error fetching restaurants', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des restaurants',
      },
      { status: 500 }
    )
  }
}

