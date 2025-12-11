/**
 * POST /api/ai-configurable
 * Génère du contenu IA depuis un prompt configurable
 * Accessible uniquement aux admins
 */
import { NextRequest, NextResponse } from 'next/server'
import { generateCustomContent } from '@/lib/ai'
import { requireAdmin } from '@/lib/middleware'
import { logger } from '@/lib/logger'
import { z } from 'zod'

// Schéma de validation
const aiConfigurableSchema = z.object({
  prompt: z.string().min(1, 'Prompt requis'),
  systemPrompt: z.string().optional(),
  saveForSeo: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoSlug: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const admin = await requireAdmin(request)

    logger.info('AI configurable request from admin', { adminId: admin.id })

    const body = await request.json()
    const validatedData = aiConfigurableSchema.parse(body)
    
    const { prompt, systemPrompt, saveForSeo, seoTitle, seoSlug } = validatedData

    // Générer le contenu via IA
    const content = await generateCustomContent(prompt, systemPrompt)

    // Si demandé, sauvegarder pour SEO
    let seoPageId: string | null = null
    if (saveForSeo && seoTitle && seoSlug) {
      const { prisma } = await import('@/lib/prisma')
      
      const seoPage = await prisma.seoPage.create({
        data: {
          slug: seoSlug,
          title: seoTitle,
          content: content,
          metaDescription: content.substring(0, 160), // Premiers 160 caractères
        },
      })

      seoPageId = seoPage.id
      logger.info(`SEO page created`, { seoPageId, slug: seoSlug })
    }

    return NextResponse.json({
      success: true,
      data: {
        content,
        seoPageId,
      },
    })
  } catch (error: any) {
    logger.error('Error in AI configurable', error)

    if (error.message === 'Unauthorized: Admin authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentification admin requise' },
        { status: 401 }
      )
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erreur lors de la génération de contenu',
      },
      { status: 500 }
    )
  }
}

