import { createSelector } from 'reselect';

import { initialState } from '../reducers/appReducer';

const appState = state => state.app || initialState;

const moduleIdSelector = createSelector(
  appState,
  state => state.moduleId
);

const galleryIdSelector = createSelector(
  appState,
  state => state.galleryId
);

const darkThemeSelector = createSelector(
  appState,
  state => state.darkTheme
);

export { moduleIdSelector, galleryIdSelector, darkThemeSelector };
