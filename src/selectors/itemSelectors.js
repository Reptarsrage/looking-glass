import { createSelector } from 'reselect';

import { initialState, initialItemState } from '../reducers/itemReducer';
import { fullScreenItemIdSelector } from './appSelectors';

const getItemId = (_, props) => props.itemId;

const itemsStateSelector = (state) => state.item || initialState;

const itemsSelector = createSelector(itemsStateSelector, (state) => state.allIds);

const itemByIdSelector = createSelector(
  [itemsStateSelector, getItemId],
  (state, itemId) => state.byId[itemId] || initialItemState
);

const itemWidthSelector = createSelector(itemByIdSelector, (item) => item.width);

const itemHeightSelector = createSelector(itemByIdSelector, (item) => item.height);

const fullScreenItemSelector = createSelector([itemsStateSelector, fullScreenItemIdSelector], (state, itemId) =>
  itemId ? state.byId[itemId] : null
);

export { itemsSelector, itemByIdSelector, itemWidthSelector, itemHeightSelector, fullScreenItemSelector };
