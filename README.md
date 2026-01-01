# 🌍 WanderPlan AI

Application Next.js fullstack pour la planification de voyages assistée par IA avec interface moderne Material-UI.

## ✨ Fonctionnalités

- ✈️ **Génération automatique** de programmes de voyage via IA
- 🎨 **Interface moderne** avec Material-UI (MUI) - Design responsive et mobile-first
- 🔍 **Recherche intelligente** de destinations avec autocomplete
- 💾 **Cache intelligent** - Vérifie la BDD avant d'appeler l'IA pour économiser les coûts
- 📋 **Formulaire complet** avec tous les critères (activités, restauration, logistique)
- 🤖 **Endpoint admin** pour prompts IA configurables
- 📊 Gestion des destinations, restaurants et activités
- 💬 Système de feedback utilisateur
- 📄 Génération de pages SEO optimisées
- 🔐 Authentification JWT pour les admins
- ⚡ Cache Redis pour les requêtes lourdes
- 📝 Logging et monitoring
- 🐳 **Docker ready** - Déploiement simplifié avec docker-compose

## 🚀 Installation

### Option 1 : Avec Docker (Recommandé) 🐳

**Le plus simple et rapide !**

1. **Configurer les variables d'environnement**

```bash
cp env.example .env
```

Modifiez `.env` avec vos clés (au minimum `OPENAI_API_KEY` et `JWT_SECRET`).

2. **Lancer avec Docker Compose**

```bash
# Production
pnpm run docker:up
# ou
docker-compose up -d

# Développement (avec hot-reload)
pnpm run docker:dev
# ou
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

3. **Initialiser la base de données**

```bash
# Créer les tables
docker-compose exec app npx prisma db push

# Créer un admin
docker-compose exec app pnpm create-admin

# (Optionnel) Seed avec des données d'exemple (DÉVELOPPEMENT UNIQUEMENT)
# ⚠️ Ne jamais exécuter en production !
FORCE_SEED=true docker-compose exec app pnpm seed
```

4. **Accéder à l'application**

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

**Commandes Docker utiles :**
- `pnpm run docker:logs` - Voir les logs
- `pnpm run docker:down` - Arrêter les services
- `docker-compose exec app sh` - Accéder au shell du conteneur

📚 **Voir [DOCKER.md](./docs/DOCKER.md) pour plus de détails sur Docker**

### Option 2 : Installation locale

### Prérequis

- Node.js 20.9+ et pnpm
- PostgreSQL (base de données)
- Redis (optionnel, pour le cache)
- Clé API OpenAI

### Étapes

1. **Cloner et installer les dépendances**

```bash
pnpm install
```

2. **Configurer les variables d'environnement**

Copiez `env.example` vers `.env` et remplissez les valeurs :

```bash
cp env.example .env
```

3. **Configurer la base de données**

```bash
# Générer le client Prisma
pnpm db:generate

# Créer les tables en base
pnpm db:push

# Ou utiliser les migrations
pnpm db:migrate
```

4. **Créer un admin initial**

```bash
pnpm create-admin
```

5. **Lancer le serveur de développement**

```bash
pnpm dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🎨 Interface utilisateur

L'application dispose d'une interface moderne et intuitive avec Material-UI :

- **Formulaire complet** avec tous les critères de voyage
- **Recherche de destinations** avec autocomplete en temps réel
- **Affichage des résultats** avec accordéons pour chaque jour
- **Design responsive** - Optimisé mobile-first
- **Thème personnalisé** avec dégradés et animations

### Critères de voyage disponibles

1. **Critères de base**
   - Destination (avec recherche)
   - Durée du séjour
   - Dates de début/fin
   - Type de voyage (familial, romantique, entre amis, solo, business)
   - Thème (culture, nature, sport, gastronomie, luxe, détente)
   - Budget global

2. **Critères pour activités**
   - Activités préférées
   - Activités à éviter
   - Niveau d'intensité (relax, modéré, intense)
   - Budget par activité
   - Accessibilité (handicap, enfants, animaux)

3. **Critères pour restauration**
   - Type de restaurant (local, international, vegan, gastronomique, street food)
   - Budget par repas
   - Préférences alimentaires (végétarien, halal, casher, sans gluten, sans lactose)
   - Ambiance (familiale, romantique, animée, calme)

4. **Critères logistiques**
   - Transport préféré (vélo, voiture, marche, transports en commun)
   - Distance maximale entre activités
   - Horaires préférés (matin, après-midi, soir, journée complète)
   - Météo préférée

## 📡 API Routes

### Public

- `POST /api/generate-plan` : Génère un programme de voyage (avec cache intelligent)
- `GET /api/examples` : Liste des programmes validés pour SEO
- `GET /api/destinations` : Liste des destinations
- `GET /api/destinations/search?q=...` : Recherche de destinations avec autocomplete
- `GET /api/restaurants?destinationId=xxx` : Restaurants par destination
- `GET /api/activities?destinationId=xxx` : Activités par destination
- `POST /api/feedback` : Envoie un feedback
- `POST /api/seo-page` : Génère une page SEO

### Admin (JWT requis)

- `POST /api/auth/login` : Connexion admin
- `POST /api/ai-configurable` : Génère du contenu IA avec prompt libre

### Exemples de requêtes

#### Générer un programme

