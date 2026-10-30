import { createStore } from '../../lib/storage'
import type { Entry } from './types'

export const entriesStore = createStore<Entry[]>({
  key: 'entries',
  version: 1,
  defaultValue: [],
})
