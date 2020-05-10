import { createSelector } from 'reselect';

import { initialState } from '../reducers/appReducer';

const appState = (state) => state.app || initialState;

const moduleIdSelector = createSelector(appState, (state) => state.currentModuleId);

const galleryIdSelector = createSelector(appState, (state) => state.currentGalleryId);

const darkThemeSelector = createSelector(appState, (state) => state.darkTheme);

export { moduleIdSelector, galleryIdSelector, darkThemeSelector };
