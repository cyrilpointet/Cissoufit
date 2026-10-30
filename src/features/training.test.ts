import { beforeEach, describe, expect, it, vi } from 'vitest'
import { addEntry, deleteEntry, updateEntry } from './entries/actions'
import { getLastValue, groupByDate, groupByExercise } from './entries/selectors'
import { entriesStore } from './entries/store'
import type { Entry } from './entries/types'
import { createExercise, deleteExercise, updateExercise } from './exercises/actions'
import { exercisesStore } from './exercises/store'

beforeEach(() => {
  localStorage.clear()
  exercisesStore.reset()
  entriesStore.reset()
  vi.useRealTimers()
})

function entry(partial: Partial<Entry>): Entry {
  return { id: crypto.randomUUID(), exerciseId: 'x', date: '2026-01-01', value: 1, createdAt: '2026-01-01T10:00:00Z', ...partial }
}

describe('exercices', () => {
  it('crée un exercice en nettoyant le nom', () => {
    const squat = createExercise('  Squat   barre ', 'kg')
    expect(squat).toMatchObject({ name: 'Squat barre', unit: 'kg' })
    expect(exercisesStore.get()).toHaveLength(1)
  })

  it('réutilise un exercice existant, sans tenir compte de la casse (R4)', () => {
    const squat = createExercise('Squat', 'kg')
    expect(createExercise('squat', 'min')).toBe(squat)
    expect(exercisesStore.get()).toHaveLength(1)
  })

  it('refuse un nom vide', () => {
    expect(() => createExercise('  ', 'kg')).toThrow()
  })

  it('renomme et change l’unité, en refusant un doublon (R7)', () => {
    const squat = createExercise('Squat', 'kg')
    createExercise('Course', 'km')
    updateExercise(squat.id, { name: 'Squat avant', unit: 'min' })
    expect(exercisesStore.get()[0]).toMatchObject({ name: 'Squat avant', unit: 'min' })
    expect(() => updateExercise(squat.id, { name: 'COURSE', unit: 'kg' })).toThrow(/existe déjà/)
    // Changer seulement la casse de son propre nom est autorisé
    updateExercise(squat.id, { name: 'squat avant', unit: 'min' })
  })

  it('supprime les réalisations avec l’exercice (R8)', () => {
    const squat = createExercise('Squat', 'kg')
    const course = createExercise('Course', 'km')
    addEntry({ exerciseId: squat.id, date: '2026-01-01', value: 50 })
    addEntry({ exerciseId: course.id, date: '2026-01-01', value: 5 })
    deleteExercise(squat.id)
    expect(exercisesStore.get().map((e) => e.name)).toEqual(['Course'])
    expect(entriesStore.get().map((e) => e.exerciseId)).toEqual([course.id])
  })
})

describe('réalisations', () => {
  it('ajoute, modifie et supprime', () => {
    const { id } = addEntry({ exerciseId: 'x', date: '2026-01-01', value: 10 })
    updateEntry(id, { date: '2026-01-02', value: 12.5 })
    expect(entriesStore.get()[0]).toMatchObject({ date: '2026-01-02', value: 12.5 })
    deleteEntry(id)
    expect(entriesStore.get()).toEqual([])
  })

  it('refuse une date future ou une valeur négative (R5)', () => {
    expect(() => addEntry({ exerciseId: 'x', date: '2999-01-01', value: 1 })).toThrow(/futur/)
    expect(() => addEntry({ exerciseId: 'x', date: '2026-01-01', value: -1 })).toThrow()
  })

  it('pré-remplit avec la réalisation la plus récente (R3)', () => {
    const entries = [
      entry({ value: 1, date: '2026-01-02', createdAt: '2026-01-02T08:00:00Z' }),
      entry({ value: 2, date: '2026-01-02', createdAt: '2026-01-02T09:00:00Z' }),
      // saisie plus tardive mais pour un jour antérieur
      entry({ value: 3, date: '2026-01-01', createdAt: '2026-01-03T09:00:00Z' }),
      entry({ value: 4, exerciseId: 'autre', date: '2026-01-05' }),
    ]
    expect(getLastValue(entries, 'x')).toBe(2)
    expect(getLastValue(entries, 'inconnu')).toBeUndefined()
  })

  it('groupe par date : jours récents d’abord, ordre de saisie dans un jour', () => {
    const a = entry({ date: '2026-01-01' })
    const b = entry({ date: '2026-01-02', createdAt: '2026-01-02T09:00:00Z' })
    const c = entry({ date: '2026-01-02', createdAt: '2026-01-02T08:00:00Z' })
    expect(groupByDate([a, b, c])).toEqual([
      { date: '2026-01-02', entries: [c, b] },
      { date: '2026-01-01', entries: [a] },
    ])
  })

  it('groupe par exercice : ordre alphabétique, réalisations récentes d’abord', () => {
    const squat = createExercise('Squat', 'kg')
    const course = createExercise('course', 'km')
    createExercise('Jamais fait', 'min')
    const s1 = entry({ exerciseId: squat.id, date: '2026-01-01' })
    const s2 = entry({ exerciseId: squat.id, date: '2026-01-03' })
    const c1 = entry({ exerciseId: course.id })
    const groups = groupByExercise([s1, c1, s2], exercisesStore.get())
    expect(groups.map((g) => g.exercise.name)).toEqual(['course', 'Squat'])
    expect(groups[1].entries).toEqual([s2, s1])
  })
})
