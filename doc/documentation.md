# Cissoufit — Documentation

Documentation de référence du projet : besoins métier et fonctionnement technique.
Elle est à tenir à jour à chaque évolution fonctionnelle ou technique, et sert aussi bien à un développeur qu'à un assistant IA travaillant sur le code.

---

## 1. Présentation

Cissoufit est une application web progressive (PWA) personnelle pour suivre ses exercices de fitness.

- **Usage principal :** sur mobile, installée sur l'écran d'accueil, utilisable hors ligne.
- **Utilisateur :** une seule personne, sans compte ni authentification.
- **Données :** stockées uniquement dans le `localStorage` du navigateur. Pas de backend, rien n'est envoyé sur le réseau.
- **Hébergement :** GitHub Pages — https://cyrilpointet.github.io/Cissoufit/

---

## 2. Besoins métier

### 2.1 Objectifs

Noter chaque jour les exercices de fitness réalisés, et pouvoir consulter l'historique.

### 2.2 Fonctionnalités

| #  | Fonctionnalité | Description | Statut |
| -- | -------------- | ----------- | ------ |
| F1 | Saisie d'une réalisation | Enregistrer un exercice réalisé : choisir un exercice existant, ou en créer un nouveau, puis saisir sa valeur et sa date (aujourd'hui par défaut) | ✅ Fait |
| F2 | Pré-remplissage | Quand on choisit un exercice, la valeur est pré-remplie avec la dernière valeur enregistrée pour cet exercice | ✅ Fait |
| F3 | Création d'exercice | Créer un nouvel exercice (nom et unité) directement depuis la saisie ; il rejoint ensuite la liste des exercices disponibles | ✅ Fait |
| F4 | Historique par date | Consulter les exercices passés, regroupés par jour (du plus récent au plus ancien) | ✅ Fait |
| F5 | Historique par exercice | Consulter les exercices passés, regroupés par exercice, chaque réalisation avec sa date | ✅ Fait |
| F6 | Modifier / supprimer une réalisation | Changer la valeur ou la date d'une réalisation, ou la supprimer | ✅ Fait |
| F7 | Gérer les exercices | Renommer un exercice, changer son unité, ou le supprimer (avec ses réalisations, après confirmation) | ✅ Fait |
| F8 | Sauvegarde | Exporter toutes les données dans un fichier JSON, et les restaurer depuis un tel fichier | ✅ Fait |

### 2.3 Modèle de données

Deux entités : le **catalogue d'exercices**, et les **réalisations** (un exercice effectué un jour donné, avec une valeur).

#### Exercise — exercice du catalogue

| Champ       | Type     | Règles |
| ----------- | -------- | ------ |
| `id`        | `string` | UUID (`crypto.randomUUID()`) |
| `name`      | `string` | Obligatoire, sans espaces en début et fin, unique sans tenir compte de la casse |
| `unit`      | `'kg' \| 'min' \| 'km'` | Obligatoire, choisie à la création |
| `createdAt` | `string` | Date ISO |

#### Entry — réalisation d'un exercice

| Champ        | Type     | Règles |
| ------------ | -------- | ------ |
| `id`         | `string` | UUID |
| `exerciseId` | `string` | Référence un `Exercise` existant |
| `date`       | `string` | Jour de réalisation, format `YYYY-MM-DD`, en heure locale |
| `value`      | `number` | Obligatoire, nombre décimal positif ou nul |
| `createdAt`  | `string` | Date ISO, sert à départager plusieurs réalisations le même jour |

Stores : `cissoufit:exercises` (`Exercise[]`) et `cissoufit:entries` (`Entry[]`), voir le registre (§3.4).

> Une réalisation pointe vers son exercice par `exerciseId`, et non par son nom : on peut ainsi renommer un exercice sans perdre son historique.

### 2.4 Règles de gestion

