import { beforeEach, describe, expect, it, vi } from 'vitest'
import { exportBackup, importBackup } from './backup'
import { createStore, STORAGE_PREFIX } from './store'

beforeEach(() => localStorage.clear())

describe('createStore', () => {
  it('retourne la valeur par défaut quand rien n’est stocké', () => {
    const store = createStore({ key: 'test', version: 1, defaultValue: [] as number[] })
    expect(store.get()).toEqual([])
  })

  it('persiste et relit les données', () => {
    const store = createStore({ key: 'test', version: 1, defaultValue: 0 })
    store.set(42)
    store.set((prev) => prev + 1)

    const reopened = createStore({ key: 'test', version: 1, defaultValue: 0 })
    expect(reopened.get()).toBe(43)
    expect(JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}test`)!)).toEqual({ version: 1, data: 43 })
  })

  it('notifie les abonnés', () => {
    const store = createStore({ key: 'test', version: 1, defaultValue: 0 })
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)
    store.set(1)
    unsubscribe()
    store.set(2)
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('migre les données d’une version antérieure', () => {
    localStorage.setItem(`${STORAGE_PREFIX}test`, JSON.stringify({ version: 1, data: 'Squat' }))
    const store = createStore({
      key: 'test',
      version: 2,
      defaultValue: { name: '' },
      migrate: (data) => ({ name: data as string }),
    })
    expect(store.get()).toEqual({ name: 'Squat' })
    expect(JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}test`)!).version).toBe(2)
  })

  it('retombe sur la valeur par défaut si le JSON est corrompu', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    localStorage.setItem(`${STORAGE_PREFIX}test`, '{oops')
    const store = createStore({ key: 'test', version: 1, defaultValue: 'défaut' })
    expect(store.get()).toBe('défaut')
  })
})

describe('backup', () => {
  it('exporte uniquement les clés de l’app et les réimporte', () => {
    createStore({ key: 'a', version: 1, defaultValue: 0 }).set(5)
    localStorage.setItem('autre-app', 'x')

    const backup = exportBackup()
    expect(Object.keys(backup.entries)).toEqual([`${STORAGE_PREFIX}a`])

    localStorage.clear()
    importBackup(backup)
    expect(createStore({ key: 'a', version: 1, defaultValue: 0 }).get()).toBe(5)
  })

  it('remplace les données existantes à l’import', () => {
    const backup = exportBackup() // sauvegarde vide
    createStore({ key: 'a', version: 1, defaultValue: 0 }).set(5)
    localStorage.setItem('autre-app', 'x')

    importBackup(backup)
    expect(localStorage.getItem(`${STORAGE_PREFIX}a`)).toBeNull()
    expect(localStorage.getItem('autre-app')).toBe('x')
  })

  it('refuse un fichier invalide', () => {
    expect(() => importBackup({ foo: 'bar' })).toThrow()
  })
})
