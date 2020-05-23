import { createSelector } from 'reselect';

import { initialState } from '../reducers/appReducer';

const appState = (state) => state.app || initialState;

const moduleIdSelector = createSelector(appState, (state) => state.currentModuleId);

const galleryIdSelector = createSelector(appState, (state) => state.currentGalleryId);

const darkThemeSelector = createSelector(appState, (state) => state.darkTheme);

const fullScreenItemIdSelector = createSelector(appState, (state) => state.fullScreenItem);

const fullScreenInSelector = createSelector(appState, (state) => state.fullScreenIn);

export { moduleIdSelector, galleryIdSelector, darkThemeSelector, fullScreenItemIdSelector, fullScreenInSelector };