- **R1 — Valeur décimale :** la valeur est un nombre à virgule (ex. `12,5`), positif ou nul. La saisie accepte la virgule comme le point, et l'affichage utilise la virgule (format `fr-FR`).
- **R2 — Unité :** chaque exercice a une unité choisie à sa création, parmi `kg`, `min` et `km`. Elle s'affiche à côté de chaque valeur. L'app ne fait aucun calcul entre exercices différents.
- **R3 — Pré-remplissage :** la valeur proposée est celle de la réalisation la plus récente de l'exercice (la date la plus récente, puis `createdAt` en cas d'égalité). Si l'exercice n'a jamais été réalisé, le champ est vide.
- **R4 — Liste d'exercices :** on choisit dans le catalogue ou on crée un nouvel exercice. Si on essaie de créer un nom qui existe déjà (sans tenir compte de la casse), l'exercice existant est réutilisé.
- **R5 — Date de saisie :** une réalisation est datée du jour par défaut. On peut choisir une date passée, en cas d'oubli, mais pas une date future.
- **R6 — Plusieurs réalisations par jour :** un même exercice peut être enregistré autant de fois que voulu le même jour, par exemple pour plusieurs séries. Chaque réalisation est affichée séparément, dans l'ordre de saisie.
- **R7 — Modification :** une réalisation peut être modifiée (valeur et date) ou supprimée. Un exercice peut être renommé, en respectant l'unicité du nom, et son unité peut être changée.
- **R8 — Suppression d'un exercice :** supprimer un exercice supprime aussi toutes ses réalisations. Avant de supprimer, l'app affiche un avertissement qui indique le nombre de réalisations concernées, et demande une confirmation.
- **R9 — Sauvegarde :** un écran permet d'exporter toutes les données dans un fichier JSON (`cissoufit-YYYY-MM-DD.json`) et de les restaurer depuis un tel fichier. L'import **remplace** les données actuelles : l'app demande une confirmation avant, puis se recharge.
- **R10 — Après enregistrement :** le formulaire de saisie est réinitialisé (exercice, nom et unité du nouvel exercice, valeur). La date choisie est conservée.

### 2.5 Écrans

Navigation par une barre d'onglets en bas de l'écran.

| Route (après `#`)        | Écran | Fonctionnalités |
| ------------------------ | ----- | --------------- |
| `/`                      | **Saisie** : la liste des réalisations de la date choisie, puis en dessous le formulaire (date, exercice ou nouvel exercice avec son unité, valeur) | F1, F2, F3 |
| `/history`               | **Historique**, onglet « Par date » | F4 |
| `/history?view=exercise` | **Historique**, onglet « Par exercice » | F5 |
| `/entries/$entryId`      | Modifier ou supprimer une réalisation (on y accède en touchant une réalisation dans une liste) | F6 |
| `/exercises`             | Liste des exercices, avec leur unité et leur nombre de réalisations | F7 |
| `/exercises/$exerciseId` | Renommer un exercice, changer son unité, le supprimer (confirmation avec le nombre de réalisations supprimées) | F7 |
| `/backup`                | Sauvegarde : export et import JSON, avec le nombre d'exercices et de réalisations présents | F8 |

Les confirmations (suppressions, import) utilisent la boîte de dialogue native du navigateur (`window.confirm`).

### 2.6 Questions ouvertes

_Aucune pour l'instant._

---

## 3. Fonctionnement technique

### 3.1 Stack

| Brique            | Rôle                                                       |
| ----------------- | ---------------------------------------------------------- |
| React 19 + TS     | UI                                                         |
| Vite 8            | Dev server et bundler                                      |
| TanStack Router   | Routing par fichiers, typé, découpage du code automatique  |
| Tailwind CSS v4   | Styles (plugin `@tailwindcss/vite`, pas de config JS)      |
| vite-plugin-pwa   | Service worker Workbox, manifest, génération des icônes    |
| Vitest + happy-dom| Tests unitaires                                            |
| oxlint            | Lint                                                       |

### 3.2 Arborescence

