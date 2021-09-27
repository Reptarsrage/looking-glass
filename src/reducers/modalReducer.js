import produce from 'immer'

import {
  MODAL_OPEN,
  SET_DRAWER_OPEN,
  MODAL_BOUNDS_UPDATE,
  MODAL_CLOSE,
  MODAL_CLEAR,
  MODAL_SET_ITEM,
  CLEAR_GALLERY,
} from 'actions/types'

export const initialState = {
  modalOpen: false,
  drawerOpen: false,
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
    case SET_DRAWER_OPEN: {
      draft.drawerOpen = payload
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
    case CLEAR_GALLERY:
    case MODAL_CLEAR: {
      draft.modalItemId = null
      draft.modalBounds = null
      break
    }
    case MODAL_SET_ITEM: {
      draft.modalItemId = payload
      break
    }

    // no default
  }
}, initialState)
