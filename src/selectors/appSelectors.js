import { createSelector } from 'reselect';

const appState = state => state.get('app');

const moduleIdSelector = () =>
  createSelector(
    appState,
    state => state.get('moduleId')
  );

const galleryIdSelector = () =>
  createSelector(
    appState,
    state => state.get('galleryId')
  );

export { moduleIdSelector, galleryIdSelector };
