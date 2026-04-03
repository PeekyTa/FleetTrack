# Architecture Technique — FleetTrack

## Vue d'Ensemble

FleetTrack est une plateforme de suivi en temps réel de radios POC (Push-to-Talk over Cellular). L'architecture est organisée en trois couches principales :

```
┌──────────────────────────────────┐
│     FRONTEND (React + Vite)      │
│   TypeScript • Tailwind CSS      │
│  Leaflet • Socket.io-client      │
├──────────────────────────────────┤
│       REST API + WebSocket       │
├──────────────────────────────────┤
│    BACKEND (Node.js + Express)   │
│   TypeScript • Prisma ORM        │
│  Socket.io • JWT • Swagger       │
├──────────────────────────────────┤
│   PostgreSQL + PostGIS (Docker)  │
└──────────────────────────────────┘
```

## Stack Technologique

### Frontend
| Technologie | Rôle |
|------------|------|
| React 19 | Framework UI |
| TypeScript | Typage statique |
| Vite | Bundler et serveur de développement |
| Tailwind CSS 4 | Framework CSS utilitaire |
| React Router 7 | Routage côté client |
| Leaflet | Cartes interactives |
| Recharts | Graphiques et visualisations |
| Socket.io-client | Communication temps réel |
| Lucide React | Icônes |
| Axios | Client HTTP |

### Backend
| Technologie | Rôle |
|------------|------|
| Node.js 20 | Runtime JavaScript |
| Express 4 | Framework HTTP |
| TypeScript | Typage statique |
| Prisma ORM | Accès base de données |
| Socket.io | WebSocket bidirectionnel |
| JWT (jsonwebtoken) | Authentification |
| bcrypt | Hachage de mots de passe |
| Swagger (swagger-jsdoc) | Documentation API |
| Zod | Validation de schémas |

### Base de Données
| Technologie | Rôle |
|------------|------|
| PostgreSQL 15 | SGBDR principal |
| PostGIS 3.4 | Extension géospatiale |
| Docker | Conteneurisation |

## Structure des Dossiers

### Frontend (`src/`)
```
src/
├── app/
│   ├── App.tsx              ← Point d'entrée React
│   ├── routes.ts            ← Routage avec gardes d'authentification
│   ├── components/
│   │   └── Layout.tsx       ← Mise en page avec sidebar + navbar
│   └── pages/               ← 9 pages (Dashboard, LiveMap, etc.)
├── components/              ← Composants réutilisables
│   ├── Map/
│   │   ├── LeafletMap.tsx   ← Carte Leaflet (temps réel)
│   │   └── HistoryMap.tsx   ← Carte de lecture d'historique
│   ├── Sidebar/
│   └── Navbar/
├── context/
│   ├── AuthContext.tsx      ← État d'authentification global
│   └── SocketContext.tsx    ← Fournisseur WebSocket
├── guards/
│   └── RoleGuard.tsx        ← Protection des routes par rôle
├── hooks/                   ← Hooks personnalisés (données API)
│   ├── useDevices.ts
│   ├── useLocations.ts
│   ├── useAlerts.ts
│   ├── useGeofences.ts
│   ├── useUsers.ts
│   └── useAnalytics.ts
├── services/
│   └── api.ts               ← Service API typé (Axios)
├── types/
│   └── index.ts             ← Types TypeScript partagés
└── styles/
```

### Backend (`backend/`)
```
backend/
├── prisma/
│   ├── schema.prisma        ← Schéma de la base de données
│   └── seed.ts              ← Données initiales de démonstration
├── src/
│   ├── server.ts            ← Point d'entrée Express + Socket.io
│   ├── config/              ← Configuration (env, Prisma)
│   ├── controllers/         ← Contrôleurs HTTP (7 modules)
│   ├── services/            ← Logique métier (7 modules)
│   ├── middleware/           ← Auth, RBAC, erreurs
│   ├── routes/              ← Définition des routes (7 modules)
│   ├── socket/              ← Gestionnaire WebSocket
│   └── utils/               ← Swagger, utilitaires
├── Dockerfile
├── tsconfig.json
└── .env
```

## Modèle de Données

### Entités principales

| Table | Description | Relations |
|-------|-------------|-----------|
| `users` | Utilisateurs de la plateforme | → device_assignments, audit_logs |
| `devices` | Radios POC suivies | → locations, alerts, device_assignments |
| `locations` | Positions GPS horodatées | → device |
| `alerts` | Alertes système (géorepérage, batterie, SOS) | → device |
| `geofence_zones` | Zones de géorepérage (polygone/cercle) | — |
| `device_assignments` | Liaison utilisateur-appareil | → user, device |
| `audit_logs` | Journal d'audit des actions | → user |
| `settings` | Paramètres clé-valeur | — |

## Contrôle d'Accès (RBAC)

| Permission | ADMIN | SUPERVISOR | OPERATOR | VIEWER |
|-----------|-------|------------|----------|--------|
| Tableau de bord | ✅ | ✅ | ✅ | ✅ |
| Carte en direct | ✅ | ✅ | ✅ | ✅ |
| Gestion appareils | ✅ (CRUD) | ✅ (lecture) | ❌ | ❌ |
| Historique | ✅ | ✅ | ✅ | ✅ |
| Alertes | ✅ | ✅ (acquitter) | ✅ (acquitter) | ✅ (lecture) |
| Géorepérage | ✅ | ✅ | ❌ | ❌ |
| Analytique | ✅ | ✅ | ❌ | ❌ |
| Utilisateurs | ✅ | ❌ | ❌ | ❌ |
| Paramètres | ✅ | ❌ | ❌ | ❌ |

## Communication Temps Réel

### Événements WebSocket

| Événement | Direction | Données | Description |
|-----------|-----------|---------|-------------|
| `device:locationUpdate` | Serveur → Client | `{ deviceId, lat, lng, speed, timestamp }` | Mise à jour de position |
| `device:statusChange` | Serveur → Client | `{ deviceId, status, battery, signal }` | Changement de statut |
| `alert:new` | Serveur → Client | `{ id, type, severity, deviceId, message }` | Nouvelle alerte |
| `alert:acknowledged` | Serveur → Client | `{ id, acknowledgedBy }` | Alerte acquittée |

## Points de Terminaison API

La documentation complète est disponible sur `/api/docs` (Swagger UI).

### Groupes de routes

| Préfixe | Module | Méthodes |
|---------|--------|----------|
| `/api/auth` | Authentification | POST login, POST register, GET me |
| `/api/devices` | Appareils | GET, POST, PUT, DELETE, GET stats |
| `/api/locations` | Positions GPS | POST, GET history, GET latest |
| `/api/alerts` | Alertes | GET, PUT acknowledge |
| `/api/geofences` | Géorepérage | GET, POST, PUT, DELETE |
| `/api/users` | Utilisateurs | GET, POST, PUT, DELETE |
| `/api/analytics` | Analytique | GET dashboard, devices, alerts, distance |

## Justification PostgreSQL + PostGIS

| Critère | PostgreSQL + PostGIS | MySQL |
|---------|---------------------|-------|
| Requêtes géospatiales | ST_Contains, ST_DWithin natifs | Fonctions spatiales limitées |
| Indexation spatiale | GiST optimisé | B-tree uniquement |
| Séries temporelles | BRIN index pour les timestamps | Moins efficace |
| JSON | JSONB avec indexation | JSON sans index |
| Extensibilité | Riche écosystème d'extensions | Plus limité |
