import { createSelector } from 'reselect';

const galleryState = state => state.get('gallery');

const imagesSelector = () =>
  createSelector(
    galleryState,
    state => state.get('images')
  );

const fetchingSelector = () =>
  createSelector(
    galleryState,
    state => state.get('fetching')
  );

const errorSelector = () =>
  createSelector(
    galleryState,
    state => state.get('error')
  );

const offsetSelector = () =>
  createSelector(
    galleryState,
    state => state.get('offset')
  );

const hasNextSelector = () =>
  createSelector(
    galleryState,
    state => state.get('hasNext')
  );

export { imagesSelector, fetchingSelector, errorSelector, offsetSelector, hasNextSelector };
