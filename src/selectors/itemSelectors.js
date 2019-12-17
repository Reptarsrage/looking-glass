import { createSelector } from 'reselect';

import { itemsInGallerySelector } from './gallerySelectors';
import { initialState, initialItemState } from '../reducers/itemReducer';

const getItemId = (_, props) => props.itemId;

const itemsStateSelctor = state => state.item || initialState;

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

export { itemsSelector, itemByIdSelector, itemWidthsSelector, itemHeightsSelector };
