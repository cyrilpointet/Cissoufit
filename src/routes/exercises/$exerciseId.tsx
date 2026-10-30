import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { useGoBack } from '../../components/useGoBack'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorMessage, Field, inputClassName } from '../../components/ui/Field'
import { countEntries } from '../../features/entries/selectors'
import { entriesStore } from '../../features/entries/store'
import { deleteExercise, updateExercise } from '../../features/exercises/actions'
import { UnitPicker } from '../../features/exercises/components/UnitPicker'
import { useExerciseMap } from '../../features/exercises/hooks'
import type { Exercise } from '../../features/exercises/types'

export const Route = createFileRoute('/exercises/$exerciseId')({
  component: EditExercisePage,
})

/** F7 — modification / suppression d'un exercice */
function EditExercisePage() {
  const { exerciseId } = Route.useParams()
  const exercise = useExerciseMap().get(exerciseId)

  if (!exercise) {
    return (
      <>
        <PageHeader title="Exercice" back={{ fallback: '/exercises' }} />
        <EmptyState>Cet exercice n'existe plus.</EmptyState>
      </>
    )
  }
  return <EditExerciseForm exercise={exercise} />
}

function EditExerciseForm({ exercise }: { exercise: Exercise }) {
  const navigate = useNavigate()
  const goBack = useGoBack('/exercises')
  const [name, setName] = useState(exercise.name)
  const [unit, setUnit] = useState(exercise.unit)
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      updateExercise(exercise.id, { name, unit })
      goBack()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  // R8 : avertir du nombre de réalisations supprimées
  function handleDelete() {
    const count = countEntries(entriesStore.get(), exercise.id)
    const message =
      count > 0
        ? `Supprimer « ${exercise.name} » ?\n\n⚠️ ${count} réalisation${count > 1 ? 's' : ''} de cet exercice ${
            count > 1 ? 'seront supprimées' : 'sera supprimée'
          } aussi. Cette action est irréversible.`
        : `Supprimer « ${exercise.name} » ?`
    if (!window.confirm(message)) return
    navigate({ to: '/exercises', replace: true })
    deleteExercise(exercise.id)
  }

  return (
    <>
      <PageHeader title={exercise.name} back={{ fallback: '/exercises' }} />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field label="Nom" htmlFor="exercise-name">
          <input
            id="exercise-name"
            className={inputClassName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
        </Field>

        <div className="space-y-1.5">
          <span className="block text-sm font-medium text-slate-400">Unité</span>
          <UnitPicker value={unit} onChange={setUnit} />
        </div>

        <ErrorMessage>{error}</ErrorMessage>

        <Button type="submit">Enregistrer</Button>
        <Button variant="danger" onClick={handleDelete}>
          Supprimer l'exercice
        </Button>
      </form>
    </>
  )
}
