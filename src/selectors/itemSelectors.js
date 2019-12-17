import { createSelector } from 'reselect';

import { initialState, initialItemState } from '../reducers/itemReducer';

const getGalleryId = (_, props) => props.galleryId;

const getItemId = (_, props) => props.itemId;

const itemsStateSelctor = state => state.item || initialState;

const itemsInGallerySelector = createSelector([itemsStateSelctor, getGalleryId], (state, galleryId) =>
  state.allIds.filter(id => state.byId[id].galleryId === galleryId)
);

const itemsSelector = createSelector(itemsStateSelctor, state => state.allIds);

const itemByIdSelector = createSelector(
  [itemsStateSelctor, getItemId],
  (state, itemId) => state.byId[itemId] || initialItemState
);

const itemWidthsSelector = createSelector([itemsStateSelctor, itemsInGallerySelector], (state, items) =>
  items.map(itemId => state.byId[itemId].width)
);

const itemHeightsSelector = createSelector([itemsStateSelctor, itemsInGallerySelector], (state, items) =>
  items.map(itemId => state.byId[itemId].height)
);

export { itemsInGallerySelector, itemsSelector, itemByIdSelector, itemWidthsSelector, itemHeightsSelector };
