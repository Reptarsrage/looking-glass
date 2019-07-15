import { createSelector } from 'reselect';

import { moduleIdSelector, galleryIdSelector } from './appSelectors';
import { initialGalleryState, initialState } from '../reducers/galleryReducer';

const galleryState = state => state.gallery || initialState;

const getStateOrInitial = (state, moduleId, galleryId) =>
  moduleId &&
  galleryId &&
  Object.prototype.hasOwnProperty.call(state, moduleId) &&
  Object.prototype.hasOwnProperty.call(state[moduleId], galleryId)
    ? state[moduleId][galleryId]
    : initialGalleryState;

const imagesSelector = createSelector(
  galleryState,
  moduleIdSelector,
  galleryIdSelector,
  (state, moduleId, galleryId) => getStateOrInitial(state, moduleId, galleryId).images
);

const fetchingSelector = createSelector(
  galleryState,
  moduleIdSelector,
  galleryIdSelector,
  (state, moduleId, galleryId) => getStateOrInitial(state, moduleId, galleryId).fetching
);

const errorSelector = createSelector(
  galleryState,
  moduleIdSelector,
  galleryIdSelector,
  (state, moduleId, galleryId) => getStateOrInitial(state, moduleId, galleryId).error
);

const offsetSelector = createSelector(
  galleryState,
  moduleIdSelector,
  galleryIdSelector,
  (state, moduleId, galleryId) => getStateOrInitial(state, moduleId, galleryId).offset
);

const beforeSelector = createSelector(
  galleryState,
  moduleIdSelector,
  galleryIdSelector,
  (state, moduleId, galleryId) => getStateOrInitial(state, moduleId, galleryId).before
);

const afterSelector = createSelector(
  galleryState,
  moduleIdSelector,
  galleryIdSelector,
  (state, moduleId, galleryId) => getStateOrInitial(state, moduleId, galleryId).after
);

const hasNextSelector = createSelector(
  galleryState,
  moduleIdSelector,
  galleryIdSelector,
  (state, moduleId, galleryId) => getStateOrInitial(state, moduleId, galleryId).hasNext
);

const searchQuerySelector = createSelector(
  galleryState,
  moduleIdSelector,
  galleryIdSelector,
  (state, moduleId, galleryId) => getStateOrInitial(state, moduleId, galleryId).searchQuery
);

export {
  imagesSelector,
  fetchingSelector,
  errorSelector,
  offsetSelector,
  hasNextSelector,
  beforeSelector,
  afterSelector,
  searchQuerySelector,
};
