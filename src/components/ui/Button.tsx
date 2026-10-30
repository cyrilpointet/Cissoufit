import type { ButtonHTMLAttributes } from 'react'

const variants = {
  primary: 'bg-brand-500 text-slate-900 active:bg-brand-600',
  secondary: 'bg-slate-800 text-slate-100 active:bg-slate-700',
  danger: 'bg-transparent text-red-400 ring-1 ring-red-400/40 active:bg-red-400/10',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
}

export function Button({ variant = 'primary', className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`h-12 w-full rounded-xl px-4 font-semibold transition-colors disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
