import { createStore } from '../../lib/storage'
import type { Exercise } from './types'

export const exercisesStore = createStore<Exercise[]>({
  key: 'exercises',
  version: 1,
  defaultValue: [],
})
