import { useRegisterSW } from 'virtual:pwa-register/react'

/** Propose de recharger l'app quand une nouvelle version du service worker est disponible. */
export function ReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div
      role="alert"
      className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-md items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-lg"
    >
      <p className="flex-1 text-sm">Une nouvelle version est disponible.</p>
      <button
        type="button"
        className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-slate-900"
        onClick={() => updateServiceWorker(true)}
      >
        Mettre à jour
      </button>
      <button
        type="button"
        className="text-sm text-slate-400"
        onClick={() => setNeedRefresh(false)}
      >
        Plus tard
      </button>
    </div>
  )
}
