import { BackIcon } from './icons'
import { useGoBack, type BackFallback } from './useGoBack'

type PageHeaderProps = {
  title: string
  /** Affiche un bouton retour ; `fallback` est utilisé s'il n'y a pas d'historique (ouverture directe). */
  back?: { fallback: BackFallback }
}

export function PageHeader({ title, back }: PageHeaderProps) {
  const goBack = useGoBack(back?.fallback ?? '/')
  return (
    <header className="mb-6 flex items-center gap-2">
      {back && (
        <button type="button" onClick={goBack} className="-ml-2 p-2 text-slate-400" aria-label="Retour">
          <BackIcon />
        </button>
      )}
      <h1 className="truncate text-2xl font-bold">{title}</h1>
    </header>
  )
}
