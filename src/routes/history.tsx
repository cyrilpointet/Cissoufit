import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { PageHeader } from '../components/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { EntryList, EntryRow } from '../features/entries/components/EntryRow'
import { groupByDate, groupByExercise } from '../features/entries/selectors'
import { entriesStore } from '../features/entries/store'
import { useExerciseMap } from '../features/exercises/hooks'
import { exercisesStore } from '../features/exercises/store'
import { formatDate, formatShortDate } from '../lib/format'
import { useStore } from '../lib/storage'

type HistoryView = 'date' | 'exercise'

export const Route = createFileRoute('/history')({
  validateSearch: (search: Record<string, unknown>): { view?: HistoryView } =>
    search.view === 'exercise' ? { view: 'exercise' } : {},
  component: HistoryPage,
})

function HistoryPage() {
  const { view = 'date' } = Route.useSearch()
  const [entries] = useStore(entriesStore)

  return (
    <>
      <PageHeader title="Historique" />

      <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-800 p-1">
        <ViewTab view="date" current={view} label="Par date" />
        <ViewTab view="exercise" current={view} label="Par exercice" />
      </div>

      {entries.length === 0 ? (
        <EmptyState>Aucun exercice enregistré pour l'instant.</EmptyState>
      ) : view === 'date' ? (
        <ByDate />
      ) : (
        <ByExercise />
      )}
    </>
  )
}

function ViewTab({ view, current, label }: { view: HistoryView; current: HistoryView; label: string }) {
  return (
    <Link
      to="/history"
      search={view === 'date' ? {} : { view }}
      replace
      className={`rounded-lg py-2 text-center text-sm font-medium ${
        view === current ? 'bg-slate-900 text-brand-400' : 'text-slate-400'
      }`}
    >
      {label}
    </Link>
  )
}

/** F4 */
function ByDate() {
  const [entries] = useStore(entriesStore)
  const exercisesById = useExerciseMap()
  const groups = useMemo(() => groupByDate(entries), [entries])

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.date} className="space-y-2">
          <h2 className="font-semibold text-slate-300 first-letter:uppercase">{formatDate(group.date)}</h2>
          <EntryList>
            {group.entries.map((entry) => {
              const exercise = exercisesById.get(entry.exerciseId)
              return <EntryRow key={entry.id} entry={entry} label={exercise?.name ?? '?'} unit={exercise?.unit} />
            })}
          </EntryList>
        </section>
      ))}
    </div>
  )
}

/** F5 */
function ByExercise() {
  const [entries] = useStore(entriesStore)
  const [exercises] = useStore(exercisesStore)
  const groups = useMemo(() => groupByExercise(entries, exercises), [entries, exercises])

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.exercise.id} className="space-y-2">
          <h2 className="font-semibold text-slate-300">{group.exercise.name}</h2>
          <EntryList>
            {group.entries.map((entry) => (
              <EntryRow key={entry.id} entry={entry} label={formatShortDate(entry.date)} unit={group.exercise.unit} />
            ))}
          </EntryList>
        </section>
      ))}
    </div>
  )
}
