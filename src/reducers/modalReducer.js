import produce from 'immer'

import { MODAL_OPEN, MODAL_BOUNDS_UPDATE, MODAL_CLOSE, MODAL_CLEAR, MODAL_SET_ITEM } from 'actions/types'

export const initialState = {
  modalOpen: false,
  modalItemId: null,
  modalBounds: null,
}

export default produce((draft, action) => {
  const { type, payload } = action || {}
  switch (type) {
    case MODAL_OPEN: {
      draft.modalOpen = true
      break
    }
    case MODAL_BOUNDS_UPDATE: {
      draft.modalBounds = payload
      break
    }
    case MODAL_CLOSE: {
      draft.modalOpen = false
      break
    }
    case MODAL_CLEAR: {
      draft.modalItemId = null
      draft.modalBounds = null
      break
    }
    case MODAL_SET_ITEM: {
      draft.modalItemId = payload
      break
    }
    default:
      // Nothing to do
      break
  }
}, initialState)
