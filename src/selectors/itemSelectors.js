import { createSelector } from 'reselect';

import { initialState, initialItemState } from '../reducers/itemReducer';

const getItemId = (_, props) => props.itemId;

export const itemsStateSelector = (state) => state.item || initialState;

export const itemsSelector = createSelector(itemsStateSelector, (state) => state.allIds);

export const itemByIdSelector = createSelector(
  [itemsStateSelector, getItemId],
  (state, itemId) => state.byId[itemId] || initialItemState
);

export const itemWidthSelector = createSelector(itemByIdSelector, (item) => item.width);

export const itemHeightSelector = createSelector(itemByIdSelector, (item) => item.height);
