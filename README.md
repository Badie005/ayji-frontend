# AYJI – Modern E-Learning Platform

AYJI est une plateforme e-learning moderne et interactive, développée dans le cadre d’un projet de fin d’études. Elle a pour objectif de résoudre le manque d’engagement et de suivi dans l’apprentissage en ligne en offrant :

* une interface étudiante intuitive regroupant cours, quiz et suivi de progression ;
* un tableau d’administration pour gérer facilement le contenu pédagogique.

---

## ✨ Fonctionnalités clés

- **Authentification sécurisée** : inscription & connexion.
- **Tableau de bord des cours** : progression individuelle en un coup d’œil.
- **Visionneuse PDF intégrée** pour consulter le contenu pédagogique.
- **Quiz interactifs (QCM)** classés par niveau de difficulté.
- **Résultats détaillés** avec explications pour un feedback constructif.
- **Profil utilisateur** avec statistiques (temps passé, cours complétés, etc.).
- **Interface responsive** construite avec Angular 17+ et SCSS.

---

## ⚙️ Prérequis

| Outil            | Version recommandée |
|------------------|---------------------|
| Node.js          | ≥ 20.x              |
| npm / pnpm / yarn| ≥ 8.x               |
| Angular CLI      | ≥ 17.x              |

---

## 🚀 Mise en route

```bash
# Cloner le dépôt
git clone https://github.com/Badie005/ayji-frontend.git
cd ayji-frontend

# Installer les dépendances
npm install  # ou pnpm install | yarn install

# Lancer le serveur de dev
ng serve
# 👉 http://localhost:4200/
```

---

## 📦 Scripts utiles

| Script             | Description                         |
|--------------------|-------------------------------------|
| `ng serve`         | Démarre le serveur de développement |
| `ng build`         | Compile l’application pour prod     |
| `ng test`          | Lance les tests unitaires (Karma)   |

---

## 🗂️ Structure du projet (extrait)

```text
src/
 ├─ app/
 │   ├─ core/            # Services & garde 
 │   ├─ shared/          # Composants réutilisables
 │   ├─ features/        # Modules fonctionnels (cours, quiz…)
 │   └─ app.module.ts    # Module racine
 ├─ assets/              # Images, polices, traductions…
 └─ styles.scss          # Styles globaux
```

---

## 🤝 Contribuer

1. Forkez le repo, créez votre branche (`git checkout -b feat/ma-fonctionnalite`).
2. Commitez vos changements (`git commit -m 'feat: ma fonctionnalité'`).
3. Poussez la branche (`git push origin feat/ma-fonctionnalite`).
4. Ouvrez une *Pull Request*.

---

## 📄 Licence

Ce projet est publié sous licence MIT — voir le fichier **LICENSE** pour plus d’informations.