```
.github/workflows/deploy.yml   # déploiement GitHub Pages (manuel)
doc/                           # documentation (ce fichier)
public/logo.svg                # logo source des icônes PWA
src/
├── main.tsx                   # point d'entrée React
├── router.tsx                 # instance du router
├── routeTree.gen.ts           # GÉNÉRÉ par le plugin router — ne pas éditer, mais committer
├── index.css                  # import Tailwind + thème (@theme)
├── routes/                    # une route = un fichier (écrans, voir §2.5)
│   ├── __root.tsx             # layout global (<Outlet />, barre d'onglets, page 404)
│   ├── index.tsx              # Saisie « / »
│   ├── history.tsx            # Historique (search param `view`)
│   ├── backup.tsx             # Sauvegarde
│   ├── entries/$entryId.tsx   # modification d'une réalisation
│   └── exercises/
│       ├── index.tsx          # liste des exercices
│       └── $exerciseId.tsx    # modification d'un exercice
├── features/                  # code métier, par domaine
│   ├── exercises/
│   │   ├── types.ts           # Exercise, Unit, UNITS
│   │   ├── store.ts           # exercisesStore
│   │   ├── actions.ts         # create / update / delete (avec suppression des réalisations)
│   │   ├── hooks.ts           # useSortedExercises, useExerciseMap
│   │   └── components/UnitPicker.tsx
│   ├── entries/
│   │   ├── types.ts           # Entry
│   │   ├── store.ts           # entriesStore
│   │   ├── actions.ts         # add / update / delete (+ validation)
│   │   ├── selectors.ts       # dernière valeur, regroupements par date / par exercice
│   │   └── components/        # EntryForm (saisie), EntryRow / EntryList
│   └── training.test.ts       # tests des règles métier
├── components/                # composants transverses
│   ├── ui/                    # Button, Field (+ inputClassName, ErrorMessage), Select, EmptyState
│   ├── BottomNav.tsx          # barre d'onglets
│   ├── PageHeader.tsx         # titre de page + bouton retour
│   ├── useGoBack.ts           # retour arrière, avec une page de repli si pas d'historique
│   └── icons.tsx              # icônes SVG
├── lib/
│   ├── format.ts              # nombres (virgule) et dates (YYYY-MM-DD local, libellés fr)
│   └── storage/               # couche de persistance localStorage
│       ├── store.ts           # createStore
│       ├── useStore.ts        # hook React
│       ├── backup.ts          # export / import JSON
│       └── store.test.ts
└── pwa/ReloadPrompt.tsx       # bannière de mise à jour de l'app
```

### 3.3 Routing

- **Routing par fichiers :** chaque fichier de `src/routes/` déclare une route via `createFileRoute('/chemin')`. Le plugin Vite régénère `routeTree.gen.ts` dès qu'un fichier est ajouté ou renommé (en dev comme au build).
  - `routes/exercises/index.tsx` → `/exercises`
  - `routes/exercises/$exerciseId.tsx` → `/exercises/:exerciseId` (lu avec `Route.useParams()`)
- **Search params :** validés par `validateSearch` dans la route (ex. `view` de `/history`), lus avec `Route.useSearch()`.
- **Hash history** (`/#/exercises`) : GitHub Pages ne sait pas renvoyer `index.html` pour une URL profonde, donc un rechargement en mode history classique donnerait une 404. Le hash évite le problème.
- **Layout :** `__root.tsx` contient le conteneur principal (`max-w-md`, pensé mobile), la barre d'onglets (`BottomNav`) et le composant 404. Chaque page affiche son titre avec `PageHeader`.
- **Retour arrière :** `useGoBack(fallback)` revient à la page précédente, ou à `fallback` si la page a été ouverte directement.
- **Devtools :** les devtools TanStack Router ne sont chargées qu'en dev.
- Les liens se font avec `<Link to="...">`, typé : une route inexistante provoque une erreur TypeScript.

### 3.4 Persistance (localStorage)

