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

export { imagesSelector, fetchingSelector, errorSelector };
