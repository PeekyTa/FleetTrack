# Changelog

## [1.1.0] - 2026-04-03
### Added
- **Frontend** : Configuration de Vitest, ajout des tests unitaires pour le rendu conditionnel (ex: Devices, Map, RoleGuard).
- **Backend** : Pipeline CI mis en place. Les migrations Prisma se lancent dorénavant de manière déterministe avant chaque déploiement.
- **QA** : Mise en place complète des tests de non-régression RBAC automatisés.
- **Documentation** : Swagger est synchronisé. Ajout du changelog (ce fichier) orchestré par le Documentation Agent.

### Changed
- Refonte des handlers `implicit any` de React via TS Strict mode.
- Remplacement du mapping mocké par `react-leaflet`.

## [1.0.0] - Sortie Initiale
- Création de base des composants avec données en dur (Maquette Figma vers code).
