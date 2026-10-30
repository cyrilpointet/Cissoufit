import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { EntryForm } from '../features/entries/components/EntryForm'
import { EntryList, EntryRow } from '../features/entries/components/EntryRow'
import { entriesOfDate } from '../features/entries/selectors'
import { entriesStore } from '../features/entries/store'
import { useExerciseMap } from '../features/exercises/hooks'
import { formatDate, todayISO } from '../lib/format'
import { useStore } from '../lib/storage'

export const Route = createFileRoute('/')({
  component: EntryPage,
})

function EntryPage() {
  const [date, setDate] = useState(todayISO)
  const [entries] = useStore(entriesStore)
  const exercisesById = useExerciseMap()
  const dayEntries = useMemo(() => entriesOfDate(entries, date), [entries, date])

  return (
    <>
      <PageHeader title="Saisie" />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold first-letter:uppercase">{formatDate(date)}</h2>
        {dayEntries.length === 0 ? (
          <EmptyState>Aucun exercice enregistré ce jour-là.</EmptyState>
        ) : (
          <EntryList>
            {dayEntries.map((entry) => {
              const exercise = exercisesById.get(entry.exerciseId)
              return <EntryRow key={entry.id} entry={entry} label={exercise?.name ?? '?'} unit={exercise?.unit} />
            })}
          </EntryList>
        )}
      </section>

      <div className="mt-8">
        <EntryForm date={date} onDateChange={setDate} />
      </div>
    </>
  )
}
