import { createSelector } from 'reselect';

import { initialState, initialItemState } from '../reducers/moduleReducer';

const getGalleryId = (state, props) => props.galleryId;

const getItemId = (state, props) => props.itemId;

const itemsStateSelctor = state => (state.module || initialState).items;

const galleryItemStateSelctor = state => (state.module || initialState).galleryItem;

const itemsInGallerySelector = createSelector(
  [galleryItemStateSelctor, getGalleryId],
  (state, galleryId) =>
    state.allIds.filter(id => state.byId[id].galleryId === galleryId).map(id => state.byId[id].itemId)
);

const itemByIdSelector = createSelector(
  [itemsStateSelctor, getItemId],
  (state, itemId) => state.byId[itemId] || initialItemState
);

const itemWidthsSelector = createSelector(
  [itemsStateSelctor, itemsInGallerySelector],
  (state, items) => items.map(itemId => state.byId[itemId].width)
);

const itemHeightsSelector = createSelector(
  [itemsStateSelctor, itemsInGallerySelector],
  (state, items) => items.map(itemId => state.byId[itemId].height)
);

export { itemsInGallerySelector, itemByIdSelector, itemWidthsSelector, itemHeightsSelector };
