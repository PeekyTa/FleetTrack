import swaggerJsdoc from 'swagger-jsdoc';
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FleetTrack API — Tableau de Bord de Géolocalisation',
      version: '1.0.0',
      description: `
API REST pour la gestion et le suivi en temps réel des radios POC (Push-to-Talk over Cellular).
## Fonctionnalités principales
- **Authentification** : Inscription, connexion, gestion de profil (JWT)
- **Appareils** : CRUD complet avec gestion par groupes
- **Positions GPS** : Ingestion et historique des positions
- **Alertes** : Géorepérage, batterie faible, signal perdu, SOS
- **Géorepérage** : Création et gestion des zones
- **Utilisateurs** : Gestion des utilisateurs et rôles (RBAC)
- **Analytique** : Statistiques et indicateurs de performance
## Rôles disponibles
| Rôle | Description |
|------|-------------|
| ADMIN | Accès complet au système |
| SUPERVISOR | Surveillance de la flotte et gestion des équipes |
| OPERATOR | Tâches opérationnelles — consultation et acquittement d'alertes |
| VIEWER | Accès en lecture seule aux appareils assignés |
      `,
      contact: {
        name: 'Équipe FleetTrack',
        email: 'support@fleettrack.io',
      },
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Serveur de développement' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenu via /api/auth/login',
        },
      },
    },
    tags: [
      { name: 'Authentification', description: 'Gestion de l\'authentification et des sessions' },
      { name: 'Appareils', description: 'Gestion des radios POC et de leur statut' },
      { name: 'Positions', description: 'Suivi GPS et historique des positions' },
      { name: 'Alertes', description: 'Gestion des alertes et notifications' },
      { name: 'Géorepérage', description: 'Zones de géorepérage et règles d\'alerte' },
      { name: 'Utilisateurs', description: 'Gestion des utilisateurs et des rôles' },
      { name: 'Analytique', description: 'Statistiques et indicateurs de performance' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};
export const swaggerSpec = swaggerJsdoc(options);
