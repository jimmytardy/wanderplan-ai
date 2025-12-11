/**
 * Script de seed pour peupler la base de données avec des données d'exemple
 * Usage: npx tsx scripts/seed.ts
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...\n')

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
}

main()
  .catch((error) => {
    console.error('❌ Erreur:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

