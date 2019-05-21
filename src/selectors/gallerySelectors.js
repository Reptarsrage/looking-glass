import { createSelector } from 'reselect';

const galleryState = state => state.get('gallery');

const appState = state => state.get('app');

const imagesSelector = () =>
  createSelector(
    galleryState,
    appState,
    (gallery, app) => gallery.getIn([app.get('moduleId'), app.get('galleryId'), 'images'])
  );

const fetchingSelector = () =>
  createSelector(
    galleryState,
    appState,
    (gallery, app) => gallery.getIn([app.get('moduleId'), app.get('galleryId'), 'fetching'])
  );

const errorSelector = () =>
  createSelector(
    galleryState,
    appState,
    (gallery, app) => gallery.getIn([app.get('moduleId'), app.get('galleryId'), 'error'])
  );

const offsetSelector = () =>
  createSelector(
    galleryState,
    appState,
    (gallery, app) => gallery.getIn([app.get('moduleId'), app.get('galleryId'), 'offset'])
  );

const beforeSelector = () =>
  createSelector(
    galleryState,
    appState,
    (gallery, app) => gallery.getIn([app.get('moduleId'), app.get('galleryId'), 'before'])
  );

const afterSelector = () =>
  createSelector(
    galleryState,
    appState,
    (gallery, app) => gallery.getIn([app.get('moduleId'), app.get('galleryId'), 'after'])
  );

const hasNextSelector = () =>
  createSelector(
    galleryState,
    appState,
    (gallery, app) => gallery.getIn([app.get('moduleId'), app.get('galleryId'), 'hasNext'])
  );

export {
  imagesSelector,
  fetchingSelector,
  errorSelector,
  offsetSelector,
  hasNextSelector,
  beforeSelector,
  afterSelector,
};
