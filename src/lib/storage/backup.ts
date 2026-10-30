import { STORAGE_PREFIX } from './store'

/**
 * Sauvegarde / restauration de toutes les données de l'app.
 * Le localStorage pouvant être vidé par le navigateur, l'export JSON est le seul filet de sécurité.
 */

export type Backup = {
  app: 'cissoufit'
  exportedAt: string
  entries: Record<string, string>
}

export function exportBackup(): Backup {
  const entries: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(STORAGE_PREFIX)) entries[key] = localStorage.getItem(key)!
  }
  return { app: 'cissoufit', exportedAt: new Date().toISOString(), entries }
}

/** Après un import, recharger la page : les stores gardent leurs valeurs en cache. */
export function importBackup(backup: unknown) {
  if (!isBackup(backup)) throw new Error('Fichier de sauvegarde invalide')
  for (const [key, value] of Object.entries(backup.entries)) {
    if (key.startsWith(STORAGE_PREFIX)) localStorage.setItem(key, value)
  }
}

export function downloadBackup() {
  const blob = new Blob([JSON.stringify(exportBackup(), null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `cissoufit-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

function isBackup(value: unknown): value is Backup {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as Backup).app === 'cissoufit' &&
    typeof (value as Backup).entries === 'object'
  )
}
