import { createSelector } from 'reselect';

const galleryState = state => state.get('gallery');

const imagesSelector = moduleId =>
  createSelector(
    galleryState,
    state => state.getIn([moduleId, 'images'])
  );

const fetchingSelector = moduleId =>
  createSelector(
    galleryState,
    state => state.getIn([moduleId, 'fetching'])
  );

const errorSelector = moduleId =>
  createSelector(
    galleryState,
    state => state.getIn([moduleId, 'error'])
  );

const offsetSelector = moduleId =>
  createSelector(
    galleryState,
    state => state.getIn([moduleId, 'offset'])
  );

const hasNextSelector = moduleId =>
  createSelector(
    galleryState,
    state => state.getIn([moduleId, 'hasNext'])
  );

export { imagesSelector, fetchingSelector, errorSelector, offsetSelector, hasNextSelector };
