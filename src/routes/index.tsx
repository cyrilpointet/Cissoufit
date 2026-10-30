import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold">Bienvenue 💪</h1>
      <p className="text-slate-400">Le suivi de tes séances arrive bientôt.</p>
    </section>
  )
}
