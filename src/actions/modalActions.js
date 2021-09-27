import { MODAL_OPEN, SET_DRAWER_OPEN, MODAL_BOUNDS_UPDATE, MODAL_CLOSE, MODAL_CLEAR, MODAL_SET_ITEM } from './types'

/**
 * sets the current modal item
 * @param {string|number} itemId Item ID
 */
export const modalSetItem = (itemId) => ({
  type: MODAL_SET_ITEM,
  payload: itemId,
})

/**
 * closes the modal
 */
export const modalClose = () => ({
  type: MODAL_CLOSE,
})

/**
 * removes the current modal item
 */
export const modalClear = () => ({
  type: MODAL_CLEAR,
})

/**
 * updates bounds used for modal transition
 * @param {DOMRect} modalBounds Bounding rectangle
 */
export const modalBoundsUpdate = (modalBounds) => ({
  type: MODAL_BOUNDS_UPDATE,
  payload: modalBounds,
})

/**
 * opens modal
 */
export const modalOpen = () => ({
  type: MODAL_OPEN,
})

export const setDrawerOpen = (isOpen) => ({
  type: SET_DRAWER_OPEN,
  payload: isOpen,
})
