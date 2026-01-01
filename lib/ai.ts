/**
 * Service d'intégration avec l'IA (abstraction multi-provider)
 * Supporte OpenAI, Gemini, et autres providers via l'interface AIProvider
 */
import { getCache, setCache } from './redis'
import { getAIProvider } from './ai/factory'
import { logger } from './logger'
import type { AIMessage } from './ai/types'

/**
 * Génère un programme de voyage via IA
 */
export async function generateTravelPlan(prompt: string): Promise<string> {
  // Vérifier le cache d'abord
  const cacheKey = `ai:travel-plan:${Buffer.from(prompt).toString('base64')}`
  const cached = await getCache(cacheKey)
  
  if (cached) {
    logger.info('Cache hit for travel plan generation')
    return cached
  }

  try {
    const provider = getAIProvider()

    const systemPrompt = `You are a travel planning expert. 
Generate detailed travel itineraries in JSON format with this structure:
{
  "title": "Titre du voyage",
  "days": [
    {
      "day": 1,
      "date": "2024-01-15",
      "activities": [
        {
          "name": "Nom de l'activité",
          "time": "09:00",
          "duration": "2h",
          "description": "Description",
          "location": "Adresse"
        }
      ],
      "restaurants": [
        {
          "name": "Nom du restaurant",
          "time": "12:30",
          "cuisine": "Type de cuisine",
          "priceRange": "€€"
        }
      ]
    }
  ],
  "budget": "Budget estimé",
  "tips": ["Conseil 1", "Conseil 2"]
}`

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: prompt,
      },
    ]

    const content = await provider.generate({
      messages,
      temperature: 0.7,
      maxTokens: 2000,
    })

    // Mettre en cache pour 24h
    await setCache(cacheKey, content, 86400)

    return content
  } catch (error: any) {
    logger.error('Error generating travel plan', error)
    throw new Error('Erreur lors de la génération du programme de voyage')
  }
}

/**
 * Génère du contenu IA depuis un prompt configurable (pour admin)
 */
export async function generateCustomContent(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const cacheKey = `ai:custom:${Buffer.from(prompt + (systemPrompt || '')).toString('base64')}`
  const cached = await getCache(cacheKey)
  
  if (cached) {
    logger.info('Cache hit for custom content generation')
    return cached
  }

  try {
    const provider = getAIProvider()

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: systemPrompt || 'Tu es un assistant IA utile et créatif.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]

    const content = await provider.generate({
      messages,
      temperature: 0.8,
      maxTokens: 2000,
    })

    // Mettre en cache pour 12h
    await setCache(cacheKey, content, 43200)

    return content
  } catch (error: any) {
    logger.error('Error generating custom content', error)
    throw new Error('Erreur lors de la génération de contenu')
  }
}

/**
 * Génère une page SEO à partir d'un programme de voyage
 */
export async function generateSeoPage(travelPlan: any): Promise<string> {
  const prompt = `Génère une page HTML complète et optimisée SEO pour ce programme de voyage :
  ${JSON.stringify(travelPlan, null, 2)}
  
  La page doit inclure :
  - Un titre H1 optimisé SEO
  - Des balises meta description
  - Du contenu structuré avec des sections
  - Des listes d'activités et restaurants
  - Des conseils pratiques
  - Un format HTML valide`

  try {
    const htmlContent = await generateCustomContent(
      prompt,
      'Tu es un expert SEO et rédacteur web. Génère du contenu HTML optimisé pour le référencement.'
    )

    return htmlContent
  } catch (error: any) {
    logger.error('Error generating SEO page', error)
    throw new Error('Erreur lors de la génération de la page SEO')
  }
}

