
# QuickCart - Modern E-Commerce Web App with AI RAG Assistant

## Introduction
**QuickCart** est une application web e-commerce moderne et performante construite avec React, Vite et TypeScript. 

L'application offre un parcours d'achat complet : recherche intelligente assistée par IA, consultation d'un catalogue dynamique hébergé sur Firestore, gestion d'un panier persistant, authentification sécurisée et paiement par carte bancaire via Stripe en mode test.

---

## Nouvelles Fonctionnalités Majeures 

* **Assistant IA Shopping RAG (Retrieval-Augmented Generation) :** Intégration d'un chatbot intelligent alimenté par l'API Google Gemini (`gemini-3.6-flash` & `gemini-embedding-001`). Il analyse la sémantique des questions des utilisateurs via la recherche vectorielle Firestore (`findNearest`) pour recommander des produits pertinents du catalogue en temps réel sans halluciner.
* **UI/UX Moderne & Esthétique :** Refonte visuelle complète de l'interface utilisateur pour un rendu élégant, épuré et responsive.
* **Migration vers Firestore Database :** Le catalogue produit a été entièrement migré depuis des fichiers statiques locaux vers la base de données dynamique Cloud Firestore.
* **Optimisation des Images :** Remplacement des images locales par des URLs Unsplash haute définition optimisées pour le web.

---

##  Technologies Utilisées

### Frontend
* **React 18 & Vite** — Pour une interface utilisateur réactive et un environnement de développement rapide.
* **TypeScript** — Typage statique pour un code robuste et maintenable.
* **Zustand** — Gestion globale de l'état du panier avec persistance locale (`localStorage`).
* **React Router** — Navigation fluide entre les pages de l'application.
* **CSS Modern / Bootstrap Icons** — Design sur-mesure et iconographie.

### Backend & IA
* **Node.js & Express.js** — API Backend gérant la création des `PaymentIntents` Stripe, le pipeline RAG et la gestion du rate limiting.
* **Google Gemini API SDK (`@google/genai`)** — Génération d'embeddings vectoriels et traitement du langage naturel pour le chatbot.
* **Stripe SDK** — Gestion sécurisée des paiements par carte.

### Base de Données & Services Cloud
* **Firebase Authentication** — Gestion des inscriptions, connexions et sessions utilisateurs.
* **Cloud Firestore** — Base de données NoSQL pour les comptes utilisateurs, le catalogue produits dynamiques, les embeddings vectoriels (768 dimensions) et l'historique des commandes.
* **Firebase Admin SDK** — Accès serveur sécurisé à Firestore pour l'indexation vectorielle automatique.

---

##  Fonctionnalités Principales

* **🤖 Chatbot IA RAG :** Posez n'importe quelle question sur les produits (ex: *"Avez-vous des équipements légers pour le sport ?"*) et recevez des réponses personnalisées basées directement sur le stock.
* **🛍️ Catalogue Dynamique & Recherche :** Affichage en temps réel des produits Firestore avec filtrage par catégorie et recherche textuelle.
* **🔒 Authentification Firebase :** Inscription, connexion, déconnexion et conservation de session après rafraîchissement.
* **🛒 Panier d'Achat Persistant :** Ajout d'articles, ajustement des quantités et calcul automatique du total (conservé après refresh).
* **💳 Paiement Stripe Sécurisé :** Formulaire de livraison avec validation et paiement en mode test via PaymentIntents.
* **📋 Confirmation & Profil Utilisateur :** Tableau de bord affichant le détail des commandes passées et les informations de compte.


---

##  Prochaines Étapes

- [ ] **Dashboard Administrateur :** Interface admin pour ajouter, modifier ou supprimer des produits Firestore sans passer par la console.
- [ ] **Gestion Dynamique du Stock :** Suivi des quantités disponibles et blocage des commandes en cas de rupture de stock.
- [ ] **Protection des Routes (Auth Guard) :** Redirection automatique des utilisateurs non authentifiés essayant d'accéder aux pages `/checkout` et `/profile`.
- [ ] **Historique du Chat IA :** Sauvegarde des conversations avec l'assistant IA directement dans le profil utilisateur Firestore.

---

## Comment Exécuter le Projet

  

**Prérequis :**

  

- Node.js installé

- npm installé

- Compte Firebase configuré

- Clés Firebase dans `.env`

- Clés Stripe test dans `.env`

- Clé d'API Google Gemini (AI Studio) dans `.env`
  

**Étapes d'Installation :**

  

1.  **Clonez le projet :**

  

```bash

git  clone  https://github.com/Feras52/quickcart.git

cd  quickcart

```

  

2.  **Installez les dependances :**

  

```bash

npm  install

```

  

3.  **Changez le nom de fichier .env.example à .env et inserer vos clés :**

  

4.  **Lancez le serveur Stripe backend :**

  

```bash

node  server/server.js

```

  

5.  **Lancez l'application React :**

  

```bash

npm  run  dev

```

  

6.  **Ouvrez l'application :**

  

```txt

http://localhost:5173

```

  

----------

  

## Paiement Test Stripe

  

Utilisez cette carte de test :

  

```txt

Card Number: 4242 4242 4242 4242

Expiration: Any future date

CVC: Any 3 digits

```

  

Aucun vrai paiement n'est effectue en mode test.

  

----------
