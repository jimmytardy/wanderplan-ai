#!/bin/bash
# Script d'entrée pour le conteneur Docker
# Gère l'initialisation de la base de données

set -e

echo "🚀 Démarrage de l'application..."

# Attendre que PostgreSQL soit prêt
echo "⏳ Attente de PostgreSQL..."
until pg_isready -h postgres -U ${POSTGRES_USER:-postgres}; do
  sleep 2
done

echo "✅ PostgreSQL est prêt!"

# Générer Prisma Client si nécessaire
if [ ! -d "node_modules/.prisma" ]; then
  echo "📦 Génération de Prisma Client..."
  npx prisma generate
fi

# Appliquer les migrations
echo "🔄 Application des migrations..."
npx prisma migrate deploy || npx prisma db push --skip-generate

echo "✨ Base de données initialisée!"

# Exécuter la commande passée en paramètre
exec "$@"