Toutes les données passent par `src/lib/storage`. **Aucun accès direct à `localStorage` ailleurs dans le code.**

#### Créer un store

```ts
// ex. src/features/workouts/store.ts
import { createStore } from '../../lib/storage'

export const workoutsStore = createStore<Workout[]>({
  key: 'workouts',     // stocké sous « cissoufit:workouts »
  version: 1,
  defaultValue: [],
})
```

#### L'utiliser

```tsx
const [workouts, setWorkouts] = useStore(workoutsStore)
setWorkouts((prev) => [...prev, newWorkout])
```

Hors React : `workoutsStore.get()`, `.set()`, `.reset()`, `.subscribe()`.

#### Format et versioning

- Chaque clé contient une enveloppe JSON `{ "version": <n>, "data": <valeur> }`.
- Quand la forme des données change, on **incrémente `version`** et on fournit `migrate(data, fromVersion)`. Les données migrées sont réécrites au premier accès.
- Sans `migrate`, des données d'une autre version sont ignorées et `defaultValue` est utilisé, sans être écrasé tant qu'on n'appelle pas `set`.
- Un JSON illisible renvoie `defaultValue` et l'erreur est loguée dans la console.

#### Comportement

- La valeur est mise en cache en mémoire après la première lecture. `useStore` s'appuie sur `useSyncExternalStore`.
- **Synchronisation entre onglets** grâce à l'événement `storage`.
- Les valeurs doivent être sérialisables en JSON : pas de `Date` (stocker des chaînes ISO), pas de `Map`/`Set`, pas de fonctions.

#### Sauvegarde

Le navigateur peut vider le `localStorage` (stockage saturé, nettoyage du navigateur, désinstallation de la PWA). `backup.ts` fournit :

- `exportBackup()` / `downloadBackup()` : un JSON de toutes les clés `cissoufit:*`
- `importBackup(json)` : valide le fichier, supprime toutes les clés `cissoufit:*` existantes, puis écrit celles de la sauvegarde. Les clés des autres apps ne sont pas touchées. **Il faut recharger la page ensuite**, car les stores gardent leur cache.

#### Registre des stores

| Clé (`cissoufit:…`) | Version | Contenu | Fichier |
| ------------------- | ------- | ------- | ------- |
| `exercises`         | 1       | `Exercise[]` — catalogue d'exercices | `src/features/exercises/store.ts` |
| `entries`           | 1       | `Entry[]` — réalisations | `src/features/entries/store.ts` |

### 3.5 PWA

- Configurée dans `vite.config.ts` (`VitePWA`).
- **Mise à jour :** `registerType: 'prompt'`. Quand une nouvelle version est déployée, `ReloadPrompt` affiche une bannière « Mettre à jour / Plus tard ». Aucun rechargement forcé, pour ne jamais interrompre une séance en cours.
- **Hors ligne :** Workbox précache tous les assets du build (js, css, html, images). Toutes les navigations sont servies par `index.html` depuis le cache. Avec `clientsClaim`, la page est contrôlée par le service worker dès la première visite.
  - ⚠️ Ne pas ajouter `webmanifest` à `globPatterns` : le plugin l'ajoute déjà au précache. Un doublon fait échouer le précache **sans erreur visible** : le service worker est actif mais vide, et l'app ne marche pas hors ligne.
  - Pour vérifier : DevTools → Application → Cache Storage doit contenir `workbox-precache-v2-…` avec une trentaine d'entrées.
- **Icônes :** générées au build depuis `public/logo.svg` (favicon, 64/192/512, maskable, apple-touch-icon), avec les balises `<link>` injectées dans `index.html`. Pour changer le logo, il suffit de remplacer ce fichier SVG.
- **Manifest :** nom, couleurs (`#0f172a`), `display: standalone`, orientation portrait. `scope` et `start_url` suivent le base path.
- Le service worker est **désactivé en dev**. Pour tester la PWA : `npm run build && npm run preview`.

### 3.6 Styles

