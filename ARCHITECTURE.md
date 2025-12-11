# 🏗️ Architecture du projet

## Vue d'ensemble

Application Next.js 14 fullstack avec App Router, utilisant TypeScript, Prisma, OpenAI, et Redis.

## Structure des dossiers

```
wanderplan-ai/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (backend)
│   │   ├── generate-plan/     # Génération de programmes
│   │   ├── ai-configurable/   # IA configurable (admin)
│   │   ├── examples/          # Exemples pour SEO
│   │   ├── destinations/      # Liste destinations
│   │   ├── restaurants/       # Restaurants par destination
│   │   ├── activities/        # Activités par destination
│   │   ├── feedback/          # Feedback utilisateur
│   │   ├── seo-page/          # Génération pages SEO
│   │   └── auth/              # Authentification admin
│   ├── page.tsx           # Frontend de test
│   ├── layout.tsx         # Layout principal
│   └── globals.css        # Styles globaux
│
├── lib/                   # Bibliothèques et utilitaires
│   ├── prisma.ts          # Client Prisma singleton
│   ├── jwt.ts             # Utilitaires JWT
│   ├── redis.ts           # Client Redis (optionnel)
│   ├── ai.ts              # Service OpenAI
│   ├── logger.ts          # Système de logging
│   ├── middleware.ts      # Middleware authentification
│   ├── seo-service.ts     # Service décision SEO
│   └── constants.ts       # Constantes
│
├── prisma/                # Prisma ORM
│   └── schema.prisma      # Schéma de base de données
│
├── types/                 # Types TypeScript partagés
│   └── index.ts
│
├── scripts/               # Scripts utilitaires
│   ├── create-admin.ts    # Création admin
│   └── seed.ts            # Seed données
│
└── examples/              # Exemples
    └── travel-plan-example.json
```

## Flux de données

### Génération d'un programme

```
Client → POST /api/generate-plan
  ↓
Validation (Zod)
  ↓
Génération IA (lib/ai.ts)
  ↓
Cache Redis (optionnel)
  ↓
Enregistrement BDD (Prisma)
  ↓
Décision SEO (lib/seo-service.ts)
  ↓
Réponse JSON
```

### Authentification admin

```
Client → POST /api/auth/login
  ↓
Vérification credentials (Prisma + bcrypt)
  ↓
Génération JWT (lib/jwt.ts)
  ↓
Réponse avec token
  ↓
Client stocke token
  ↓
Requêtes suivantes : Header Authorization: Bearer <token>
  ↓
Middleware vérifie token (lib/middleware.ts)
```

## Modèles de données

### Admin
- Authentification JWT
- Hash bcrypt pour mots de passe

### Destination
- Stocke les destinations disponibles
- Relation avec TravelPlan, Restaurant, Activity

### TravelPlan
- Programme généré par IA (JSON)
- Statut : isPublished, isExample
- Relation avec Destination et Feedback

### Restaurant / Activity
- Suggestions par destination
- Filtrables par type, prix, saison

### Feedback
- Avis utilisateur sur un programme
- Note 1-5 + commentaire optionnel

### SeoPage
- Pages HTML générées pour SEO
- Slug unique pour URL

## Sécurité

1. **Authentification** : JWT avec secret
2. **Mots de passe** : Hash bcrypt (10 rounds)
3. **Validation** : Zod pour tous les inputs
4. **SQL Injection** : Prisma ORM (préparé statements)
5. **CORS** : Géré par Next.js

## Cache

- **Redis** : Cache optionnel pour requêtes IA lourdes
- **TTL** : 24h pour programmes, 12h pour contenu custom
- **Fallback** : Application fonctionne sans Redis

## Logging

- Console en développement
- Structure JSON pour production
- Niveaux : info, warn, error, debug

## Extensibilité

### Ajouter un endpoint

1. Créer `app/api/nouveau-endpoint/route.ts`
2. Exporter `GET`, `POST`, etc.
3. Utiliser les utilitaires `lib/`
4. Valider avec Zod
5. Logger avec `logger`

### Ajouter un modèle

1. Modifier `prisma/schema.prisma`
2. Exécuter `npm run db:push`
3. Utiliser `prisma` dans le code

### Modifier le modèle IA

1. Modifier `lib/ai.ts`
2. Ajuster les prompts système
3. Tester avec différents modèles OpenAI

## Performance

- **SSG/SSR** : Next.js pour pages SEO
- **Cache** : Redis pour requêtes lourdes
- **Database** : Index sur colonnes fréquentes
- **API** : Routes optimisées, pagination

## Déploiement

### Vercel (recommandé)
- Build automatique
- Variables d'environnement dans dashboard
- PostgreSQL : Supabase, Neon, etc.
- Redis : Upstash, Redis Cloud

### Autres plateformes
- Build : `npm run build`
- Start : `npm start`
- Variables d'environnement requises

