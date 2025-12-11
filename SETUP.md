# 🚀 Guide d'installation détaillé

## Étape 1 : Installation des dépendances

```bash
npm install
```

## Étape 2 : Configuration PostgreSQL

### Option A : PostgreSQL local

1. Installer PostgreSQL sur votre machine
2. Créer une base de données :

```sql
CREATE DATABASE voyage_generator;
```

3. Dans `.env`, configurer :

```
DATABASE_URL="postgresql://user:password@localhost:5432/voyage_generator?schema=public"
```

### Option B : PostgreSQL cloud (Supabase, Railway, etc.)

1. Créer un compte sur votre plateforme préférée
2. Créer une nouvelle base de données
3. Copier l'URL de connexion dans `.env`

## Étape 3 : Configuration OpenAI

1. Créer un compte sur [OpenAI](https://platform.openai.com)
2. Générer une clé API
3. Ajouter dans `.env` :

```
OPENAI_API_KEY="sk-votre-cle-ici"
```

## Étape 4 : Configuration Redis (optionnel)

### Option A : Redis local

```bash
# Installation (macOS)
brew install redis
redis-server

# Installation (Linux)
sudo apt-get install redis-server
redis-server
```

Dans `.env` :
```
REDIS_URL="redis://localhost:6379"
```

### Option B : Redis cloud (Upstash, Redis Cloud, etc.)

1. Créer un compte
2. Créer une instance Redis
3. Copier l'URL dans `.env`

### Option C : Sans Redis

Laissez `REDIS_URL` vide dans `.env`. Le cache sera désactivé mais l'application fonctionnera.

## Étape 5 : Initialisation de la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Créer les tables
npm run db:push
```

## Étape 6 : Créer un admin

```bash
npm run create-admin
```

Suivez les instructions pour créer votre premier administrateur.

## Étape 7 : (Optionnel) Peupler avec des données d'exemple

```bash
npm run seed
```

## Étape 8 : Lancer l'application

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## ✅ Vérification

1. L'interface de test s'affiche
2. Testez la génération d'un programme avec :
   - Destination : "Paris"
   - Durée : 5 jours
3. Connectez-vous en tant qu'admin
4. Testez l'endpoint `/api/ai-configurable`

## 🔧 Dépannage

### Erreur de connexion à la base de données

- Vérifiez que PostgreSQL est démarré
- Vérifiez l'URL dans `.env`
- Testez la connexion : `psql $DATABASE_URL`

### Erreur OpenAI

- Vérifiez que votre clé API est valide
- Vérifiez que vous avez des crédits sur votre compte OpenAI

### Erreur Redis

- Si Redis n'est pas installé, laissez `REDIS_URL` vide
- L'application fonctionnera sans cache

### Erreur Prisma

```bash
# Réinitialiser Prisma
rm -rf node_modules/.prisma
npm run db:generate
```

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation OpenAI](https://platform.openai.com/docs)

