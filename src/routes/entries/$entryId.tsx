import { createFileRoute } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { useGoBack } from '../../components/useGoBack'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorMessage, Field, inputClassName } from '../../components/ui/Field'
import { deleteEntry, updateEntry } from '../../features/entries/actions'
import { entriesStore } from '../../features/entries/store'
import type { Entry } from '../../features/entries/types'
import { useExerciseMap } from '../../features/exercises/hooks'
import { parseDecimal, toInputValue, todayISO } from '../../lib/format'
import { useStore } from '../../lib/storage'

export const Route = createFileRoute('/entries/$entryId')({
  component: EditEntryPage,
})

/** F6 */
function EditEntryPage() {
  const { entryId } = Route.useParams()
  const [entries] = useStore(entriesStore)
  const entry = entries.find((e) => e.id === entryId)

  if (!entry) {
    return (
      <>
        <PageHeader title="Réalisation" back={{ fallback: '/history' }} />
        <EmptyState>Cette réalisation n'existe plus.</EmptyState>
      </>
    )
  }
  return <EditEntryForm entry={entry} />
}

function EditEntryForm({ entry }: { entry: Entry }) {
  const exercise = useExerciseMap().get(entry.exerciseId)
  const goBack = useGoBack('/history')
  const [value, setValue] = useState(toInputValue(entry.value))
  const [date, setDate] = useState(entry.date)
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const parsedValue = parseDecimal(value)
    if (parsedValue === null) return setError('La valeur doit être un nombre, par exemple 12,5.')
    try {
      updateEntry(entry.id, { date, value: parsedValue })
      goBack()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  function handleDelete() {
    if (!window.confirm('Supprimer cette réalisation ?')) return
    goBack()
    deleteEntry(entry.id)
  }

  return (
    <>
      <PageHeader title={exercise?.name ?? 'Réalisation'} back={{ fallback: '/history' }} />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field label="Date" htmlFor="entry-date">
          <input
            id="entry-date"
            type="date"
            className={inputClassName}
            value={date}
            max={todayISO()}
            onChange={(e) => e.target.value && setDate(e.target.value)}
          />
        </Field>

        <Field label="Valeur" htmlFor="entry-value">
          <div className="relative">
            <input
              id="entry-value"
              className={`${inputClassName} pr-14 text-lg font-semibold tabular-nums`}
              inputMode="decimal"
              autoComplete="off"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <span className="absolute inset-y-0 right-4 flex items-center text-slate-400">{exercise?.unit}</span>
          </div>
        </Field>

        <ErrorMessage>{error}</ErrorMessage>

        <Button type="submit">Enregistrer</Button>
        <Button variant="danger" onClick={handleDelete}>
          Supprimer
        </Button>
      </form>
    </>
  )
}
