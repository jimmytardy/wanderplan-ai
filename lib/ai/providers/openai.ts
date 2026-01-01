/**
 * Provider OpenAI (ChatGPT)
 */
import OpenAI from 'openai'
import type { AIProvider, AIGenerateOptions, AIProviderConfig } from '../types'
import { logger } from '@/lib/logger'

export class OpenAIProvider implements AIProvider {
  readonly name = 'OpenAI'
  private client: OpenAI | null = null
  private defaultModel: string

  constructor(config: AIProviderConfig) {
    const apiKey = config.apiKey || process.env.OPENAI_API_KEY
    const model = config.model || process.env.OPENAI_MODEL || 'gpt-4-turbo-preview'

    if (!apiKey) {
      logger.warn('OpenAI API key not configured')
      return
    }

    this.defaultModel = model
    this.client = new OpenAI({
      apiKey,
      baseURL: config.baseURL,
    })
  }

  isConfigured(): boolean {
    return this.client !== null
  }

  async generate(options: AIGenerateOptions): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI provider not configured. Please set OPENAI_API_KEY')
    }

    try {
      const model = options.model || this.defaultModel
      const temperature = options.temperature ?? 0.7
      const maxTokens = options.maxTokens ?? 2000

      // Convertir nos messages au format OpenAI
      const messages = options.messages.map((msg) => ({
        role: msg.role as 'system' | 'user' | 'assistant',
        content: msg.content,
      }))

      const completion = await this.client.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      })

      const content = completion.choices[0]?.message?.content

      if (!content) {
        throw new Error('OpenAI returned empty response')
      }

      return content
    } catch (error: any) {
      logger.error('OpenAI generation error', error)
      throw new Error(`OpenAI error: ${error.message || 'Unknown error'}`)
    }
  }
}

