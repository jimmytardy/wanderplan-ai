/**
 * POST /api/auth/login
 * Authentification admin (retourne un JWT)
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken } from '@/lib/jwt'
import { logger } from '@/lib/logger'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Trouver l'admin
    const admin = await prisma.admin.findUnique({
      where: { email },
    })

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email ou mot de passe incorrect',
        },
        { status: 401 }
      )
    }

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, admin.password)

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email ou mot de passe incorrect',
        },
        { status: 401 }
      )
    }

    // Générer le token JWT
    const token = generateToken({
      adminId: admin.id,
      email: admin.email,
    })

    logger.info('Admin logged in', { adminId: admin.id })

    return NextResponse.json({
      success: true,
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        },
      },
    })
  } catch (error: any) {
    logger.error('Error in login', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la connexion',
      },
      { status: 500 }
    )
  }
}

