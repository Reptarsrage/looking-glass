import { createSelector } from 'reselect'

import { initialState } from 'reducers/modalReducer'
import { initialState as initialItemState } from 'reducers/itemReducer'
import { byIdSelector as itemByIdSelector } from './itemSelectors'
import { byIdSelector as galleryByIdSelector } from './gallerySelectors'

const modalState = (state) => state.modal || initialState

export const modalOpenSelector = createSelector(modalState, (state) => state.modalOpen)

export const drawerOpenSelector = createSelector(modalState, (state) => state.drawerOpen)

export const modalItemIdSelector = createSelector(modalState, (state) => state.modalItemId)

export const modalBoundsSelector = createSelector(modalState, (state) => state.modalBounds)

export const modalItemSelector = createSelector(
  [itemByIdSelector, modalItemIdSelector],
  (itemById, itemId) => itemById[itemId] || initialItemState
)

export const modalPrevSelector = createSelector(
  [galleryByIdSelector, itemByIdSelector, modalItemIdSelector],
  (galleryById, itemById, itemId) => {
    if (!itemId) {
      return null
    }

    const { galleryId } = itemById[itemId]
    const { items } = galleryById[galleryId]
    const idx = items.indexOf(itemId)
    if (idx <= 0) {
      return null
    }

    return items[idx - 1]
  }
)

export const modalNextSelector = createSelector(
  [galleryByIdSelector, itemByIdSelector, modalItemIdSelector],
  (galleryById, itemById, itemId) => {
    if (!itemId) {
      return null
    }

    const { galleryId } = itemById[itemId]
    const { items } = galleryById[galleryId]
    const idx = items.indexOf(itemId)
    if (idx >= items.length - 1) {
      return null
    }

    return items[idx + 1]
  }
)

export const forceRenderItemsSelector = createSelector(
  [modalPrevSelector, modalItemIdSelector, modalNextSelector],
  (prev, current, next) => [prev, current, next].filter((id) => id !== null)
)

export const modalItemHasFiltersSelector = createSelector(
  modalItemSelector,
  (item) => (item && item.filters && item.filters.length > 0) || false
)
