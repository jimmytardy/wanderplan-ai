# 🐳 Guide Docker

Ce dossier contient la configuration Docker pour l'application.

## 🚀 Démarrage rapide

### 1. Configuration

Copiez `env.example` vers `.env` et configurez vos variables :

```bash
cp env.example .env
```

**Important** : Modifiez au minimum :
- `OPENAI_API_KEY` : Votre clé API OpenAI
- `JWT_SECRET` : Une clé secrète aléatoire
- `POSTGRES_PASSWORD` : Mot de passe PostgreSQL (en production)

### 2. Lancer avec Docker Compose

```bash
# Production
docker-compose up -d

# Développement (avec hot-reload)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### 3. Initialiser la base de données

```bash
# Créer les tables
docker-compose exec app npx prisma db push

# Créer un admin
docker-compose exec app npm run create-admin

# (Optionnel) Seed avec des données d'exemple
docker-compose exec app npm run seed
```

### 4. Accéder à l'application

- Application : http://localhost:3000
- PostgreSQL : localhost:5432
- Redis : localhost:6379

## 📋 Commandes utiles

### Voir les logs

```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f app
docker-compose logs -f postgres
```

### Arrêter les services

```bash
docker-compose down
```

### Arrêter et supprimer les volumes (⚠️ supprime les données)

```bash
docker-compose down -v
```

### Rebuild l'application

```bash
docker-compose build app
docker-compose up -d app
```

### Accéder au shell du conteneur

```bash
docker-compose exec app sh
```

### Commandes Prisma

```bash
# Générer le client
docker-compose exec app npx prisma generate

# Créer une migration
docker-compose exec app npx prisma migrate dev

# Ouvrir Prisma Studio
docker-compose exec app npx prisma studio
# Puis accéder à http://localhost:5555
```

## 🔧 Configuration

### Variables d'environnement

Toutes les variables sont dans `.env`. Pour Docker, utilisez les noms de services :

- Base de données : `postgres:5432` (au lieu de `localhost:5432`)
- Redis : `redis:6379` (au lieu de `localhost:6379`)

### Ports

Par défaut :
- Application : 3000
- PostgreSQL : 5432
- Redis : 6379

Modifiez dans `.env` si nécessaire.

## 🏗️ Architecture

```
┌─────────────────┐
│   app (Next.js) │
│   Port: 3000    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌───▼───┐
│postgres│ │ redis │
│ :5432  │ │ :6379 │
└────────┘ └───────┘
```

## 🐛 Dépannage

### L'application ne démarre pas

1. Vérifiez que PostgreSQL est prêt :
```bash
docker-compose logs postgres
```

2. Vérifiez les variables d'environnement :
```bash
docker-compose exec app env | grep DATABASE_URL
```

3. Réinitialisez la base de données :
```bash
docker-compose down -v
docker-compose up -d
```

### Erreur de connexion à la base de données

Vérifiez que `DATABASE_URL` utilise `postgres` (nom du service) et non `localhost`.

### Redis ne fonctionne pas

Redis est optionnel. Si vous ne l'utilisez pas, laissez `REDIS_URL` vide dans `.env`.

## 📦 Production

Pour la production :

1. Utilisez `NODE_ENV=production`
2. Changez tous les secrets (JWT_SECRET, POSTGRES_PASSWORD)
3. Utilisez un reverse proxy (nginx, traefik) devant l'application
4. Configurez des volumes persistants pour PostgreSQL
5. Activez les backups automatiques

## 🔒 Sécurité

- Ne commitez jamais `.env`
- Utilisez des secrets forts en production
- Limitez l'exposition des ports (sauf 3000 pour l'app)
- Utilisez un réseau Docker privé (déjà configuré)


