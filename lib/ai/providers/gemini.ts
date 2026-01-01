/**
 * Provider Google Gemini
 * Note: Nécessite @google/generative-ai dans package.json
 */
import type { AIProvider, AIGenerateOptions, AIProviderConfig } from '../types'
import { logger } from '@/lib/logger'

export class GeminiProvider implements AIProvider {
  readonly name = 'Gemini'
  private client: any = null // @google/generative-ai
  private defaultModel: string
  private isGeminiAvailable = false

  constructor(config: AIProviderConfig) {
    const apiKey = config.apiKey || process.env.GEMINI_API_KEY
    const model = config.model || process.env.GEMINI_MODEL || 'gemini-pro'

    if (!apiKey) {
      logger.warn('Gemini API key not configured')
      return
    }

    // Vérifier si le package est installé
    try {
      // Dynamic import pour éviter les erreurs si le package n'est pas installé
      const { GoogleGenerativeAI } = require('@google/generative-ai')
      this.client = new GoogleGenerativeAI(apiKey)
      this.defaultModel = model
      this.isGeminiAvailable = true
    } catch (error) {
      logger.warn(
        'Gemini SDK not installed. Install with: pnpm add @google/generative-ai'
      )
      this.isGeminiAvailable = false
    }
  }

  isConfigured(): boolean {
    return this.isGeminiAvailable && this.client !== null
  }

  async generate(options: AIGenerateOptions): Promise<string> {
    if (!this.client) {
      throw new Error(
        'Gemini provider not configured. Please set GEMINI_API_KEY and install @google/generative-ai'
      )
    }

    try {
      const model = options.model || this.defaultModel
      const temperature = options.temperature ?? 0.7
      const maxTokens = options.maxTokens ?? 2000

      const genModel = this.client.getGenerativeModel({
        model,
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      })

      // Convertir les messages au format Gemini
      // Gemini n'a pas de rôle "system", on le convertit en user
      const prompt = options.messages
        .map((msg) => {
          if (msg.role === 'system') {
            return `${msg.content}\n\n`
          }
          if (msg.role === 'user') {
            return `User: ${msg.content}\n\n`
          }
          if (msg.role === 'assistant') {
            return `Assistant: ${msg.content}\n\n`
          }
          return ''
        })
        .join('')

      const result = await genModel.generateContent(prompt)
      const response = await result.response
      const content = response.text()

      if (!content) {
        throw new Error('Gemini returned empty response')
      }

      return content
    } catch (error: any) {
      logger.error('Gemini generation error', error)
      throw new Error(`Gemini error: ${error.message || 'Unknown error'}`)
    }
  }
}

