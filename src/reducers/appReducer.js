import produce from 'immer'
import Store from 'electron-store'

import { SET_VOLUME } from 'actions/types'

let electronStore
const getStore = () => {
  if (!electronStore) {
    electronStore = new Store()
  }

  return electronStore
}

export const initialState = {
  volume: getStore().get('volume', 1),
}

export default produce((draft, action, store = getStore()) => {
  const { type, payload } = action || {}

  switch (type) {
    case SET_VOLUME: {
      draft.volume = payload
      store.set('volume', payload)
      break
    }

    // no default
  }
}, initialState)
