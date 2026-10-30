import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { ChevronIcon } from '../../../components/icons'
import { formatNumber } from '../../../lib/format'
import type { Unit } from '../../exercises/types'
import type { Entry } from '../types'

type EntryRowProps = {
  entry: Entry
  label: string
  unit?: Unit
}

/** Ligne cliquable d'une réalisation, ouvre son écran de modification. */
export function EntryRow({ entry, label, unit }: EntryRowProps) {
  return (
    <li>
      <Link
        to="/entries/$entryId"
        params={{ entryId: entry.id }}
        className="flex items-center gap-3 px-4 py-3 active:bg-slate-800"
      >
        <span className="flex-1 truncate">{label}</span>
        <span className="font-semibold tabular-nums">
          {formatNumber(entry.value)} <span className="text-sm font-normal text-slate-400">{unit}</span>
        </span>
        <ChevronIcon />
      </Link>
    </li>
  )
}

export function EntryList({ children }: { children: ReactNode }) {
  return <ul className="divide-y divide-slate-800 overflow-hidden rounded-xl bg-slate-800/50">{children}</ul>
}
