/**
 * Types et interfaces pour l'abstraction des providers d'IA
 */

export type AIProviderType = 'openai' | 'gemini' | 'anthropic' | 'custom'

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIGenerateOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  messages: AIMessage[]
}

export interface AIProvider {
  /**
   * Nom du provider (pour logging)
   */
  readonly name: string

  /**
   * Génère du contenu à partir d'un prompt
   */
  generate(options: AIGenerateOptions): Promise<string>

  /**
   * Vérifie si le provider est correctement configuré
   */
  isConfigured(): boolean
}

export interface AIProviderConfig {
  provider: AIProviderType
  apiKey?: string
  model?: string
  baseURL?: string
  // Options spécifiques par provider
  [key: string]: unknown
}

