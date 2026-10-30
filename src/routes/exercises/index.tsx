import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronIcon } from '../../components/icons'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { countEntries } from '../../features/entries/selectors'
import { entriesStore } from '../../features/entries/store'
import { useSortedExercises } from '../../features/exercises/hooks'
import { useStore } from '../../lib/storage'

export const Route = createFileRoute('/exercises/')({
  component: ExercisesPage,
})

/** F7 — liste des exercices */
function ExercisesPage() {
  const exercises = useSortedExercises()
  const [entries] = useStore(entriesStore)

  return (
    <>
      <PageHeader title="Exercices" />
      {exercises.length === 0 ? (
        <EmptyState>Aucun exercice. Ils se créent depuis l'écran de saisie.</EmptyState>
      ) : (
        <ul className="divide-y divide-slate-800 overflow-hidden rounded-xl bg-slate-800/50">
          {exercises.map((exercise) => {
            const count = countEntries(entries, exercise.id)
            return (
              <li key={exercise.id}>
                <Link
                  to="/exercises/$exerciseId"
                  params={{ exerciseId: exercise.id }}
                  className="flex items-center gap-3 px-4 py-3 active:bg-slate-800"
                >
                  <span className="flex-1 truncate">{exercise.name}</span>
                  <span className="text-sm text-slate-400">
                    {exercise.unit} · {count} réalisation{count > 1 ? 's' : ''}
                  </span>
                  <ChevronIcon />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
