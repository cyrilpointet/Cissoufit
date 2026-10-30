import { isISODate, todayISO } from '../../lib/format'
import { entriesStore } from './store'
import type { Entry } from './types'

type EntryInput = { date: string; value: number }

function validate({ date, value }: EntryInput) {
  if (!Number.isFinite(value) || value < 0) throw new Error('La valeur doit être un nombre positif.')
  if (!isISODate(date)) throw new Error('La date est invalide.')
  if (date > todayISO()) throw new Error('La date ne peut pas être dans le futur.')
}

export function addEntry(input: EntryInput & { exerciseId: string }): Entry {
  validate(input)
  const entry: Entry = {
    id: crypto.randomUUID(),
    exerciseId: input.exerciseId,
    date: input.date,
    value: input.value,
    createdAt: new Date().toISOString(),
  }
  entriesStore.set((prev) => [...prev, entry])
  return entry
}

export function updateEntry(id: string, changes: EntryInput) {
  validate(changes)
  entriesStore.set((prev) =>
    prev.map((entry) => (entry.id === id ? { ...entry, date: changes.date, value: changes.value } : entry)),
  )
}

export function deleteEntry(id: string) {
  entriesStore.set((prev) => prev.filter((entry) => entry.id !== id))
}
