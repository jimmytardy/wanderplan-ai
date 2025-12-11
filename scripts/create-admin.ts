/**
 * Script pour créer un admin initial
 * Usage: npx tsx scripts/create-admin.ts
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function main() {
  console.log('🔐 Création d\'un administrateur\n')

  const email = await question('Email: ')
  const password = await question('Mot de passe: ')
  const name = await question('Nom (optionnel): ')

  if (!email || !password) {
    console.error('❌ Email et mot de passe requis')
    process.exit(1)
  }

  // Vérifier si l'admin existe déjà
  const existing = await prisma.admin.findUnique({
    where: { email },
  })

  if (existing) {
    console.error('❌ Un admin avec cet email existe déjà')
    process.exit(1)
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10)

  // Créer l'admin
  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      name: name || null,
    },
  })

  console.log('\n✅ Admin créé avec succès!')
  console.log(`   ID: ${admin.id}`)
  console.log(`   Email: ${admin.email}`)

  rl.close()
}

main()
  .catch((error) => {
    console.error('❌ Erreur:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

