import { createSelector } from 'reselect';

import { initialState, initialModuleState } from '../reducers/moduleReducer';

const getModuleId = (_, props) => props.moduleId;

const moduleStateSelector = state => state.module || initialState;

const galleryStateSelctor = state => state.gallery || initialState;

const modulesSelector = createSelector(moduleStateSelector, state => state.allIds);

const moduleByIdSelector = createSelector(
  moduleStateSelector,
  getModuleId,
  (state, moduleId) => state.byId[moduleId] || initialModuleState
);

const sortByValuesSelector = createSelector(moduleByIdSelector, module => module.sortBy);

const moduleByIdSiteIdSelector = createSelector(moduleByIdSelector, module => module.siteId);

const searchGalleryIdSelector = createSelector(moduleByIdSelector, module => module.searchGalleryId);

const defaultGalleryIdSelector = createSelector(moduleByIdSelector, module => module.defaultGalleryId);

const successSelector = createSelector(moduleStateSelector, state => state.success);

const fetchingSelector = createSelector(moduleStateSelector, state => state.fetching);

const errorSelector = createSelector(moduleStateSelector, state => state.error);

const searchQuerySelector = createSelector(
  [searchGalleryIdSelector, galleryStateSelctor],
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
  sortByValuesSelector,
};
