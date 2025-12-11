/**
 * Client Redis pour le cache des requêtes lourdes (IA notamment)
 */
import { createClient } from 'redis'

let redisClient: ReturnType<typeof createClient> | null = null

/**
 * Initialise et retourne le client Redis
 * Retourne null si Redis n'est pas configuré (optionnel)
 */
export async function getRedisClient() {
  if (redisClient) {
    return redisClient
  }

  const redisUrl = process.env.REDIS_URL

  // Redis est optionnel, on retourne null si non configuré
  if (!redisUrl) {
    return null
  }

  try {
    redisClient = createClient({
      url: redisUrl,
    })

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })

    await redisClient.connect()
    return redisClient
  } catch (error) {
    console.error('Failed to connect to Redis:', error)
    return null
  }
}

/**
 * Récupère une valeur depuis le cache Redis
 */
export async function getCache(key: string): Promise<string | null> {
  const client = await getRedisClient()
  if (!client) return null

  try {
    return await client.get(key)
  } catch (error) {
    console.error('Redis get error:', error)
    return null
  }
}

/**
 * Stocke une valeur dans le cache Redis avec expiration
 * @param key - Clé du cache
 * @param value - Valeur à stocker
 * @param ttl - Time to live en secondes (défaut: 3600 = 1h)
 */
export async function setCache(
  key: string,
  value: string,
  ttl: number = 3600
): Promise<boolean> {
  const client = await getRedisClient()
  if (!client) return false

  try {
    await client.setEx(key, ttl, value)
    return true
  } catch (error) {
    console.error('Redis set error:', error)
    return false
  }
}

/**
 * Supprime une clé du cache
 */
export async function deleteCache(key: string): Promise<boolean> {
  const client = await getRedisClient()
  if (!client) return false

  try {
    await client.del(key)
    return true
  } catch (error) {
    console.error('Redis delete error:', error)
    return false
  }
}

