import { sortExercises } from '../exercises/actions'
import type { Exercise } from '../exercises/types'
import type { Entry } from './types'

/** Ordre chronologique : date, puis ordre de saisie. */
export function compareEntries(a: Entry, b: Entry): number {
  return a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt)
}

/** Valeur de la réalisation la plus récente de l'exercice (R3). */
export function getLastValue(entries: Entry[], exerciseId: string): number | undefined {
  let last: Entry | undefined
  for (const entry of entries) {
    if (entry.exerciseId === exerciseId && (!last || compareEntries(entry, last) > 0)) last = entry
  }
  return last?.value
}

export function countEntries(entries: Entry[], exerciseId: string): number {
  return entries.filter((entry) => entry.exerciseId === exerciseId).length
}

/** Réalisations d'un jour, dans l'ordre de saisie. */
export function entriesOfDate(entries: Entry[], date: string): Entry[] {
  return entries.filter((entry) => entry.date === date).sort(compareEntries)
}

/** Jours du plus récent au plus ancien ; dans un jour, ordre de saisie. */
export function groupByDate(entries: Entry[]): { date: string; entries: Entry[] }[] {
  const groups = new Map<string, Entry[]>()
  for (const entry of [...entries].sort(compareEntries)) {
    groups.set(entry.date, [...(groups.get(entry.date) ?? []), entry])
  }
  return [...groups].map(([date, entries]) => ({ date, entries })).sort((a, b) => b.date.localeCompare(a.date))
}

/** Exercices par ordre alphabétique (seulement ceux réalisés) ; réalisations de la plus récente à la plus ancienne. */
export function groupByExercise(
  entries: Entry[],
  exercises: Exercise[],
): { exercise: Exercise; entries: Entry[] }[] {
  return sortExercises(exercises)
    .map((exercise) => ({
      exercise,
      entries: entries.filter((entry) => entry.exerciseId === exercise.id).sort((a, b) => compareEntries(b, a)),
    }))
    .filter((group) => group.entries.length > 0)
}
