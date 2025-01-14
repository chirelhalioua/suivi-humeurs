# Projet de Suivi des Humeurs

Ce projet est une application web permettant de suivre les humeurs journalières et hebdomadaires des utilisateurs. Elle est constituée d'un frontend (Nuxt.js), d'un backend (Node.js/Express) et utilise MongoDB comme base de données.

## Fonctionnalités
- Suivi des humeurs matin et soir pour chaque jour de la semaine.
- Vue hebdomadaire des humeurs.
- Gestion des utilisateurs avec authentification basée sur token (JWT).

---

## Structure du Projet
```
mon-projet/
├── backend/              # Code backend (Node.js/Express)
│   ├── .env             # Variables d'environnement pour le backend
│   ├── package.json
│   ├── server.js
│   └── ... (autres fichiers backend)
├── frontend/             # Code frontend (Vue.js)
│   ├── .env             # Variables d'environnement pour le frontend
│   ├── package.json
│   ├── src/
│   └── ... (autres fichiers frontend)
├── README.md             # Documentation du projet
└── .gitignore            # Liste des fichiers à ignorer dans Git
```

---

## Prérequis
Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) (v16 ou plus récent)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local ou distant)

---

## Installation

### 1. Cloner le répertoire du projet
```bash
git clone [https://github.com/votre-utilisateur/mon-projet.git](https://github.com/chirelhalioua/suivi-humeurs.git)
cd suivi-humeurs
```

### 2. Configuration des Variables d'Environnement

#### Backend
Créez un fichier `.env` dans le dossier `backend/` et ajoutez les variables suivantes :
```
PORT=5000
MONGO_URI=Votre_URL_MongoDB
JWT_SECRET=Votre_Secret_JWT
```

#### Frontend
Créez un fichier `.env` dans le dossier `frontend/` et ajoutez les variables suivantes :
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Installation des Dépendances

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

---

## Démarrage du Projet

### Lancer le Backend
Depuis le dossier `backend/` :
```bash
npm start
```

### Lancer le Frontend
Depuis le dossier `frontend/` :
```bash
npm run dev
```

Le frontend sera accessible sur [http://localhost:5173](http://localhost:5173) (par défaut avec Vite).

---

## Utilisation
1. Connectez-vous ou inscrivez-vous pour accéder à l'application.
2. Sélectionnez une date pour enregistrer ou consulter vos humeurs.
3. Passez en mode hebdomadaire pour voir un récapitulatif de vos humeurs.

---

## Déploiement

### Backend
Hébergez votre backend sur un service comme [Heroku](https://www.heroku.com/), [Render](https://render.com/) ou [AWS](https://aws.amazon.com/).
1. Configurez les variables d'environnement dans le tableau de bord du service d'hébergement.
2. Déployez votre application.

### Frontend
Hébergez votre frontend sur [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/) ou un autre service similaire.
1. Configurez la variable `VITE_API_URL` pour pointer vers l'URL de votre backend déployé.
2. Déployez votre application.

---

## Technologies Utilisées
- **Frontend** : Vue.js (Vite)
- **Backend** : Node.js, Express
- **Base de données** : MongoDB

---

## Contribuer

1. Forkez le projet.
2. Créez une branche pour votre fonctionnalité : `git checkout -b nouvelle-fonctionnalite`.
3. Commitez vos changements : `git commit -m 'Ajout d’une nouvelle fonctionnalité'`.
4. Poussez votre branche : `git push origin nouvelle-fonctionnalite`.
5. Ouvrez une Pull Request.

---

## Licence
Ce projet est sous licence [MIT](https://opensource.org/licenses/MIT).

---

## Auteur
Chirel Halioua 

