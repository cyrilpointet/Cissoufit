import type { ReactNode } from 'react'

export const inputClassName =
  'h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 text-base text-slate-100 placeholder:text-slate-500 focus:border-brand-400 focus:outline-none'

type FieldProps = {
  label: string
  htmlFor: string
  children: ReactNode
}

export function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-400">
        {label}
      </label>
      {children}
    </div>
  )
}

export function ErrorMessage({ children }: { children: ReactNode }) {
  if (!children) return null
  return (
    <p role="alert" className="text-sm text-red-400">
      {children}
    </p>
  )
}
