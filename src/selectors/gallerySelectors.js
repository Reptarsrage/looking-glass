import { createSelector } from 'reselect';

import { initialState, initialGalleryState } from '../reducers/galleryReducer';
import { galleryIdSelector } from './appSelectors';

const getGalleryId = (_, props) => props.galleryId;

const galleriesStateSelector = (state) => state.gallery || initialState;

const galleryByIdSelector = createSelector(
  [galleriesStateSelector, getGalleryId],
  (state, galleryId) => state.byId[galleryId] || initialGalleryState
);

const galleriesSelector = createSelector(galleriesStateSelector, (state) => state.allIds);

const itemsInGallerySelector = createSelector(galleryByIdSelector, (gallery) => gallery.items);

const currentSortSelector = createSelector(galleryByIdSelector, (gallery) => gallery.currentSort);

const currentFilterSelector = createSelector(galleryByIdSelector, (gallery) => gallery.currentFilter);

const savedScrollPositionSelector = createSelector(
  [galleryIdSelector, galleriesStateSelector],
  (galleryId, state) => state.byId[galleryId].savedScrollPosition
);

const savedScrollTopSelector = createSelector(
  [galleryIdSelector, galleriesStateSelector],
  (galleryId, state) => state.byId[galleryId].savedScrollTop
);

export {
  itemsInGallerySelector,
  galleryByIdSelector,
  galleriesSelector,
  currentSortSelector,
  currentFilterSelector,
  savedScrollPositionSelector,
  savedScrollTopSelector,
};
