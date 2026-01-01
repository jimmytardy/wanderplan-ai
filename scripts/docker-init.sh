#!/bin/bash
# Script d'initialisation pour Docker
# Crée les tables et seed la base de données si nécessaire

set -e

echo "🚀 Initialisation de la base de données..."

# Attendre que PostgreSQL soit prêt
until npx prisma db push --skip-generate; do
  echo "⏳ En attente de PostgreSQL..."
  sleep 2
done

echo "✅ Base de données prête!"

# Optionnel: Seed la base de données
if [ "$SEED_DB" = "true" ]; then
  echo "🌱 Seeding de la base de données..."
  pnpm seed
fi

echo "✨ Initialisation terminée!"


