import { useMemo } from 'react'
import { useStore } from '../../lib/storage'
import { sortExercises } from './actions'
import { exercisesStore } from './store'

/** Catalogue trié par ordre alphabétique. */
export function useSortedExercises() {
  const [exercises] = useStore(exercisesStore)
  return useMemo(() => sortExercises(exercises), [exercises])
}

export function useExerciseMap() {
  const [exercises] = useStore(exercisesStore)
  return useMemo(() => new Map(exercises.map((exercise) => [exercise.id, exercise])), [exercises])
}
