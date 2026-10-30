import type { SelectHTMLAttributes } from 'react'
import { inputClassName } from './Field'

/** Select natif avec un chevron personnalisé (celui du navigateur est collé au bord). */
export function Select({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={`${inputClassName} appearance-none pr-11 ${className}`} {...props} />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-slate-400"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  )
}
