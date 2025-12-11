/**
 * Middleware pour l'authentification admin
 */
import { NextRequest } from 'next/server'
import { extractTokenFromHeader, verifyToken } from './jwt'
import { prisma } from './prisma'

export interface AuthenticatedRequest extends NextRequest {
  admin?: {
    id: string
    email: string
  }
}

/**
 * Vérifie si la requête est authentifiée avec un token admin valide
 * Retourne l'admin si authentifié, null sinon
 */
export async function authenticateAdmin(
  request: NextRequest
): Promise<{ id: string; email: string } | null> {
  const authHeader = request.headers.get('authorization')
  const token = extractTokenFromHeader(authHeader)

  if (!token) {
    return null
  }

  const payload = verifyToken(token)
  if (!payload) {
    return null
  }

  // Vérifier que l'admin existe toujours en BDD
  const admin = await prisma.admin.findUnique({
    where: { id: payload.adminId },
  })

  if (!admin) {
    return null
  }

  return {
    id: admin.id,
    email: admin.email,
  }
}

/**
 * Middleware pour protéger une route admin
 * Utilisé dans les API routes
 */
export async function requireAdmin(request: NextRequest) {
  const admin = await authenticateAdmin(request)

  if (!admin) {
    throw new Error('Unauthorized: Admin authentication required')
  }

  return admin
}

