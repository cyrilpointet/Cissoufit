export const UNITS = ['kg', 'min', 'km'] as const

export type Unit = (typeof UNITS)[number]

export type Exercise = {
  id: string
  name: string
  unit: Unit
  /** Date ISO */
  createdAt: string
}
