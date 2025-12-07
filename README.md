# AYJI – Plateforme E-Learning Moderne

[![License: Academic](https://img.shields.io/badge/License-Academic%20Project-blue.svg)](LICENSE)
[![Angular](https://img.shields.io/badge/Angular-19-DD0031?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://ayji-frontend.vercel.app)

---

## Présentation

**AYJI** est une plateforme e-learning moderne et interactive, développée dans le cadre d'un **projet de fin d'études**. Elle vise à résoudre le manque d'engagement et de suivi dans l'apprentissage en ligne en proposant :

- Une **interface étudiante intuitive** regroupant cours, quiz et suivi de progression
- Un **tableau d'administration** pour gérer facilement le contenu pédagogique

> **Type de projet** : Personnel / Académique

---

## Fonctionnalités clés

| Fonctionnalité | Description |
|----------------|-------------|
| **Authentification sécurisée** | Inscription, connexion et gestion des sessions |
| **Tableau de bord** | Progression individuelle en un coup d'œil |
| **Visionneuse PDF** | Consultation du contenu pédagogique intégrée |
| **Quiz interactifs** | QCM classés par niveau de difficulté |
| **Résultats détaillés** | Feedback constructif avec explications |
| **Profil utilisateur** | Statistiques (temps passé, cours complétés, etc.) |
| **Interface responsive** | Design adaptatif pour tous les appareils |

---

## Stack Technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Angular** | 19 | Framework frontend |
| **TypeScript** | 5.x | Langage principal |
| **NgRx** | - | State management |
| **SCSS** | - | Styles avancés |
| **Tailwind CSS** | 3.x | Utility-first CSS |
| **Socket.io-client** | - | Communication temps réel |

---

## Prérequis

| Outil | Version recommandée |
|-------|---------------------|
| Node.js | >= 20.x |
| npm / pnpm / yarn | >= 8.x |
| Angular CLI | >= 17.x |

---

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/Badie005/ayji-frontend.git
cd ayji-frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
ng serve
```

Accédez à l'application : [http://localhost:4200](http://localhost:4200)

---

## Scripts disponibles

| Script | Description |
|--------|-------------|
| `ng serve` | Démarre le serveur de développement |
| `ng build` | Compile l'application pour la production |
| `ng test` | Lance les tests unitaires (Karma) |
| `ng lint` | Vérifie la qualité du code |

---

## Structure du projet

```
src/
├── app/
│   ├── core/           # Services, guards, interceptors
│   ├── shared/         # Composants réutilisables
│   ├── features/       # Modules fonctionnels (cours, quiz, auth...)
│   └── app.module.ts   # Module racine
├── assets/             # Images, polices, fichiers statiques
├── environments/       # Configuration par environnement
└── styles.scss         # Styles globaux
```

---

## Démo en ligne

L'application est déployée et accessible ici : **[ayji-frontend.vercel.app](https://ayji-frontend.vercel.app)**

---

## Projets liés

| Projet | Description | Lien |
|--------|-------------|------|
| **AYJI Backend** | API RESTful (Node.js/Express) | [ayji-backend](https://github.com/Badie005/ayji-backend) |

---

## Contribution

Ce projet étant académique, les contributions sont les bienvenues à des fins éducatives :

1. Forkez le repo
2. Créez votre branche (`git checkout -b feature/ma-fonctionnalite`)
3. Commitez vos changements (`git commit -m 'feat: ma fonctionnalité'`)
4. Poussez la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une Pull Request

---

## Licence

Ce projet est sous **licence académique personnalisée**.

- Consultation et fork autorisés pour usage éducatif
- Usage commercial interdit sans autorisation
- Voir le fichier [LICENSE](LICENSE) pour plus de détails

---

## Auteur

**Abdelbadie Khoubiza**

| Plateforme | Lien |
|------------|------|
| GitHub | [@Badie005](https://github.com/Badie005) |
| Email | [a.khoubiza.dev@gmail.com](mailto:a.khoubiza.dev@gmail.com) |
| Portfolio | [portfoliobadie.vercel.app](https://portfoliobadie.vercel.app) |
| LinkedIn | [Badie Khoubiza](https://www.linkedin.com/in/badie-khoubiza) |

---

Copyright © 2025 Abdelbadie Khoubiza - Tous droits réservés
