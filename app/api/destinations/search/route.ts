/**
 * GET /api/destinations/search
 * Recherche de destinations avec autocomplete
 * Endpoint public
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    // Recherche dans nom, ville, pays
    const destinations = await prisma.destination.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
          { country: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        _count: {
          select: {
            travelPlans: true,
          },
        },
      },
      orderBy: [
        { name: 'asc' },
      ],
      take: limit,
    })

    // Formater pour l'autocomplete
    const formatted = destinations.map((dest) => ({
      id: dest.id,
      label: `${dest.name}${dest.city ? `, ${dest.city}` : ''}, ${dest.country}`,
      name: dest.name,
      city: dest.city,
      country: dest.country,
      description: dest.description,
      imageUrl: dest.imageUrl,
      travelPlansCount: dest._count.travelPlans,
    }))

    return NextResponse.json({
      success: true,
      data: formatted,
    })
  } catch (error: any) {
    logger.error('Error searching destinations', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la recherche de destinations',
      },
      { status: 500 }
    )
  }
}
