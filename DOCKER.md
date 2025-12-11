# 🐳 Guide Docker - Démarrage rapide

## 🚀 Démarrage en 3 étapes

### 1. Configuration

```bash
cp env.example .env
```

Modifiez `.env` avec vos clés :
- `OPENAI_API_KEY` (obligatoire)
- `JWT_SECRET` (changez la valeur par défaut)
- `POSTGRES_PASSWORD` (pour la sécurité)

### 2. Lancer l'application

```bash
# Production
docker-compose up -d

# Ou avec logs en direct
docker-compose up

# Développement (hot-reload)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### 3. Initialiser la base de données

```bash
# Créer les tables
docker-compose exec app npx prisma db push

# Créer un admin
docker-compose exec app npm run create-admin

# (Optionnel) Ajouter des données d'exemple
docker-compose exec app npm run seed
```

## ✅ Vérification

- Application : http://localhost:3000
- PostgreSQL : localhost:5432
- Redis : localhost:6379

## 📋 Commandes utiles

```bash
# Voir les logs
docker-compose logs -f app

# Arrêter
docker-compose down

# Rebuild
docker-compose build app
docker-compose up -d app

# Accéder au shell
docker-compose exec app sh

# Prisma Studio
docker-compose exec app npx prisma studio
# Puis http://localhost:5555
```

## 🔧 Configuration avancée

### Variables d'environnement importantes

Dans `.env`, pour Docker utilisez les noms de services :

```env
# Base de données (utilisez "postgres" au lieu de "localhost")
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/wanderplan_ai?schema=public"

# Redis (utilisez "redis" au lieu de "localhost")
REDIS_URL="redis://redis:6379"
```

### Ports personnalisés

Modifiez dans `.env` :
```env
APP_PORT=3000
POSTGRES_PORT=5432
REDIS_PORT=6379
```

## 🐛 Dépannage

### L'application ne démarre pas

1. Vérifiez les logs : `docker-compose logs app`
2. Vérifiez que PostgreSQL est prêt : `docker-compose logs postgres`
3. Vérifiez les variables d'environnement

### Erreur de connexion à la base de données

Assurez-vous que `DATABASE_URL` utilise `postgres` (nom du service) et non `localhost`.

### Réinitialiser complètement

```bash
docker-compose down -v
docker-compose up -d
```

## 📚 Documentation complète

Voir `.docker/README.md` pour plus de détails.


