/**
 * Store persistant dans le localStorage.
 *
 * Chaque store occupe une clé préfixée par STORAGE_PREFIX et stocke une enveloppe
 * `{ version, data }`. Quand le schéma des données évolue, on incrémente `version`
 * et on fournit `migrate` pour convertir les anciennes données.
 */

export const STORAGE_PREFIX = 'cissoufit:'

type Envelope = { version: number; data: unknown }

type Listener = () => void

export type StoreOptions<T> = {
  /** Clé (sans préfixe) */
  key: string
  /** Version courante du schéma */
  version: number
  defaultValue: T
  /** Convertit des données issues d'une version antérieure */
  migrate?: (data: unknown, fromVersion: number) => T
}

export type Store<T> = {
  readonly key: string
  get: () => T
  set: (value: T | ((prev: T) => T)) => void
  reset: () => void
  subscribe: (listener: Listener) => () => void
}

export function createStore<T>({ key, version, defaultValue, migrate }: StoreOptions<T>): Store<T> {
  const storageKey = STORAGE_PREFIX + key
  const listeners = new Set<Listener>()
  let cache: T | undefined

  function read(): T {
    const raw = localStorage.getItem(storageKey)
    if (raw === null) return defaultValue
    try {
      const envelope = JSON.parse(raw) as Envelope
      if (envelope.version === version) return envelope.data as T
      if (migrate) {
        const migrated = migrate(envelope.data, envelope.version)
        write(migrated)
        return migrated
      }
    } catch (error) {
      console.error(`[storage] Données illisibles pour "${storageKey}"`, error)
    }
    return defaultValue
  }

  function write(value: T) {
    const envelope: Envelope = { version, data: value }
    localStorage.setItem(storageKey, JSON.stringify(envelope))
  }

  function emit() {
    listeners.forEach((listener) => listener())
  }

  function get(): T {
    if (cache === undefined) cache = read()
    return cache
  }

  function set(value: T | ((prev: T) => T)) {
    const next = typeof value === 'function' ? (value as (prev: T) => T)(get()) : value
    write(next)
    cache = next
    emit()
  }

  function reset() {
    localStorage.removeItem(storageKey)
    cache = undefined
    emit()
  }

  // Synchronisation entre onglets
  function onStorage(event: StorageEvent) {
    if (event.key !== storageKey && event.key !== null) return
    cache = undefined
    emit()
  }

  function subscribe(listener: Listener) {
    if (listeners.size === 0) window.addEventListener('storage', onStorage)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
      if (listeners.size === 0) window.removeEventListener('storage', onStorage)
    }
  }

  return { key: storageKey, get, set, reset, subscribe }
}
