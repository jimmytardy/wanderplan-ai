# Abstraction des Providers d'IA

Cette couche d'abstraction permet de basculer facilement entre différents fournisseurs d'IA (OpenAI, Gemini, Anthropic, etc.) sans modifier le code métier.

## 🏗️ Architecture

```
lib/ai/
├── types.ts              # Interfaces et types
├── factory.ts            # Factory pour créer le provider
├── providers/
│   ├── openai.ts        # Provider OpenAI
│   └── gemini.ts        # Provider Google Gemini
└── index.ts             # Exports
```

## 🚀 Utilisation

### Configuration via variables d'environnement

```bash
# Choisir le provider
AI_PROVIDER=openai  # ou 'gemini'

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview

# Gemini
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-pro
```

### Utilisation dans le code

Le code existant continue de fonctionner sans modification :

```typescript
import { generateTravelPlan, generateCustomContent } from '@/lib/ai'

// Ces fonctions utilisent automatiquement le provider configuré
const plan = await generateTravelPlan(prompt)
const content = await generateCustomContent(prompt, systemPrompt)
```

### Utilisation directe du provider

```typescript
import { getAIProvider } from '@/lib/ai/factory'
import type { AIMessage } from '@/lib/ai/types'

const provider = getAIProvider()

const messages: AIMessage[] = [
  { role: 'system', content: 'You are a helpful assistant' },
  { role: 'user', content: 'Hello!' }
]

const response = await provider.generate({
  messages,
  temperature: 0.7,
  maxTokens: 1000
})
```

## ➕ Ajouter un nouveau provider

### 1. Créer le fichier provider

Créer `lib/ai/providers/mon-provider.ts` :

```typescript
import type { AIProvider, AIGenerateOptions, AIProviderConfig } from '../types'
import { logger } from '@/lib/logger'

export class MonProvider implements AIProvider {
  readonly name = 'Mon Provider'
  private client: any = null
  private defaultModel: string

  constructor(config: AIProviderConfig) {
    const apiKey = config.apiKey || process.env.MON_PROVIDER_API_KEY
    const model = config.model || process.env.MON_PROVIDER_MODEL || 'default-model'

    if (!apiKey) {
      logger.warn('Mon Provider API key not configured')
      return
    }

    // Initialiser le client SDK du provider
    this.client = new MonProviderSDK({ apiKey })
    this.defaultModel = model
  }

  isConfigured(): boolean {
    return this.client !== null
  }

  async generate(options: AIGenerateOptions): Promise<string> {
    if (!this.client) {
      throw new Error('Mon Provider not configured')
    }

    try {
      // Adapter les options au format du provider
      const model = options.model || this.defaultModel
      
      // Appeler l'API du provider
      const response = await this.client.generate({
        model,
        messages: options.messages,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
      })

      return response.content
    } catch (error: any) {
      logger.error('Mon Provider generation error', error)
      throw new Error(`Mon Provider error: ${error.message}`)
    }
  }
}
```

### 2. Ajouter le provider au factory

Modifier `lib/ai/factory.ts` :

```typescript
import { MonProvider } from './providers/mon-provider'

// Dans la fonction createAIProvider, ajouter :
case 'mon-provider':
  provider = new MonProvider(fullConfig)
  break
```

### 3. Ajouter le type dans types.ts

Modifier `lib/ai/types.ts` :

```typescript
export type AIProviderType = 'openai' | 'gemini' | 'mon-provider' | 'custom'
```

### 4. Mettre à jour env.example

```bash
# Mon Provider
MON_PROVIDER_API_KEY="..."
MON_PROVIDER_MODEL="default-model"
```

## 🔧 Configuration avancée

### Configuration programmatique

```typescript
import { createAIProvider } from '@/lib/ai/factory'

const provider = createAIProvider({
  provider: 'openai',
  apiKey: 'custom-key',
  model: 'gpt-3.5-turbo',
  baseURL: 'https://custom-endpoint.com'
})
```

### Réinitialiser le provider

Utile pour les tests ou changement de configuration :

```typescript
import { resetAIProvider } from '@/lib/ai/factory'

resetAIProvider() // Force la recréation au prochain appel
```

## 📝 Notes importantes

1. **Cache** : Le cache Redis fonctionne indépendamment du provider
2. **Messages** : Tous les providers doivent supporter les rôles `system`, `user`, `assistant`
3. **Fallback** : Si un provider n'est pas configuré, le factory bascule vers OpenAI par défaut
4. **Logging** : Tous les providers utilisent le logger centralisé

## 🧪 Tests

Pour tester un nouveau provider :

```typescript
import { createAIProvider } from '@/lib/ai/factory'

const provider = createAIProvider({
  provider: 'mon-provider',
  apiKey: 'test-key'
})

if (!provider.isConfigured()) {
  throw new Error('Provider not configured')
}

const result = await provider.generate({
  messages: [
    { role: 'user', content: 'Test' }
  ]
})

console.log(result)
```

