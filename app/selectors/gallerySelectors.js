import { createSelector } from 'reselect';

import { initialState, initialGalleryState } from '../reducers/moduleReducer';

const getGalleryId = (state, props) => props.galleryId;

const galleriesStateSelctor = state => (state.module || initialState).galleries;

const galleryByIdSelector = createSelector(
  [galleriesStateSelctor, getGalleryId],
  (state, galleryId) => state.byId[galleryId] || initialGalleryState
);

const searchQuerySelector = createSelector(
  galleryByIdSelector,
  gallery => gallery.searchQuery
);

// eslint-disable-next-line import/prefer-default-export
export { galleryByIdSelector, searchQuerySelector };
