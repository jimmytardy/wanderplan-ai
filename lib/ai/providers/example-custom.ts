/**
 * EXEMPLE : Provider personnalisé
 * 
 * Ce fichier montre comment créer un nouveau provider d'IA.
 * Pour l'utiliser, copiez ce fichier et adaptez-le à votre provider.
 * 
 * Étapes :
 * 1. Copier ce fichier vers providers/votre-provider.ts
 * 2. Remplacer "ExampleCustom" par le nom de votre provider
 * 3. Implémenter la méthode generate() selon l'API de votre provider
 * 4. Ajouter le case dans factory.ts
 * 5. Ajouter le type dans types.ts
 */

import type { AIProvider, AIGenerateOptions, AIProviderConfig } from '../types'
import { logger } from '@/lib/logger'

export class ExampleCustomProvider implements AIProvider {
  readonly name = 'Example Custom Provider'
  private client: any = null
  private defaultModel: string
  private apiKey: string | undefined

  constructor(config: AIProviderConfig) {
    // Récupérer la clé API depuis la config ou les variables d'environnement
    this.apiKey = config.apiKey || process.env.CUSTOM_PROVIDER_API_KEY
    const model = config.model || process.env.CUSTOM_PROVIDER_MODEL || 'default-model'

    if (!this.apiKey) {
      logger.warn('Custom Provider API key not configured')
      return
    }

    // Initialiser le client SDK de votre provider
    // Exemple avec un SDK fictif :
    // this.client = new CustomProviderSDK({
    //   apiKey: this.apiKey,
    //   baseURL: config.baseURL,
    // })

    this.defaultModel = model
    // Pour cet exemple, on simule juste l'initialisation
    this.client = { initialized: true }
  }

  isConfigured(): boolean {
    return this.client !== null && this.apiKey !== undefined
  }

  async generate(options: AIGenerateOptions): Promise<string> {
    if (!this.client) {
      throw new Error(
        'Custom Provider not configured. Please set CUSTOM_PROVIDER_API_KEY'
      )
    }

    try {
      const model = options.model || this.defaultModel
      const temperature = options.temperature ?? 0.7
      const maxTokens = options.maxTokens ?? 2000

      // Adapter les messages au format de votre provider
      // Certains providers n'ont pas de rôle "system", il faut l'adapter
      const messages = options.messages.map((msg) => {
        // Exemple d'adaptation : convertir "system" en "user" si nécessaire
        if (msg.role === 'system') {
          return {
            role: 'user', // ou le format attendu par votre provider
            content: `[System] ${msg.content}`,
          }
        }
        return {
          role: msg.role,
          content: msg.content,
        }
      })

      // Appeler l'API de votre provider
      // Exemple avec un SDK fictif :
      // const response = await this.client.chat.complete({
      //   model,
      //   messages,
      //   temperature,
      //   maxTokens,
      // })

      // Pour cet exemple, on retourne une réponse simulée
      const simulatedResponse = `[Simulated response from ${this.name}]\nModel: ${model}\nTemperature: ${temperature}\nMaxTokens: ${maxTokens}\n\nUser message: ${options.messages[options.messages.length - 1]?.content || 'N/A'}`

      return simulatedResponse
    } catch (error: any) {
      logger.error('Custom Provider generation error', error)
      throw new Error(`Custom Provider error: ${error.message || 'Unknown error'}`)
    }
  }
}

