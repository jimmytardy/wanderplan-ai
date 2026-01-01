# ⚡ Démarrage rapide

## Installation en 5 minutes

### 1. Installer les dépendances

```bash
pnpm install
```

### 2. Configurer l'environnement

Copiez `env.example` vers `.env` et remplissez au minimum :

```bash
cp env.example .env
```

**Minimum requis :**
- `DATABASE_URL` : URL PostgreSQL
- `JWT_SECRET` : Une chaîne aléatoire (ex: `openssl rand -base64 32`)
- `OPENAI_API_KEY` : Votre clé OpenAI

### 3. Initialiser la base de données

```bash
pnpm run db:generate
pnpm run db:push
```

### 4. Créer un admin

```bash
pnpm run create-admin
```

### 5. Lancer l'application

```bash
pnpm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## 🧪 Test rapide

1. **Générer un programme** :
   - Destination : "Paris"
   - Durée : 5 jours
   - Cliquez sur "Générer le programme"

2. **Se connecter en admin** :
   - Utilisez les identifiants créés à l'étape 4
   - Testez l'endpoint "IA Configurable"

## 📝 Notes

- Redis est optionnel : laissez `REDIS_URL` vide si non installé
- Pour PostgreSQL local, créez d'abord la base : `CREATE DATABASE wanderplan_ai;`
- ⚠️ Le script `seed` ne fonctionne qu'en développement (protection contre l'exécution en production)
- Consultez [SETUP.md](./SETUP.md) pour un guide détaillé

## 🆘 Problème ?

Vérifiez que :
- ✅ PostgreSQL est démarré
- ✅ Les variables d'environnement sont correctes
- ✅ La base de données existe
- ✅ OpenAI API key est valide

