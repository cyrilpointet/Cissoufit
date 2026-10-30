# Cissoufit

Application (PWA) de suivi de mes exercices de fitness. Aucune donnée ne quitte le navigateur : tout est stocké dans le `localStorage`.

📖 Documentation complète (besoins métier et fonctionnement technique) : [doc/documentation.md](doc/documentation.md)

## Stack

- **React 19** + **TypeScript**, bundlé par **Vite**
- **TanStack Router** — routing par fichiers dans `src/routes/` (le fichier `src/routeTree.gen.ts` est généré automatiquement, ne pas l'éditer)
- **Tailwind CSS v4** — thème dans `src/index.css` (`@theme`)
- **vite-plugin-pwa** — service worker Workbox, manifest et icônes générées depuis `public/logo.svg`
- **Vitest** + happy-dom pour les tests

## Scripts

```bash
npm run dev        # serveur de dev
npm run build      # build de prod dans dist/ (+ typecheck)
npm run preview    # sert le build (permet de tester la PWA / le service worker)
npm test           # tests
npm run lint       # oxlint
```

## Architecture

```
src/
├── main.tsx              # point d'entrée
├── router.tsx            # instance du router (hash history)
├── routes/               # une route = un fichier (__root.tsx = layout)
├── lib/storage/          # persistance localStorage
│   ├── store.ts          # createStore : store typé, versionné, migrable
│   ├── useStore.ts       # hook React (useSyncExternalStore)
│   └── backup.ts         # export / import JSON de toutes les données
└── pwa/ReloadPrompt.tsx  # bannière « nouvelle version disponible »
```

### Persistance

Chaque domaine de données déclare son store :

```ts
const workoutsStore = createStore<Workout[]>({ key: 'workouts', version: 1, defaultValue: [] })

// dans un composant
const [workouts, setWorkouts] = useStore(workoutsStore)
```

Les données sont stockées sous `cissoufit:<key>` dans une enveloppe `{ version, data }`. Si le schéma change, incrémenter `version` et fournir `migrate(data, fromVersion)`. Les modifications sont synchronisées entre onglets.

## Déploiement

Le workflow `.github/workflows/deploy.yml` lint, teste, build et publie sur GitHub Pages. Il est pour l'instant **manuel** (*Actions → Deploy to GitHub Pages → Run workflow*).
Le base path (`/<nom-du-repo>/`) est injecté via la variable `BASE_PATH`.

Pré-requis côté GitHub : *Settings → Pages → Source : GitHub Actions*.

Le router utilise le **hash history** (`/#/route`) car GitHub Pages ne sait pas rediriger les routes profondes vers `index.html`.
