import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { BottomNav } from '../components/BottomNav'
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
    <>
      <main className="mx-auto max-w-md px-4 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(6rem+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>

      <BottomNav />
      <ReloadPrompt />
      <Suspense>
        <RouterDevtools position="top-right" />
      </Suspense>
    </>
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
