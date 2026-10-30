import { entriesStore } from '../entries/store'
import { exercisesStore } from './store'
import type { Exercise, Unit } from './types'

function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ')
}

function sameName(a: string, b: string): boolean {
  return normalizeName(a).toLocaleLowerCase('fr') === normalizeName(b).toLocaleLowerCase('fr')
}

export function findExerciseByName(exercises: Exercise[], name: string): Exercise | undefined {
  return exercises.find((exercise) => sameName(exercise.name, name))
}

/** Catalogue trié par ordre alphabétique. */
export function sortExercises(exercises: Exercise[]): Exercise[] {
  return [...exercises].sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }))
}

/** Crée un exercice, ou retourne l'existant s'il porte déjà ce nom (R4). */
export function createExercise(name: string, unit: Unit): Exercise {
  const cleanName = normalizeName(name)
  if (!cleanName) throw new Error('Le nom est obligatoire.')

  const existing = findExerciseByName(exercisesStore.get(), cleanName)
  if (existing) return existing

  const exercise: Exercise = {
    id: crypto.randomUUID(),
    name: cleanName,
    unit,
    createdAt: new Date().toISOString(),
  }
  exercisesStore.set((prev) => [...prev, exercise])
  return exercise
}

export function updateExercise(id: string, changes: { name: string; unit: Unit }) {
  const cleanName = normalizeName(changes.name)
  if (!cleanName) throw new Error('Le nom est obligatoire.')

  const duplicate = findExerciseByName(exercisesStore.get(), cleanName)
  if (duplicate && duplicate.id !== id) throw new Error(`L'exercice « ${duplicate.name} » existe déjà.`)

  exercisesStore.set((prev) =>
    prev.map((exercise) => (exercise.id === id ? { ...exercise, name: cleanName, unit: changes.unit } : exercise)),
  )
}

/** Supprime l'exercice et toutes ses réalisations (R8). */
export function deleteExercise(id: string) {
  entriesStore.set((prev) => prev.filter((entry) => entry.exerciseId !== id))
  exercisesStore.set((prev) => prev.filter((exercise) => exercise.id !== id))
}
