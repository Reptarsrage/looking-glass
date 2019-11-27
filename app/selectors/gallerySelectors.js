import { createSelector } from 'reselect';

import { initialState } from '../reducers/moduleReducer';

const selectGalleries = state => (state.module || initialState).galleries;

const selectGalleryId = (state, props) => props.galleryId;

const gallerySelector = createSelector(
  [selectGalleries, selectGalleryId],
  (state, galleryId) => state.byId[galleryId]
);

const searchQuerySelector = createSelector(
  gallerySelector,
  gallery => (gallery && gallery.searchQuery) || null
);

// eslint-disable-next-line import/prefer-default-export
export { gallerySelector, searchQuerySelector };
