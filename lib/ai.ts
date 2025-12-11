/**
 * Service d'intégration avec l'IA (OpenAI GPT-4 ou GPT-3.5-turbo)
 * Note: GPT-5 Nano n'existe pas encore, on utilise GPT-4 ou GPT-3.5-turbo
 */
import OpenAI from 'openai'
import { getCache, setCache } from './redis'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Modèle à utiliser (peut être changé via variable d'environnement)
const AI_MODEL = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview'

/**
 * Génère un programme de voyage via IA
 */
export async function generateTravelPlan(prompt: string): Promise<string> {
  // Vérifier le cache d'abord
  const cacheKey = `ai:travel-plan:${Buffer.from(prompt).toString('base64')}`
  const cached = await getCache(cacheKey)
  
  if (cached) {
    console.log('Cache hit for travel plan generation')
    return cached
  }

  try {
    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: 'system',
          content: `Tu es un expert en planification de voyages. 
          Génère des programmes de voyage détaillés au format JSON avec cette structure :
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
          }`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = completion.choices[0]?.message?.content || '{}'

    // Mettre en cache pour 24h
    await setCache(cacheKey, content, 86400)

    return content
  } catch (error) {
    console.error('Error generating travel plan:', error)
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
    console.log('Cache hit for custom content generation')
    return cached
  }

  try {
    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: 'system',
          content: systemPrompt || 'Tu es un assistant IA utile et créatif.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    })

    const content = completion.choices[0]?.message?.content || ''

    // Mettre en cache pour 12h
    await setCache(cacheKey, content, 43200)

    return content
  } catch (error) {
    console.error('Error generating custom content:', error)
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
  } catch (error) {
    console.error('Error generating SEO page:', error)
    throw new Error('Erreur lors de la génération de la page SEO')
  }
}

