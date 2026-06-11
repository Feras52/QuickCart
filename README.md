
# QuickCart - E-Commerce Web App

  

## Introduction

  

QuickCart est une application web e-commerce construite avec React, Vite et TypeScript.

L'application permet aux utilisateurs de parcourir des produits, filtrer et rechercher des articles, créer un compte, se connecter, ajouter des produits au panier, passer une commande avec paiement Stripe en mode test, puis consulter leurs commandes précédentes depuis leur page profil.

  

----------

  

## Technologies Utilisées

  

-  **React** — Pour l'interface utilisateur

  

-  **Vite** — Outil de développement rapide pour lancer et contruire le projet

  

-  **TypeScript** — Ajout du typage pour rendre le code plus clair et plus sûr

  

-  **Firebase Authentication** — Gestion de l'inscription, connexion, déconnexion et session utilisateur

  

-  **Firestore Database** — Stockage des informations utilisateurs et des commandes

  

-  **Zustand** — Gestion globale de l'état du panier avec persistance locale

  

-  **Stripe** — Intégration du paiement par carte en mode test

  

-  **Express.js** — Petit serveur backend pour créer les PaymentIntents Stripe de manière sécurisée

  

-  **React Router** — Navigation entre les pages de l'application

  

-  **CSS / Bootstrap Icons** — Style de l'interface et icônes

  

----------

  

## Fonctionnalités

  

-  **Catalogue de Produits** — Affichage de plusieurs produits avec nom, prix, catégorie et image.

  

-  **Recherche et Filtrage** — Recherche par nom de produit et filtrage par catégorie.

  

-  **Authentification Firebase** — Création de compte, connexion, déconnexion et maintien de session après refresh.

  

-  **Panier d'Achat** — Ajout de produits au panier, modification des quantités, suppression d'articles et calcul automatique du total.

  

-  **Persistance du Panier** — Le panier reste sauvegardé après un refresh grâce à Zustand et localStorage.

  

-  **Checkout** — Formulaire d'adresse de livraison avec validation des champs.

  

-  **Paiement Stripe** — Paiement par carte en mode test avec création de PaymentIntent via un backend Express.

  

-  **Confirmation de Commande** — Affichage de l'ID de commande, des produits commandés, de l'adresse de livraison, du statut de paiement et de la date estimée de livraison.

  

-  **Profil Utilisateur** — Affichage des informations utilisateur et de l'historique des commandes précédentes.

  

-  **Page About Us** — Page de présentation avec slider visuel.

  

----------

  
  

## Ce que J'ai Appris

  

-  **React Context** — Utiliser un contexte global pour partager l'utilisateur connecté dans toute l'application sans passer les props manuellement.

  

-  **Zustand State Management** — Gérer un état global simplement, notamment pour le panier d'achat et sa persistance avec localStorage.

  

-  **Stripe Payment** — Comprendre le fonctionnement d'un paiement sécurisé avec Stripe, la différence entre clé publique et clé secrète, et le rôle d'un PaymentIntent.

  

-  **APIs et Backend** — Créer un petit backend Express, envoyer des requêtes HTTP depuis React avec `fetch`, recevoir une réponse JSON et connecter le frontend au backend.

  

-  **Callback Functions** — Utiliser des fonctions callback pour faire communiquer les composants, par exemple déclencher la sauvegarde d'une commande après un paiement réussi.

  

----------

  


## Prochaines Étapes

- **Amélioration UI/UX** - Refaire l'interface avec un design plus moderne, esthétique et responsive.

- **Chatbot IA** - Ajouter un assistant intelligent pour aider les utilisateurs à trouver des produits, répondre à leurs questions, proposer des articles.

- **Dashboard Administrateur** - Créer une interface admin pour gérer les produits, consulter les commandes, modifier les statuts des commandes et suivre les utilisateurs.

- **Gestion Dynamique des Produits** - Déplacer les produits depuis le fichier statique `products.tsx` vers Firestore afin de pouvoir ajouter, modifier ou supprimer des produits dynamiquement.

- **Gestion du Stock** - Ajouter une quantité disponible pour chaque produit et empêcher l'achat lorsqu'un article n'est plus disponible.

- **Protection des Routes** - Protéger les pages comme Checkout et Profile afin que seuls les utilisateurs connectés puissent y accéder.

- **Meilleure Gestion des Erreurs** - Améliorer les messages d'erreur Firebase, Stripe et réseau avec des messages plus clairs et plus faciles à comprendre pour l'utilisateur.

- **Optimisation des Images** - Remplacer les grandes images base64 par des URLs optimisées.
  

## Comment Exécuter le Projet

  

**Prérequis :**

  

- Node.js installé

- npm installé

- Compte Firebase configuré

- Clés Firebase dans `.env`

- Clés Stripe test dans `.env`

  

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

  

3.  **Changer le nom de fichier .env.example à .env et inserer vos clés :**

  

4.  **Lancez le serveur Stripe backend :**

  

```bash

node  server/paymentServer.cjs

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
