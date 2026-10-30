import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { DumbbellIcon, HistoryIcon, PlusIcon, SaveIcon } from './icons'

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-800 bg-slate-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-4">
        <NavLink to="/" icon={<PlusIcon />} label="Saisie" exact />
        <NavLink to="/history" icon={<HistoryIcon />} label="Historique" />
        <NavLink to="/exercises" icon={<DumbbellIcon />} label="Exercices" />
        <NavLink to="/backup" icon={<SaveIcon />} label="Sauvegarde" />
      </div>
    </nav>
  )
}

type NavLinkProps = {
  to: '/' | '/history' | '/exercises' | '/backup'
  icon: ReactNode
  label: string
  exact?: boolean
}

function NavLink({ to, icon, label, exact = false }: NavLinkProps) {
  return (
    <Link
      to={to}
      activeOptions={{ exact, includeSearch: false }}
      className="flex h-16 flex-col items-center justify-center gap-1 text-xs text-slate-400"
      activeProps={{ className: 'text-brand-400' }}
    >
      {icon}
      {label}
    </Link>
  )
}