```bash
curl -X POST http://localhost:3000/api/generate-plan \
  -H "Content-Type: application/json" \
  -d '{
    "destinationId": "paris-1",
    "duration": 5,
    "travelType": "familial",
    "theme": "culture",
    "budget": "1000€"
  }'
```

#### Rechercher une destination

```bash
curl "http://localhost:3000/api/destinations/search?q=Paris&limit=10"
```

#### Connexion admin

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

## 💡 Cache intelligent

L'application vérifie automatiquement si un programme similaire existe déjà en base de données avant d'appeler l'IA. Cela permet de :

- ✅ **Économiser les coûts** d'API OpenAI
- ✅ **Répondre plus rapidement** aux requêtes
- ✅ **Réutiliser** les programmes déjà générés

Si un programme correspondant est trouvé, il est retourné immédiatement avec `fromCache: true` dans la réponse.

## 🏗️ Structure du projet

```
wanderplan-ai/
├── app/
│   ├── api/              # API routes Next.js
│   │   ├── generate-plan/     # Génération avec cache
│   │   ├── destinations/      # Destinations + recherche
│   │   ├── ai-configurable/   # IA admin
│   │   └── ...
│   ├── page.tsx          # Page principale (MUI)
│   ├── layout.tsx        # Layout SEO optimisé
│   ├── theme.ts          # Thème MUI personnalisé
│   └── providers.tsx    # Providers MUI
├── components/
│   ├── TravelForm.tsx    # Formulaire complet
│   ├── TravelResult.tsx  # Affichage résultats
│   ├── AdminPanel.tsx    # Panel admin
│   └── LoginDialog.tsx   # Connexion admin
├── lib/
│   ├── prisma.ts         # Client Prisma
│   ├── jwt.ts            # Utilitaires JWT
│   ├── redis.ts          # Client Redis
│   ├── ai.ts             # Service IA
│   ├── cache-service.ts  # Service de cache intelligent
│   ├── logger.ts         # Système de logging
│   ├── middleware.ts    # Middleware auth
│   └── seo-service.ts    # Service SEO
├── prisma/
│   └── schema.prisma     # Schéma de base de données
├── docker-compose.yml    # Configuration Docker
├── Dockerfile            # Image production
├── Dockerfile.dev        # Image développement
└── README.md
```

## 🔒 Sécurité

- Les mots de passe admin sont hashés avec bcrypt
- JWT pour l'authentification admin
- Validation des données avec Zod
- Protection contre les injections SQL (Prisma)
- Variables d'environnement pour les secrets

## 🧪 Tests

L'interface frontend (`/`) permet de tester tous les endpoints interactivement avec une interface moderne Material-UI.

## 📝 Format des données

### Programme de voyage (JSON)

```json
{
  "title": "Voyage à Paris",
  "days": [
    {
      "day": 1,
      "date": "2024-01-15",
      "activities": [
        {
          "name": "Visite de la Tour Eiffel",
          "time": "09:00",
          "duration": "2h",
          "description": "...",
          "location": "..."
        }
      ],
      "restaurants": [
        {
          "name": "Le Comptoir du Relais",
          "time": "12:30",
          "cuisine": "Française",
          "priceRange": "€€"
        }
      ]
    }
  ],
  "budget": "1000€",
  "tips": ["Conseil 1", "Conseil 2"]
}
```

## 🚀 Déploiement

### Avec Docker (Recommandé)

Voir [DOCKER.md](./docs/DOCKER.md) pour le guide complet.

```bash
docker-compose up -d
```

### Vercel

1. Connecter le repo GitHub
2. Configurer les variables d'environnement
3. Déployer

**Note** : Pour Vercel, vous devrez utiliser une base de données externe (Supabase, Railway, etc.) et Redis (Upstash, etc.).

### Autres plateformes

- Build : `pnpm build`
- Start : `pnpm start`

## 📚 Technologies

- **Next.js 16** : Framework React fullstack avec App Router
- **TypeScript** : Typage statique
- **Material-UI (MUI)** : Interface utilisateur moderne
- **Prisma** : ORM pour PostgreSQL
- **IA Multi-provider** : Abstraction pour basculer entre OpenAI, Gemini, etc.
  - **OpenAI API** : Génération IA (GPT-4) - Par défaut
  - **Google Gemini** : Alternative (optionnel)
- **Redis** : Cache (optionnel)
- **JWT** : Authentification
- **Zod** : Validation de schémas
- **Docker** : Containerisation

## 📖 Documentation

Toute la documentation est centralisée dans le répertoire [`docs/`](./docs/) :

- [QUICKSTART.md](./docs/QUICKSTART.md) - Démarrage rapide (5 minutes)
- [SETUP.md](./docs/SETUP.md) - Guide d'installation détaillé
- [DOCKER.md](./docs/DOCKER.md) - Guide Docker complet
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Architecture du projet

Documentation technique :
- [lib/ai/README.md](./lib/ai/README.md) - Guide de l'abstraction des providers d'IA

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une PR.

## 📄 Licence

MIT

## 🆘 Support

En cas de problème :

1. Consultez la [documentation Docker](./docs/DOCKER.md)
2. Vérifiez les logs : `docker-compose logs -f`
3. Ouvrez une issue sur GitHub

---

**Fait avec ❤️ pour faciliter la planification de vos voyages**
