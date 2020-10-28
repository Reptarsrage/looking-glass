import { MODAL_OPEN, MODAL_BOUNDS_UPDATE, MODAL_CLOSE, MODAL_CLEAR, MODAL_SET_ITEM } from './types'

export const modalSetItem = (itemId) => ({
  type: MODAL_SET_ITEM,
  payload: itemId,
})

export const modalClose = () => ({
  type: MODAL_CLOSE,
})

export const modalClear = () => ({
  type: MODAL_CLEAR,
})

export const modalBoundsUpdate = (modalBounds) => ({
  type: MODAL_BOUNDS_UPDATE,
  payload: modalBounds,
})

export const modalOpen = () => ({
  type: MODAL_OPEN,
})
