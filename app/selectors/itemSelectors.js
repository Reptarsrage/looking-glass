import { createSelector } from 'reselect';

import { initialState } from '../reducers/moduleReducer';

const selectItems = state => (state.module || initialState).items;

const selectGalleryItem = state => (state.module || initialState).galleryItem;

const selectGalleryId = (state, props) => props.galleryId;

const selectItemId = (state, props) => props.itemId;

const galleryItemsSelector = createSelector(
  [selectGalleryItem, selectGalleryId],
  (galleryItem, galleryId) => galleryItem.allIds.filter(id => galleryItem.byId[id].galleryId === galleryId)
);

const itemSelector = createSelector(
  [selectItems, selectItemId],
  (items, itemId) => items.byId[itemId]
);

export { galleryItemsSelector, itemSelector };
