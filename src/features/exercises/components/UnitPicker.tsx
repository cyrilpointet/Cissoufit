import { UNITS, type Unit } from '../types'

type UnitPickerProps = {
  value: Unit
  onChange: (unit: Unit) => void
}

export function UnitPicker({ value, onChange }: UnitPickerProps) {
  return (
    <div role="radiogroup" aria-label="Unité" className="grid grid-cols-3 gap-2">
      {UNITS.map((unit) => (
        <button
          key={unit}
          type="button"
          role="radio"
          aria-checked={value === unit}
          onClick={() => onChange(unit)}
          className={`h-12 rounded-xl font-semibold ring-1 transition-colors ${
            value === unit ? 'bg-brand-500/15 text-brand-400 ring-brand-400' : 'text-slate-300 ring-slate-700'
          }`}
        >
          {unit}
        </button>
      ))}
    </div>
  )
}
