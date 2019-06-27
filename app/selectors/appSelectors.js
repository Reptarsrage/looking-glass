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

const darkThemeSelector = () =>
  createSelector(
    appState,
    state => state.get('darkTheme')
  );

export { moduleIdSelector, galleryIdSelector, darkThemeSelector };
