import { createSelector } from 'reselect';

import { initialState, initialGalleryState } from '../reducers/galleryReducer';

const getGalleryId = (_, props) => props.galleryId;

export const galleriesStateSelector = (state) => state.gallery || initialState;

/** Specific gallery */
export const galleryByIdSelector = createSelector(
  [galleriesStateSelector, getGalleryId],
  (state, galleryId) => state.byId[galleryId] || initialGalleryState
);

/** All galleries */
export const galleriesSelector = createSelector(galleriesStateSelector, (state) => state.allIds);

/** All gallery items */
export const itemsInGallerySelector = createSelector(galleryByIdSelector, (gallery) => gallery.items);

/** Gallery search query value */
export const currentSearchQuerySelector = createSelector(galleryByIdSelector, (gallery) => gallery.searchQuery);

/** Gallery sort value */
export const currentSortSelector = createSelector(galleryByIdSelector, (gallery) => gallery.currentSort);

/** Gallery filter value  */
export const currentFilterSelector = createSelector(galleryByIdSelector, (gallery) => gallery.currentFilter);

/** Gallery saved scroll position */
export const savedScrollPositionSelector = createSelector(
  galleryByIdSelector,
  (gallery) => gallery.savedScrollPosition
);
