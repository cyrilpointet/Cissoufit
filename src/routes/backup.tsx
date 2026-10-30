import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, type ChangeEvent } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/ui/Button'
import { ErrorMessage } from '../components/ui/Field'
import { entriesStore } from '../features/entries/store'
import { exercisesStore } from '../features/exercises/store'
import { downloadBackup, importBackup, useStore } from '../lib/storage'

export const Route = createFileRoute('/backup')({
  component: BackupPage,
})

/** F8 — export / import JSON (R9) */
function BackupPage() {
  const [exercises] = useStore(exercisesStore)
  const [entries] = useStore(entriesStore)
  const fileInput = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = '' // permet de re-sélectionner le même fichier
    if (!file) return
    setError('')
    try {
      const backup: unknown = JSON.parse(await file.text())
      if (!window.confirm("L'import va remplacer toutes tes données actuelles. Continuer ?")) return
      importBackup(backup)
      window.location.reload()
    } catch {
      setError("Ce fichier n'est pas une sauvegarde Cissoufit valide.")
    }
  }

  return (
    <>
      <PageHeader title="Sauvegarde" />

      <div className="space-y-8">
        <p className="text-slate-400">
          Tes données sont stockées uniquement sur cet appareil : {exercises.length} exercice
          {exercises.length > 1 ? 's' : ''} et {entries.length} réalisation{entries.length > 1 ? 's' : ''}. Exporte-les
          régulièrement pour ne pas les perdre.
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Exporter</h2>
          <p className="text-sm text-slate-400">Télécharge un fichier JSON contenant toutes tes données.</p>
          <Button onClick={downloadBackup}>Télécharger la sauvegarde</Button>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Importer</h2>
          <p className="text-sm text-slate-400">
            Restaure une sauvegarde. <strong className="text-slate-200">Les données actuelles seront remplacées.</strong>
          </p>
          <input ref={fileInput} type="file" accept="application/json,.json" className="hidden" onChange={handleImport} />
          <Button variant="secondary" onClick={() => fileInput.current?.click()}>
            Choisir un fichier…
          </Button>
          <ErrorMessage>{error}</ErrorMessage>
        </section>
      </div>
    </>
  )
}
