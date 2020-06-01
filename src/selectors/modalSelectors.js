import { createSelector } from 'reselect';

import { initialState } from '../reducers/modalReducer';
import { initialState as initialItemState } from '../reducers/itemReducer';
import { itemsSelector, itemsStateSelector } from './itemSelectors';

const modalState = (state) => state.modal || initialState;

const modalOpenSelector = createSelector(modalState, (state) => state.modalOpen);

const modalItemIdSelector = createSelector(modalState, (state) => state.modalItemId);

const modalBoundsSelector = createSelector(modalState, (state) => state.modalBounds);

const modalItemSelector = createSelector(
  [itemsStateSelector, modalItemIdSelector],
  (state, itemId) => state.byId[itemId] || initialItemState
);

const modalPrevSelector = createSelector([itemsSelector, modalItemIdSelector], (items, itemId) => {
  if (!itemId) {
    return null;
  }

  const idx = items.indexOf(itemId);
  if (idx <= 0) {
    return null;
  }

  return items[idx - 1];
});

const modalNextSelector = createSelector([itemsSelector, modalItemIdSelector], (items, itemId) => {
  if (!itemId) {
    return null;
  }

  const idx = items.indexOf(itemId);
  if (idx >= items.length - 1) {
    return null;
  }

  return items[idx + 1];
});

const forceRenderItemsSelector = createSelector(
  [modalPrevSelector, modalItemIdSelector, modalNextSelector],
  (prev, current, next) => [prev, current, next].filter((id) => id !== null)
);

export {
  modalOpenSelector,
  modalItemIdSelector,
  modalBoundsSelector,
  modalNextSelector,
  modalPrevSelector,
  modalItemSelector,
  forceRenderItemsSelector,
};
