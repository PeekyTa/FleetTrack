# Guide d'Installation — FleetTrack

## Prérequis

| Outil | Version minimale | Recommandé |
|-------|-----------------|------------|
| Node.js | 18.x | 20.x LTS |
| npm | 9.x | 10.x |
| Docker | 20.x | 25.x |
| Docker Compose | 2.x | 2.25+ |
| Git | 2.x | Dernière |

## Installation Rapide

### 1. Cloner le projet

```bash
git clone https://github.com/votre-org/geolocation-tracking-dashboard.git
cd geolocation-tracking-dashboard
```

### 2. Démarrer la base de données

```bash
docker compose up -d db
```

Cela démarre un conteneur PostgreSQL + PostGIS sur le port `5432`.

### 3. Configurer le backend

```bash
cd backend
cp .env.example .env   # Ou utilisez le .env existant
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

#### Variables d'environnement (`backend/.env`)

```
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/geolocation_db?schema=public"
JWT_SECRET=votre_cle_secrete_jwt
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 4. Démarrer le serveur API

```bash
npm run dev
```

Le serveur sera accessible sur `http://localhost:5000`.  
La documentation Swagger est disponible sur `http://localhost:5000/api/docs`.

### 5. Configurer le frontend

```bash
cd ..  # Retour à la racine
npm install --legacy-peer-deps
```

### 6. Démarrer l'application frontend

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`.

## Identifiants de Démonstration

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@fleettrack.io | admin123 | ADMIN |
| schen@fleettrack.io | password123 | SUPERVISOR |
| drodriguez@fleettrack.io | password123 | OPERATOR |
| jpark@fleettrack.io | password123 | VIEWER |

## Démarrage avec Docker (tout-en-un)

```bash
docker compose up --build
```

Cela démarre à la fois la base de données PostGIS et le serveur API.

## Commandes Utiles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarrer le serveur de développement (frontend ou backend) |
| `npx prisma studio` | Interface graphique pour la base de données |
| `npx prisma migrate dev` | Appliquer les migrations |
| `npx prisma db seed` | Réinitialiser les données de démonstration |
| `docker compose up -d db` | Démarrer uniquement la base de données |
| `docker compose down -v` | Arrêter et supprimer les volumes |

## Résolution de Problèmes

### Port déjà utilisé
```bash
npx kill-port 5000 5173
```

### Erreur Prisma "migration not found"
```bash
npx prisma migrate reset
npx prisma db seed
```

### Erreur "ECONNREFUSED" PostgreSQL
Vérifiez que Docker est démarré et le conteneur `fleettrack-db` est actif :
```bash
docker ps
```
