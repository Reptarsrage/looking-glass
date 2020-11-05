import { MODAL_OPEN, MODAL_BOUNDS_UPDATE, MODAL_CLOSE, MODAL_CLEAR, MODAL_SET_ITEM } from './types'

/**
 * Sets the current modal item
 * @param {string|number} itemId Item ID
 */
export const modalSetItem = (itemId) => ({
  type: MODAL_SET_ITEM,
  payload: itemId,
})

/**
 * Closes the modal
 */
export const modalClose = () => ({
  type: MODAL_CLOSE,
})

/**
 * Removes the current modal item
 */
export const modalClear = () => ({
  type: MODAL_CLEAR,
})

/**
 * Updates bounds used for modal transition
 * @param {DOMRect} modalBounds Bounding rectangle
 */
export const modalBoundsUpdate = (modalBounds) => ({
  type: MODAL_BOUNDS_UPDATE,
  payload: modalBounds,
})

/**
 * Opens modal
 */
export const modalOpen = () => ({
  type: MODAL_OPEN,
})
