import { createSelector } from 'reselect'

import { initialState, initialModuleState } from 'reducers/moduleReducer'

const getModuleId = (_, props) => props.moduleId

const moduleStateSelector = (state) => state.module || initialState

/** all modules */
export const modulesSelector = createSelector(moduleStateSelector, (state) => state.allIds)

/** specific module */
export const moduleByIdSelector = createSelector(
  moduleStateSelector,
  getModuleId,
  (state, moduleId) => state.byId[moduleId] || initialModuleState
)

/** module siteId */
export const moduleSiteIdSelector = createSelector(moduleByIdSelector, (module) => module.siteId)

/** module OAuth URL */
export const moduleOAuthUrlSelector = createSelector(moduleByIdSelector, (module) => module.oAuthUrl)

/** have modules been fetched? */
export const fetchedSelector = createSelector(moduleStateSelector, (state) => state.fetched)

/** are modules currently fetching? */
export const fetchingSelector = createSelector(moduleStateSelector, (state) => state.fetching)

/** did we encounter an error while fetching modules? */
export const errorSelector = createSelector(moduleStateSelector, (state) => state.error)

/** filter values configured for module */
export const filterBySelector = createSelector(moduleByIdSelector, (module) => module.filterBy)

/** sort values configured for module */
export const sortBySelector = createSelector(moduleByIdSelector, (module) => module.sortBy)

/** default gallery for this module */
export const defaultGalleryIdSelector = createSelector(moduleByIdSelector, (module) => module.defaultGalleryId)

/** module supports sorting */
export const supportsSortingSelector = createSelector(
  moduleByIdSelector,
  (module) => (module.sortBy && module.sortBy.length > 0) || false
)

/** module supports filtering */
export const supportsFilteringSelector = createSelector(
  moduleByIdSelector,
  (module) => (module.filterBy && module.filterBy.length > 0) || false
)

/** module supports fetching filters for individual items */
export const itemFiltersEnabledSelector = createSelector(moduleByIdSelector, (module) => module.itemFiltersEnabled)
