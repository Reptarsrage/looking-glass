import { createSelector } from 'reselect';

import { initialState, initialModuleState } from '../reducers/moduleReducer';

const getModuleId = (state, props) => props.moduleId;

const modulesStateSelector = state => (state.module || initialState).modules;

const galleriesStateSelctor = state => (state.module || initialState).galleries;

const modulesSelector = createSelector(modulesStateSelector, state => state.allIds);

const moduleByIdSelector = createSelector(
  modulesStateSelector,
  getModuleId,
  (state, moduleId) => state.byId[moduleId] || initialModuleState
);

const moduleByIdSiteIdSelector = createSelector(moduleByIdSelector, module => module.siteId);

const searchGalleryIdSelector = createSelector(moduleByIdSelector, module => module.searchGalleryId);

const defaultGalleryIdSelector = createSelector(moduleByIdSelector, module => module.defaultGalleryId);

const successSelector = createSelector(modulesStateSelector, state => state.success);

const fetchingSelector = createSelector(modulesStateSelector, state => state.fetching);

const errorSelector = createSelector(modulesStateSelector, state => state.error);

const searchQuerySelector = createSelector(
  [searchGalleryIdSelector, galleriesStateSelctor],
  (searchGalleryId, state) => searchGalleryId && state.byId[searchGalleryId].searchQuery
);

const defaultGalleryUrlSelector = createSelector(
  [getModuleId, defaultGalleryIdSelector],
  (moduleId, defaultGalleryId) => `/gallery/${moduleId}/${defaultGalleryId}`
);

const searchGalleryUrlSelector = createSelector(
  [getModuleId, searchGalleryIdSelector],
  (moduleId, searchGalleryId) => `/gallery/${moduleId}/${searchGalleryId}`
);

export {
  modulesSelector,
  moduleByIdSelector,
  successSelector,
  fetchingSelector,
  errorSelector,
  moduleByIdSiteIdSelector,
  defaultGalleryUrlSelector,
  searchQuerySelector,
  searchGalleryIdSelector,
  searchGalleryUrlSelector,
};
