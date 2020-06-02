import { createSelector } from 'reselect';

import { initialState, initialItemState } from '../reducers/itemReducer';
import { generateGalleryId } from '../reducers/constants';
import { galleriesStateSelector } from './gallerySelectors';

const getItemId = (_, props) => props.itemId;

export const itemsStateSelector = (state) => state.item || initialState;

/** All items */
export const itemsSelector = createSelector(itemsStateSelector, (state) => state.allIds);

/** Specific item */
export const itemByIdSelector = createSelector(
  [itemsStateSelector, getItemId],
  (state, itemId) => state.byId[itemId] || initialItemState
);

/** Item dimensions */
export const itemDimensionsSelector = createSelector(itemByIdSelector, (item) => ({
  width: item.width,
  height: item.height,
}));

/** Item gallery URL */
export const itemGalleryUrlSelector = createSelector([itemByIdSelector, galleriesStateSelector], (item, state) => {
  if (!item.isGallery) {
    return null;
  }

  const { galleryId, siteId } = item;
  const { moduleId } = state.byId[galleryId];
  const itemGalleryId = generateGalleryId(moduleId, siteId);
  return `/gallery/${moduleId}/${itemGalleryId}`;
});
