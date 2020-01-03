import { createSelector } from 'reselect';

import { initialState, initialGalleryState } from '../reducers/galleryReducer';

const getGalleryId = (_, props) => props.galleryId;

const galleriesStateSelector = state => state.gallery || initialState;

const galleryByIdSelector = createSelector(
  [galleriesStateSelector, getGalleryId],
  (state, galleryId) => state.byId[galleryId] || initialGalleryState
);

const galleriesSelector = createSelector(galleriesStateSelector, state => state.allIds);

const itemsInGallerySelector = createSelector(galleryByIdSelector, gallery => gallery.items);

const currentSortSelector = createSelector(galleryByIdSelector, gallery => gallery.currentSort);

export { itemsInGallerySelector, galleryByIdSelector, galleriesSelector, currentSortSelector };
