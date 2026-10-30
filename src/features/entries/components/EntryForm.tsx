import { useState, type FormEvent } from 'react'
import { Button } from '../../../components/ui/Button'
import { ErrorMessage, Field, inputClassName } from '../../../components/ui/Field'
import { Select } from '../../../components/ui/Select'
import { parseDecimal, toInputValue, todayISO } from '../../../lib/format'
import { createExercise } from '../../exercises/actions'
import { UnitPicker } from '../../exercises/components/UnitPicker'
import { useExerciseMap, useSortedExercises } from '../../exercises/hooks'
import type { Unit } from '../../exercises/types'
import { addEntry } from '../actions'
import { getLastValue } from '../selectors'
import { entriesStore } from '../store'

const NEW_EXERCISE = '__new__'

type EntryFormProps = {
  date: string
  onDateChange: (date: string) => void
}

/** Saisie d'une réalisation (F1), avec création d'exercice à la volée (F3) et pré-remplissage (F2). */
export function EntryForm({ date, onDateChange }: EntryFormProps) {
  const exercises = useSortedExercises()
  const exercisesById = useExerciseMap()

  const [selection, setSelection] = useState('')
  const [newName, setNewName] = useState('')
  const [newUnit, setNewUnit] = useState<Unit>('kg')
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const isNew = selection === NEW_EXERCISE || exercises.length === 0
  const selected = isNew ? undefined : exercisesById.get(selection)
  const unit = isNew ? newUnit : selected?.unit

  function selectExercise(id: string) {
    setSelection(id)
    setError('')
    const lastValue = id === NEW_EXERCISE ? undefined : getLastValue(entriesStore.get(), id)
    setValue(lastValue === undefined ? '' : toInputValue(lastValue))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const parsedValue = parseDecimal(value)
    if (!isNew && !selected) return setError('Choisis un exercice.')
    if (isNew && !newName.trim()) return setError("Donne un nom à l'exercice.")
    if (parsedValue === null) return setError('La valeur doit être un nombre, par exemple 12,5.')
    if (date > todayISO()) return setError('La date ne peut pas être dans le futur.')

    try {
      const exercise = isNew ? createExercise(newName, newUnit) : selected!
      addEntry({ exerciseId: exercise.id, date, value: parsedValue })
      // On garde l'exercice sélectionné pour enchaîner les séries
      setSelection(exercise.id)
      setNewName('')
      setValue(toInputValue(parsedValue))
      setError('')
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field label="Date" htmlFor="entry-date">
        <input
          id="entry-date"
          type="date"
          className={inputClassName}
          value={date}
          max={todayISO()}
          onChange={(e) => e.target.value && onDateChange(e.target.value)}
        />
      </Field>

      {exercises.length > 0 && (
        <Field label="Exercice" htmlFor="entry-exercise">
          <Select
            id="entry-exercise"
            value={selection}
            onChange={(e) => selectExercise(e.target.value)}
          >
            <option value="" disabled>
              Choisir un exercice…
            </option>
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name} ({exercise.unit})
              </option>
            ))}
            <option value={NEW_EXERCISE}>＋ Nouvel exercice</option>
          </Select>
        </Field>
      )}

      {isNew && (
        <div className="space-y-4 rounded-xl border border-slate-800 p-4">
          <Field label="Nom du nouvel exercice" htmlFor="new-exercise-name">
            <input
              id="new-exercise-name"
              className={inputClassName}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex. Développé couché"
              autoComplete="off"
            />
          </Field>
          <div className="space-y-1.5">
            <span className="block text-sm font-medium text-slate-400">Unité</span>
            <UnitPicker value={newUnit} onChange={setNewUnit} />
          </div>
        </div>
      )}

      <Field label="Valeur" htmlFor="entry-value">
        <div className="relative">
          <input
            id="entry-value"
            className={`${inputClassName} pr-14 text-lg font-semibold tabular-nums`}
            inputMode="decimal"
            enterKeyHint="done"
            autoComplete="off"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0"
          />
          {unit && <span className="absolute inset-y-0 right-4 flex items-center text-slate-400">{unit}</span>}
        </div>
      </Field>

      <ErrorMessage>{error}</ErrorMessage>

      <Button type="submit">Enregistrer</Button>
    </form>
  )
}
