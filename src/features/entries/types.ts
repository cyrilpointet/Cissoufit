export type Entry = {
  id: string
  exerciseId: string
  /** Jour de réalisation, YYYY-MM-DD en heure locale */
  date: string
  value: number
  /** Date ISO, départage les réalisations d'un même jour */
  createdAt: string
}
