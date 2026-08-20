# Chat AI CAMRAIL

Application de chat intelligent développée avec React et Vite, conçue pour interagir avec une IA Gemini en temps réel. Elle propose une interface de discussion moderne avec historique de conversations, affichage du raisonnement, citations de sources et prise en charge de la dictée vocale.

## Aperçu

Ce projet est un client web de conversation assistée par IA, inspiré du comportement d'un assistant de type chat. L'utilisateur peut :

- démarrer une conversation,
- consulter l'historique des discussions dans une sidebar,
- envoyer des messages texte,
- écouter la réponse de l'IA en streaming,
- visualiser le raisonnement interne de l'IA,
- consulter les sources citées par l'IA,
- renommer ou supprimer une conversation,
- utiliser la dictée vocale pour rédiger des messages.

## Fonctionnalités

- Interface de chat en React
- Conversations multiples avec gestion d'état locale
- Streaming des réponses de l'IA
- Affichage du raisonnement généré par le modèle
- Citations de sources avec liens externes
- Support de la recherche web via l'API Google GenAI
- Dictée vocale du navigateur (SpeechRecognition)
- Design responsive et sidebar réductible
- Rendu Markdown dans les messages et le raisonnement

## Stack technique

- React 19
- Vite
- JavaScript
- Google GenAI SDK
- Keycloak JS
- react-markdown
- remark-gfm
- rehype-highlight
- react-icons
- uuid

## Prérequis

Avant de lancer le projet, assurez-vous d'avoir installé :

- Node.js 18 ou plus
- npm
- Une clé API Gemini / Google Generative AI valide
- Une instance Keycloak accessible depuis l'application

## Installation

1. Clonez le dépôt :

```bash
git clone git@github.com:Arol4/Chat-AI-CAMRAIL.git
cd Chat-AI-CAMRAIL
```

2. Installez les dépendances :

```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet à partir de `.env.example`, puis renseignez vos paramètres :

```env
VITE_GEMINI_API_KEY=votre_cle_api
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=camrail-rda
VITE_KEYCLOAK_CLIENT_ID=camrail-rda-frontend
```

Le fichier `.env` est local et ne doit pas être versionné. Les variables `VITE_KEYCLOAK_*` doivent correspondre à un client Keycloak configuré pour l'application, avec une URL de redirection autorisée vers l'origine du frontend. L'application impose l'authentification au démarrage et propose la déconnexion depuis le profil utilisateur.

Un fichier d'exemple est disponible dans le dépôt sous le nom `.env.example`.

## Lancer le projet

### Mode développement

```bash
npm run dev
```

Le projet sera accessible par défaut sur le port Vite local (souvent `http://localhost:5173`).

### Build de production

```bash
npm run build
```

### Prévisualisation du build

```bash
npm run preview
```

### Vérification lint

```bash
npm run lint
```

## Structure du projet

```text
Chat-AI-CAMRAIL/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ChatArea/
│   │   ├── ChatInput/
│   │   ├── Message/
│   │   ├── MessageList/
│   │   ├── Sidebar/
│   │   └── UserProfile/
│   ├── context/
│   ├── services/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── ...
```

## Détails du fonctionnement

### 1. Gestion des conversations

La logique de l'application est centralisée dans le contexte React `AppProvider`, qui gère :

- la liste des conversations,
- la conversation active,
- l'état de la sidebar,
- les messages et leurs métadonnées.

Les actions sont gérées par un reducer pour ajouter, modifier, supprimer ou renommer des discussions.

### 2. Envoi et streaming des messages

Le composant `ChatInput` envoie le message utilisateur et crée immédiatement un message assistant vide. Ensuite, il consume le flux retourné par `streamReasoningAndAnswer()` du service IA.

Les chunks reçus permettent de mettre à jour :

- le contenu final de la réponse,
- le raisonnement de l'IA,
- la liste des sources citées.

### 3. Service IA

Le fichier `src/services/aiService.js` instancie le client Google GenAI et appelle le modèle `gemma-4-31b-it` avec :

- un flux de réponse streaming,
- activation des `thinking_summaries`,
- le support de recherche web via `google_search`.

Les événements du flux sont transformés en morceaux de texte et en métadonnées de sources pour l'affichage dans l'interface.

### 4. Rendu des messages

Les messages sont affichés avec `react-markdown`, et le raisonnement est rendu avec une configuration qui inclut :

- support GFM,
- coloration syntaxique de code,
- mise en forme lisible pour les étapes de réflexion.

## Configuration de l’environnement

Les variables d'environnement utilisées par l'application sont :

```env
VITE_GEMINI_API_KEY=xxxxxxxx
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=camrail-rda
VITE_KEYCLOAK_CLIENT_ID=camrail-rda-frontend
```

Important : ces variables doivent être présentes au moment où l'application démarre. La clé Gemini est utilisée par le service IA et les variables Keycloak par le service d'authentification.

## Points à noter

- Les conversations sont stockées dans l'état React local du navigateur, donc elles ne sont pas persistées dans une base de données.
- La dictée vocale dépend des capacités du navigateur et peut varier selon le support et la configuration du système.
- L'intégration de recherche web utilise l'outillage du client AI Google et dépend des fonctionnalités disponibles sur votre clé API.

## Contribution

Les contributions sont les bienvenues. Pour proposer une amélioration :

1. créer une branche,
2. ajouter la fonctionnalité ou la correction,
3. lancer `npm run lint`,
4. ouvrir une pull request avec une description claire.

## Licence

Ce projet est un projet interne / de démonstration. Vérifiez le type de licence applicable avant toute diffusion externe.

## Auteur

Projet développé dans le cadre de l'écosystème CAMRAIL / IA conversationnelle.
