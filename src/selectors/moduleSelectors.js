import { createSelector } from 'reselect';

import { initialState, initialModuleState } from '../reducers/moduleReducer';

const getModuleId = (_, props) => props.moduleId;

const moduleStateSelector = state => state.module || initialState;

const galleryStateSelector = state => state.gallery || initialState;

const modulesSelector = createSelector(moduleStateSelector, state => state.allIds);

const moduleByIdSelector = createSelector(
  moduleStateSelector,
  getModuleId,
  (state, moduleId) => state.byId[moduleId] || initialModuleState
);

const moduleByIdSiteIdSelector = createSelector(moduleByIdSelector, module => module.siteId);

const searchGalleryIdSelector = createSelector(moduleByIdSelector, module => module.searchGalleryId);

const defaultGalleryIdSelector = createSelector(moduleByIdSelector, module => module.defaultGalleryId);

const successSelector = createSelector(moduleStateSelector, state => state.success);

const fetchingSelector = createSelector(moduleStateSelector, state => state.fetching);

const errorSelector = createSelector(moduleStateSelector, state => state.error);

const filterBySelector = createSelector(moduleByIdSelector, module => module.filterBy);

const searchQuerySelector = createSelector(
  [searchGalleryIdSelector, galleryStateSelector],
  (searchGalleryId, state) => searchGalleryId && state.byId[searchGalleryId].searchQuery
);

export {
  modulesSelector,
  moduleByIdSelector,
  successSelector,
  fetchingSelector,
  errorSelector,
  moduleByIdSiteIdSelector,
  searchQuerySelector,
  filterBySelector,
  searchGalleryIdSelector,
  defaultGalleryIdSelector,
};
