import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { ReloadPrompt } from '../pwa/ReloadPrompt'

const RouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-router-devtools').then((m) => ({
        default: m.TanStackRouterDevtools,
      })),
    )
  : () => null

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootLayout() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/90 px-4 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="flex h-14 items-center">
          <Link to="/" className="text-lg font-bold text-brand-400">
            Cissoufit
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <Outlet />
      </main>

      <ReloadPrompt />
      <Suspense>
        <RouterDevtools />
      </Suspense>
    </div>
  )
}

function NotFound() {
  return (
    <div className="space-y-4 text-center">
      <p className="text-slate-400">Page introuvable.</p>
      <Link to="/" className="text-brand-400 underline">
        Retour à l'accueil
      </Link>
    </div>
  )
}
