# Guide Utilisateur — FleetTrack

## Introduction

FleetTrack est une plateforme de gestion et de suivi en temps réel de radios POC (Push-to-Talk over Cellular). Ce guide vous accompagne dans l'utilisation de toutes les fonctionnalités de l'application.

## Connexion

1. Accédez à `http://localhost:5173/login`
2. Saisissez votre adresse email et mot de passe
3. Cliquez sur **Se Connecter**

> **Note :** Les identifiants de démonstration sont pré-remplis :  
> Email: `admin@fleettrack.io` | Mot de passe: `admin123`

---

## Rôles Utilisateur

Votre rôle détermine les fonctionnalités auxquelles vous avez accès :

| Rôle | Description | Accès |
|------|-------------|-------|
| **ADMIN** | Administrateur système | Accès complet à toutes les fonctionnalités |
| **SUPERVISOR** | Chef d'équipe | Surveillance de la flotte, gestion des géorepérages, analytique |
| **OPERATOR** | Agent terrain | Consultation de la carte, historique, acquittement d'alertes |
| **VIEWER** | Observateur | Lecture seule sur les appareils qui lui sont assignés |

---

## Modules

### 1. Tableau de Bord

Le tableau de bord affiche un résumé de l'état de votre flotte :
- **Statistiques** : Nombre total d'appareils, en ligne, hors ligne, alertes actives
- **Carte** : Vue d'ensemble des positions des appareils
- **Liste des appareils** : État en temps réel de chaque appareil

### 2. Carte en Direct

La carte interactive Leaflet affiche la position de tous les appareils en temps réel :
- **Filtrage** : Par statut (en ligne, hors ligne, batterie faible, alerte)
- **Recherche** : Par nom ou identifiant d'appareil
- **Clic sur un marqueur** : Affiche les détails de l'appareil (batterie, signal, groupe)
- **Zones de géorepérage** : Affichées en superposition si vous êtes Admin ou Superviseur

### 3. Gestion des Appareils *(Admin, Superviseur)*

Gérez votre flotte de radios POC :
- **Voir** : Liste de tous les appareils avec statut, batterie, signal
- **Filtrer** : Par groupe, par statut
- **Ajouter** : Créer un nouvel appareil (nom, identifiant, groupe, modèle)
- **Modifier** : Mettre à jour les informations d'un appareil
- **Supprimer** : Retirer un appareil du système

### 4. Historique & Lecture

Rejouez le trajet d'un appareil :
1. Sélectionnez un appareil dans la liste
2. Définissez la plage de dates
3. Cliquez **Charger l'historique**
4. Utilisez les contrôles de lecture (play, pause, vitesse) pour voir le trajet
- La ligne bleue montre le chemin parcouru
- La ligne grise en pointillé montre le chemin restant

### 5. Alertes & Géorepérage

#### Onglet Alertes
- Visualisez toutes les alertes en cours et passées
- Filtrez par sévérité (Critique, Élevée, Moyenne, Faible)
- Filtrez par statut (Acquittée / Non acquittée)
- Acquittez une alerte individuelle ou toutes les alertes (Admin, Superviseur, Opérateur)

#### Onglet Zones de Géorepérage *(Admin, Superviseur)*
- Visualisez les zones définies sur la carte
- Activez/désactivez une zone
- Les zones actives sont affichées sur la carte en direct

### 6. Analytique *(Admin, Superviseur)*

Consultez les indicateurs de performance de votre flotte :
- **Activité des appareils** : Graphique en temps réel des appareils en ligne/hors ligne
- **Distance parcourue** : Distance totale parcourue cette semaine
- **Qualité du signal** : Distribution de la qualité du signal (Excellent, Bon, Moyen, Faible)
- **Couverture par groupe** : Pourcentage d'appareils en ligne par groupe
- **Distribution des alertes** : Types d'alertes les plus fréquents

### 7. Utilisateurs & Rôles *(Admin)*

Gérez les utilisateurs de la plateforme :
- **Ajouter** : Créer un nouvel utilisateur avec nom, email, mot de passe et rôle
- **Modifier** : Changer le rôle ou le statut d'un utilisateur
- **Supprimer** : Retirer un utilisateur
- **Matrice de permissions** : Visualisez les permissions de chaque rôle

### 8. Paramètres *(Admin)*

Configurez les paramètres système :
- **Général** : Nom de l'entreprise, fuseau horaire, langue, thème
- **GPS & Carte** : Intervalle de mise à jour, seuils d'alerte
- **Sécurité** : Timeout de session, authentification 2FA
- **Notifications** : Email, push, SMS, sons d'alerte
- **Clés API** : Gestion des clés d'accès à l'API

---

## Indicateur de Connexion Temps Réel

Dans la barre supérieure, un indicateur affiche l'état de la connexion WebSocket :
- 🟢 **Connecté** : Les données sont mises à jour en temps réel
- 🔴 **Hors ligne** : La connexion WebSocket est interrompue ; les données ne sont plus mises à jour automatiquement

---

## Documentation API

La documentation Swagger de l'API est disponible à l'adresse :  
`http://localhost:5000/api/docs`

Toutes les routes sont documentées en français avec les schémas de requête et réponse.
