import { createSelector } from 'reselect';

import { initialState, initialGalleryState } from '../reducers/galleryReducer';

const getGalleryId = (_, props) => props.galleryId;

const galleriesStateSelctor = state => state.gallery || initialState;

const galleryByIdSelector = createSelector(
  [galleriesStateSelctor, getGalleryId],
  (state, galleryId) => state.byId[galleryId] || initialGalleryState
);

const galleriesSelector = createSelector(galleriesStateSelctor, state => state.allIds);

export { galleryByIdSelector, galleriesSelector };
