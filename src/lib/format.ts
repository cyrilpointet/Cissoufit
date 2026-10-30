const numberFormat = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 3 })

/** 12.5 → « 12,5 » */
export function formatNumber(value: number): string {
  return numberFormat.format(value)
}

/** Valeur à placer dans un champ de saisie : 12.5 → « 12,5 » (sans séparateur de milliers). */
export function toInputValue(value: number): string {
  return String(value).replace('.', ',')
}

/** « 12,5 » ou « 12.5 » → 12.5. Retourne null si la saisie n'est pas un nombre positif ou nul. */
export function parseDecimal(input: string): number | null {
  const normalized = input.trim().replace(',', '.')
  if (!/^(\d+\.?\d*|\.\d+)$/.test(normalized)) return null
  return Number(normalized)
}

/** Date du jour au format YYYY-MM-DD, en heure locale. */
export function todayISO(): string {
  return toISODate(new Date())
}

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isISODate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(parseISODate(value).getTime())
}

function parseISODate(value: string): Date {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** « Aujourd'hui », « Hier » ou « lundi 3 novembre 2026 ». */
export function formatDate(iso: string): string {
  const today = new Date()
  if (iso === toISODate(today)) return "Aujourd'hui"
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
  if (iso === toISODate(yesterday)) return 'Hier'
  return parseISODate(iso).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Format court : « 03/11/2026 ». */
export function formatShortDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString('fr-FR')
}