- Tailwind v4, configuré en CSS dans `src/index.css` :
  - `@theme` : couleurs personnalisées `brand-*` (émeraude)
  - `@layer base` : thème sombre par défaut (`bg-slate-900`, `text-slate-100`)
- Mobile d'abord : contenu limité à `max-w-md`, gestion des encoches iOS avec `env(safe-area-inset-*)` (viewport `viewport-fit=cover`).

### 3.7 Tests et qualité

```bash
npm test          # Vitest (environnement happy-dom, localStorage disponible)
npm run lint      # oxlint
npm run typecheck # tsc -b
```

- Les tests sont placés à côté du code (`*.test.ts`).
- La règle oxlint `only-export-components` est désactivée dans `src/routes/**`, car les fichiers de route exportent `Route` en plus de leurs composants.

### 3.8 Build et déploiement

- `npm run build` lance `vite build` **puis** `tsc -b`. Dans cet ordre, parce que c'est le build Vite qui génère `routeTree.gen.ts`, dont le typecheck a besoin.
- **Base path :** variable d'environnement `BASE_PATH` (par défaut `/`). En CI elle vaut `/<nom-du-repo>/`, soit `/Cissoufit/`.
- **Workflow** `.github/workflows/deploy.yml` : `npm ci` → lint → tests → build → publication sur GitHub Pages.
  - Pour l'instant il se lance **manuellement** (*Actions → Deploy to GitHub Pages → Run workflow*). Pour revenir au déploiement automatique, ajouter `push: branches: [main]` dans `on:`.
  - Pré-requis : *Settings → Pages → Source : GitHub Actions*.

---

## 4. Conventions

- **Langue :** l'interface, les commentaires et la documentation sont en français. Le code (identifiants) est en anglais.
- **Organisation :** le code métier est dans `src/features/<domaine>/` : `types`, `store`, `actions` (écritures et validation, qui lèvent une `Error` avec un message en français affichable tel quel), `selectors` (fonctions pures), `hooks` et `components`. Les routes de `src/routes/` restent minces et assemblent les features.
- **Données :** toute nouvelle clé de stockage passe par `createStore` et doit être ajoutée au [registre des stores](#registre-des-stores).
- **Documentation :** toute évolution métier ou technique doit être reportée dans ce fichier.

---

## 5. Journal des décisions

| Date       | Décision | Raison |
| ---------- | -------- | ------ |
| 2026-10-30 | Stockage 100 % `localStorage`, sans backend | App personnelle, hébergement statique gratuit |
| 2026-10-30 | Hash history pour le router | GitHub Pages ne gère pas le fallback SPA |
| 2026-10-30 | Enveloppe versionnée `{ version, data }` par clé | Pouvoir faire évoluer le modèle sans perdre de données |
| 2026-10-30 | Mise à jour PWA sur demande (`prompt`) | Ne pas recharger l'app en pleine séance |
| 2026-10-30 | Déploiement manuel | Rien à publier tant que l'app n'est pas fonctionnelle |
| 2026-10-30 | Exercices (catalogue) et réalisations dans deux stores séparés, liés par `exerciseId` | Renommer un exercice sans toucher à l'historique ; liste des exercices indépendante des saisies |
| 2026-10-30 | Unité portée par l'exercice (`kg` / `min` / `km`), pas par chaque réalisation | Toutes les réalisations d'un même exercice sont comparables |
| 2026-10-30 | Supprimer un exercice supprime ses réalisations (après confirmation) | Pas de réalisation orpheline |
| 2026-10-30 | `clientsClaim` activé, manifest retiré de `globPatterns` | Correctif : le précache était vide, donc pas de mode hors ligne |
| 2026-10-30 | Confirmations par `window.confirm` | Simple, natif sur mobile, suffisant pour une app personnelle |
| 2026-10-30 | Saisie numérique en `<input inputMode="decimal">` plutôt que `type="number"` | `type="number"` gère mal la virgule selon les navigateurs et la langue |
