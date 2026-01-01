/**
 * Factory pour créer le bon provider d'IA selon la configuration
 */
import type { AIProvider, AIProviderType, AIProviderConfig } from './types'
import { OpenAIProvider } from './providers/openai'
import { GeminiProvider } from './providers/gemini'
import { logger } from '@/lib/logger'

let cachedProvider: AIProvider | null = null

/**
 * Crée une instance du provider d'IA configuré
 */
export function createAIProvider(config?: Partial<AIProviderConfig>): AIProvider {
  // Si un provider est déjà en cache et la config n'a pas changé, le réutiliser
  if (cachedProvider && !config) {
    return cachedProvider
  }

  // Déterminer le provider à utiliser
  const providerType: AIProviderType =
    (config?.provider as AIProviderType) ||
    (process.env.AI_PROVIDER as AIProviderType) ||
    'openai'

  // Construire la config complète
  const fullConfig: AIProviderConfig = {
    provider: providerType,
    apiKey: config?.apiKey,
    model: config?.model,
    baseURL: config?.baseURL,
    ...config,
  }

  let provider: AIProvider

  switch (providerType) {
    case 'openai':
      provider = new OpenAIProvider(fullConfig)
      break

    case 'gemini':
      provider = new GeminiProvider(fullConfig)
      break

    default:
      logger.warn(`Unknown AI provider: ${providerType}, falling back to OpenAI`)
      provider = new OpenAIProvider(fullConfig)
  }

  // Vérifier que le provider est configuré
  if (!provider.isConfigured()) {
    logger.error(
      `AI provider ${providerType} is not properly configured. Check your environment variables.`
    )
    throw new Error(
      `AI provider ${providerType} is not configured. Please check your environment variables.`
    )
  }

  logger.info(`Using AI provider: ${provider.name}`)

  // Mettre en cache
  cachedProvider = provider

  return provider
}

/**
 * Récupère le provider d'IA actuel (singleton)
 */
export function getAIProvider(): AIProvider {
  if (!cachedProvider) {
    cachedProvider = createAIProvider()
  }
  return cachedProvider
}

/**
 * Réinitialise le provider (utile pour les tests ou changement de config)
 */
export function resetAIProvider(): void {
  cachedProvider = null
}

