import { useSyncExternalStore } from 'react'
import type { Store } from './store'

/** Lit un store et se ré-affiche à chaque modification (y compris depuis un autre onglet). */
export function useStore<T>(store: Store<T>): [T, Store<T>['set']] {
  const value = useSyncExternalStore(store.subscribe, store.get)
  return [value, store.set]
}
