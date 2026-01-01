/**
 * Script de seed pour peupler la base de données avec des données d'exemple
 * ⚠️ ATTENTION: Ne pas exécuter en production !
 * 
 * Protections en place:
 * - Vérifie que NODE_ENV !== 'production'
 * - Requiert FORCE_SEED=true pour s'exécuter
 * 
 * Usage (développement uniquement):
 *   FORCE_SEED=true pnpm seed
 *   ou
 *   FORCE_SEED=true pnpm tsx scripts/seed.ts
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Protection 1: Vérifier l'environnement
  const nodeEnv = process.env.NODE_ENV || 'development'
  
  if (nodeEnv === 'production') {
    console.error('❌ ERREUR: Ce script ne doit PAS être exécuté en production!')
    console.error('   Pour forcer l\'exécution, définissez NODE_ENV=development')
    console.error('   Mais ATTENTION: ne le faites jamais en production!')
    process.exit(1)
  }

  // Protection 2: Demander confirmation explicite
  const forceSeed = process.env.FORCE_SEED === 'true'
  
  if (!forceSeed) {
    console.warn('⚠️  ATTENTION: Ce script va insérer des données d\'exemple dans la base de données.')
    console.warn('   Ces données sont destinées au DÉVELOPPEMENT et aux TESTS uniquement.')
    console.warn('')
    console.warn('   Pour continuer, définissez FORCE_SEED=true')
    console.warn('   Exemple: FORCE_SEED=true pnpm seed')
    console.warn('')
    console.warn('   ⚠️  Ne JAMAIS exécuter en production!')
    process.exit(1)
  }

  console.log('🌱 Seeding database...\n')
  console.log(`   Environnement: ${nodeEnv}`)
  console.log(`   FORCE_SEED: ${forceSeed}`)
  console.log('')

  // Créer des destinations
  const paris = await prisma.destination.upsert({
    where: { id: 'paris-1' },
    update: {},
    create: {
      id: 'paris-1',
      name: 'Paris',
      country: 'France',
      city: 'Paris',
      description: 'La capitale de la France, ville de la lumière',
      imageUrl: 'https://example.com/paris.jpg',
    },
  })

  const tokyo = await prisma.destination.upsert({
    where: { id: 'tokyo-1' },
    update: {},
    create: {
      id: 'tokyo-1',
      name: 'Tokyo',
      country: 'Japon',
      city: 'Tokyo',
      description: 'Métropole moderne et traditionnelle du Japon',
      imageUrl: 'https://example.com/tokyo.jpg',
    },
  })

  console.log('✅ Destinations créées')

  // Créer des restaurants
  await prisma.restaurant.createMany({
    data: [
      {
        name: 'Le Comptoir du Relais',
        destinationId: paris.id,
        cuisine: 'Française',
        priceRange: '€€',
        address: '9 Carrefour de l\'Odéon, 75006 Paris',
        rating: 4.5,
        description: 'Bistrot parisien authentique',
      },
      {
        name: 'L\'As du Fallafel',
        destinationId: paris.id,
        cuisine: 'Moyen-Orientale',
        priceRange: '€',
        address: '34 Rue des Rosiers, 75004 Paris',
        rating: 4.3,
        description: 'Meilleur falafel de Paris',
      },
      {
        name: 'Sukiyabashi Jiro',
        destinationId: tokyo.id,
        cuisine: 'Japonaise',
        priceRange: '€€€',
        address: 'Ginza, Tokyo',
        rating: 5.0,
        description: 'Restaurant de sushi légendaire',
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Restaurants créés')

  // Créer des activités
  await prisma.activity.createMany({
    data: [
      {
        name: 'Visite de la Tour Eiffel',
        destinationId: paris.id,
        type: 'Culture',
        duration: '2h',
        price: '25€',
        season: 'Toutes',
        description: 'Monument emblématique de Paris',
      },
      {
        name: 'Musée du Louvre',
        destinationId: paris.id,
        type: 'Culture',
        duration: '3-4h',
        price: '17€',
        season: 'Toutes',
        description: 'Plus grand musée du monde',
      },
      {
        name: 'Temple Senso-ji',
        destinationId: tokyo.id,
        type: 'Culture',
        duration: '1h',
        price: 'Gratuit',
        season: 'Toutes',
        description: 'Temple bouddhiste historique',
      },
      {
        name: 'Shibuya Crossing',
        destinationId: tokyo.id,
        type: 'Découverte',
        duration: '30min',
        price: 'Gratuit',
        season: 'Toutes',
        description: 'Carrefour le plus fréquenté au monde',
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Activités créées')

  console.log('\n🎉 Seeding terminé!')
  console.log('   ⚠️  Rappel: Ces données sont pour le développement uniquement')
}

main()
  .catch((error) => {
    console.error('❌ Erreur:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
